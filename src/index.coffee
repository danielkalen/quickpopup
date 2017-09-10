Popup = import './popup'
DOM = import 'quickdom'
import {html as htmlTemplate} from './template'

QuickPopup = (arg)->
	args = arguments
	switch
		when arguments.length is 0
			new Popup

		when typeof arg is 'string'
			new Popup content:htmlTemplate.spawn(data:html:arg)
		
		when DOM.isEl(arg), DOM.isQuickEl(arg)
			new Popup content:arg
		
		when DOM.isTemplate(arg)
			new Popup content:arg.spawn()

		when arg and typeof arg is 'object'
			new Popup arg

		else throw new Error('invalid argument provided to QuickPopup')

QuickPopup.wrapBody = ()-> Popup.wrapBody()
QuickPopup.unwrapBody = ()-> Popup.unwrapBody()
QuickPopup.destroyAll = ()-> Popup.destroyAll()






QuickPopup.version = import '../package.json $ version'
module.exports = QuickPopup



