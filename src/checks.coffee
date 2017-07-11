IS = import '@danielkalen/is'
DOM = import 'quickdom'

module.exports = IS = IS.create('natives')
IS.load
	'domEl': DOM.isEl
	'quickEl': DOM.isQuickEl
	'template': DOM.isTemplate