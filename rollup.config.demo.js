'use strict';

let helper = require('./rollup/helper.js'),
    pkg = require('./package.json'),
    configure = require('./rollup/base.js'),
    meta = {
        name: helper.cleanPackageName(),
        target: pkg.main,
        moduleTarget: pkg.moduleName
    },
    config = {};

// base setup
configure(config, meta);

// setup demo
require("./rollup/demo.js")(config, meta);

module.exports = config;
