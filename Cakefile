global.Promise = require 'bluebird'
Promise.config longStackTraces:process.env.DEBUG?
extend = require 'smart-extend'
packageInstall = require 'package-install'
fs = require 'fs-jetpack'
chalk = require 'chalk'
Path = require 'path'
MEASURE_LOG = './.config/measure.json'
PACKAGE = './package.json'
process.env.SOURCE_MAPS ?= 1
buildModules = ['simplyimport@4.0.0-t7','google-closure-compiler-js','uglify-js@3.0.24','babelify','babel-preset-es2015-script','babel-core']
coverageModules = ['istanbul', 'badge-gen', 'coffee-coverage']
testModules = ['@danielkalen/polyfills', 'mocha', 'chai', 'chai-dom', 'chai-style', 'chai-almost', 'chai-asserttype', 'chai-events']
karmaModules = ['electron', 'karma@1.6.0', 'karma-chrome-launcher', 'karma-coverage', 'karma-electron', 'karma-firefox-launcher', 'karma-ie-launcher', 'karma-mocha', 'karma-opera-launcher', 'karma-safari-launcher', 'github:danielkalen/karma-sauce-launcher']

option '-d', '--debug', 'run in debug mode'
option '-t', '--target [target]', 'target measure dir'


task 'build', ()->
	Promise.resolve()
		.then ()-> invoke 'build:js'
		.then ()-> invoke 'build:test'


task 'build:js', (options)->
	debug = if options.debug then '.debug' else ''
	Promise.resolve()
		.then ()-> invoke 'install:build'
		.then ()-> {src:"src/index.coffee", dest:"build/quickpopup#{debug}.js"}
		.tap ()-> console.log 'compiling js' unless global.silent
		.then (file)-> compileJS(file, debug:options.debug, umd:'quickpopup', target:'browser')

task 'build:test', (options)->
	Promise.resolve()
		.then ()-> invoke 'install:build'
		.then ()-> invoke 'install:test'
		.tap ()-> console.log 'compiling test' unless global.silent
		.then ()-> {src:"test/test.coffee", dest:"test/test.js"}
		.then (file)-> compileJS(file, debug:options.debug, noPkgConfig:true)




task 'watch', ()->
	Promise.resolve()
		.then ()-> invoke 'install:watch'
		.then ()->
			invoke 'watch:js'
			invoke 'watch:test'

task 'watch:js', (options)->
	watch "src/*.coffee", -> invoke 'build:js'

task 'watch:test', (options)->
	watch "test/*.coffee", -> invoke 'build:test'





task 'install', ()->
	Promise.resolve()
		.then ()-> invoke 'install:test'
		.then ()-> invoke 'install:coverage'
		.then ()-> invoke 'install:bench'

task 'install:build', ()-> packageInstall buildModules
task 'install:watch', ()-> packageInstall ['listr','simplywatch@3.0.0-l5']
task 'install:test', ()-> packageInstall testModules
task 'install:karma', ()-> packageInstall testModules.concat(karmaModules)
task 'install:coverage', ()-> packageInstall coverageModules
task 'install:measure', ()-> packageInstall ['gzipped', 'sugar']



task 'measure', (options)->
	Promise.resolve()
		.then ()-> fs.writeAsync(MEASURE_LOG, {}) if not fs.exists(MEASURE_LOG)
		.then ()-> invoke 'install:measure'
		.then ()->
			DIR = if options.target then options.target else 'build'
			measure {debug:"./#{DIR}/quickpopup.debug.js", release:"./#{DIR}/quickpopup.js"}

















watch = (globs, command)->
	global.silent = true
	Promise.resolve()
		# .then ()-> packageInstall 'simplywatch@3.0.0-l5'
		.then ()-> require('simplywatch')({globs, command})


runTaskList = (tasks)->
	(new (require 'listr')(tasks, concurrent:true)).run()


measure = (file)->
	gzipped = Promise.promisifyAll require('gzipped')
	bytes = require 'sugar/number/bytes'
	isEqual = require 'sugar/object/isEqual'
	results = debug:null, release:null
	
	Promise.resolve()
		.then ()-> gzipped.calculateAsync fs.createReadStream(file.debug)
		.then (result)-> results.debug = 'orig':bytes(result.original,2), 'gzip':bytes(result.compressed,2)
		
		.then ()-> gzipped.calculateAsync fs.createReadStream(file.release)
		.then (result)-> results.release = 'orig':bytes(result.original,2), 'gzip':bytes(result.compressed,2)
		
		.then ()-> Promise.all [fs.readAsync(MEASURE_LOG,'json'), fs.readAsync(PACKAGE,'json').get('version')]
		.then ([log, version])->
			log[version] ?= []
			lastResult = log[version].slice(-1)[0]
			return log if lastResult and isEqual(lastResult, results)
			log[version].push(results)
			return log
		
		.then (updatedLog)-> fs.writeAsync MEASURE_LOG, updatedLog
		.then ()->
			console.log "#{chalk.dim 'DEBUG  '} #{chalk.green results.debug.gzip} (#{chalk.yellow results.debug.orig})"
			console.log "#{chalk.dim 'RELEASE'} #{chalk.green results.release.gzip} (#{chalk.yellow results.release.orig})"
			console.log '\n'


compileJS = (file, options)->
	Promise.resolve()
		.then ()-> require('simplyimport')(extend {file:file.src, usePaths:options.debug, specific}, options)
		.then (result)-> fs.writeAsync(file.dest, result)
		.catch (err)->
			console.error(err) if err not instanceof Error
			throw err

babelify = transform:['babelify', {presets:'babel-preset-es2015-script', sourceMaps:false}]
specific = 
	'p-event': babelify
	'p-finally': babelify
	'p-timeout': babelify







