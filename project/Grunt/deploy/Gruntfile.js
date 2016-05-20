module.exports = function(grunt) {

	var homedir = require('userhome');
	var base64 = require('base-64');

	// Project configuration.
	grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
		aws: ( grunt.file.exists(homedir('.grunt-aws.json')) ? JSON.parse(base64.decode(grunt.file.read(homedir('.grunt-aws.json')))) : ''),

		dirs: {
			dev		: 'project/',
			prod	: 'project/',
			pack  : 'project/pack/',
			temp	: '.temp/',
		},

		/*
			AWS CloudFront cache invalidating grunt task.
			https://www.npmjs.org/package/grunt-cloudfront
		*/
		cloudfront: {
	    	options: {
				// optional credentials, uses AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY env vars by default
				credentials:       "<%= aws %>",
				region:            'us-east-1',
				distributionId:    "<%= aws.distributionId %>",
				listInvalidations: true, // if you want to see the status of invalidations
				listDistributions: true,
			},
			production: {
				paths: [ ]
			}
		},



		/*
			Git commands for grunt.
			https://www.npmjs.org/package/grunt-git
		*/
		gitpull: {
			production: {
				files: {
					src: ['<%= dirs.prod %>**/*.*'],
				}
			}
		},

		/*
			Git commands for grunt.
			https://www.npmjs.org/package/grunt-git
		*/
		gitcommit: {
			production: {
				options: { },
				files: {
					src: ['<%= dirs.prod %>**/*.*'],
				}
			}
		},

		/*
			Git commands for grunt.
			https://www.npmjs.org/package/grunt-git
		*/
		gitpush: {
			production: {
				options: { }
			}
		},

		/*
			This task can help you automate uploading/downloading files to/from Amazon S3.
			All file transfers are verified and will produce errors if incomplete.
			https://www.npmjs.org/package/grunt-s3
		*/
  		s3: {
			options: {
				key: '<%= aws.accessKeyId %>',
				secret: '<%= aws.secretAccessKey %>',
				bucket: '<%= aws.bucket %>',
				access: 'public-read',
				headers: {
					// Two Year cache policy (1000 * 60 * 60 * 24 * 730)
					"Cache-Control": "max-age=630720000, public",
					"Expires": new Date(Date.now() + 63072000000).toUTCString()
				}
			},
			production_upload: {
				// These options override the defaults
				options: {
					encodePaths: false,
					maxOperations: 20
				},

				// Files to be uploaded.
				upload: [{
					src: '<%= dirs.prod %>**/*.*',
					dest: '<%= dirs.prod %>',
					rel: '<%= dirs.prod %>'
				}],
			},

			production_sync: {
				// These options override the defaults
				options: {
					encodePaths: false,
					maxOperations: 20,
					verify: true
				},

				// Files to be synchronized.
				sync: [{
					src: '<%= dirs.prod %>**/*.*',
					dest: '<%= dirs.prod %>',
					rel: '<%= dirs.prod %>'
				}],
			}

		  },

	});

	// Load the plugins that provides the tasks.
	grunt.loadNpmTasks('grunt-cloudfront');
	grunt.loadNpmTasks('grunt-git');
	grunt.loadNpmTasks('grunt-s3');


 //grunt deploy:test
	grunt.task.registerTask('deploy',
				'Task to push latest changes in the repository and deploy in amazon s3 server',
				function(args){
					if (arguments.length === 0) {
						grunt.log.writeln("no message provided.");
					} else {
            //grunt.task.run('production');
						grunt.task.run('gitpull');
						grunt.config.set('gitcommit.options.message', args);
						grunt.task.run('gitcommit');
						grunt.task.run('gitpush');
					  grunt.task.run('s3:production_sync');
					}
				}
	);

	grunt.task.registerTask('pull',['gitpull']);
	grunt.task.registerTask('push',['gitpush']);
	grunt.task.registerTask('commit',
							'Task to commit in git',
							function(args){
								if (arguments.length === 0) {
									grunt.log.writeln("no message provided.");
								} else {
									grunt.config.set('gitcommit.options.message', args);
									grunt.task.run('gitcommit');
								}
							}
	);

	grunt.task.registerTask('server',
			'Task to deploy to server',
			function(args) {
				if (arguments.length === 0) {
					grunt.log.writeln("no arguments provided.");
				} else {
					switch (args) {
						case 'up':
							grunt.task.run('s3:production_upload');
						break;
						case 'sync':
							grunt.task.run('s3:production_sync');
						break;
						default:
							grunt.log.writeln(args + " is not a valid argument.");
						break;
					}
				}
			}
	);

	// grunt.task.registerTask('invalidate',
	// 		'Task to invalidate a file',
	// 		function(args) {
	// 			if (arguments.length === 0) {
	// 				grunt.log.writeln("no path provided.");
	// 			} else {
	// 				var aux = [];
	// 				for (var i=0; i<arguments.length; i++) {
	// 					grunt.log.writeln("path " + (i+1) + ":" + arguments[i]);
	// 					aux.push(arguments[i])
	// 				}
  //
	// 				grunt.config.set('cloudfront.production.paths', aux);
	// 				grunt.task.run('cloudfront');
	// 			}
	// 		}
	// );

	// grunt.task.registerTask('cert',
	// 		'Task to invalidate a file',
	// 		function(bucket,key,secret,distribution) {
  //
	// 			if (arguments.length !== 4) {
	// 				grunt.log.writeln("Error: 4 arguments are required");
	// 				grunt.log.writeln("grunt cert:[bucket]:[key]:[secret]:[distribution]");
	// 			} else {
	// 				var cert = {};
	// 				cert.accessKeyId = key;
	// 				cert.secretAccessKey = secret;
	// 				cert.bucket = bucket;
	// 				cert.distributionId = distribution;
  //
	// 				grunt.file.write(homedir('.grunt-aws.json'), base64.encode(JSON.stringify(cert)));
	// 				grunt.log.writeln(JSON.stringify(cert));
	// 				grunt.log.writeln("The certificate has been created on " + homedir('.grunt-aws.json'));
  //
	// 			}
	// 		}
	// );

};
