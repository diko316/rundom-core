'use strict';

import {
            doNothing,
            EventSubscription
        } from './subscription.js';

import {
            string,
            method,
            createRegistry
        } from 'libcore';

export
    class EventObservable {

        constructor() {
            var me = this;

            me.isAlive = true;
            me.types = [];
            me.subscriptions = createRegistry();
        }

        onDestroy() {
            var me = this,
                types = me.types,
                all = me.subscriptions,
                total = types.length,
                len = total;
            var type;

            for (; len--;) {
                type = types[len];
                all.get(type).destroy();
            }

            all.clear();
            types.splice(0, total);
        }

        subscribe(type, handler) {
            var me = this;
            var all, types, subscriptions;

            if (me.isAlive) {

                all = me.subscriptions;
                types = me.types;

                if (!string(type)) {
                    throw new Error('Invalid [type] to subscribe.');
                }

                if (!method(handler)) {
                    throw new Error('Invalid [handler] parameter.');
                }

                if (!all.exists(type)) {
                    types[types.length] = type;
                    subscriptions = new EventSubscription();
                    all.set(type, subscriptions);
                }
                else {
                    subscriptions = all.get(type);
                }

                return subscriptions.subscribe(handler);
            }

            return doNothing;

        }

        unsubscribe(type, handler) {
            var me = this,
                all = me.subscriptions;

            if (me.isAlive) {

                if (!string(type)) {
                    throw new Error('Invalid [type] to unsubscribe.');
                }

                if (!method(handler)) {
                    throw new Error('Invalid [handler] parameter.');
                }

                if (all.exists(type)) {
                    all.get(type).unsubscribe(handler);
                }
            }

            return me;
            
        }

        broadcast(type, ...params) {
            var me = this;
            var found, all;

            if (me.isAlive) {

                if (!string(type)) {
                    throw new Error('Invalid [type] to unsubscribe.');
                }

                all = me.subscriptions;

                found = all.get(type);

                if (found) {
                    found.broadcast(...params);
                }

            }

            return this;
        }

        clearByType(type) {
            var me = this;
            var found;

            if (me.isAlive) {
                
                if (!string(type)) {
                    throw new Error('Invalid [type] to clear.');
                }

                found = me.subscriptions.get(type);
                if (found) {
                    found.clear();
                }

            }

            return me;
        }

        clear() {
            var me = this;
            var types, all, len;

            if (me.isAlive) {

                types = me.types;
                all = me.subscriptions;
                len = types.length;

                for (; len--;) {
                    all.get(types[len]).clear();
                }

            }

            return me;

        }

        destroy() {
            var me = this;

            if (me.isAlive) {
                delete me.isAlive;
                me.onDestroy();
            }

            return me;
        }

    }