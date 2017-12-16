'use strict';

import { DEFINITION_PROPERTY } from '../settings.js';

import {
            object,
            assign
        } from 'libcore';

export
    class ServiceDefinitionBase {

        constructor(Class, definition) {

            var access = DEFINITION_PROPERTY;
            var Prototype, extend;

            this.onInitialize();
            this.target = Class;

            Prototype = Class.prototype;

            if (access in Prototype &&
                (extend = Prototype[access]) instanceof ServiceDefinitionBase &&
                extend.target !== Class) {
                this.onExtend(Prototype[access]);
            }

            this.onDefine(definition);

            Prototype[access] = this;

        }

        onInitialize() {
            this.target = null;
            this.requires = {};
        }

        onExtend(definition) {
            var requires = definition.requires;

            if (object(requires)) {
                assign(this.requires, requires);
            }

        }

        onDefine(definition) {
            var requires = definition.requires;
            
            if (object(requires)) {
                assign(this.requires, requires);
            }
        }

        onSetup(instance) {
            
        }

        setup(instance) {

            if (object(instance)) {
                this.onSetup(instance);
            }

            return instance;

        }


    }