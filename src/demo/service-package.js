'use strict';

//import { defineService } from '../service/api.js';

import { TemplateService } from '../template/service.js';

import { Declaration } from '../package/api';


// const test = defineService({

//     },
//     class TestService {

//     });

///console.log(test);


console.log(Declaration.instantiate(TemplateService));


