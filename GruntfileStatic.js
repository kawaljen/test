module.exports = function(grunt) {

  var singlePageSrcJS = [
     'video'
   ],
   singlePageSrcCSS = [
      'video'
    ]
   ;
	// Project configuration.
	grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

		dirs: {
			core   : 'core/static/',
      jsProd : 'core/static/js/prod/',
      jsDev  : 'core/static/js/dev/',
		},

		/*
			Clean files and folders.
			https://www.npmjs.org/package/grunt-contrib-clean
		*/
		clean: {
			dev: [ '<%= dirs.jsProd %>' ],
		},

		/*
			Copy files and folders.
			https://www.npmjs.org/package/grunt-contrib-copy
		*/
		copy: {
				production: {
  				files: [
  					{ expand: true,
  						cwd: '<%= dirs.jsDev %>',
  					  src: ['**'],
  					  dest: '<%= dirs.jsProd %>'
  					},
  				],
  			},
        deuz:{
          files: [
            { expand: true,
              cwd: '<%= dirs.jsProd %>single/',
              src: ['*.js'],
              dest: '<%= dirs.jsProd %>'
            },
          ],
        }
		},

		/*
			Compress CSS files.
			https://www.npmjs.org/package/grunt-contrib-cssmin
		*/
		cssmin: {
			minify: {
			    expand: true,
			    cwd: '<%= dirs.core %>/styles/css',
			    src: '*.css',
			    dest: '<%= dirs.core %>/styles/css',
			    ext: '.css'
			}
		},

		/*
			Minify PNG, JPEG and GIF images
			https://www.npmjs.org/package/grunt-contrib-imagemin
		*/
		imagemin: {
			core: {
				files: [{
					expand: true,
					cwd: '<%= dirs.core %>images',
					src: ['**/*.{png,jpg,jpeg,gif}'],
					dest: '<%= dirs.core %>/images'
				}]
			}
		 },

		/*
			Static analysis tool for JavaScript
			JSHint is a community-driven tool to detect errors and potential problems in JavaScript code.
			It is very flexible so you can easily adjust it to your particular coding guidelines
			and the environment you expect your code to execute in.
			https://www.npmjs.org/package/jshint
		*/
		jshint: {
			files: {
				src: [ '<%= dirs.core %>js/prod/**/*.js' ]
		    },
			options: {
				'curly'		: true,
				'eqeqeq'	: true,
				'latedef'	: true,
				'newcap'	: true,
				'noarg'		: true,
				'sub'		: true,
				'undef'		: true,
				'unused'	: true,
				'boss'		: true,
				'eqnull'	: true,
				'browser'	: true,
				'evil'		: true,
				'devel'		: true,
				'globals'	: {},
				force: true
			}
		},

		/*
			Compile SASS files to CSS.
			https://www.npmjs.org/package/grunt-contrib-sass
		*/
		sass: {
			core: {
			    // files: {
			    //   "<%= dirs.core %>styles/css/main.css":
			    //   "<%= dirs.core %>styles/sass/*.scss"
			    // },
          files: [{
            expand: true,
            cwd: "<%= dirs.core %>styles/sass/",
            src: ['**/*.scss'],
            dest: '<%= dirs.core %>styles/css/',
            ext: '.css'
          }]
			},

		},

		uglify: {
	    my_target: {
	      files: [
				{
					expand: true,
          cwd: '<%= dirs.jsDev %>',
          src: '**/*.js',
          dest: '<%= dirs.jsProd %>'
	      }
      ]}
	  },

		/*
			Minify SVG using SVGO
			https://www.npmjs.org/package/grunt-svgmin
		*/
		svgmin: {
			options: {
            //	 plugins: [	{ removeViewBox: false },
				 //			{ removeUselessStrokeAndFill: false }]
			},
			core: {
            	files: [{
                	expand: true,
					cwd: '<%= dirs.core %>images',
					src: ['**/*.svg'],
					dest: '<%= dirs.core %>images',
				}]
			}
		},

		/*
			Run predefined tasks whenever watched file patterns are added, changed or deleted.
			https://www.npmjs.org/package/grunt-contrib-watch
		*/
		watchdev: {
			sass: {
				files: ['<%= dirs.core %>styles/**/*.scss'],
				tasks: ['sass:core'],
				options: {
					spawn: false,
					livereload: true
				}
			},
		},

		/*
			Run predefined tasks whenever watched file patterns are added, changed or deleted.
			https://www.npmjs.org/package/grunt-contrib-watch
		*/
		concat: {
	    options: {
	      separator: ';\n',
	    },
	    dist: {
	      src: ['<%= dirs.jsProd %>main/*.js'],
	      dest: '<%= dirs.jsProd %>main.min.js',
	    },
			singleJS: {
				files: (function() {
					var files = Object.create(null);
					singlePageSrcJS.forEach(function(dir) {
						files['<%= dirs.jsProd %>' + dir + '.min.js'] = [
              '<%= dirs.jsProd %>single/' + dir + '/*.js'
            ];
						// grunt.log.write(dir);
					});
					return files;
				}()),
			},
      singleCss: {
				files: (function() {
          var files = Object.create(null);
					singlePageSrcCSS.forEach(function(dir) {
						files['<%= dirs.core %>styles/css/' + dir + '.min.css'] = [
              '<%= dirs.core %>styles/css/' + dir + '/*.css'
            ];
						// grunt.log.write(dir);
					});
          return files;
				}()),
			},
		},
	});



	// Load the plugins that provides the tasks.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.renameTask  ('watch', 'watchdev');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.renameTask  ('watch', 'watchprod');
	grunt.loadNpmTasks('grunt-svgmin');
	grunt.loadNpmTasks('grunt-text-replace');


	// Default task(s).
	grunt.registerTask('default',
									[
										 'sass:core',
										 'watchdev',
									   ]);

	// Productions task(s).
		grunt.registerTask('production',
											[
                      'clean:dev',
                      'copy:production',
											'imagemin:core',
											'svgmin:core',
											'sass:core',
											'cssmin',
											'jshint',
											'uglify',
                      'copy:deuz',
                      'concat',
										  ]);
};
