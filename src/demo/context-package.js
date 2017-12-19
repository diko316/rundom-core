'use strict';

import { createRootContext } from '../context/api.js';

var root = createRootContext();

console.log('context: ', root);


root.addChild();
