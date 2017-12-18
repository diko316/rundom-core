'use strict';

import {
            string
        } from 'libcore';

var     DEFAULT_PREFIX = 'id',
        COUNTER_RE = /^[a-zA-Z0-9]$/;

export
    function changeDefaultPrefix(prefix) {
        if (string(prefix)) {
            DEFAULT_PREFIX = prefix;
        }
    }

export
    class IdManager {
        constructor(prefix) {
            this.counter = 0;
            this.prefix = string(prefix) ?
                                prefix : DEFAULT_PREFIX;
        }

        generate(id) {
            var prefix = this.prefix,
                prefixLength = prefix.length;
            var counter;

            if (string(id)) {
                // update counter
                if (id.substring(0, prefixLength) === prefix) {
                    counter = id.substring(prefixLength, id.length);
                    // valid counter
                    if (COUNTER_RE.test(counter)) {
                        this.counter = Math.max(this.counter,
                                                parseInt(counter, 32));
                        return id;
                    }
                }
            }

            // create new
            return prefix + (++this.counter).toString(32);
        }
    }