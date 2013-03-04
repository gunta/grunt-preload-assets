grunt-preload-assets
====================

A Grunt plugin for generating preload assets manifest files.
Work In Progress (!)

##Way to install (WIP!):

Add to your `package.json` entry:
	
	"grunt-preload-assets": "git+ssh://git@github.com:gunta/grunt-preload-assets.git"

Or just use:

	npm install git+ssh://git@github.com:gunta/grunt-preload-assets.git --save-dev



## Changes

### Current 0.1.0


### Roadmap 0.1.1
- Add md5 support
- Add flag for optional switching of options
- Add timestamp support

	DONE:
- Added JSON template, with key and array version
- Added CSV support
- Added totalBytes support

### Roadmap 0.1.2
- Consider ignoreBasePath naming
- Consider file templates vs. string templates, processId
- Replace lodash with grunt.util._
- Add image width and height support
- Refactor functions

### Roadmap 0.1.3
- Add image sprites support
- Add TexturePacker JSON and sprites support
- Add image jpeg+alpha support
- Add jpeg+alpha sprites support
- Consider id generation by groups
- Look for other IDs, id duplication
- Add video specs support
- Add audio template support (zynga audio library)

### Roadmap 0.1.4
- Write docs
- Test with PreloadJS
- Write template for other preloaders
- Add check for not scanning heavy properties if lastModified is present
- Add test suite
- Publish npm
- Add async support where possible

### Roadmap 0.1.5
- Create graphics
- Contact Adobe for PreloadJS official endorsement and support
- Contact grunt-preloader-manifest-generator author about duplicated work

### Roadmap 0.1.6
- Add Grunt 0.5 support