# periodicjs.ext.scheduled_content

An extension that uses a cron job to periodically check for unpublished posts to publish.

 [API Documentation](https://github.com/typesettin/periodicjs.ext.scheduled_content/blob/master/doc/api.md)

## Installation

```
$ npm install periodicjs.ext.scheduled_content
```

## Configure

You can alter the interval at which this extension checks for unpublished content. After the extension has been installed, the extension configuration is located in `content/config/extensions/periodicjs.ext.scheduled_content/settings.json`

##Development
*Make sure you have grunt installed*
```
$ npm install -g grunt-cli
```

Then run grunt watch
```
$ grunt watch
```
For generating documentation
```
$ grunt doc
$ jsdoc2md controller/**/*.js index.js install.js uninstall.js > doc/api.md
```
##Notes
* Check out https://github.com/typesettin/periodicjs for the full Periodic Documentation