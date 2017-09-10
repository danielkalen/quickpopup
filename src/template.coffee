DOM = import 'quickdom'

export popup = DOM.template(
	['div'
		ref: 'popup'
		style:
			position: 'absolute'
			zIndex: 1e4
			top: 0
			left: 0
			width: '100vw'
			height: 0
			minHeight: '100%'
			visibility: 'hidden'
			overflow: 'hidden'
			transition: (popup)-> "all 0.001s linear #{popup.settings.animation+1}ms"
			
			$open:
				transition: ()-> 'all 0.001s linear 0s'
				visibility: 'visible'
				overflow: 'visible'
				height: 'auto'

	]
)


export overlay = DOM.template(
	['div'
		ref: 'overlay'
		style:
			position: 'fixed'
			zIndex: 1
			left: 0
			top: 0
			width: '100vw'
			minHeight: '100vh'
			opacity: 0
			backgroundColor: (popup)-> popup.settings.overlayColor
			transition: (popup)-> "opacity #{popup.settings.animation}ms"
			$open:
				opacity: 1
	]
)


export content = DOM.template(
	['div'
		ref: 'content'
		style:
			position: 'absolute'
			zIndex: 2
			boxSizing: 'border-box'
			maxWidth: '100%'
			margin: '0 auto'
			padding: (popup)-> popup.settings.contentPadding
			opacity: 0
			transition: (popup)->
				duration = popup.settings.animation
				"transform #{duration}ms,
				-webkit-transform #{duration}ms,
				opacity #{duration}ms"
			
			$open:
				opacity: 1

			$centerPlacement:
				left: '50%'
				transform: 'translateX(-50%)'
			
			$topPlacement:
				top: 0
				left: '50%'
				transform: 'translateX(-50%) translateY(-100%)'
				$open: transform: 'translateX(-50%) translateY(0)'
			
			$bottomPlacement:
				bottom: 0
				left: '50%'
				transform: 'translateX(-50%) translateY(100%)'
				$open: transform: 'translateX(-50%) translateY(0)'

		computers:
			placement: (placement)-> @state "#{placement}Placement", on
			content: (content)-> @append(content) if content

		events: 'stateChange:visible': (visible)->
			if visible and DOM(@).related.settings.placement is 'center'
				DOM(@).related.alignToCenter()
	]
)


export close = DOM.template(
	['div'
		ref: 'close'
		style:
			position: 'absolute'
			display: (popup)-> if popup.settings.close.show then 'block' else 'none'
			top: (popup)-> if popup.settings.close.inside then popup.settings.close.padding else popup.settings.close.size*2.5 * -1
			right: (popup)-> if popup.settings.close.inside then popup.settings.close.padding else 0
			width: (popup)-> popup.settings.close.size
			height: (popup)-> popup.settings.close.size
			color: (popup)-> popup.settings.close.color

		['*svg'
			attrs: viewBox:"0 0 492 492"
			style: width:'100%', height:'100%'

			['*path'
				attrs: d:'M300.2 246L484.1 62c5.1-5.1 7.9-11.8 7.9-19 0-7.2-2.8-14-7.9-19L468 7.9c-5.1-5.1-11.8-7.9-19-7.9 -7.2 0-14 2.8-19 7.9L246 191.8 62 7.9c-5.1-5.1-11.8-7.9-19-7.9 -7.2 0-14 2.8-19 7.9L7.9 24c-10.5 10.5-10.5 27.6 0 38.1L191.8 246 7.9 430c-5.1 5.1-7.9 11.8-7.9 19 0 7.2 2.8 14 7.9 19l16.1 16.1c5.1 5.1 11.8 7.9 19 7.9 7.2 0 14-2.8 19-7.9l184-184 184 184c5.1 5.1 11.8 7.9 19 7.9h0c7.2 0 14-2.8 19-7.9l16.1-16.1c5.1-5.1 7.9-11.8 7.9-19 0-7.2-2.8-14-7.9-19L300.2 246z'
				style: fill: (popup)-> popup.settings.close.color
			]
		]
	]
)


export bodyWrapper = DOM.template(
	['div'
		id: 'bodyWrapper'
		passStateToChildren: false
		style:
			$open:
				position: 'fixed'
				width: '100%'
				top: ''
	]
)


export html = DOM.template(
	['div'
		computers: html: (html)-> @html = html
	]
)
