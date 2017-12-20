'use strict';

import { defineService } from '../service/api.js';

import { TemplateDomService } from './dom-service.js';

export
    class TemplateService {

        constructor() {
            this.templates = {};
        }

        bootstrap(dom) {
            
            


        }

    }

defineService({
        requires: {
            domService: TemplateDomService
        }
    },
    TemplateService);
