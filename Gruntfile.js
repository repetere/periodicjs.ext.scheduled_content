/*
 * domhelper
 * http://github.com/yawetse/domhelper
 *
 * Copyright (c) 2014 Yaw Joseph Etse. All rights reserved.
 */
'use strict';
var path = require('path');

module.exports = function (grunt) {
  grunt.initConfig({
    simplemocha: {
      options: {
        globals: ['should'],
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'spec'
      },
      all: {
        src: 'test/**/*.js'
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'index.js',
        'controller/**/*.js',
        'resources/**/*.js',
        'test/**/*.js',
      ]
    },
    jsbeautifier: {
      files: ['<%= jshint.all %>'],
      options: {
        config: '.jsbeautify'
      }
    },
    jsdoc: {
      dist: {
        src: [
          'index.js',
          'controller/**/*.js',
          'resources/**/*.js',
        ],
        options: {
          destination: 'doc/html',
          configure: 'jsdoc.json'
        }
      }
    },
    browserify: {
      dist: {
        files: [{
          expand: true,
          cwd: 'resources',
          src: ['**/*_src.js'],
          dest: 'public',
          rename: function (dest, src) {
            var finallocation = path.join(dest, src);
            finallocation = finallocation.replace('_src', '_build');
            finallocation = finallocation.replace('resources', 'public');
            finallocation = path.resolve(finallocation);
            return finallocation;
          }
        }],
        options: {}
      }
    },
    uglify: {
      options: {
        sourceMap: true,
        compress: {
          drop_console: false
        }
      },
      all: {
        files: [{
          expand: true,
          cwd: 'public',
          src: ['**/*_build.js'],
          dest: 'public',
          rename: function (dest, src) {
            var finallocation = path.join(dest, src);
            finallocation = finallocation.replace('_build', '.min');
            finallocation = path.resolve(finallocation);
            return finallocation;
          }
        }]
      }
    },
    copy: {
      main: {
        cwd: 'public',
        expand: true,
        src: '**/*.*',
        dest: '../../public/extensions/periodicjs.ext.login',
      },
    },
    watch: {
      scripts: {
        // files: '**/*.js',
        files: [
          'Gruntfile.js',
          'index.js',
          'controller/**/*.js',
          'resources/**/*.js',
          'test/**/*.js',
        ],
        tasks: ['lint', 'packagejs', 'copy', /*'doc',*/ 'test'],
        options: {
          interrupt: true
        }
      }
    }
  });


  // Loading dependencies
  for (var key in grunt.file.readJSON('package.json').devDependencies) {
    if (key.indexOf('grunt') === 0 && key !== 'grunt') {
      grunt.loadNpmTasks(key);
    }
  }

  grunt.registerTask('default', ['jshint', 'simplemocha']);
  grunt.registerTask('lint', 'jshint', 'jsbeautifier');
  grunt.registerTask('packagejs', ['browserify', 'uglify']);
  grunt.registerTask('doc', 'jsdoc');
  grunt.registerTask('test', 'simplemocha');
};
