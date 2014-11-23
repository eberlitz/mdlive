module.exports = function(grunt) {

	grunt.initConfig({
		watch: {
			scripts: {
				files: 'src/**/*',
				options: {
      				reload: true
    			}
			}
		},
		connect: {
			server: {
				options: {
					port: 8080,
					hostname: '*',
					base: 'src/'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['connect', 'watch']);

};
