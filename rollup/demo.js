'use strict';


function augment(config, meta) {
    var output;
    

    meta.demo = output = {};

    config.output = [output];

    config.input = 'src/demo.js';
    output.file = 'dist/demo.js';
    output.format = 'umd';
    output.name = 'demo';
    output.exports = 'named';
    output.sourcemap = 'inline';

    
    delete config.targets;
    delete config.external;
    delete config.globals;
}

module.exports = augment;

