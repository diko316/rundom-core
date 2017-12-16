// Karma configuration
// Generated on Tue Dec 05 2017 23:28:24 GMT+0800 (+08)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'src/**/*.spec.js'
    ],


    // list of files to exclude
    exclude: [
      'src/**/*.temp.spec.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        'src/**/*.js': ['rollup']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    rollupPreprocessor: {
        plugins: [
            require('rollup-plugin-node-globals')(),
            require('rollup-plugin-node-builtins')(),
            require('rollup-plugin-node-resolve')({
                jsnext: true,
                main: true,
                browser: true
            }),
            require('rollup-plugin-commonjs')({
                ignoreGlobal: true
            }),
            require('rollup-plugin-buble')()
        ],
        format: 'iife',
        name: require("./rollup/helper.js").camelizedPackageName(),
        sourcemap: 'inline'
    }

  })
}
