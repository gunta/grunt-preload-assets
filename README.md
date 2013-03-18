# grunt-preload-assets (WIP) [![Build Status](https://travis-ci.org/gunta/grunt-preload-assets.png)](http://travis-ci.org/gunta/grunt-preload-assets)

> A Grunt plugin for generating preload assets manifest files.	
> Supports [PreloadJS](http://www.createjs.com/#!/PreloadJS), [PxLoader](http://thinkpixellab.com/pxloader/), JSON, JS, CSV, and unlimited support for multiple formats by using [underscore templates](http://www.2ality.com/2012/06/underscore-templates.html).
> By [@gunta](https://github.com/gunta/).


## Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:


Add to your `package.json` entry:

```
"grunt-preload-assets": "git+ssh://git@github.com:gunta/grunt-preload-assets.git"
```

Or just use:
```shell
npm install git+ssh://git@github.com:gunta/grunt-preload-assets.git --save-dev
```

## Preload Assets task
_Run this task with the `grunt preload_assets` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Options

#### template
Type: `String`	
Choices: 	

* `preloadjs`
* `pxloader`
* `json`
* `json-idaskey`
* `csv`
* `custom-sample`
* Or a path to a template file.		

Default: `json`

Selects a template for generating the assets list.
The output can be customized by creating your own [underscore template](http://www.2ality.com/2012/06/underscore-templates.html). 


#### detect
Type: `Object`

An object containing properties to analyze and include from the assets. 

* #####id
	Type: `Boolean`		
	Default: `true`
	
	Includes an **identifier** in the output. 	
	By default, it **camelizes the filename and removes the extension**.
	
* #####src
	Type: `Boolean`		
	Default: `true`
	
	Includes the file path.
	
* #####type
	Type: `Boolean`		
	Default: `true`
	
	Analyzes each asset file type and includes it. 	
	By default, the supported file types are `IMAGE` `SOUND` `JSON` `XML` `CSS` `JAVASCRIPT` `SVG` and `TEXT`.
	
* #####bytes	
	Type: `Boolean`		
	Default: `false`	
	
	Includes each asset file size **in bytes**.		
	Useful when creating realistic progress bars.
	
* #####totalBytes	
	Type: `Boolean`		
	Default: `false`	
	
	Includes the sum of all assets file sizes **in bytes**. 	
	Useful when creating realistic progress bars.
	
* #####lastModified	
	Type: `Boolean`		
	Default: `false`	
	
	Includes each asset file last modified timestamp **in unixtime**. 	
	Useful when comparing file changes or implementing a cache system.
	
* #####md5	
	Type: `Boolean`		
	Default: `false`	
	
	Includes each asset file **md5 hash** trimmed to the first **8 chars**.		
	Useful when creating a cache system more reliable than one based on timestamps or checking integrity. 
	
* #####base64	
	Type: `Boolean`		
	Default: `false`	
	
	Includes each entire asset file encoded in a **base64 string**.		
	Useful when the asset file sizes are small, to reduce http requests.
	
* #####dimensions	
	Type: `Boolean`		
	Default: `false`	
	
	For `IMAGE` files: Includes each asset file `width` and `height` **in pixels**.		
	Useful so one doesn't need to manually write the width/height everytime for each file.
	
	*Currently this only works on OS X.*
	
*Note that not every template needs to add support to all these properties.*
	

### Advanced Options

#### key
Type: `String`	
Default: `filesManifest`

Specifies a key name for the root container.

####ignoreBasePath
Type: `String`	
Default: `undefined`

Ignores a specific base path from the specified `src`.

#### process
Type: `Object`

An object containing functions to override the default behaviour of **detect**. 

By default it includes the following object.

```js
process: {
	src: function (file) {
		return file;
	},
	id: function (file) {
		return scan.idBasedOnFilenameCamelized(file);
	},
	type: function (file) {
		return scan.typeByExtension(file);
	},
	bytes: function (file) {
		return scan.fileSizeInBytes(file);
	},
	totalBytes: function (bytes) {
		return bytes;
	},
	dimensions: function (file) {
		return scan.dimensionsInPixels(file);
	},
	md5: function (file) {
		return scan.md5hash(file, 8);
	},
	lastModified: function (file) {
		return scan.lastModifiedUnixTime(file);
	},
	base64: function (file) {
		return scan.base64encode(file);
	}
}
```

## Usage examples

### Basic usage

```js
// Project configuration.
grunt.initConfig({
  preload_assets: {
    my_target: {
      files: {
        'dest/filesmanifest.js': ['src/*.png', 'src/*.jpg']
      }
    }
  }
});
```

Will produce something like this:

```js
var filesManifest = [
	{id: 'genericButton', src: 'genericButton.png', type: createjs.LoadQueue.IMAGE},
	{id: 'genericButtonOver', src: 'genericButtonOver.png', type: createjs.LoadQueue.IMAGE},
	{id: 'parallaxHill1', src: 'parallaxHill1.png', type: createjs.LoadQueue.IMAGE},
	{id: 'sky', src: 'sky.png', type: createjs.LoadQueue.IMAGE},
	{id: 'image2', src: 'image2.jpg', type: createjs.LoadQueue.IMAGE}
];
```



## Release History

### 0.1.1

- Added timestamp support
- Added base64 support
- Added md5 support
- Added flag for optional switching of options
- Added JSON template, with key and array version
- Added CSV support
- Added totalBytes support
- Replaced lodash with grunt.util._


## Roadmap

### 0.1.2

- Consider ignoreBasePath naming -> CONSIDER USING ~ new syntax
- Consider file templates vs. string templates, processId
- Refactor functions
- Add PxLoader template
- Write docs

DONE:
- Add image width and height support

### 0.1.3
- Add image sprites support
- Add TexturePacker JSON and sprites support
- Add image jpeg+alpha support
- Add jpeg+alpha sprites support
- Consider id generation by groups
- Look for other IDs, id duplication
- Add video specs support
- Add audio template support (zynga audio library)

### 0.1.4

- Test with PreloadJS
- Write template for other preloaders
- Add check for not scanning heavy properties if lastModified is present
- Add test suite
- Publish npm
- Add async support where possible
- Add support for imagemagick
- Add support for Windows
- Remove dependency for execSync
- Add template for grouping by filetype
- Add support for remote file path (absolute)

### 0.1.5
- Create graphics
- Contact Adobe for PreloadJS official endorsement and support
- Contact grunt-preloader-manifest-generator author about duplicated work

### 0.1.6
- Add Grunt 0.5 support