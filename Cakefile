global.Promise = require 'bluebird'
Promise.config longStackTraces:process.env.DEBUG?
promiseBreak = require 'promise-break'
spawn = require('child_process').spawn
extend = require 'smart-extend'
fs = require 'fs-jetpack'
chalk = require 'chalk'
Path = require 'path'
process.env.SOURCE_MAPS ?= 1
buildModules = ['google-closure-compiler-js','uglify-js@3.0.24']
coverageModules = ['istanbul', 'badge-gen', 'coffee-coverage', 'request']
testModules = ['@danielkalen/polyfills', 'chai', 'mocha', 'sinon']
karmaModules = ['request', 'electron', 'karma@1.6.0', 'karma-chai', 'karma-chrome-launcher', 'karma-coverage', 'karma-electron', 'karma-firefox-launcher', 'karma-ie-launcher', 'karma-mocha', 'karma-opera-launcher', 'karma-safari-launcher', 'github:danielkalen/karma-sauce-launcher']
karmaModules = testModules.concat(karmaModules)
MEASURE_LOG = './.config/measure.json'
PACKAGE = './package.json'

option '-d', '--debug', 'run in debug mode'
option '-t', '--target [target]', 'target measure dir'


task 'build', ()->
	Promise.resolve()
		.then ()-> invoke 'install:build'
		.then ()-> invoke 'build:js'
		.then ()-> invoke 'build:test'


task 'build:js', (options)->
	debug = if options.debug then '.debug' else ''
	Promise.resolve()
		.then ()-> {src:"src/index.coffee", dest:"build/quickpopup#{debug}.js"}
		.tap ()-> console.log 'compiling js' unless global.silent
		.then (file)-> compileJS(file, debug:options.debug, umd:'quickpopup', target:'browser')

task 'build:test', (options)->
	Promise.resolve()
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
	global.silent = true
	require('simplywatch')
		globs: "src/*.coffee"
		finalCommandDelay: 1
		finalCommand: ()-> invoke 'build:js'


task 'watch:test', (options)->
	global.silent = true
	require('simplywatch')
		globs: "test/*.coffee"
		command: ()-> null
		finalCommandDelay: 1
		finalCommand: ()-> invoke 'build:test'




task 'install', ()->
	Promise.resolve()
		.then ()-> invoke 'install:test'
		.then ()-> invoke 'install:coverage'
		.then ()-> invoke 'install:bench'


task 'install:build', ()->
	Promise.resolve()
		.then ()-> buildModules.filter (module)-> not moduleInstalled(module)
		.tap (missingModules)-> promiseBreak() if missingModules.length is 0
		.tap (missingModules)-> installModules(missingModules)
		.catch promiseBreak.end


task 'install:watch', ()->
	Promise.resolve()
		.then ()-> ['listr'].filter (module)-> not moduleInstalled(module)
		.tap (missingModules)-> promiseBreak() if missingModules.length is 0
		.tap (missingModules)-> installModules(missingModules)
		.catch promiseBreak.end


task 'install:test', ()->
	Promise.resolve()
		.then ()-> testModules.filter (module)-> not moduleInstalled(module)
		.tap (missingModules)-> promiseBreak() if missingModules.length is 0
		.tap (missingModules)-> installModules(missingModules)
		.catch promiseBreak.end


task 'install:karma', ()->
	Promise.resolve()
		.then ()-> karmaModules.filter (module)-> not moduleInstalled(module)
		.tap (missingModules)-> promiseBreak() if missingModules.length is 0
		.tap (missingModules)-> installModules(missingModules)
		.catch promiseBreak.end


task 'install:coverage', ()->
	Promise.resolve()
		.then ()-> coverageModules.filter (module)-> not moduleInstalled(module)
		.tap (missingModules)-> promiseBreak() if missingModules.length is 0
		.tap (missingModules)-> installModules(missingModules)
		.catch promiseBreak.end


task 'install:measure', ()->
	Promise.resolve()
		.then ()-> ['gzipped', 'sugar'].filter (module)-> not moduleInstalled(module)
		.tap (missingModules)-> promiseBreak() if missingModules.length is 0
		.tap (missingModules)-> installModules(missingModules)
		.catch promiseBreak.end



task 'measure', ()->
	Promise.resolve()
		.then ()-> fs.writeAsync(MEASURE_LOG, {}) if not fs.exists(MEASURE_LOG)
		.then ()-> invoke 'install:measure'
		.then ()->
			DIR = if options.target then options.target else 'build'
			measure {debug:"./#{DIR}/quickpopup.debug.js", release:"./#{DIR}/quickpopup.js"}




















runTaskList = (tasks)->
	(new (require 'listr')(tasks, concurrent:true)).run()


measure = (target, file)->
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
			console.log chalk.bold.underline.red target.toUpperCase()
			console.log "#{chalk.dim 'DEBUG  '} #{chalk.green results.debug.gzip} (#{chalk.yellow results.debug.orig})"
			console.log "#{chalk.dim 'RELEASE'} #{chalk.green results.release.gzip} (#{chalk.yellow results.release.orig})"
			console.log '\n'


compileJS = (file, options)->
	Promise.resolve()
		.then ()-> require('simplyimport')(extend {file:file.src}, options)
		.then (result)-> fs.writeAsync(file.dest, result)
		.catch (err)->
			console.error(err) if err not instanceof Error
			throw err



installModules = (targetModules)-> new Promise (resolve, reject)->
	targetModules = targetModules
		.filter (module)-> if typeof module is 'string' then true else module[1]()
		.map (module)-> if typeof module is 'string' then module else module[0]
	
	return resolve() if not targetModules.length
	console.log "#{chalk.yellow('Installing')} #{chalk.dim targetModules.join ', '}"
	
	install = spawn('npm', ['install', '--no-save', '--no-purne', targetModules...], {stdio:'inherit'})
	install.on 'error', reject
	install.on 'close', resolve


moduleInstalled = (targetModule)->
	targetModule = targetModule[0] if typeof targetModule is 'object'
	if (split=targetModule.split('@')) and split[0].length
		targetModule = split[0]
		targetVersion = split[1]
	
	pkgFile = Path.resolve('node_modules',targetModule,'package.json')
	exists = fs.exists(pkgFile)
	
	if exists and targetVersion?
		currentVersion = fs.read(pkgFile, 'json').version
		exists = require('semver').gte(currentVersion, targetVersion)

	return exists


