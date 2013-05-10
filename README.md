# grunt-preload-assets

> A Grunt plugin for generating preload assets manifest files.	
> Supports [PreloadJS](http://www.createjs.com/#!/PreloadJS), [PxLoader](http://thinkpixellab.com/pxloader/), JSON, JS, CSV, and unlimited support for multiple formats by using [underscore templates](http://www.2ality.com/2012/06/underscore-templates.html).
> By [@gunta](https://github.com/gunta/).



![image](http://gunta.github.com/grunt-preload-assets/images/grunt-preload-assets-logo.jpg)



## Getting Started

This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-preload-assets --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-preload-assets');
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


### Detecting options

####detectId
Type: `Boolean`		
Default: `true`

Includes an **identifier** in the output. 	
By default, it **camelizes the filename and removes the extension**.
	
####detectSrc
Type: `Boolean`		
Default: `true`

Includes the file path.
	
####detectType
Type: `Boolean`		
Default: `true`

Analyzes each asset file type and includes it. 	
By default, the supported file types are `IMAGE` `SOUND` `JSON` `XML` `CSS` `JAVASCRIPT` `SVG` and `TEXT`.
	
####detectBytes	
Type: `Boolean`		
Default: `false`	

Includes each asset file size **in bytes**.		
Useful when creating realistic progress bars.
	
####detectTotalBytes	
Type: `Boolean`		
Default: `false`	

Includes the sum of all assets file sizes **in bytes**. 	
Useful when creating realistic progress bars.

####detectLastModified	
Type: `Boolean`		
Default: `false`	

Includes each asset file last modified timestamp **in unixtime**. 	
Useful when comparing file changes or implementing a cache system.

####detectMD5	
Type: `Boolean`		
Default: `false`	

Includes each asset file **md5 hash** trimmed to the first **8 chars**.		
Useful when creating a cache system more reliable than one based on timestamps or checking integrity. 

####detectBase64	
Type: `Boolean`		
Default: `false`	

Includes each entire asset file encoded in a **base64 string**.		
Useful when the asset file sizes are small, to reduce http requests.

####detectDimensions	
Type: `Boolean`		
Default: `false`	

For `IMAGE` files: Includes each asset file `width` and `height` **in pixels**.		
Useful so one doesn't need to manually write the width/height everytime for each file.

*Currently this only works on OS X (Waiting your pull request)* 😉
	
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

#### processSrc
Type: `Function`	
Parameter: `String` filename

Overrides the function for processing the src filename.

#### processId
Type: `Function`	
Parameter: `String` filename

Overrides the function for processing the id.

#### processType
Type: `Function`	
Parameter: `String` filename

Overrides the function for processing the file type.

#### processBytes
Type: `Function`	
Parameter: `Number` bytes

Overrides the function for processing the number of bytes.

#### processTotalBytes
Type: `Function`	
Parameter: `String` filename

Overrides the function for processing the number of total bytes.

#### processDimensions
Type: `Function`	
Parameter: `String` filename

Overrides the function for processing the dimensions of the file.

#### processMD5
Type: `Function`	
Parameter: `String` filename

Overrides the function for processing the md5 hash for the file.

#### processLastModified
Type: `Function`	
Parameter: `String` filename

Overrides the function for processing the last modified date.

#### processBase64
Type: `Function`	
Parameter: `String` filename

Overrides the function for processing the base64 encode of the file.


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

```json
{
	"filesManifest": {
		"files": [
			{
				"id": "testFixturesGenericButton",
			    "src": "test/fixtures/genericButton.png",
			    "type": "IMAGE"
	        },
			{
				"id": "testFixturesGenericButtonOver",
			    "src": "test/fixtures/genericButtonOver.png",
			    "type": "IMAGE"
	        },
			{
				"id": "testFixturesParallaxHill1",
			    "src": "test/fixtures/parallaxHill1.png",
			    "type": "IMAGE"
	        },
			{
				"id": "testFixturesSky",
			    "src": "test/fixtures/sky.png",
			    "type": "IMAGE"
	        },
			{
				"id": "testFixturesImage2",
			    "src": "test/fixtures/image2.jpg",
			    "type": "IMAGE"
	        }
        ]
    }
}
```

### PreloadJS sample

```js
// Project configuration.
grunt.initConfig({
	preload_assets: {
		my_target: {
			options: {
				ignoreBasePath: 'somebasepath/path/',
				template: 'preloadjs'
			},
			files: {
				'dest/filesmanifest.js': ['somebasepath/path/*.png', 'somebasepath/path/*.jpg']
			}
		}
	}
});
```

Will produce this:

```js
var filesManifest = [
	{id: 'genericButton', src: 'genericButton.png', type: createjs.LoadQueue.IMAGE},
	{id: 'genericButtonOver', src: 'genericButtonOver.png', type: createjs.LoadQueue.IMAGE},
	{id: 'parallaxHill1', src: 'parallaxHill1.png', type: createjs.LoadQueue.IMAGE},
	{id: 'sky', src: 'sky.png', type: createjs.LoadQueue.IMAGE},
	{id: 'image2', src: 'image2.jpg', type: createjs.LoadQueue.IMAGE}
];
```

### JSON full options sample

```js
// Project configuration.
grunt.initConfig({
	preload_assets: {
		my_target: {
			options: {
				template: 'json',
				detectId: true,
				detectBytes: true,
				detectTotalBytes: true,
				detectSrc: true,
				detectLastModified: false,
				detectMD5: true,
				detectBase64: true,
				detectDimensions: true
			},
			files: {
				'dest/filesmanifest.js': ['test/fixtures/*.*']
			}
		}
	}
});
```

Will produce this:

```json
{
	"filesManifest": {
		"files": [
			{
				"id": "testFixturesCabinBoy",
			    "src": "test/fixtures/CabinBoy.mp3",
			    "bytes": 9529,
			    "md5": "bc1d817c",
                "base64": "SUQzAwAAAAAlH1RSUQzAwAAAAAlH1RZRVIMjAxMC0xMC0yMlQxwNjowM...",
                "lastModified": 1363601857000
	        },
			{
				"id": "testFixturesThunder",
			    "src": "test/fixtures/Thunder.ogg",
			    "bytes": 71083,
			    "md5": "076b3c87",
			    "base64": "1RZRVIAAAAaAASUQzAwAAAAAlH1RZRVIAAAAaAAAAMjAxMC0xMC0ywNjowM...",
                "lastModified": 1363601857000
	        },
			{
				"id": "testFixturesFont",
			    "src": "test/fixtures/font.css",
			    "bytes": 37,
			    "md5": "34b228cf",
                "base64": "ZGl2IHsKICAgY29sb3I6ICMyNMC0xmIzZjggIWltcG9ydGFudDsKfQ...",
                "lastModified": 1363601857000
	        },
			{
				"id": "testFixturesGenericButton",
			    "src": "test/fixtures/genericButton.png",
			    "bytes": 2832,
			    "width": 150,
                "height": 100,
                "md5": "7a36698a",
                "base64": "iVBONvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2FTkSuQmCC..."
	        },
			{
				"...": "............"
			}
        ],
        "totalBytes": 206944
    }
}
```

### CSV options sample

```js
// Project configuration.
grunt.initConfig({
	preload_assets: {
		my_target: {
			options: {
					template: 'csv'
			},
			files: {
				'dest/filesmanifest.csv': ['test/fixtures/*.*']
			}
		}
	}
});
```

Will produce this:

```csv
test/fixtures/CabinBoy.mp3,test/fixtures/Thunder.ogg,test/fixtures/font.css,test/fixtures/gbot.svg,test/fixtures/genericButton.png,test/fixtures/genericButtonOver.png,test/fixtures/grant.json,test/fixtures/grant.xml,test/fixtures/image2.jpg,test/fixtures/loader.gif,test/fixtures/parallaxHill1.png,test/fixtures/sky.png
```



## Release History

### 0.2.1
- Updated package information

### 0.2.0
- First NPM package release

### 0.1.2
- Changed option parameters to a single hash because they would be overridden with a new object if passed
- Changed idaskey to hash for better naming
- Added bytes to PreloadJS template

### 0.1.1

- Added timestamp support
- Added base64 support
- Added md5 support
- Added flag for optional switching of options
- Added JSON template, with key and array version
- Added CSV support
- Added totalBytes support
- Replaced lodash with grunt.util._

