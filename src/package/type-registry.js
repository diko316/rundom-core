'use strict';

import {
            string,
            createRegistry
        } from 'libcore';

import { isSubclassOf } from '../helper/function.js';

import { PackageBaseType } from './base-type.js';

export
    class PackageTypeRegistry {

        constructor() {
            this.registry = createRegistry();
        }

        register(type, Class) {
            var registry = this.registry;

            if (!string(type)) {
                throw new Error('Invalid [type] parameter.');
            }

            if (!isSubclassOf(Class, PackageBaseType)) {
                throw new Error('[Class] is not a subclass of PackageBaseType');
            }

            if (registry.exists(type)) {
                throw new Error('Package type [' + type + '] already existed.');
            }

            registry.set(type, Class);

            return this;

        }

        get(type) {
            var registry = this.registry;

            return registry.exists(type) ?
                        registry.get(type) : null;
        }


    }