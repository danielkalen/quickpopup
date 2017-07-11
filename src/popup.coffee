import template,{bodyWrapper} from './template'
DOM = import 'quickdom'
extend = import 'smart-extend'
defaults = import './defaults'
helpers = import './helpers'
body = DOM(document.body)

class Popup extends require('event-lite')
	@defaults: defaults
	@instances: []
	@hasOpen: false
	@bodyWrapper: null

	@wrapBody: ()-> unless @bodyWrapper
		@bodyWrapper = bodyWrapper.spawn()
		bodyChildren = body.children
		@bodyWrapper.prependTo(body)
		@bodyWrapper.append(child) for child in bodyChildren
		return


	constructor: (settings)->
		@settings = extend.clone.deep defaults, settings
		@id = Math.round(Math.rand()*1e5).toString(16)
		@state = open:false, destroyed:false, offset:0
		@content = DOM(settings.target)
		@el = template.spawn({data:@content, placement:@settings.placement}, relatedInstance:@)

		super
		@instances.push(@)
		@_attachBindings()
		@_applyTemplate() if @settings.template and typeof @settings.template is 'object'
		@open() if @settings.openOnInit
		@el.prependTo(body)

	_applyCustomStyles: ()->
		custom = @settings.template
		@el.child.popup.updateOptions(custom.popup) if custom.popup
		@el.child.overlay.updateOptions(custom.overlay) if custom.overlay
		@el.child.content.updateOptions(custom.content) if custom.content
		@el.child.close.updateOptions(custom.close) if custom.close

	_attachBindings: ()->
		close = @close.bind(@)
		@el.child.overlay.on 'mouseup touchend', close
		@el.child.close.on 'mouseup touchend', close

		if @settings.closeOnEsc
			DOM(document).on "keyup.#{@id}", (event)=> if event.keyCode is 27 and @state.open
				event.stopPropagation()
				event.preventDefault()
				@close()

		if @settings.placement is 'center'
			DOM(window).on "resize.#{@id}", ()=> if @state.open
				@alignToCenter()

	_detachBindings: ()->
		@el.child.overlay.off()
		@el.child.close.off()
		DOM(document).off "keyup.#{@id}" if @settings.closeOnEsc
		DOM(window).off "resize.#{@id}" if @settings.placement is 'center'

	_throwDestroyed: ()->
		throw new Error("invalid attempt to operate a destroyed popup instance")


	alignToCenter: ()->
		contentHeight = @el.child.content.raw.clientHeight
		windowHeight = window.innerHeight
		
		if contentHeight >= windowHeight-80
			offset = if window.innerWidth > 736 then 100 else 60
		else
			offset = (windowHeight - contentHeight)/2
		
		@el.child.content.style 'margin', "#{offset}px auto"


	open: ()-> if not @open and (not Popup.hasOpen or @settings.forceOpen)
		@_throwDestroyed() if @state.destroyed
		@emit 'beforeopen'
		
		if Popup.hasOpen
			for popup in Popup.instances when popup isnt @ and popup.state.open
				@state.offset = popup.state.offset
				popup.close(true)
		else
			@state.offset = helpers.scrollOffset()
		

		helpers.scheduleScrollReset(5)
		Popup.bodyWrapper.state 'open', on
		@el.state 'open', on
		@state.open = Popup.hasOpen = true
		@alignToCenter()
		@emit 'open'


	close: (preventReset)-> if @state.open
		@emit 'beforeclose'

		unless preventReset
			setTimeout ()=> unless Popup.hasOpen
				Popup.bodyWrapper.state 'open', off
				window.scroll 0, @state.offset + helpers.documentOffset()

			Popup.hasOpen = false

		@el.state 'open', off
		@state.open = false
		@emit 'close'


	destroy: ()->
		@_throwDestroyed() if @settings.destroyed
		@close()
		@_detachBindings()
		@el.remove()
		Popup.instances.splice Popup.instances.indexOf(@), 1
		return true




module.exports = Popup