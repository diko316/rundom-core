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

        instantiate(Class, name, dependencies) {
            var definition, instance, customDependency,
                completeParams,
                requires, names, requireInstance, property, c, l;

            // validate parameters and finalize use case

            if (!method(Class)) {
                throw new Error('Invalid instance [Class] parameter.');
            }

            if (!string(name)) {
                if (name !== null && name !== undefined) {
                    throw new Error('Invalid property [name] parameter.');
                }
                name = null;
            }

            customDependency = object(dependencies);

            completeParams = name && customDependency;

            // create instance not attached to dependencies
            if (completeParams && contains(dependencies, name)) {
                return dependencies[name];
            }
            
            definition = this.getDefinition(Class);

            instance = createObject(Class);

            // attach to dependency
            if (!customDependency) {
                dependencies = {};
            }
            if (name) {
                dependencies[name] = instance;
            }

            // process instance
            definition.onInstantiate(instance);

            // for service instantiation
            if (definition) {
                names = definition.getDependencyNames();
                requires = definition.getDependencies();

                for (c = -1, l = names.length; l--;) {
                    property = names[++c];
                    instance[property] = 
                        requireInstance = this.instantiate(requires[property],
                                                            property,
                                                            dependencies);
                }

            }

            return instance;

        }


    }
