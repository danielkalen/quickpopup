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

view default settings below

### `QuickPopup.version`
The version of this release.

### `QuickPopup.hasOpen`
Boolean indicator of whether or not any popup instance is currently open/being displayed.

### `QuickPopup.instances`
Array containing all active popup instances.

### `QuickPopup.defaults`
  - `placement` - placement of popup relative to the window when open. Can be one of: `'center'`,`'top'`,`'bottom'` *(default: 'top')*
  - `openOnInit` - should the popup be opened immediatly after creation *(default: false)*
  - `closeOnEsc` - should the popup be closed when the `Esc` key on the user's keyboard is pressed
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


### `popupInstance.open()`
Opens/reveals the popup element.

### `popupInstance.close()`
Closes/hides the popup element.

### `popupInstance.destroy()`
Removes the popup element from the DOM & destroys the popup instance.


## License
MIT © [Daniel Kalen](https://github.com/danielkalen)