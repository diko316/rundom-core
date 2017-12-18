'use strict';

import { each } from 'libcore';

import './platform.js';

import { Declaration } from '../package/api.js';

import { ContextNode } from './node.js';

export
    function createContext() {
        var dependencies = {},
            instance = Declaration.instantiate(ContextNode,
                                                '$$self',
                                                dependencies);
        
        each(dependencies,
            instance => instance.constructor(),
            true);

        // run constructor
        return instance;

    }
