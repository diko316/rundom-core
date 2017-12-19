'use strict';

import { each } from 'libcore';

import { Declaration } from '../package/api.js';

import { ContextRoot } from './root.js';

export
    function createRootContext() {
        var dependencies = {},
            node = Declaration.instantiate(ContextRoot,
                                            '$$self',
                                            dependencies);
        
        each(dependencies,
            instance => instance !== node && instance.constructor(),
            true);

        node.constructor();

        // run constructor
        return node;

    }
