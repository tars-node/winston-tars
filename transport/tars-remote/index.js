'use strict';

var util = require('util'),
	assert = require('assert');

var TarsStream = require('@tars/stream'),
	TarsClient = require('@tars/rpc').client,
	TarsConfigure = require('@tars/utils').Config;

var winston = require('winston'),
	common = require('winston/lib/winston/common');

var LogProxy = require('./LogFProxy');

var TarsDateFormat = require('../util/date-format');

var Formatter = require('../../lib/formatter');

var emptyfn = function() {};

var TarsRemote = function(options) {
	var tarsConfig;

	options = options || {};

	winston.Transport.call(this, options);

	assert(options.tarsConfig || process.env.TARS_CONFIG, 'TARS_CONFIG is not in env and options.tarsConfig not defined');

	if (options.tarsConfig instanceof TarsConfigure) {
		tarsConfig = options.tarsConfig;
	} else {
		if (typeof options.tarsConfig === 'string') {
			tarsConfig = new TarsConfigure();
			tarsConfig.parseFile(options.tarsConfig);
		} else if (process.env.TARS_CONFIG) {
			tarsConfig = new TarsConfigure();
			tarsConfig.parseFile(process.env.TARS_CONFIG);
		}
	}

	assert(tarsConfig, 'options.tarsConfig not instanceof @tars/rpc.util.configure');

	assert(tarsConfig.get('tars.application.server.app') && 
		tarsConfig.get('tars.application.server.server'), 'app & server not found in configure file');

	this._logInfo = new LogProxy.tars.LogInfo();

	this._logInfo.appname = tarsConfig.get('tars.application.server.app');
	this._logInfo.servername = tarsConfig.get('tars.application.server.server');

	if (options.filename) {
		this._logInfo.sFilename = options.filename;
	}

	options.format = options.format || TarsDateFormat.LogByDay;

	if (typeof options.format === 'function') {
		options.format = new options.format;
	}

	assert(options.format.name === 'day' || 
		options.format.name === 'hour' || 
		options.format.name === 'minute', 'options.format MUST be among [day|hour|minute]');

	this._logInfo.sFormat = options.format.logPattern;
	this._logInfo.sLogType = options.format.interval + options.format.name;

	if (tarsConfig.get('tars.application.enableset', 'n').toLowerCase() === 'y' && 
		tarsConfig.get('tars.application.setdivision', 'NULL') !== 'NULL') {
		this._logInfo.setdivision = tarsConfig.get('tars.application.setdivision');
	}

	if (typeof options.hasSufix === 'boolean') {
		this._logInfo.bHasSufix = options.hasSufix;
	}
	if (typeof options.hasAppNamePrefix === 'boolean') {
		this._logInfo.bHasAppNamePrefix = options.hasAppNamePrefix;
	}
	if (typeof options.concatStr === 'string') {
		this._logInfo.sConcatStr = options.concatStr;
	}
	if (typeof options.separ === 'string') {
		this._logInfo.sSepar = options.separ;
	}

	if (typeof options.tarsConfig === 'string') {
		TarsClient.initialize(options.tarsConfig);
	}

	if (typeof options.tarsLogServant === 'string') {
		this._client = TarsClient.stringToProxy(LogProxy.tars.LogProxy, options.tarsLogServant);
	} else {
		this._client = TarsClient.stringToProxy(LogProxy.tars.LogProxy, 
			tarsConfig.get('tars.application.server.log', 'tars.tarslog.LogObj'));
	}
	
	this.options = {
		interval : options.interval || 500, // 500ms
		bufferSize : options.bufferSize || 10000,
		prefix : options.prefix,
		formatter : options.formatter || Formatter.Detail({
			separ : this._logInfo.sSepar
		})
	};

	this._buffer = [];
	this._bufferIndex = 0;
};

util.inherits(TarsRemote, winston.Transport);

TarsRemote.prototype.name = 'tarsRemote';

TarsRemote.prototype.log = function (level, msg, meta, callback) {
	var ths = this;

	var output = common.log({
		level : level,
		message : msg,
		meta : meta,
		formatter : this.options.formatter,
		prefix : this.options.prefix
	}) + '\n';

	this._buffer[this._bufferIndex++] = {
		output : output,
		callback : callback
	};

	if (this._bufferIndex > this.options.bufferSize) {
		this._bufferIndex = 0;
	}

	if (!this._timerid) {
		this._timerid = setTimeout(function() {
			ths._flush();
			delete ths._timerid;
		}, this.options.interval);
	}
};

TarsRemote.prototype._flush = function() {
	var buffer = new TarsStream.List(TarsStream.String), i = 0;

	for (i = this._bufferIndex; i < this._buffer.length; i += 1) {
		buffer.push(this._buffer[i].output);
		this._buffer[i].callback(null, true);
	}
	for (i = 0; i < this._bufferIndex; i += 1) {
		buffer.push(this._buffer[i].output);
		this._buffer[i].callback(null, true);
	}

	this._bufferIndex = 0;
	this._buffer = [];

	this._client.loggerbyInfo(this._logInfo, buffer).catch(emptyfn);
};

TarsRemote.prototype.close = function() {
	if (this._timerid) {
		clearTimeout(this._timerid);
		delete this._timerid;
	}

	this._buffer = [];
	this._bufferIndex = 0;

	this._client.disconnect();
};

TarsRemote.FORMAT = TarsDateFormat;

module.exports = winston.transports.TarsRemote = TarsRemote;