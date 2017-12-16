#!/bin/sh

cd $(dirname $(dirname $(readlink -f $0)))

npm install --save-dev -dd -y \
    "jasmine-core" \
    "karma" \
    "karma-firefox-launcher" \
    "karma-jasmine" \
    "karma-mocha-reporter" \
    "karma-rollup-preprocessor" \
    "rollup" \
    "rollup-plugin-browsersync" \
    "rollup-plugin-buble" \
    "rollup-plugin-commonjs" \
    "rollup-plugin-json" \
    "rollup-plugin-node-builtins" \
    "rollup-plugin-node-globals" \
    "rollup-plugin-node-resolve" \
    "rollup-plugin-uglify"


#rm -Rf node_modules
npm install --save -dd -y \
    "libcore" \
    "libcore-parser-lalr" \
    "libdom" \
    "libdom-http" \
    "joqx"

rm -Rf node_modules package-lock.json