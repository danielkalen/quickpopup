export isIE = document.all and !window.atob
export isIE11 = window.navigator.msPointerEnabled
export isEdge = /Edge/.test window.navigator?.userAgent or ''