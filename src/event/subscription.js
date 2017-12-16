'use strict';

import { method } from 'libcore';

export
    function doNothing() {
    }

export
    class EventSubscription {
        
        constructor() {
            this.items = [];
            this.isAlive = true;
        }

        onDestroy() {

        }

        onSubscribe() {
            
        }

        onBroadcast(params) {
            
            var me = this,
                list = me.items,
                running = list.slice(0);
            var subscription, callback;
            
            for (; running.length; ) {
                subscription = running.splice(0, 1)[0];
    
                // do not process when dead
                if (!me.isAlive) {
                    break;
                }
    
                if (subscription[1]) {
                    callback = subscription[0];
    
                    try {
                        callback.apply(null, params);
                    }
                    catch (e) {
                        console.warn(e);
                    }
    
                }
            }
        
            
        }

        subscribe(handler) {
            var list = this.items;
            var subscription;

            if (this.isAlive && method(handler)) {

                list[list.length] =
                    subscription = [handler, true];

                this.onSubscribe(subscription);

                if (subscription[1] === true) {
                    return () => this.unsubscribe(handler) && undefined;
                }

            }

            return doNothing;
        }

        unsubscribe(handler) {
            var list = this.items;
            var l, item;

            if (this.isAlive) {
                for (l = list.length; l--;) {
                    item = list[l];
                    if (item[0] === handler) {
                        item[1] = false;
                        list.splice(l, 1);
                        break;
                    }

                }
            }

            return this;

        }

        broadcast() {
            if (this.isAlive) {
                this.onBroadcast(arguments);
            }

            return this;
        }

        clear() {
            var list = this.items;
            var total, l, item;

            if (this.isAlive) {
                for (l = total = list.length; l--;) {
                    item = list[l];
                    item[1] = false;
                }
                list.splice(0, total);
            }

            return this;
        }

        destroy() {
            if (this.isAlive) {
                delete this.isAlive;
                this.onDestroy();
            }
        }
    }