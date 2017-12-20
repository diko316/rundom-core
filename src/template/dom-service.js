'use strict';

import { defineService } from '../service/api.js';

export
    class TemplateDomService {

        eachSlots(dom, handler) {
            // find slots
            var depth = 0;
            var queue, last, node, current;
       
            for (current = dom; current;) {
    
                // process pre-order (current)
   
                // go into first child
                node = current.firstChild;
    
                if (node) {
                    depth++;
                }
                // go next sibling or parentNode's nextSibling
                else {
    
                    node = current.nextSibling;
    
                    for (; !node && depth-- && current;) {
                        current = current.parentNode;
                        node = current.nextSibling;
                    }
                }
                current = node;
            }

            last = queue = node = current = null;
        }

    }

defineService(TemplateDomService);
