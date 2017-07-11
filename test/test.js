var expect, restartSandbox, sandbox;

this.Popup = window.quickpopup;

mocha.setup('tdd');

mocha.slow(400);

mocha.timeout(12000);

if (!window.location.hostname) {
  mocha.bail();
}

expect = chai.expect;

sandbox = null;

restartSandbox = function() {
  if (sandbox) {
    sandbox.parentElement.removeChild(sandbox);
  }
  sandbox = document.createElement('div');
  sandbox.id = 'sandbox';
  sandbox.setAttribute('style', 'border:1px solid; padding:20px; box-sizing:border-box');
  return document.body.appendChild(sandbox);
};

suite("QuickPopup", function() {
  setup(restartSandbox);
  return test("Version Property", function() {
    var packageVersion;
    packageVersion = "1.0.0";
    return expect(Dom.version).to.equal(packageVersion);
  });
});

