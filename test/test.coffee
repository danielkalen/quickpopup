@Popup = window.quickpopup
@DOM = import 'quickdom'
helpers = import './helpers'
chai = import 'chai'
chai.use(import 'chai-dom')
chai.use(import 'chai-style')
chai.use(import 'chai-almost')
chai.use(import 'chai-asserttype')
chai.use(import 'chai-events')
mocha.setup('tdd')
mocha.slow(400)
mocha.timeout(12000)
mocha.bail() unless window.__karma__
expect = chai.expect
assert = chai.assert
@sandbox = null



suite "QuickPopup", ()->
	setup(helpers.restartSandbox)
	teardown(Popup.destroyAll)

	test "Version Property", ()->
		packageVersion = (import '../package $ version')
		expect(Popup.version).to.equal(packageVersion)


	suite "instance", ()->
		test "should be an event emitter", ()->
			popup = Popup()
			assert.equal typeof popup.on, 'function'
			assert.equal typeof popup.off, 'function'
			assert.equal typeof popup.emit, 'function'
			Promise.delay().then ()-> popup.emit 'someEvent'
			expect(popup).to.emit 'someEvent'


		suite "args", ()->
			test "using no args", ()->
				popup = Popup()
				popup = new Popup()
				assert popup not instanceof Popup
				assert.equal typeof popup, 'object'
				assert.equal typeof popup.open, 'function'
				assert.equal popup.el.text, ''


			test "with string arg", ()->
				popup = Popup('provided string')
				assert.equal popup.el.text, 'provided string'


			test "with html string arg", ()->
				popup = Popup('<b class="theBoldOne">provided string</b><i class="theSlantedOne"> is slanted</b>')
				assert.equal popup.el.text, 'provided string is slanted'
				
				contents = popup.el.child.content.children[1].children
				assert.equal contents.length, 2
				assert.equal contents[0].type, 'b'
				assert.equal contents[1].type, 'i'
				assert.equal contents[0].raw.className, 'theBoldOne'
				assert.equal contents[1].raw.className, 'theSlantedOne'


			test "with DOM element arg", ()->
				span = DOM.span(class:'abc123-child', 'provided el')
				div = DOM.div(class:'abc123', span)
				popup = Popup(div.raw)
				assert.equal popup.el.text, 'provided el'
				
				contents = popup.el.child.content.children.slice(1)
				assert.equal contents.length, 1
				assert.equal contents[0].type, 'div'
				assert.equal contents[0].raw.className, 'abc123'
				assert.equal contents[0], div
				assert.equal contents[0].children[0], span


			test "with QuickDOM element arg", ()->
				span = DOM.span(class:'abc123-child', 'provided el')
				div = DOM.div(class:'abc123', span)
				popup = Popup(div)
				assert.equal popup.el.text, 'provided el'
				
				contents = popup.el.child.content.children.slice(1)
				assert.equal contents.length, 1
				assert.equal contents[0].type, 'div'
				assert.equal contents[0].raw.className, 'abc123'
				assert.equal contents[0], div
				assert.equal contents[0].children[0], span


			test "with settings arg", ()->
				popupA = Popup({})
				popupB = Popup({placement:'bottom'})
								
				assert.equal popupA.settings.placement, 'center'
				assert.equal popupB.settings.placement, 'bottom'


	suite "behavior", ()->
		test "should create a wrapper element around body contents", ()->
			assert.equal typeof DOM.query('#bodyWrapper'), 'undefined'
			bodyChildren = DOM(document.body).children.slice()

			popup = Popup()
			assert.equal typeof DOM.query('#bodyWrapper'), 'object'
			assert.equal DOM.query('#bodyWrapper').parent, DOM(document.body)
			assert.equal DOM(document.body).children.length, 2
			assert.equal DOM.query('#bodyWrapper').children.length, bodyChildren.length
			
			Popup.unwrapBody()
			assert.equal typeof DOM.query('#bodyWrapper'), 'undefined'
			assert.equal DOM(document.body).children.length, bodyChildren.length+1

			popup.destroy()
			assert.equal DOM(document.body).children.length, bodyChildren.length
			
			popup = Popup()
			assert.equal DOM(document.body).children.length, 2
			assert.equal DOM.query('#bodyWrapper').children.length, bodyChildren.length














