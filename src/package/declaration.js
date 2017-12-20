'use strict';

import {
            string,
            object,
            method,
            createRegistry,
            contains
        } from 'libcore';

import {
            tagClass,
            getClassTag,
            createObject
        } from '../helper/function.js';

import { PackageTypeRegistry } from './type-registry.js';

export
    class PackageDeclaration {

        constructor() {
            this.registry = createRegistry();
            this.packageType = new PackageTypeRegistry();
            this.defaultType = 'base';
        }

        define(type, config, Class) {
            var registry = this.registry,
                Type = this.packageType;
            var id, baseId, base, definition, PackageDefinition;

            if (!string(type)) {
                throw new Error('Invalid package [type] parameter.');
            }

            if (!object(config)) {
                throw new Error('Invalid [config] parameter.');
            }

            if (!method(Class)) {
                throw new Error('Invalid [Class] parameter.');
            }

            // get base definition
            baseId = getClassTag(Class);

            id = tagClass(Class);
            definition = registry.get(id);

            // update configuration and return definition
            if (definition) {

                definition.merge(config);

                return definition;
            }

            base = baseId && baseId !== id ? registry.get(baseId) : null;

            // create definition
            PackageDefinition = Type.get(type) ||
                                Type.get(this.defaultType);

            definition = new PackageDefinition(Class);

            registry.set(id, definition);

            // merge base configuration
            if (base) {
                definition.merge(base.getConfiguration());
            }

            // merge current configuration
            definition.merge(config);

            return definition;

        }

        getDefinition(Class) {
            var registry = this.registry;
            var id, definition;

            if (!method(Class)) {
                throw new Error('Invalid instance [Class] parameter.');
            }

            id = getClassTag(Class);
            if (id && registry.exists(id)) {
                definition = registry.get(id);

                if (!definition.finalized) {
                    // finalize definition
                    definition.finalize();
                }

                return definition;
            }

            return null;

        }

        instantiate(Class, factoryName, factory) {
            var dependency, dependencyClass, dependencies, name, names, c, l,
                definition, instance;

            if (!method(Class)) {
                throw new Error('Invalid instance [Class] parameter.');
            }

            if (!string(factoryName)) {
                factoryName = null;
            }

            if (!object(factory)) {
                factory = {};
            }
            

            definition = this.getDefinition(Class);
            instance = createObject(Class);

            if (factoryName) {
                factory[factoryName] = instance;
            }

            // populate properties
            if (definition) {
                dependencies = definition.getDependencies();
                names = definition.getDependencyNames();

                for (c = -1, l = names.length; l--;) {
                    name = names[++c];
                    dependencyClass = dependencies[name];

                    if (contains(factory, name)) {
                        dependency = factory[name];

                        // do not recreate
                        if (dependency instanceof dependencyClass) {
                            return dependency;
                        }
                        
                        throw new Error('dependency conflict found ' +
                                    dependencyClass.name +
                                    ' when used as ' + name +
                                    ' property of ' +
                                    Class.name);

                    }

                    dependency = this.instantiate(dependencies[name],
                                                    name,
                                                    factory);

                    instance[name] = dependency[0];

                }
            }

            return [instance, factory];

        }

    }
