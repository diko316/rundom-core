'use strict';


import { PackageDeclaration } from './declaration.js';

export { PackageBaseType as BaseType } from './base-type.js';

export const    Declaration = new PackageDeclaration(),
                TypeRegistry = Declaration.packageType;
