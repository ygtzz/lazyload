# LazyLoad

a component to lazyload images

## Feature

1. wirtten in native javascript
2. use intersectionObserver when support, fallback listen scroll event to check image's getBoundingClientRect
3. use debounce to decrease scroll event
4. when load image, remove image from observe
5. when all images loaded, remove observer or scroll event
6. defer load images when use data-defer

## Installation
```bash
npm i my-lazyload -S
```

## Usage
```html
<img src="images/defalut.png" data-src="images/real.jpg" data-defer="5000"/>
```
```javascript
import {LazyLoad} from 'my-lazyload';

new LazyLoad({
    imgSelector:'img[data-src]',
    threshold:100
})
```   

## Params

Parameter | Type |Default| Description
--------- | ---- | ------|-----------
data-src    | `string` |  | image's attr to store url
data-defer   | `number` |  | image's load after defer time, not scroll 
imgSelector | `string` | img[data-src] | the images selector, used in document.querySelectorAll
thresold | `number` | 0 | how pixels before viewport to load images
container | `function` | window | the callback function after toast hide


