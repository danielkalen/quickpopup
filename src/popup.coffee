import promiseEvent from 'p-event'
import promiseBreak from 'promise-break'
import DOM from 'quickdom'
import IS from './checks'
import * as template from './template'
import * as helpers from './helpers'
import * as BROWSER from './browser-info'
import EventEmitter from 'event-lite'
body = DOM(document.body)

class Popup extends EventEmitter
	@instances: []
	@hasOpen: false
	@bodyWrapper: null
	@transitionEnd: helpers.transitionEnd()

	@wrapBody: ()-> unless @bodyWrapper?.parent
		@bodyWrapper = template.bodyWrapper.spawn()
		bodyChildren = body.children.slice()
		@bodyWrapper.prependTo(body)
		@bodyWrapper.append(child) for child in bodyChildren
		return

	@unwrapBody: ()-> if @bodyWrapper
		bodyChildren = @bodyWrapper.children.slice()
		body.append(child) for child in bodyChildren
		@bodyWrapper.remove()
		@bodyWrapper = null

	@destroyAll: ()->
		instances = @instances.slice()
		instance.destroy() for instance in instances
		@unwrapBody()





	constructor: (settings, defaults, @template)->
		super()
		@settings = helpers.extendSettings(defaults, settings)
		@id = Math.round(Math.random()*1e5).toString(16)
		@state = open:false, destroyed:false, offset:0, count:0
		@content = DOM(@settings.content) if @settings.content

		Popup.instances.push(@)
		Popup.wrapBody()
		@_createElements()
		@_attachBindings()
		@_applyTemplate() if @settings.template and typeof @settings.template is 'object'

		@el.prependTo(body)
		@open() if @settings.open


	_createElements: ()->
		data = data:{@content, placement:@settings.placement}
		config = relatedInstance: @
		
		@el = @template.popup.spawn(data, config)
		overlay = @template.overlay.spawn(data, config).appendTo(@el)
		content = @template.content.spawn(data, config).appendTo(@el)
		close = @template.close.spawn(data, config).appendTo(content) if @settings.close.show


	_applyTemplate: ()->
		custom = @settings.template
		for ref of @el.child
			@el.child[ref].updateOptions(custom[ref]) if custom[ref]

		return

	_attachBindings: ()->
		close = @close.bind(@)
		@el.child.overlay.on 'mouseup touchend', close
		@el.child.close?.on 'mouseup touchend', close

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
			DOM(document).on "mouseout.#{@id}", (event)=>
				base = if BROWSER.isIE or BROWSER.isIE11 or BROWSER.isEdge then 110 else 0
				threshold = @settings.yThreshold + base
				@open('exitIntent') if event.clientY <= threshold

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
		@el.child.close?.off()
		{visibilitychange,hidden} = helpers.visibilityApiKeys()
		
		DOM(window).off "resize.#{@id}" if @settings.placement is 'center'
		DOM(window).off "popstate.#{@id}" if @settings.triggers.open.navigation
		DOM(document).off "mouseout.#{@id}" if @settings.triggers.open.exitIntent
		DOM(document).off "#{visibilitychange}.#{@id}" if @settings.triggers.open.visibility
		DOM(document).off "keyup.#{@id}" if @settings.triggers.close.esc


	_throwDestroyed: ()->
		throw new Error("invalid attempt to operate a destroyed popup instance")












	setContent: (target)->
		@content = switch
			when IS.quickEl(target) then target
			when IS.domEl(target) then DOM(target)
			when IS.template(target) then target.spawn()
			when IS.string(target) then template.html.spawn(data:html:target)
			else throw new Error('invalid target provided to Popup::setContent()')
		
		if @el.child.content.children.length
			@el.child.content.children[1].replaceWith @content
		else
			@el.child.content.append @content


	alignToCenter: ()->
		contentHeight = @el.child.content.raw.clientHeight
		windowHeight = window.innerHeight
		
		if contentHeight >= windowHeight-80
			offset = if window.innerWidth > 736 then 100 else 60
		else
			offset = (windowHeight - contentHeight)/2
		
		@el.child.content.style 'margin', "#{offset}px auto"


	open: (triggerName)->
		Promise.resolve()
			.then ()=>
				@_throwDestroyed() if @state.destroyed
				promiseBreak() if false or
					@state.open or (Popup.hasOpen and not @settings.forceOpen) or
					++@state.count >= @settings.openLimit or
					window.innerWidth < @settings.triggers.open.minWidth or
					@settings.condition and not @settings.condition()
			
			.then ()=>
				@emit 'beforeopen', triggerName
				
				if not Popup.hasOpen
					@state.offset = helpers.scrollOffset()
				else
					openPopups = Popup.instances.filter (popup)=> popup isnt @ and popup.state.open
					Promise.all openPopups.map (popup)=>
						@state.offset = popup.state.offset
						popup.close(true)
				
			.then ()=>
				helpers.scheduleScrollReset(5)
				Popup.bodyWrapper.state 'open', on
				Popup.bodyWrapper.style 'top', @state.offset*-1
				@el.state 'open', on
				@state.open = Popup.hasOpen = true
				@alignToCenter() if @settings.placement is 'center'
				@emit 'open', triggerName
				
				if not @settings.animation or not Popup.transitionEnd
					@emit 'finishopen'
				else
					promise = promiseEvent(@, 'finishopen')
					
					@el.child.content.on Popup.transitionEnd, (event)=> if event.target is @el.child.content.raw
						@emit 'finishopen'
						@el.child.content.off Popup.transitionEnd
				
					return promise

			.catch promiseBreak.end
			.then ()=> @


	close: (preventReset)->
		Promise.resolve()
			.then ()=> promiseBreak() if not @state.open
			.then ()=>
				@emit 'beforeclose'

				unless preventReset is true
					setTimeout ()=> unless Popup.hasOpen
						Popup.bodyWrapper?.state 'open', off
						Popup.bodyWrapper?.style 'top', null
						window.scroll 0, @state.offset + helpers.documentOffset()

					Popup.hasOpen = false

				@el.state 'open', off
				@state.open = false
				@emit 'close'
				if not @settings.animation or not Popup.transitionEnd
					@emit 'finishclose'
				else
					promise = promiseEvent(@, 'finishclose')
					
					@el.child.content.on Popup.transitionEnd, (event)=> if event.target is @el.child.content.raw
						@emit 'finishclose'
						@el.child.content.off Popup.transitionEnd

					return promise
			
			.catch promiseBreak.end
			.then ()=> @


	destroy: ()->
		@_throwDestroyed() if @settings.destroyed
		@close()
		@_detachBindings()
		@el.remove()
		Popup.instances.splice Popup.instances.indexOf(@), 1
		return true




export default Popup