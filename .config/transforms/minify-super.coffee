extend = require 'smart-extend'

module.exports = (file, options, file_, content)->
	if options._flags.debug
		return content
	else
		Closure = require('google-closure-compiler-js')
		result = Closure.compile(extend jsCode:[src:content], config)
		
		if result.errors.length
			errors = result.errors.map (err)-> {err:err.description, line:"#{err.lineNo}:#{err.charNo}"}
			console.error(errors)
			throw new Error('closure compiler failed')
		else if result.warnings.length
			console.error(result.warnings)

		return result.compiledCode

config =
	applyInputSourceMaps: false
	languageIn: 'ECMASCRIPT5'
	languageOut: 'ECMASCRIPT5'
	# compilationLevel: 'SIMPLE'
	compilationLevel: 'WHITESPACE_ONLY'
	assumeFunctionWrapper: false
	exportLocalPropertyDefinitions: true
	createSourceMap: true
	externs: [
		src:"function QuickTemplate(){}"
	,
		src:"function QuickElement(){}"
	]