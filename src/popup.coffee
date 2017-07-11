import template,{bodyWrapper, html as htmlTemplate} from './template'
DOM = import 'quickdom'
IS = import './checks'
defaults = import './defaults'
helpers = import './helpers'
body = DOM(document.body)

class Popup extends require('event-lite')
	@defaults: defaults
	@instances: []
	@hasOpen: false
	@bodyWrapper: null
	@transitionEnd: helpers.transitionEnd()

	@wrapBody: ()-> unless @bodyWrapper
		@bodyWrapper = bodyWrapper.spawn()
		bodyChildren = body.children.slice()
		@bodyWrapper.prependTo(body)
		@bodyWrapper.append(child) for child in bodyChildren
		return


	constructor: (settings)->
		@settings = helpers.extendSettings(defaults, settings)
		@id = Math.round(Math.random()*1e5).toString(16)
		@state = open:false, destroyed:false, offset:0, count:0
		@content = DOM(@settings.content) if @settings.content
		@el = template.spawn({data:@content, placement:@settings.placement}, relatedInstance:@)

		super
		Popup.instances.push(@)
		Popup.wrapBody()
		@_attachBindings()
		@_applyTemplate() if @settings.template and typeof @settings.template is 'object'

		@el.prependTo(body)
		@open() if @settings.openOnInit


	_applyTemplate: ()->
		custom = @settings.template
		for ref of @el.child
			@el.child[ref].updateOptions(custom[ref]) if custom[ref]

		return


	_attachBindings: ()->
		close = @close.bind(@)
		@el.child.overlay.on 'mouseup touchend', close
		@el.child.close.on 'mouseup touchend', close

		if @settings.placement is 'center'
			DOM(window).on "resize.#{@id}", ()=> if @state.open
				@alignToCenter()

		if @settings.triggers.close.esc
			DOM(document).on "keyup.#{@id}", (event)=> if event.keyCode is 27 and @state.open
				event.stopPropagation()
				event.preventDefault()
				@close()

		if @settings.triggers.open.visibility
			{visibilitychange,hidden} = helpers.visibilityApiKeys()
			DOM(document).on "#{visibilitychange}.#{@id}", ()=>
				@open('visibility') if document[hidden]

		if @settings.triggers.open.exitIntent
			DOM(window).on "mouseleave.#{@id}", (event)=>
				@open('exitIntent') if event.clientY < 1

		if @settings.triggers.open.navigation and window.history?.pushState
			window.history.replaceState {id:'quickpopup-origin'}, '', ''
			window.history.pushState {id:'quickpopup'}, '', ''
			
			DOM(window).on "popstate.#{@id}", (event)=>
				if event.state.state.id is 'quickpopup-origin' and @open('navigation')
					;
				else
					window.history.back()


	_detachBindings: ()->
		@el.child.overlay.off()
		@el.child.close.off()
		{visibilitychange,hidden} = helpers.visibilityApiKeys()
		
		DOM(window).off "resize.#{@id}" if @settings.placement is 'center'
		DOM(window).off "mouseleave.#{@id}" if @settings.triggers.open.exitIntent
		DOM(window).off "popstate.#{@id}" if @settings.triggers.open.navigation
		DOM(document).off "#{visibilitychange}.#{@id}" if @settings.triggers.open.visibility
		DOM(document).off "keyup.#{@id}" if @settings.triggers.close.esc


	_throwDestroyed: ()->
		throw new Error("invalid attempt to operate a destroyed popup instance")












	setContent: (target)->
		newContent = switch
			when IS.quickEl(target) then target
			when IS.domEl(target) then DOM(target)
			when IS.template(target) then target.spawn()
			when IS.string(target) then htmlTemplate.spawn(data:html:target)
			else throw new Error('invalid target provided to Popup::setContent()')
		
		@el.child.content.children[1].replaceWith newContent


	alignToCenter: ()->
		contentHeight = @el.child.content.raw.clientHeight
		windowHeight = window.innerHeight
		
		if contentHeight >= windowHeight-80
			offset = if window.innerWidth > 736 then 100 else 60
		else
			offset = (windowHeight - contentHeight)/2
		
		@el.child.content.style 'margin', "#{offset}px auto"


	open: (triggerName)-> if not @open and (not Popup.hasOpen or @settings.forceOpen)
		@_throwDestroyed() if @state.destroyed
		return if ++@state.count >= @settings.openLimit
		return if window.innerWidth < @settings.triggers.open.minWidth
		return if @settings.condition and not @settings.condition()
		
		@emit 'beforeopen', triggerName
		
		if not Popup.hasOpen
			@state.offset = helpers.scrollOffset()
		else
			for popup in Popup.instances when popup isnt @ and popup.state.open
				@state.offset = popup.state.offset
				popup.close(true)
		

		helpers.scheduleScrollReset(5)
		Popup.bodyWrapper.state 'open', on
		@el.state 'open', on
		@state.open = Popup.hasOpen = true
		@alignToCenter()
		@emit 'open', triggerName
		
		if not @settings.animation or not Popup.transitionEnd
			@emit 'finishopen'
		else
			@el.child.content.on Popup.transitionEnd, (event)=> if event.target is @el.child.content.raw
				@emit 'finishopen'
				@el.child.content.off Popup.transitionEnd
		return @


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
		if not @settings.animation or not Popup.transitionEnd
			@emit 'finishclose'
		else
			@el.child.content.on Popup.transitionEnd, (event)=> if event.target is @el.child.content.raw
				@emit 'finishclose'
				@el.child.content.off Popup.transitionEnd
		return @


	destroy: ()->
		@_throwDestroyed() if @settings.destroyed
		@close()
		@_detachBindings()
		@el.remove()
		Popup.instances.splice Popup.instances.indexOf(@), 1
		return true




module.exports = Popup