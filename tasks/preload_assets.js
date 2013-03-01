/*
 * grunt-preload-assets
 * https://github.com/gunta/grunt-preload-assets
 *
 * Copyright (c) 2013 Gunther Brunner
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	var _ = require('lodash');
	var path = require('path');

	// Filename conversion for templates
	var defaultProcessName = function (name) {
		return name;
	};

	// SAMPLE
	// https://github.com/gruntjs/grunt-contrib-jst/blob/master/tasks/jst.js


	var getTypeByExtension = function (extension) {
		switch (extension) {
			case "jpeg":
			case "jpg":
			case "gif":
			case "png":
			case "webp":
			case "bmp":
				return "IMAGE";
			case "ogg":
			case "mp3":
			case "wav":
				return "SOUND";
			case "json":
				return "JSON";
			case "xml":
				return "XML";
			case "css":
				return "CSS";
			case "js":
				return "JAVASCRIPT";
			case 'svg':
				return "SVG";
			default:
				return "TEXT";
		}
	};


	grunt.registerMultiTask('preload_assets', 'A Grunt plugin for making preload assets manifest.', function () {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			key: 'preloadFiles',
			punctuation: '.',
			separator: ', ',
			template: 'preloadjs-var.jst',
			processContent: function (src) {
				return src;
			}
		});

//		var processName = options.processName || defaultProcessName;

		grunt.verbose.writeflags(options, 'Options');

		var templatePath = "templates/" + options.template;

		var tpl = options.processContent(grunt.file.read(templatePath));

		var compiled, filename;

		var data = {
			key: "filesToPreload",
			files: [
				{
					id: "folderImage",
					src: "folder/image.png"
				},
				{
					id: "folder/sound2",
					src: "folder/sound2.mp3",
					type: "SOUND",
					bytes: 1231251
				},
				{
					src: "folder/image3.jpg",
					width: 480,
					height: 640
				}
			],
			totalBytes: 1234567
		};

		// Compile
		try {
			compiled = _.template(tpl, data, {});
		} catch (e) {
			grunt.log.error(e);
			grunt.fail.warn('JST failed to compile.');
		}

		console.log(compiled);


//		// Iterate over all specified file groups.
//		this.files.forEach(function (f) {
//			// Concat specified files.
//			var src = f.src.filter(function (filepath) {
//				// Warn on and remove invalid source files (if nonull was set).
//				if (!grunt.file.exists(filepath)) {
//					grunt.log.warn('Source file "' + filepath + '" not found.');
//					return false;
//				} else {
//					return true;
//				}
//			}).map(function (filepath) {
//					// Read file source.
//					return grunt.file.read(filepath);
//				}).join(grunt.util.normalizelf(options.separator));
//
//			// Handle options.
//			src += options.punctuation;
//
//			// Write the destination file.
//			grunt.file.write(f.dest, src);
//
//			// Print a success message.
//			grunt.log.writeln('File "' + f.dest + '" created.');
//		});
	});

};
