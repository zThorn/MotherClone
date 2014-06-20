module.exports = function(grunt){

	grunt.loadNpmTasks("grunt-ts")

	grunt.initConfig({
		ts: {
			dev: {
				src: ["src/**/*.ts"],
				watch: 'src',
				reference: "src/reference.ts",
				out: 'src/game.js'
			}
		},



	});


	grunt.registerTask('default',["ts:dev"]);
};