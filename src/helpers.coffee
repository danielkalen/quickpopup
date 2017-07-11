IS = import './checks'
extend = import 'smart-extend'
detectAnimation = import 'detect-animation-end-helper'

exports.extendSettings = (defaults, settings)->
	extend
		.filter
			placement: IS.string
			template: IS.objectPlain
			condition: IS.function
			animation: IS.number
			overlayColor: IS.string
			open: IS.objectPlain
			close: IS.objectPlain
			triggers: IS.objectPlain

		.clone.deep.notDeep('content')(defaults, settings)


exports.scheduleScrollReset = (scheduleNext)-> setTimeout ()->
	window.scroll(0,0)
	
	if scheduleNext
		setTimeout ()->
			exports.scheduleScrollReset()
		, scheduleNext

exports.transitionEnd = ()->
	detectAnimation('transition')

exports.scrollOffset = ()->
	window.scrollY - exports.documentOffset()

exports.documentOffset = ()->
	(document.body.getBoundingClientRect()?.top or 0) + window.scrollY


exports.visibilityApiKeys = ()-> switch
	when IS.defined(document.hidden)
		hidden:'hidden', visibilitychange:'visibilitychange'
	
	when IS.defined(document.msHidden)
		hidden:'msHidden', visibilitychange:'msvisibilitychange'
	
	when IS.defined(document.webkitHidden)
		hidden:'webkitHidden', visibilitychange:'webkitvisibilitychange'

	else {}

