/*
 * grunt-preload-assets
 * https://github.com/gunta/grunt-preload-assets
 *
 * Copyright (c) 2013 Gunther Brunner
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	// NodeJS libs
	var path = require('path'),
		fs = require('fs'),
		crypto = require('crypto');

	// Image libs
	var imagesEngine = 'sips';
	var execSync;

	if (imagesEngine === 'sips') {
		execSync = require('execSync');
	}


	// Grunt utils
	var _ = grunt.util._;
	var async = grunt.util.async;

	function getPathWithoutBasePath(path, ignoreBasePath) {
		if (ignoreBasePath) {
			return _.strRightBack(path, ignoreBasePath);
		} else {
			return path;
		}
	}

	// SAMPLE
	// https://github.com/gruntjs/grunt-contrib-jst/blob/master/tasks/jst.js

	var typeByExtension = function (file) {
		var extension = _.ltrim(path.extname(file.src), '.');
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

	var scan = {
		idBasedOnFilenameCamelized: function (file) {
			return _.camelize(_.strLeftBack(path.normalize(file.src), path.extname(file.src)).replace(/\//g, '_'));
		},
		typeByExtension: typeByExtension,
		fileSizeInBytes: function (filepath) {
			var stats = fs.lstatSync(filepath);
			return stats.size;
		},
		lastModifiedUnixTime: function (filepath) {
			var stats = fs.lstatSync(filepath);
			return stats.mtime.getTime();
		},
		dimensionsInPixels: function (filepath) {
			var dimensions = {
				width: -1,
				height: -1
			};

			if (imagesEngine === 'sips') {
				var commandToExecute = 'sips "' + filepath + '" -g pixelHeight -g pixelWidth';
				var sipsOutput = execSync.stdout(commandToExecute).split('\n');

				grunt.log.write(".");

				// 4 lines: good signal that we have good output
				if (sipsOutput.length === 4) {
					var heightFound = sipsOutput[1].match(/pixelHeight: (\d+)/);
					if (heightFound.length > 1) {
						// Height found
						dimensions.height = parseInt(heightFound[1], 10);
					}
					var widthFound = sipsOutput[2].match(/pixelWidth: (\d+)/);
					if (widthFound.length > 1) {
						// Width found
						dimensions.width = parseInt(widthFound[1], 10);
					}
				} else {
					// No image
				}
			}

			// TODO: scan dimensions
//			if (typeByExtension(filepath) === "IMAGE") {
//				console.log(filepath)
//			}

			return dimensions;
		},
		md5hash: function (filepath, digits) {
			// TODO: scan md5
			var hash = crypto.createHash('md5');
			hash.update(grunt.file.read(filepath));
			grunt.log.verbose.write('Hashing ' + filepath + '...');
			var hashed = hash.digest('hex');
			var sliced = hashed.slice(0, digits);
			return sliced;
		},
		base64encode: function (filepath) {
			var data = fs.readFileSync(filepath);
			var base64data = new Buffer(data || '').toString('base64');
			return base64data;
		}

	};

	grunt.registerMultiTask('preload_assets', 'A Grunt plugin for making preload assets manifest.', function () {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			key: 'filesManifest',
			template: 'json',
			basePath: undefined,
			ignoreBasePath: undefined,
			detectSrc: true,
			detectId: true,
			detectType: true,
			detectBytes: false,
			detectTotalBytes: false,
			detectDimensions: false,
			detectMD5: false,
			detectLastModified: false,
			detectBase64: false,
			processSrc: function (file) {
				return file;
			},
			processId: function (file) {
				return scan.idBasedOnFilenameCamelized(file);
			},
			processType: function (file) {
				return scan.typeByExtension(file);
			},
			processBytes: function (file) {
				return scan.fileSizeInBytes(file);
			},
			processTotalBytes: function (bytes) {
				return bytes;
			},
			processDimensions: function (file) {
				return scan.dimensionsInPixels(file);
			},
			processMD5: function (file) {
				return scan.md5hash(file, 8);
			},
			processLastModified: function (file) {
				return scan.lastModifiedUnixTime(file);
			},
			processBase64: function (file) {
				return scan.base64encode(file);
			}
		});

		grunt.verbose.writeflags(options, 'Options');

		// If the extension is .jst, treat as preset template
		if (path.extname(options.template) !== ".jst") {
			grunt.log.debug("Trying to use preset template files.");
			var bundledTemplatesPath = path.join(path.dirname(fs.realpathSync(__filename)), '../templates/');
			var defaultTemplate = bundledTemplatesPath + options.template + '.jst';
			if (grunt.file.exists(defaultTemplate)) {
				options.template = defaultTemplate;
			}
		}

		// TODO: USE GRUNT
		var tpl = options.processSrc(grunt.file.read(options.template));

		var outputData = {};
		outputData.key = options.key;
		outputData.files = [];

		// Iterate over all specified file groups.
		this.files.forEach(function (file) {

			var outputDataSample = {
				key: "filesToPreload",
				files: [
					{
						id: "folderImagex",
						src: "folder/image.png"
					},
					{
						id: "folder/sound2x",
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

			// if a basePath is set, expand using the original file pattern
			var filesArr = [];
			// TODO: fix basePath
			if (options.basePath) {
				filesArr = grunt.file.expand({cwd: options.basePath}, file.orig.src);
			} else {
				filesArr = file.src;
			}

			// Filter existent files
			var src = file.src.filter(function (filepath) {
				// Warn on and remove invalid source files (if no null was set).
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			}).map(function (filepath) {
					// Add file src
					var fileProps = {};
					fileProps.src = getPathWithoutBasePath(filepath, options.ignoreBasePath);
					fileProps.origSrc = filepath;
					grunt.verbose.writeln('Listing ' + filepath);
					outputData.files.push(fileProps);
				});

			var totalBytes = 0;

			// Generate ID for each file
			_.each(outputData.files, function (f) {
				if (options.detectId) {
					f.id = options.processId(f);
				}
				if (options.detectType) {
					f.type = options.processType(f);
				}
				if (options.detectBytes) {
					f.bytes = options.processBytes(f.origSrc);
				}
				if (options.detectTotalBytes) {
					totalBytes += f.bytes;
				}
				if (options.detectDimensions) {
					var dimensions = options.processDimensions(f.origSrc);
					if (dimensions.width !== -1) {
						f.width = dimensions.width;
					}
					if (dimensions.height !== -1) {
						f.height = dimensions.height;
					}
				}
				if (options.detectMD5) {
					f.md5 = options.processMD5(f.origSrc);
				}
				if (options.detectLastModified) {
					f.lastModified = options.processLastModified(f.origSrc);
				}
				if (options.detectBase64) {
					f.base64 = options.processBase64(f.origSrc);
				}
			});

			// After all files scanned
			grunt.log.writeln();

			if (options.detectTotalBytes) {
				outputData.totalBytes = options.processTotalBytes(totalBytes);
			}

			var compiled;
			// Compile
			try {
				compiled = _.template(tpl, outputData, {});
			} catch (e) {
				grunt.log.error(e);
				grunt.fail.warn('JST failed to compile.');
			}

			try {
				grunt.file.write(file.dest, compiled);
				grunt.verbose.writeln("\nCompiling template for file...");
				grunt.verbose.writeln(compiled);
				grunt.log.writeln('File "' + file.dest + '" created.');
			} catch (e) {
				grunt.log.error(e);
				grunt.fail.warn('Failed to save file.');
			}
		});
	});
};
