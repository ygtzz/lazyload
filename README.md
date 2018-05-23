# prefixer

get animation event prefixed name in all browsers

## Installation
```bash
npm i prefixer2 -S
```

## Usage
```javascript
import {prefixer} from 'prefixer2';
var transform = prefixer.transform();
document.querySelector('div')[transform] = 'translate(30px,30px)';
```   

## Methods
- `transform` {function} get prefixed transform
- `transiton` {function} get prefixed transition
- `transitionend` {function} get prefixed transitionend
- `animationstart` {function} get prefixed animationstart
- `animationiteration` {function} get prefixed animationiteration
- `animationend` {function} get prefixed animationend