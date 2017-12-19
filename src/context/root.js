'use strict';

import { each } from 'libcore';

import { createContextType } from './context-type.js';

import { Declaration } from '../package/api.js';

import { ProcessMonitor } from '../process/monitor.js';

import { ContextNode } from './node.js';

import { Node } from '../struct/node.js';

export
    class ContextRoot extends Node {

        constructor() {
            super();

            this.process = new ProcessMonitor();
            
        }

        onAdd(child) {
            var before = child.before;

            this.process.add(child.task,
                                before && before.task);

            super.onAdd(child);
        }

        onRemove(child) {

            this.process.remove(child.task);

            super.onRemove(child);
            
        }

        isAdoptable(node) {
            return node instanceof ContextNode && node.owner === this;
        }

        createContext() {

            var dependencies = {},
                node = Declaration.instantiate(ContextNode,
                                                '$$self',
                                                dependencies);
            
            each(dependencies,
                instance => instance !== node && instance.constructor(),
                true);

            node.constructor(this);

            // run constructor
            return node;

        }

        addChild(childBefore) {
            var node, parent;

            if (typeof childBefore === 'undefined') {
                childBefore = null;
            }

            if (childBefore !== null && !this.isAdoptable(childBefore)) {
                throw new Error('Invalid [childBefore] parameter.');
            }


            node = this.createContext();

            if (childBefore) {
                parent = childBefore.parent;

                if (!parent) {
                    throw new Error('[childBefore] has no parent.');
                }

                parent.add(node, childBefore);
            }
            else {
                this.add(node);
            }

            return node;

        }

    }

createContextType({}, ContextRoot);

