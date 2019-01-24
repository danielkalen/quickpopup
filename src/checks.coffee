import DOM from 'quickdom'
import IS_ from '@danielkalen/is'
IS = IS_.create('natives')

IS.load
	'domEl': DOM.isEl
	'quickEl': DOM.isQuickEl
	'template': DOM.isTemplate

export default IS