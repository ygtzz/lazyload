import assign from 'object-assign';

function LazyLoad(opts){
    opts = assign({
        threshold: 0,
        imgSelector:'img[data-src]',
        imgAttr: 'data-src',
        imgDefer: 'data-defer',
        container: window
    }, opts);

    opts.threshold = parseInt(opts.threshold);
    this.opts = opts;
    this.images = document.querySelectorAll(opts.imgSelector);
    this.intersectionMode = window.IntersectionObserver ? true : false;
    this.loads = [];
    this.seeHeight = null;
    this.io = null;

    var self = this,
        fCheck = null,
        triggers = ['scroll','resize'];
    
    if(self.images){
        self.images = Array.prototype.slice.call(self.images);
        if(self.intersectionMode){
            self.io = new IntersectionObserver(function(ioes){
                ioes.forEach(function(ioe){
                    var el = ioe.target,
                        intersectonRatio = ioe.intersectionRatio;
                    if(intersectonRatio >= 0 && intersectonRatio <= 1){
                        self._fLoadImage(el);
                    }
                    el.onload = el.onerror = () => self.io.unobserve(el);
                });
            },{ rootMargin: opts.threshold + 'px 0px' });
        }
        else{   
            fCheck = debounce(fCheckImage,200,300);
            self.seeHeight = document.documentElement.clientHeight || document.body.clientHeight;
            triggers.forEach(item => {
                opts.container.addEventListener(item,fCheck);
            });
        }
        //进入页面先执行一次，将首屏的图片加载出来
        self._fCheckImage();
        //将延迟加载的图片加载出来
        self._fLoadDeferImages();
    }   
    else{
        console.log('lazyload images is empty');
    }
}

LazyLoad.prototype._fLoadDeferImages = function(){
    var images = this.images,
        loads = this.loads;
    images.forEach((item,index) => {
        var defer = item.getAttribute(this.opts.imgDefer);
        if(defer){
            defer = parseInt(defer);
            setTimeout(() => {
                this._fLoadImage(item);
                loads.push(index);
            },defer);
        }
    });
    this._fFilterImageFormLoads(images);
}

LazyLoad.prototype._fCheckImage = function(){
    var images = this.images,
        loads = this.loads,
        io = this.io;
    if(this.intersectionMode){
        images.forEach(item => io.observe(item));
    }
    else{
        this._fFilterImageFormLoads();
        if(!images.length){
            triggers.forEach(item => {
                opts.container.removeEventListener(item,fCheck);
            });
            loads = null;
            return;
        }
        images.forEach((item,index) => {
            if(this._fInSight(item)){
                this._fLoadImage(item,index);
                loads.push(index);        
            }
        });
    }
}

LazyLoad.prototype._fInSight = function(imgDom){
    var bound = imgDom.getBoundingClientRect();
    return bound.top - this.seeHeight < this.opts.threshold;
}

LazyLoad.prototype._fLoadImage = function(imgDom){
    var img = new Image();
    img.src = imgDom.getAttribute(this.opts.imgAttr);
    img.onload = function(){
        imgDom.src = img.src;
    }
}

LazyLoad.prototype._fFilterImageFormLoads = function(images){
    var images = this.images,
        loads = this.loads;
    images = images.filter(function(item,index){
        return loads.indexOf(index) == -1; 
    });
    loads.length = 0;

    return images;
}

LazyLoad.prototype._debounce = function(fn, delay, atleast) {
    var timeout = null,
        startTime = new Date();
    return function() {
        var curTime = new Date();
        clearTimeout(timeout);
        if(curTime - startTime >= atleast) {
            fn();
            startTime = curTime;
        }else {
            timeout = setTimeout(fn, delay);
        }
    }
}

export {LazyLoad};
