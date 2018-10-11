# fog
> A lazy load effect library for images 

<br/>

# Preview
_Note: the format of the preview is webp, Safari browser or other browsers may not support viewing._

![example](example_1.webp)

<br/>

# Getting Started

## Install
- via npm

  ```
  npm install @kilohaty/fog --save
  ```
  ```js
  // using ES6 modules
  import fog from '@kilohaty/fog';

  // using CommonJS modules
  var fog = require('@kilohaty/fog')
  ```  

- via script
  ```html
  <!-- you can find the library on window.fog -->
  <script src="/dist/bundle/fog.js"></script>
  ```
    
<br/>

## Setup Images

In HTML, add the following attributes to your images. ( **note: both images must have the same aspect ratio**)

| attribute name | required  | description |
|----------------|-----------|-------------|
|`data-src`      |  ✓        | source image url |
|`data-src-mini` |           | mini image url |
|`data-width`    |           | image width |
|`data-height`   |           | image height |

```html
<img src=""
     data-width="400"
     data-height="200"
     data-src="https://example.com/example_source.jpg" 
     data-src-mini="https://example.com/example_source.jpg.mini.jpg"
     alt="example" />
```

<br/>

## Set global config (Optional)

| config name | value type | default value | description |
|-------------|------------|---------------|-------------|
|`display`    | `string`   | inline-block  | display style of wrapped div|
|`width`      | `number`   | 1             | image width |
|`height`     | `number`   | 1             | image height |
|`backgroundColor` | `string`   |          | skeleton image color |
|`transitionDuration` | `number` |    1    | opacity transition duration (second) |
|`retryTimes` | `number`   |        2      | the number of retry when image load failed |
|`retryDuration` | `number`   |    3000    | retry interval time (ms) |
|`miniImgRule` | `Function`   |            | rule function for mini image |
|`errorImage` | `string`   |               | set replacement image when source image load failed |

```js
fog.setConfig({
  width: 400,
  height: 200,
  backgroundColor: '#ffff00',
  transitionDuration: 0.5,
  retryTimes: 1,
  retryDuration: 2000,
  miniImgRule: function (sourceImageUrl) {
    return sourceImageUrl + '.mini.jpg';
  },
  errorImage: 'https://example.com/error.jpg',
});
```
  
  
<br/>

## Init

```js
var el = document.querySelector('img');

// simple init
fog.init(el);

// or with options
fog.init({
  el: el,
  onSuccess() {
    // source image load success
  },
  onFail() {
    // source image load fail
  },
  onComplete() {
    // source image load complete (success or fail)
  }
});
```
