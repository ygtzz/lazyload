import assign from 'object-assign';

function LazyLoad(opts){
    opts = assign({
        threshold: 0,
        imgSelector:'img[data-src]',
        container: window
    },opts);

    var images = document.querySelectorAll(opts.imgSelector),
        intersectionMode = window.IntersectionObserver ? true : false,
        io = null,
        loads = [],
        seeHeight = null,
        fScroll = null;
    
    if(images){
        images = Array.prototype.slice.call(images);
        if(intersectionMode){
            io = new IntersectionObserver(function(ioes){
                ioes.forEach(function(ioe){
                    var el = ioe.target,
                        intersectonRatio = ioe.intersectionRatio;
                    if(intersectonRatio >= 0 && intersectonRatio <= 1){
                        fLoadImage(el);
                    }
                    el.onload = el.onerror = () => io.unobserve(el);
                });
            },{ rootMargin: opts.threshold + 'px 0px' });
            window.io = io;
        }
        else{   
            fScroll = debounce(fCheckImage,200,300);
            seeHeight = document.documentElement.clientHeight || document.body.clientHeight;
            opts.container.addEventListener('scroll',fScroll);
        }
        //进入页面先执行一次，将首屏的图片加载出来
        fCheckImage();
    }   
    else{
        console.log('lazyload images is empty');
    }

    function fCheckImage(){
        if(intersectionMode){
            console.log('intersection');
            images.forEach(item => io.observe(item));
        }
        else{
            images = images.filter(function(item,index){
                return loads.indexOf(index) == -1; 
            });
            loads.length = 0;
            if(!images.length){
                opts.container.removeEventListener('scroll',fScroll);
                loads = null;
                return;
            }
            images.forEach(function(item,index){
                if(fInSight(item)){
                    fLoadImage(item,index);
                    loads.push(index);        
                }
            });
        }
    }

    function fInSight(imgDom){
        var bound = imgDom.getBoundingClientRect();
        return bound.top - seeHeight < opts.threshold;
    }
    
    function fLoadImage(imgDom){
        var img = new Image();
        img.src = imgDom.getAttribute('data-src');
        img.onload = function(){
            imgDom.src = img.src;
        }
    }

    function debounce(fn, delay, atleast) {
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
}

export {LazyLoad};