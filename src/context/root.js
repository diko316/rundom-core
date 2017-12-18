'use strict';

import { createContextType } from './context-type.js';

import { ProcessMonitor } from '../process/monitor.js';

export
    class ContextRoot {

        constructor() {
            // template/services
            this.process = new ProcessMonitor();

            
        }

    }

createContextType({}, ContextRoot);

