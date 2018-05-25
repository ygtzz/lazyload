(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LazyLoad = undefined;

var _objectAssign = __webpack_require__(1);

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function LazyLoad(opts) {
    opts = (0, _objectAssign2.default)({
        threshold: 0,
        imgSelector: 'img[data-src]',
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
        triggers = ['scroll', 'resize'];

    if (self.images) {
        self.images = Array.prototype.slice.call(self.images);
        if (self.intersectionMode) {
            self.io = new IntersectionObserver(function (ioes) {
                ioes.forEach(function (ioe) {
                    var el = ioe.target,
                        intersectonRatio = ioe.intersectionRatio;
                    if (intersectonRatio >= 0 && intersectonRatio <= 1) {
                        self._fLoadImage(el);
                    }
                    el.onload = el.onerror = function () {
                        return self.io.unobserve(el);
                    };
                });
            }, { rootMargin: opts.threshold + 'px 0px' });
        } else {
            fCheck = debounce(fCheckImage, 200, 300);
            self.seeHeight = document.documentElement.clientHeight || document.body.clientHeight;
            triggers.forEach(function (item) {
                opts.container.addEventListener(item, fCheck);
            });
        }
        //进入页面先执行一次，将首屏的图片加载出来
        self._fCheckImage();
        //将延迟加载的图片加载出来
        self._fLoadDeferImages();
    } else {
        console.log('lazyload images is empty');
    }
}

LazyLoad.prototype._fLoadDeferImages = function () {
    var _this = this;

    var images = this.images,
        loads = this.loads;
    images.forEach(function (item, index) {
        var defer = item.getAttribute(_this.opts.imgDefer);
        if (defer) {
            defer = parseInt(defer);
            setTimeout(function () {
                _this._fLoadImage(item);
                loads.push(index);
            }, defer);
        }
    });
    this._fFilterImageFormLoads(images);
};

LazyLoad.prototype._fCheckImage = function () {
    var _this2 = this;

    var images = this.images,
        loads = this.loads,
        io = this.io;
    if (this.intersectionMode) {
        images.forEach(function (item) {
            return io.observe(item);
        });
    } else {
        this._fFilterImageFormLoads();
        if (!images.length) {
            triggers.forEach(function (item) {
                opts.container.removeEventListener(item, fCheck);
            });
            loads = null;
            return;
        }
        images.forEach(function (item, index) {
            if (_this2._fInSight(item)) {
                _this2._fLoadImage(item, index);
                loads.push(index);
            }
        });
    }
};

LazyLoad.prototype._fInSight = function (imgDom) {
    var bound = imgDom.getBoundingClientRect();
    return bound.top - this.seeHeight < this.opts.threshold;
};

LazyLoad.prototype._fLoadImage = function (imgDom) {
    var img = new Image();
    img.src = imgDom.getAttribute(this.opts.imgAttr);
    img.onload = function () {
        imgDom.src = img.src;
    };
};

LazyLoad.prototype._fFilterImageFormLoads = function (images) {
    var images = this.images,
        loads = this.loads;
    images = images.filter(function (item, index) {
        return loads.indexOf(index) == -1;
    });
    loads.length = 0;

    return images;
};

LazyLoad.prototype._debounce = function (fn, delay, atleast) {
    var timeout = null,
        startTime = new Date();
    return function () {
        var curTime = new Date();
        clearTimeout(timeout);
        if (curTime - startTime >= atleast) {
            fn();
            startTime = curTime;
        } else {
            timeout = setTimeout(fn, delay);
        }
    };
};

exports.LazyLoad = LazyLoad;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ })
/******/ ]);
});