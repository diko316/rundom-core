'use strict';


var gulp = require('gulp'),
    rollup = require('rollup'),
    browserSync = require('browser-sync').create(),
    libcore = require('libcore'),
    paths = {
        jsSources: './src/**/*.js',
        target: './dist',
        httpIndex: 'index.html'
    };


gulp.task('bundle',
    function() {
        var config = require('./rollup.config.js');

        rollup.rollup(config).
            then(function (bundle) {
                var list = config.output;
                var c, l;

                if (!libcore.array(list)) {
                    list = [list];
                }

                for (c = -1, l = list.length; l--;) {
                    bundle.write(list[++c]);
                }
                
            });

    });

gulp.task('server',
    ['bundle'],
    function() {
        var config = {
                server: {
                    baseDir: paths.target,
                    index: paths.httpIndex
                },
                port: 3000,
                open: false,
                
                files: ["dist/**/*.html",
                        "dist/**/*.js"]
            };

        browserSync.init(config);

        gulp.watch(paths.jsSources, ['bundle']);
    });

gulp.task('default', ['server']);