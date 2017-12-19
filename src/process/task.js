'use strict';

import { Node } from '../struct/node.js';

import { EventObservable } from '../event/observable.js';

import {
            IDLE,
            REPORTING,
            StateInput,
            STATE_MAP
        } from './task-state.js';

import { string } from 'libcore';


export class ProcessTask extends Node {

    constructor(monitor) {
        super();
        this.state = IDLE;
        this.monitor = monitor;
        this.event = new EventObservable();
        this.processStatus = null;
        this.reportStatus = null;
    }

    onDestroy() {

        var me = this,
            event = me.event;

        // change state for the last time
        me.changeState(StateInput.Die);

        event.destroy();

        super.onDestroy();
    }

    onAdd(child) {
        super.onAdd(child);

        this.monitor.event.broadcast('add', child);
    }

    onRemove(child) {

        this.monitor.event.broadcast('remove', child);

        super.onRemove(child);
    }

    onProcess(requestReprocess) {
        this.event.broadcast('process', requestReprocess);
    }

    onReport(requestReprocess) {
        this.event.broadcast('report', requestReprocess);
    }

    isAdoptable(node) {
        return node instanceof ProcessTask;
    }

    subscribe(state, handler) {

        if (string(state) && state in STATE_MAP) {

            return this.event.subscribe('statechange',
                                runningState => runningState === state ?
                                                        handler(this) : null);
        }

        throw new Error('[state] parameter is not a known task state');
    }

    processor(handler) {
        return this.event.subscribe('process', handler);
    }

    reporter(handler) {
        return this.event.subscribe('report', handler);
    }

    process() {

        var Input = StateInput,
            ProcessInput = Input.Process,
            QueueInput = Input.QueueProcess,
            me = this,
            status = me.processStatus,
            monitor = me.monitor,
            reportStatus = me.reportStatus;

        // can enqueue
        if (me.nextState(QueueInput)) {
            me.changeState(QueueInput);
            monitor.enqueue(me);

        }
        else if (me.nextState(ProcessInput)) {
            me.changeState(ProcessInput);
            me.processStatus = status = { reprocess: false };
            
            me.onProcess(() => status.reprocess = true);

            me.processStatus = null;

            // end process
            if (me.changeState(Input.EndProcess)) {
                return status.reprocess;
            }

        }
        else if (this.state === REPORTING && reportStatus) {
            reportStatus.reprocess = true;
        }
        
        return false;
        
    }

    report() {
        var Input = StateInput;
        var status;

        if (this.changeState(Input.Report)) {

            this.reportStatus = status = { reprocess: false };

            this.onReport(() => status.reprocess = false);

            this.reportStatus = null;

            this.changeState(Input.EndReport);

            return status.reprocess;

        }

        return false;
    }

    nextState(input) {
        var old = this.state,
            reference = STATE_MAP[old];

        if (input !== old && input in reference) {
            return reference[input];
        }

        return false;
    }

    changeState(input) {
        var state = this.nextState(input);
        var old;

        if (state) {
            old = this.state;
            this.state = state;
            this.event.broadcast('statechange', state, old);
            return state;
            
        }

        return false;

    }


}
