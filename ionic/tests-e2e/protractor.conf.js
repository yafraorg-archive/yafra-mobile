var ScreenShotReporter = require('protractor-jasmine2-screenshot-reporter');

exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    '*.js'
  ],

  capabilities: {
    //'browserName': 'chrome'
    'browserName': 'firefox'
  },

  baseUrl: 'http://localhost:8081/',

  framework: 'jasmine2',

  jasmineNodeOpts: {
      // If true, print colors to the terminal.
      showColors: true,
      // Default time to wait in ms before a test fails.
      defaultTimeoutInterval: 30000,
      // Function called to print jasmine results.
      print: function() {}
  },

    onPrepare: function() {
        var jasmineReporters = require('jasmine-reporters');
        jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
            consolidateAll: true,
            savePath: 'testresults',
            filePrefix: 'xmloutput'
        }));
        // Add a screenshot reporter and store screenshots to `/tmp/screnshots`:
        jasmine.getEnv().addReporter(new ScreenShotReporter({
            dest: 'testresults/screenshots'
            }));
    }
};
