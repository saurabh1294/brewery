module.exports = function(grunt) {

var karma = require('karma');
var kbg = require('karma-background');
var karmaPath = __dirname + '\\config\\karma-conf.js';

  grunt.initConfig({
	  
	server: {
       port: 8000,
       base: './'
    },
	bgShell: {
      _defaults: {
        bg: true
      },
      runTests: {
		cmd: 'grunt unit-tests',
        bg: false 
	  },
	  runServer: {
		  cmd: 'grunt server',
		  bg: false
	  }
    },
	
	/*karma: {
		  options: {
			configFile: 'config/karma-conf.js'
		  },
		  unit: {
			singleRun: true
		  },
		continuous: {
			// keep karma running in the background
			background: true
		}
	},*/
	
    jshint: {
      files: ['Gruntfile.js', 'tests/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      },
    },
	
    concat: {
      devjs: {
          // the files to concatenate
          src: ['src/**/*.js'],
          // the location of the resulting JS file
          dest: 'dist/dev/brewery.component.js'
      },
      devcss: {
        // the files to concatenate
        src: ['src/**/*.css'],
        // the location of the resulting JS file
        dest: 'dist/dev/brewery.component.css'
      }
    },
    uglify: {
      prodjs: {
        src : ['src/**/*.js'],
        dest : 'dist/prod/brewery.component.min.js'
      }
    },
    cssmin: {
      prod: {
          files: {
            'dist/prod/brewery.component.min.css': ['src/**/*.css']
          }
      }
    },
    sass: {
      dev: {
        files: [{
            expand: true,
            cwd: 'src/',
            src: ['**/*.scss', '**/*.sass'],
            dest: 'src/',
            ext: '.css'
          },
          {
            expand: true,
            cwd: 'src/',
            src: ['**/*.scss', '**/*.sass'],
            dest: 'src/',
            ext: '.css'
          }
        ]
      }
    },
    copy: {
      devviews: {
        expand: true,
        cwd: 'src/views/',
        src: '**',
        dest: 'dist/dev/',
      },
      prodviews: {
        expand: true,
        cwd: 'src/views/',
        src: '**',
        dest: 'dist/prod/',
      },
      devtemplates: {
        expand: true,
        flatten: true,
        src: 'src/**/*.html',
        dest: 'dist/dev/templates/'
      },
      prodtemplates: {
        expand: true,
        flatten: true,
        src: 'src/**/*.html',
        dest: 'dist/prod/templates/'
      }
    },
    watch: {
      devcss: {
        files: ['src/**/*.scss', 'src/**/*.sass'],
        tasks: ['sass:dev']
      },
      options: {
        livereload: true
      },
	  karma: {
        // run these tasks when these files change
        files: ['src/js/*.js', 'tests/*.js'],
        tasks: ['karma:run'] // note the :run flag
      }
    },
    clean: {
      dev: {
        files: [
          {
            dot: true,
            src: [
              'dist/dev'
            ]
          }
        ]
      },
      prod: {
        files: [
          {
            dot: true,
            src: [
              'tmp/prod',
              'dist/prod'
            ]
          }
        ]
      },
      tmp: {
        files: [
          {
            dot: true,
            src: [
              'tmp'
            ]
          }
        ]
      },
    }
  });

  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-bg-shell');

  //default task
  grunt.registerTask('default', [
	  'bgShell',
      'clean:tmp',
      'clean:dev',
      'jshint',
      'concat:devjs',
      'sass:dev',
      'concat:devcss',
      'copy:devviews',
      'copy:devtemplates'
  ]);
  grunt.registerTask('prod', [
	  'bgShell',
      'clean:tmp',
      'clean:prod',
      'jshint',
      'uglify:prodjs',
      'sass:dev',
      'cssmin:prod',
      'copy:prodviews',
      'copy:prodtemplates'
  ]);
  
grunt.registerTask('unit-tests', ['karma:start', 'karma:watch']);

grunt.registerTask('karma:start', function(done) {
	new karma.Server({
		configFile: karmaPath,
		singleRun: true,
		autoWatch: true,
		background: true
	},
	done).start();
});

/**
 * Runs test runner..
 */
/*grunt.registerTask('karma:run', function (done) {
	console.log("RUNNING karma:run");
	karma.runner.run({
		configFile: karmaPath
	}, done);
	console.log("Please wait until server starts on port 8000");
});*/

/**
 * Starts karma server
 */
grunt.registerTask('karma:watch', function () {
  kbg({
    configFile: karmaPath
  });

  grunt.task.run('watch:karma');
  console.log("Running TESTS !! Please wait until server starts on port 8000 after task runServer finishes");
});

grunt.registerTask('server', 'Start a custom web server', function() {
    grunt.log.writeln('Started web server on port 8000');
	var done = this.async();
    require('./src/server.js').start(8000);
});

  grunt.registerTask("watch:css", function (target) {
    grunt.task.run('watch:devcss');
  });
};
