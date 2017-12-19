'use strict';

import { ProcessTask } from '../process/task.js';

import { createContextType } from './context-type.js';

import { Node } from '../struct/node.js';

export
    class ContextNode extends Node {

        constructor(owner) {
            super();

            // setup task
            this.owner = owner;
            this.task = new ProcessTask(owner.process);
            
            // template/services
            this.services =
                this.state = null;

        }

        onAdd(child) {
            var parent = child.parent,
                before = child.before;

            super.onAdd(child);

            parent.task.add(this.task,
                            before && before.task);
        }

        onRemove(child) {
            var parent = child.parent;

            super.onRemove(child);

            parent.task.remove(this.task);

        }

        isAdoptable(node) {
            return node instanceof ContextNode &&
                    node.owner === this.owner;
        }


    }

createContextType({}, ContextNode);

