import detectAnimation from 'detect-animation-end-helper'
import DOM from 'quickdom'

export supportsAnimation = ()-> !!detectAnimation()

export transitionEnd = ()-> detectAnimation('transition')

export restartSandbox = ()->
	window.sandbox.remove() if window.sandbox
	window.sandbox = DOM.div id:'sandbox', style:
		border: '1px solid'
		padding: 20
		boxSizing: 'border-box'
	
	window.sandbox.appendTo(document.body)