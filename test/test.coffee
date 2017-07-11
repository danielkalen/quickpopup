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
mocha.bail() unless window.location.hostname
expect = chai.expect
assert = chai.assert
@sandbox = null



suite "QuickPopup", ()->
	setup(helpers.restartSandbox)

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
				assert.equal typeof popup, 'object'
				assert.equal typeof popup.open, 'function'
				console.log popup.el.child.content.children
				assert.equal popup.el.text, 'provided string'
			
			test "with html string arg", ()->
				popup = Popup('<b class="theBoldOne">provided string</b> <i class="theSlantedOne">is slanted</b>')
				assert.equal typeof popup, 'object'
				assert.equal typeof popup.open, 'function'
				assert.equal popup.el.text, 'provided string is slanted'
				
				contents = popup.el.child.content.children[1].children
				assert.equal contents.length, 2
				assert.equal contents[0].type, 'b'
				assert.equal contents[1].type, 'span'
				assert.equal contents[0].raw.className, 'theBoldOne'
				assert.equal contents[1].raw.className, 'theSkinnyOne'

			# test ""









