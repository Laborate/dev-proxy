var $ = require("jquery");
var fs = require('node-fs');
var config = require('./config');
var forever = require('forever-monitor');
var crontab = require('crontab');
var path = require('path');
var util = require('util');

//Update Crontab
crontab.load(function(err, tab) {
    require('npm').load(function (err, npm) {
        if (err) { console.log(err); process.exit(1); }

        var npmPrefix = npm.config.get('prefix');
        var npmBinRoot = path.join(npmPrefix, 'bin');
        var nodePath = process.execPath.split('/').slice(0, -1).join('/');
        var exportCommand  = 'export PATH=' + nodePath + ':$PATH';
        var foreverCommand = path.join(npmBinRoot, 'forever');
        var thisCommand = __filename;
        var sysCommand = util.format('%s && %s start %s', exportCommand, foreverCommand, thisCommand);

        tab.remove(tab.findComment("laborate_proxy_server"));
        tab.create(sysCommand, "laborate_proxy_server").everyReboot();

        tab.remove(tab.findComment("scout_realtime"));
        tab.create(util.format('%s && /usr/local/bin/scout_realtime start', exportCommand), "scout_realtime").everyReboot();

        tab.save();
    });
});

//Create Logs Folder
fs.mkdirSync(__dirname + '/../logs/' + config.forever.uid, 0775, true);

//Configure Forever
var child = new (forever.Monitor)(__dirname + '/server.js', {
    uid: config.forever.uid,
    max: config.forever.max_failures,
    silent: config.forever.silent,

    watch: config.forever.watch,
    watchDirectory: __dirname + "/" + config.forever.watch_directory,
    watchIgnoreDotFiles: config.forever.watch_ignore_dot,
    watchIgnorePatterns: $.map(config.forever.watch_ignore_patterns, function(value) {
        return __dirname + "/" + value;
    }),

    env: {
        'NODE_ENV': "development"
    },

    outFile: __dirname + "/" + config.forever.output_log,
    errFile: __dirname + "/" + config.forever.error_log,

    killTree: true
});

//Start Forver
child.start();
