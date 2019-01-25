# @Popup = window.quickpopup
import Popup from '../build/quickpopup.esm.js'
import DOM from 'quickdom'
import * as helpers from './helpers'
import {version as packageVersion} from '../package.json'
import chai from 'chai'
import chaiDom from 'chai-dom'
import chaiStyle from 'chai-style'
import chaiAlmost from 'chai-almost'
import chaiAsserttype from 'chai-asserttype'
import chaiEvents from 'chai-events'
chai.use(chaiDom)
chai.use(chaiStyle)
chai.use(chaiAlmost)
chai.use(chaiAsserttype)
chai.use(chaiEvents)
mocha.setup('tdd')
mocha.slow(400)
mocha.timeout(6000)
mocha.bail() unless window.__karma__
expect = chai.expect
assert = chai.assert
window.sandbox = null



suite "QuickPopup", ()->
	setup(helpers.restartSandbox)
	teardown(Popup.destroyAll)

	test "Version Property", ()->
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
				
				contents = popup.el.child.content.lastChild.children
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
				
				contents = popup.el.child.content.children
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
				
				contents = popup.el.child.content.children
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

		test "Popup.config() will return a new constructor with customized setting defaults & templates", ()->
			Popup2 = Popup.config({animation:100})
			assert.notEqual Popup2, Popup
			assert.equal Popup2.defaults.animation, 100
			assert.notEqual Popup.defaults.animation, 100
			Popup()
			Popup2()


	suite "open/close", ()->
		suiteSetup ()-> @Popup = Popup.config({animation:50})
		test "will return promises that resolve when animation ends", ()->
			content = DOM.div(null, 'abc123')
			popup = @Popup(content)
			startTime = Date.now()
			openTime = null

			assert.equal popup.state.open, false

			openPromise = popup.open()
			assert.ok openPromise instanceof Promise
			assert.ok openPromise.isPending()

			Promise.bind(@)
				.then ()-> openPromise
				.then ()->
					openTime = Date.now()
					assert.isAtLeast openTime-startTime, @Popup.defaults.animation/2
					assert.equal popup.state.open, true

				.then ()-> popup.close()
				.then ()->
					assert.isAtLeast Date.now()-openTime, @Popup.defaults.animation/2
					assert.equal popup.state.open, false


		test "will emit events before/present/finish for open/close", ()->
			popup = @Popup()
			events = ['beforeopen','open','finishopen','beforeclose','close','finishclose']
			count = {}
			events.forEach (event)->
				count[event] = 0
				popup.on event, ()-> count[event]++

			Promise.resolve()
				.then ()-> assert.deepEqual count, {beforeopen:0, open:0, finishopen:0, beforeclose:0, close:0, finishclose:0}
				.then ()-> popup.open()
				.then ()-> assert.deepEqual count, {beforeopen:1, open:1, finishopen:1, beforeclose:0, close:0, finishclose:0}
				.then ()-> popup.close()
				.then ()-> assert.deepEqual count, {beforeopen:1, open:1, finishopen:1, beforeclose:1, close:1, finishclose:1}


		test "will fail to open if another popup is open", ()->
			popupA = @Popup()
			popupB = @Popup()

			Promise.resolve()
				.then ()->
					assert.equal popupA.state.open, false
					assert.equal popupB.state.open, false
				
				.then ()-> popupA.open()
				.then ()->
					assert.equal popupA.state.open, true
					assert.equal popupB.state.open, false

				.then ()-> popupB.open()
				.then ()->
					assert.equal popupA.state.open, true
					assert.equal popupB.state.open, false


		test "will close all other open popups and will force open when options.forceOpen", ()->
			popupA = @Popup()
			popupB = @Popup(forceOpen:true)

			Promise.resolve()
				.then ()->
					assert.equal popupA.state.open, false
					assert.equal popupB.state.open, false
				
				.then ()-> popupA.open()
				.then ()->
					assert.equal popupA.state.open, true
					assert.equal popupB.state.open, false

				.then ()-> popupB.open()
				.then ()->
					assert.equal popupA.state.open, false
					assert.equal popupB.state.open, true

				.then ()-> popupA.open()
				.then ()->
					assert.equal popupA.state.open, false
					assert.equal popupB.state.open, true
























