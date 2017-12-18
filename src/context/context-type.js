'use strict';


import {
            TypeRegistry,
            Declaration
        } from '../package/api.js';

import { BaseType } from '../package/api.js';

export
    function createContextType(config, Class) {
        return Declaration.define('context',
                                    config,
                                    Class);
    }

export
    class ContextType extends BaseType {

        onInstantiate(instance) {
            
        }

    }

// register
TypeRegistry.register('context', ContextType);
