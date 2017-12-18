'use strict';

import {
            TypeRegistry,
            Declaration
        } from '../package/api.js';

import { ServiceType } from './service-type.js';

// register
TypeRegistry.register('service', ServiceType);


export
    function defineService(config, Class) {
        return Declaration.define('service',
                                    config,
                                    Class);
    }


