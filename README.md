# QuickPopup
[![Build Status](https://travis-ci.org/danielkalen/quickpopup.svg?branch=master)](https://travis-ci.org/danielkalen/quickpopup)
[![Coverage](.config/badges/coverage.png?raw=true)](https://github.com/danielkalen/quickpopup)
[![Code Climate](https://codeclimate.com/github/danielkalen/quickpopup/badges/gpa.svg)](https://codeclimate.com/github/danielkalen/quickpopup)
[![NPM](https://img.shields.io/npm/v/quickpopup.svg)](https://npmjs.com/package/quickpopup)
[![Sauce Test Status](https://saucelabs.com/browser-matrix/quickpopup.svg)](https://saucelabs.com/u/quickpopup)

Note: this library is still under development stage and is being processed through heavy real-world battle testing. Full documentation will be released once this module is ready for alpha release.

## Usage
```
npm install --save quickpopup
```

```javascript
var QuickPopup = require('quickpopup');
var popup = QuickPopup(...)
```


## API
### `QuickPopup([settings])`
Generates and returns a new Popup instance for the provided settings.

`settings` can be one of:
  - left blank
  - html text (will be inserted into the popup via `.innerHTML`)
  - DOM element
  - [QuickDOM](https://github.com/danielkalen/quickdom) element
  - settings object

[view default settings below](#quickpopupdefaults)

### `QuickPopup.version`
The version of this release.

### `QuickPopup.hasOpen`
Boolean indicator of whether or not any popup instance is currently open/being displayed.

### `QuickPopup.instances`
Array containing all active popup instances.

### `QuickPopup.defaults`
  - `placement` - placement of popup relative to the window when open. Can be one of: `'center'`,`'top'`,`'bottom'` *(default: 'top')*
  - `open` - should the popup be opened immediatly after creation *(default: false)*
  - `forceOpen` - if `popup.open()` is called when another popup is open, this setting will ensure that the other will be closed. If this is set to false and another popup is open then `popup.open()` will do nothing *(default: false)*
  - `animation` - open animation speed in milliseconds *(default: 300)*
  - `contentPadding` - padding to apply inside the content wrapper *(default: 0)*
  - `overlayColor` - color to apply to the background overlay *(default: 'rgba(0,0,0,0.88)')*
  - `template` - custom element [QuickDOM](https://github.com/danielkalen/quickdom) settings to apply to each element. Accepts a key:value pair object where `key` is one of: `popup`,`overlay`,`content`,`close`
  - `close` - settings for the popup's close button:
    - `show` - should the close button render visible *(default: false)*
    - `padding` - how far from the edge should the close button be placed *(default: 20)*
    - `inside` - should the close button be placed inside or outside the content box
    - `size` - width/height of close button in pixels *(default: 22)*
  - `triggers` - the triggers that will cause the popup to be automatically opened/closed
    - `open`
      - `navigation` - when user goes back in browser history *(default:false)*
      - `visibility` - when page is not in focus i.e. switch tabs *(default:false)*
      - `exitIntent` - when user intends to exit the page *(default:false)*
    - `close`
      - `esc` - when user hits the 'esc' key on keyboard *(default:true)*


### `popup.open()`
Opens/reveals the popup element.

### `popup.close()`
Closes/hides the popup element.

### `popup.destroy()`
Removes the popup element from the DOM & destroys the popup instance.

### events
The following events are emitted by a popup instance:

#### `beforeopen(triggerName)`
Emitted before opening animation begins.

**`triggerName`**
Method of opening the popup.
- `null`: when opened manually via the api.
- `"visibility"`: when opened via the visibility trigger
- `"navigation"`: when opened via the navigation trigger
- `"exitIntent"`: when opened via the exitIntent trigger

#### `open(triggerName)`
Emitted when opening animation begins.

#### `finishopen(triggerName)`
Emitted when opening animation ends and popup becomes fully visible.

#### `beforeclose`
Emitted before closing animation begins.

#### `close`
Emitted when closing animation begins.

#### `finishclose`
Emitted when closing animation ends and becomes fully invisible.




## License
MIT © [Daniel Kalen](https://github.com/danielkalen)