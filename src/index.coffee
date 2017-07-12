Popup = import './popup'
DOM = import 'quickdom'
import {html as htmlTemplate} from './template'

QuickPopup = (arg)->
	args = arguments
	switch
		when args.length is 0
			new Popup

		when typeof args[0] is 'string'
			new Popup content:htmlTemplate.spawn(data:html:args[0])
		
		when DOM.isEl(args[0]), DOM.isQuickEl(args[0])
			new Popup content:args[0]
		
		when DOM.isTemplate(args[0])
			new Popup content:args[0].spawn()

		when args[0] and typeof args[0] is 'object'
			new Popup args[0]

		else throw new Error('invalid argument provided to QuickPopup')








QuickPopup.version = import '../package.json $ version'
module.exports = QuickPopup



