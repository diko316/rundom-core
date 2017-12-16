'use strict';

import {
            string,
            method,
            object,
            contains,
            createRegistry
        } from 'libcore';

import { DEFINITION_PROPERTY } from './settings.js';

import { ServiceDefinitionBase } from './definition/base.js';

function Instantiator() {

}

const   REGISTRY = createRegistry();

export
    function register(type, Class) {
        var Base = ServiceDefinitionBase;

        if (!string(type)) {
            throw new Error("Invalid Service definition [type].");
        }

        if (!method(Class) || !(Class.prototype instanceof Base)) {
            throw new Error("Invalid Service definition [Class].");
        }

        REGISTRY.set(type, Class);

    }


export
    function defineService(definition, Class) {
        var registry = REGISTRY,
            access = DEFINITION_PROPERTY;
        var type, Definer, Prototype, has;

        if (!method(Class)) {
            throw new Error('Invalid Service [Class] parameter.');
        }

        if (!object(definition)) {
            throw new Error('Invalid Service [definition] parameter.');
        }

        // validate type
        type = definition.type;
        if (!string(type)) {
            throw new Error('Invalid Service definition [type] parameter.');
        }

        if (!registry.exists(type)) {
            throw new Error('Service definition [' + type + '] do not exist.');
        }

        Prototype = Class.prototype;

        // apply definition only if not defined
        has = contains(Prototype, access);

        if (!has || !(Prototype[access] instanceof ServiceDefinitionBase)) {

            // remove useless config;
            if (has) {
                delete Prototype[access];
            }

            Definer = registry.get(type);

            // attach!
            (new Definer(Class, definition));

        }

        return Class;
        
    }

export
    function getDefinition(Class) {
        var access = DEFINITION_PROPERTY;
        var Prototype, Definer;

        if (method(Class)) {
            Prototype = Class.prototype;
            if (access in Prototype) {
                Definer = Prototype[access];
                if (Definer instanceof ServiceDefinitionBase) {
                    return Definer;
                }
            }
        }

        return null;
    }

export
    function instantiate(Class) {
        var definition = getDefinition(Class);
        var instance;

        if (definition) {
            Instantiator.prototype = Class.prototype;

            instance = new Instantiator();

            definition.setup(instance);

            return instance;
            
        }

        return null;
    }