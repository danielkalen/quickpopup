export default
	placement: 'center'
	open: false
	forceOpen: false
	template: null
	condition: null
	animation: 300
	contentPadding: 0
	yThreshold: 15
	openLimit: Infinity
	overlayColor: 'rgba(0,0,0,0.88)'
	close:
		show: false
		padding: 20
		inside: false
		size: 22

	triggers:
		open:
			navigation: false
			visibility: false
			exitIntent: false
		close:
			esc: true