'use strict';

export default
    function configure(config) {
        delete config.external;
        delete config.globals;
    }


