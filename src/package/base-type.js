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

console.log('used each ', each.toString());

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

            var create = createMerger;
            
            this.id = getClassTag(Class);
            this.target = Class;

            
            this.requires = {};
            this.requireNames = [];
            this.mergers = [];
            this.config = {};
            this.finalized = false;

            Class.prototype.$$initialized = false;

            for (var name in this) {
                create(this[name], name, this);
            }

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

                repo = config.requires;
                if (!isObject(repo)) {
                    config.requires = repo = {};
                }

                console.log('requires? ', repo);

                each(value,
                    (value, name) => {
                        var dependencies = this.requires,
                            names = this.requireNames;

                        // update config
                        repo[name] = value;
                        

                        if (value === false) {
                            delete dependencies[name];
                            

                        }
                        else if (method(value)) {

                            if (!hasOwn.call(dependencies, name)) {
                                names[names.length] = name;
                            }

                            dependencies[name] = value;

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

            if (this.finalized) {
                throw new Error('Finalized type is not reconfigurable.');
            }

            console.log('merge config! ', config, mergers);

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
                
                this.onFinalize();

                this.finalized = true;
            }
        }


    }

