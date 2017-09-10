DOM = import 'quickdom'
extend = import 'smart-extend'
Popup = import './popup'
IS = import './checks'
defaults = import './defaults'
templates = import './template'
import {html as htmlTemplate} from './template'


newBuilder = (defaults, templates)->
	builder = (arg)->
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


	builder.config = (newSettings, newTemplates)->
		throw new Error "QuickPopup Config: invalid config object provided #{String newSettings}" if not IS.object(newSettings)
		outputSettings = extend.clone.deep(defaults, newSettings)

		if IS.object(newTemplates)
			outputTemplates = Object.create(null)
			for name,template of templates
				if newTemplates[name]
					outputTemplates[name] = template.extend(newTemplates[name])
				else
					outputTemplates[name] = template
		
		return newBuilder(outputSettings, outputTemplates)
	

	builder.wrapBody = ()-> Popup.wrapBody()
	builder.unwrapBody = ()-> Popup.unwrapBody()
	builder.destroyAll = ()-> Popup.destroyAll()
	builder.version = import '../package.json $ version'
	return builder





QuickPopup = newBuilder(defaults, templates)
module.exports = QuickPopup



