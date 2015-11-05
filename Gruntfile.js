module.exports = function(grunt) {

  grunt.initConfig({
    loopback_sdk_angular: {
      options: {
        input: 'server/server.js',
        output: 'client-src/js/service.js',
        ngModuleName: 'update.service'
      },
      staging: {
        options: {
          // apiUrl: '<%= buildProperties.site.baseUrl %>' + '<%= buildProperties.restApiRoot %>'
        }
      },
      production: {
        options: {
          // apiUrl: '<%= buildProperties.site.baseUrl %>' + '<%= buildProperties.restApiRoot %>'
        }
      }
    },
    docular: {
      groups: [
        {
          groupTitle: 'LoopBack',
          groupId: 'loopback',
          sections: [
            {
              id: 'lbServices',
              title: 'LoopBack Services',
              scripts: ['client-src/js/service.js']
            }
          ]
        }
      ]
    },
    browserify: {
      all: {
        options: {
          transform: ['browserify-shim']
        },
        files: {
          'client/app.js': 'client-src/js/index.js'
        }
      }
    },
    uglify: {
      all: {
        options: {
          mangle: true,
          compress: true
        },
        files: {
          'client/app.js': 'client/app.js',
        }
      }
    },
    less: {
      all: {
        options: {
          compress: true
        },
        files: {
          'client/css/app.css': 'client-src/css/main.less'
        }
      }
    },
    jade: {
      all: {
        options: {
          doctype: 'html'
        },
        files: [{
          expand: true,
          cwd: 'client-src',
          src: ['**/*.jade'],
          dest: 'client',
          ext: '.html'
        }]
      }
    },
    copy: {
      all: {
        files: [
          {
            cwd: 'client-src',
            src: ['**', '!js/**', '!**/*.less', '!**/*.jade', '!**/*.js'],
            dest: 'client',
            expand: true
          }
        ]
      },
    },
    watch: {
      options: {
        livereload: true
      },
      css: {
        files: 'client-src/css/**/*',
        tasks: ['less']
      },
      jade: {
        files: 'client-src/views/**/*.jade',
        tasks: ['jade']
      },
      scripts: {
        files: 'client-src/js/**/*.js',
        tasks: ['browserify']
      },
      copy: {
        files: ['client-src/**', '!client-src/css/**/*', '!client-src/**/*.jade', '!client-src/**/*.js'],
        tasks: ['copy']
      },
      api: {
        files: ['server/**/*.js'],
        tasks: ['services']
      }
    }
  });

  grunt.loadNpmTasks('grunt-loopback-sdk-angular');
  grunt.loadNpmTasks('grunt-docular');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask(
    'services',
    'Generate LoopBack Services',
    ['loopback_sdk_angular']
  );

  grunt.registerTask(
    'javascript',
    'Compile scripts.',
    ['services', 'browserify', 'uglify']
  );

  grunt.registerTask(
    'views',
    'Compile views.',
    ['jade', 'less', 'copy']
  );

  grunt.registerTask(
    'files',
    'Copy files.',
    ['copy']
  );

  grunt.registerTask(
    'build',
    'Compiles everything.',
    ['javascript', 'views']
  );

  grunt.registerTask(
    'default',
    'Build, start server and watch.',
    ['build', 'watch']
  );

}
