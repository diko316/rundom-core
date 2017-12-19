'use strict';

import { Node } from '../struct/node.js';

import { ProcessTask } from './task.js';

import { EventObservable } from '../event/observable.js';

import {
            CREATED,
            DEAD,
            PROCESSING,
            PROCESSED,
            QUEUE_PROCESS,
            QUEUE_REPROCESS,
            DESTROYED,
            StateInput
        } from './task-state.js';

export class ProcessMonitor extends Node {

    constructor() {
        super();

        this.isProcessing =
            this.outsideRerunRequest = false;
            
        this.maximimumCycle = 50;

        this.pendingTasks = [];

        this.event = new EventObservable();

    }

    onDestroy() {
        var event = this.event;

        event.broadcast(DESTROYED, this);

        event.destroy();

        super.onDestroy();
    }

    onCreateTask(node) {
        // when dead, call reprocess
        //      if there's an active process
        node.subscribe(DEAD,
                        node => {
                            if (this.isProcessing) {
                                this.outsideRerunRequest = true;
                            }
                            else {
                                this.process();
                            }

                            this.event.broadcast(DEAD, node);
                        });

        // run process
        if (this.isProcessing) {
            this.outsideRerunRequest = true;
        }
        else {
            node.process();
        }

        this.event.broadcast(CREATED, node);

    }

    onProcess() {
        var me = this,
            pending = me.pendingTasks,
            changed = [],
            changeLength = 0,
            rerun = true,
            QueueProcess = StateInput.QueueProcess,
            QueueReport = StateInput.QueueReport,
            cycleLimit = this.maximimumCycle;

        var task, result, c, len, total, current, depth, running;

        for (; rerun && --cycleLimit;) {
            rerun = false;
            

            // enqueue all tasks
            depth = 0;
            total = pending.length;
            running = pending.splice(0, total);

            this.outsideRerunRequest = false;

            // preorder queue process
            for (current = me; current;) {
                
                // process pre-order
                if (depth && current.changeState(QueueProcess)) {
                    
                    running[total++] = current;
                }
    
                // go into first child
                task = current.first;
    
                // go next sibling or parentNode's nextSibling
                if (!task) {
                    task = current.after;
    
                    for (; !task && depth-- && current;) {
                        current = current.parent;
                        task = current.after;
                    }
                }
                // go deeper into node
                else {
                    depth++;
                }
    
                current = task;
            }

            // run tasks
            for (c = -1, len = total; len--;) {
                task = running[++c];

                switch (task.state) {
                case QUEUE_REPROCESS:
                case QUEUE_PROCESS:
                    result = task.process();
                    
                    if (result) {
                        rerun = true;
                        if (!task.isForReporting) {
                            task.isForReporting = true;
                            changed[changeLength++] = task;
                        }
                    }
                }
                
            }

            // run report
            if (!rerun) {
                
                for (c = -1, len = changeLength; len--;) {
                    task = changed[++c];
                    delete task.isForReporting;

                    if (task.changeState(QueueReport)) {
                        
                        result = task.report();
                        
                        if (result) {
                            rerun = true;
                        }
                        
                    }
                }

                changed.splice(0, changeLength);
                changeLength = 0;

            }

            // try outside request
            if (this.outsideRerunRequest) {
                rerun = true;
            }
            
        }

    }

    isAdoptable(node) {
        return node instanceof ProcessTask;
    }

    configure(node) {

        if (this.isAlive) {
            if (node instanceof ProcessTask) {
                return node;
            }

            node = new ProcessTask(this);

            this.onCreateTask(node);
        }

        return node;
    }

    process() {
        var events;

        if (this.isAlive) {
            if (this.isProcessing) {
                this.outsideRerunRequest = true;

            }
            else {
                events = this.event;
                events.broadcast(PROCESSING, this);
                
                this.isProcessing = true;

                this.onProcess();

                this.isProcessing = false;

                if (this.isAlive) {
                    events.broadcast(PROCESSED, this);
                }
            }
        }
    }

    enqueue(node) {
        var list = this.pendingTasks;
        
        if (this.isAlive &&
            node instanceof ProcessTask &&
            node.monitor === this) {
            switch (node.state) {

            case QUEUE_PROCESS:
            case QUEUE_REPROCESS:
                list[list.length] = node;
            }

            this.process();

        }

        return this;
    }

    subscribe(type, handler) {
        return this.event.subscribe(type, handler);
    }


}
