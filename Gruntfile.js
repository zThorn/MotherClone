module.exports = function(grunt){

	grunt.loadNpmTasks("grunt-ts")
	grunt.loadNpmTasks("grunt-contrib-uglify");

	grunt.initConfig({
		ts: {
			dev: {
				src: ["src/**/*.ts"],
				watch: 'src',
				reference: "src/reference.ts",
				out: 'src/game.js'
			}
		},
		uglify:{
			my_target: {
				files:{
					'src/game.min.js'  :  ['src/game.js']
				}
			}
		}



	});


	grunt.registerTask('default',["ts:dev"]);
	grunt.registerTask('min', ["uglify:my_target:files"]);
};