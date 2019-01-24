import IS from './checks'
import extend from 'smart-extend'
import detectAnimation from 'detect-animation-end-helper'

export extendSettings = (defaults, settings)->
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


export scheduleScrollReset = (scheduleNext)-> setTimeout ()->
	window.scroll(0,0)
	
	if scheduleNext
		setTimeout ()->
			scheduleScrollReset()
		, scheduleNext

export transitionEnd = ()->
	detectAnimation('transition')

export scrollOffset = ()->
	window.scrollY - documentOffset()

export documentOffset = ()->
	(document.body.getBoundingClientRect()?.top or 0) + window.scrollY


export visibilityApiKeys = ()-> switch
	when IS.defined(document.hidden)
		hidden:'hidden', visibilitychange:'visibilitychange'
	
	when IS.defined(document.msHidden)
		hidden:'msHidden', visibilitychange:'msvisibilitychange'
	
	when IS.defined(document.webkitHidden)
		hidden:'webkitHidden', visibilitychange:'webkitvisibilitychange'

	else {}

