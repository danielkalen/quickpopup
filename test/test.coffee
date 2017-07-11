@Popup = window.quickpopup
mocha.setup('tdd')
mocha.slow(400)
mocha.timeout(12000)
mocha.bail() unless window.location.hostname
expect = chai.expect
sandbox = null
restartSandbox = ()->
	sandbox.parentElement.removeChild(sandbox) if sandbox
	sandbox = document.createElement('div')
	sandbox.id = 'sandbox'
	sandbox.setAttribute 'style', 'border:1px solid; padding:20px; box-sizing:border-box'
	document.body.appendChild(sandbox)


suite "QuickPopup", ()->
	setup(restartSandbox)

	test "Version Property", ()->
		packageVersion = (import '../package $ version')
		expect(Dom.version).to.equal(packageVersion)
