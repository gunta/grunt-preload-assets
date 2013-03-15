grunt-preload-assets
====================

A Grunt plugin for generating preload assets manifest files.

##Way to install (WIP):

Add to your `package.json` entry:
	
	"grunt-preload-assets": "git+ssh://git@github.com:gunta/grunt-preload-assets.git"

Or just use:

	npm install git+ssh://git@github.com:gunta/grunt-preload-assets.git --save-dev



## Changes

### Current 0.1.1

- Added timestamp support
- Added base64 support
- Added md5 support
- Added flag for optional switching of options
- Added JSON template, with key and array version
- Added CSV support
- Added totalBytes support
- Replaced lodash with grunt.util._

### Roadmap 0.1.2

- Consider ignoreBasePath naming
- Consider file templates vs. string templates, processId
- Refactor functions

DONE:
- Add image width and height support

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
- Add support for imagemagick
- Add support for Windows
- Remove dependency for execSync

### Roadmap 0.1.5
- Create graphics
- Contact Adobe for PreloadJS official endorsement and support
- Contact grunt-preloader-manifest-generator author about duplicated work

### Roadmap 0.1.6
- Add Grunt 0.5 support