'use strict';

import {
            getClassTag,
            tagClass
        } from '../helper/function.js';

import {
            object,
            method,
            each
        } from 'libcore';

const   hasOwn = Object.prototype.hasOwnProperty,
        MERGE_NAME_RE = /^onMerge([A-Z][a-zA-Z]*)$/;

function createMerger(value, name, instance) {
    var match, list, access;

    if (method(value) &&
        (match = name.match(MERGE_NAME_RE))) {

        access = match[1];
        access = access.charAt(0).toLowerCase() +
                    access.substring(1, access.length);

        list = instance.mergers;
        list[list.length] = function (config) {
            var property = access,
                current = instance.config;

            // call 
            instance[name](hasOwn.call(config, property) ?
                                config[property] : undefined,
                            config,
                            property in current ?
                                current[property] : undefined);

        };

    }

}

export
    class PackageBaseType {

        constructor(Class) {
            
            this.id = getClassTag(Class);
            this.target = Class;

            
            this.requires = {};
            this.requireNames = [];
            this.mergers = [];
            this.config = {};
            this.finalized = false;

            Class.prototype.$$initialized = false;

            each(this, createMerger);

        }

        onFinalize() {

        }

        // will be called internally by PackageDeclaration.instantiate
        //      with (instance) parameter
        onInstantiate() {
            
            
        }

        onMergeRequires(value) {
            var isObject = object,
                config = this.config;
            var repo;

            if (isObject(value)) {

                if (!isObject(config)) {
                    this.config = 
                        config = {};
                }

                repo = config.requires;
                if (!isObject(repo)) {
                    config.requires =
                        repo = {};
                }

                each(value,
                    (value, name) => {
                        var requires = repo,
                            names = this.requireNames;

                        if (value === false) {
                            delete requires[name];
                        }
                        else if (method(value)) {

                            tagClass(value);

                            if (!hasOwn.call(requires, name)) {
                                names[names.length] = name;
                            }

                            requires[name] = value;


                        }

                    },
                    true);
            }
        }

        getConfiguration() {
            return this.config;
        }

        getDependencies() {
            return this.requires;
        }

        getDependencyNames() {
            return this.requireNames;
        }

        merge(config) {
            var mergers = this.mergers;
            var c, l;

            // configure
            if (object(config)) {
                for (c = -1, l = mergers.length; l--;) {
                    mergers[++c](config);
                }
            }

            return this;
        }

        finalize() {
            if (!this.finalized) {
                this.finalized = true;
                this.onFinalize();
            }
        }


    }

