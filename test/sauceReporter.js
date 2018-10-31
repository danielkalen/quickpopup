window.failedTests = [];

window.runner = null;

mocha.run = (function() {
  var orig;
  orig = mocha.run.bind(mocha);
  return function() {
    var runner;
    runner = orig.apply(null, arguments);
    runner.on('end', function() {
      window.mochaResults = runner.stats || {};
      return window.mochaResults.reports = window.failedTests;
    });
    runner.on('pass', function() {});
    runner.on('fail', function(test, err) {
      return failedTests.push({
        name: test.title,
        result: false,
        message: err.message,
        stack: err.stack,
        titles: (function() {
          var titles;
          titles = [];
          while (test.parent.title) {
            titles.push(test.parent.title);
            test = test.parent;
          }
          return titles.reverse();
        })()
      });
    });
    return runner;
  };
})();

