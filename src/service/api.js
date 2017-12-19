'use strict';

import {
            TypeRegistry,
            Declaration
        } from '../package/api.js';

import { ServiceType } from './service-type.js';

import { method } from 'libcore';

// register
TypeRegistry.register('service', ServiceType);


// also accepts parameter (Class)
export
    function defineService(config, Class) {
        var definition;

        if (method(config)) {
            Class = config;
            config = {};
        }

        definition = Declaration.define('service',
                                        config,
                                        Class);

        return definition.target;
    }


