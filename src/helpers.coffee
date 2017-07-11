module.exports = exports = {}


exports.scheduleScrollReset = (scheduleNext)-> setTimeout ()->
	window.scroll(0,0)
	
	if scheduleNext
		setTimeout ()->
			exports.scheduleScrollReset()
		, scheduleNext


exports.scrollOffset = ()->
	window.scrollY - exports.documentOffset()

exports.documentOffset = ()->
	(document.body.getBoundingClientRect()?.top or 0) + window.scrollY





