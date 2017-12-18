'use strict';

import {
            string,
            method

        } from 'libcore';

import { IdManager } from './id.js';

const   ID_MANAGER = new IdManager('id-fn'),
        TAG_ACCESS = '$$classid',
        hasOwn = Object.prototype.hasOwnProperty;

function emptyFunction() {

}


export
    function createObject(Class) {
        emptyFunction.prototype = Class.prototype;
        return new emptyFunction();
    }

export
    function isSubclassOf(Class, Base) {
        return Class === Base || Class.prototype instanceof Base;
    }

export
    function tagClass(Class) {
        var access = TAG_ACCESS,
            Prototype = Class.prototype;
        var id;

        // only tag if it is not yet tagged
        if (!hasOwn.call(Prototype, access) ||
            !string(id = Prototype[access])) {

            Prototype[access] =
                id = ID_MANAGER.generate();

        }
        
        return id;

    }

export
    function getClassTag(Class) {
        var access = TAG_ACCESS,
            Prototype = Class.prototype;
        var id;

        if (hasOwn.call(Prototype, access) &&
            string(id = Prototype[access])) {
            return id;
        }

        return null;
    }

