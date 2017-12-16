'use strict';

const   PACKAGE_NAME_RE = /(\@[^\/]+\/)?([^\/]+)/,
        pkg = require('../package.json'),
        libcore = require('libcore');

function cleanupName(name) {
    var match = name.match(PACKAGE_NAME_RE);
    return match ? match[2] : name;
}

function getPackageName() {
    return cleanupName(pkg.name);
}

function getCamelizedPackageName() {
    return libcore.camelize(getPackageName());
}


module.exports = {
    cleanPackageName: getPackageName,
    cleanupName: cleanupName,
    camelizedPackageName: getCamelizedPackageName
};
