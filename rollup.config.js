'use strict';


const   PACKAGE_NAME_RE = /(\@[^\/]+\/)?([^\/]+)/;

let helper = require('./rollup/helper.js'),
    pkg = require('./package.json'),
    configure = require('./rollup/base.js'),
    config = {},
    meta = {
        name: helper.cleanPackageName(),
        esTarget: pkg.module,
        target: pkg.main,
        moduleTarget: pkg.moduleName
    };


// base setup
configure(config, meta);

// setup by env
switch (process.env.BUILD) {
case 'production':
    require("./rollup/production.js")(config, meta);
    break;

case 'compressed':
    require("./rollup/compressed.js")(config, meta);
    break;

case 'unit-test':
    require("./rollup/unit-test.js")(config, meta);
    break;

default:
    require("./rollup/demo.js")(config, meta);
}


module.exports = config;