/**
 * Tencent is pleased to support the open source community by making Tars available.
 *
 * Copyright (C) 2016THL A29 Limited, a Tencent company. All rights reserved.
 *
 * Licensed under the BSD 3-Clause License (the "License"); you may not use this file except 
 * in compliance with the License. You may obtain a copy of the License at
 *
 * https://opensource.org/licenses/BSD-3-Clause
 *
 * Unless required by applicable law or agreed to in writing, software distributed 
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR 
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the 
 * specific language governing permissions and limitations under the License.
 */

"use strict";

var assert    = require("assert");
var TarsStream = require("@tars/stream");
var TarsError  = require("@tars/rpc").error;

var tars = tars || {};
module.exports.tars = tars;

tars.LogProxy = function () {
    this._name   = undefined;
    this._worker = undefined;
};

tars.LogProxy.prototype.setTimeout = function (iTimeout) {
    this._worker.timeout = iTimeout;
};

tars.LogProxy.prototype.getTimeout = function () {
    return this._worker.timeout;
};


tars.LogInfo = function() {
    this.appname = "";
    this.servername = "";
    this.sFilename = "";
    this.sFormat = "";
    this.setdivision = "";
    this.bHasSufix = true;
    this.bHasAppNamePrefix = true;
    this.bHasSquareBracket = false;
    this.sConcatStr = "_";
    this.sSepar = "|";
    this.sLogType = "";
    this._classname = "tars.LogInfo";
};
tars.LogInfo._classname = "tars.LogInfo";
tars.LogInfo._write = function (os, tag, value) { os.writeStruct(tag, value); };
tars.LogInfo._read  = function (is, tag, def) { return is.readStruct(tag, true, def); };
tars.LogInfo._readFrom = function (is) {
    var tmp = new tars.LogInfo();
    tmp.appname = is.readString(0, true, "");
    tmp.servername = is.readString(1, true, "");
    tmp.sFilename = is.readString(2, true, "");
    tmp.sFormat = is.readString(3, true, "");
    tmp.setdivision = is.readString(4, false, "");
    tmp.bHasSufix = is.readBoolean(5, false, true);
    tmp.bHasAppNamePrefix = is.readBoolean(6, false, true);
    tmp.bHasSquareBracket = is.readBoolean(7, false, false);
    tmp.sConcatStr = is.readString(8, false, "_");
    tmp.sSepar = is.readString(9, false, "|");
    tmp.sLogType = is.readString(10, false, "");
    return tmp;
};
tars.LogInfo.prototype._writeTo = function (os) {
    os.writeString(0, this.appname);
    os.writeString(1, this.servername);
    os.writeString(2, this.sFilename);
    os.writeString(3, this.sFormat);
    os.writeString(4, this.setdivision);
    os.writeBoolean(5, this.bHasSufix);
    os.writeBoolean(6, this.bHasAppNamePrefix);
    os.writeBoolean(7, this.bHasSquareBracket);
    os.writeString(8, this.sConcatStr);
    os.writeString(9, this.sSepar);
    os.writeString(10, this.sLogType);
};
tars.LogInfo.prototype._equal = function () {
    assert.fail("this structure not define key operation");
};
tars.LogInfo.prototype._genKey = function () {
    if (!this._proto_struct_name_) {
        this._proto_struct_name_ = "STRUCT" + Math.random();
    }
    return this._proto_struct_name_;
};
tars.LogInfo.prototype.toObject = function() { 
    return {
        "appname" : this.appname,
        "servername" : this.servername,
        "sFilename" : this.sFilename,
        "sFormat" : this.sFormat,
        "setdivision" : this.setdivision,
        "bHasSufix" : this.bHasSufix,
        "bHasAppNamePrefix" : this.bHasAppNamePrefix,
        "bHasSquareBracket" : this.bHasSquareBracket,
        "sConcatStr" : this.sConcatStr,
        "sSepar" : this.sSepar,
        "sLogType" : this.sLogType
    };
};
tars.LogInfo.prototype.readFromObject = function(json) { 
    json.hasOwnProperty("appname") && (this.appname = json.appname);
    json.hasOwnProperty("servername") && (this.servername = json.servername);
    json.hasOwnProperty("sFilename") && (this.sFilename = json.sFilename);
    json.hasOwnProperty("sFormat") && (this.sFormat = json.sFormat);
    json.hasOwnProperty("setdivision") && (this.setdivision = json.setdivision);
    json.hasOwnProperty("bHasSufix") && (this.bHasSufix = json.bHasSufix);
    json.hasOwnProperty("bHasAppNamePrefix") && (this.bHasAppNamePrefix = json.bHasAppNamePrefix);
    json.hasOwnProperty("bHasSquareBracket") && (this.bHasSquareBracket = json.bHasSquareBracket);
    json.hasOwnProperty("sConcatStr") && (this.sConcatStr = json.sConcatStr);
    json.hasOwnProperty("sSepar") && (this.sSepar = json.sSepar);
    json.hasOwnProperty("sLogType") && (this.sLogType = json.sLogType);
};
tars.LogInfo.prototype.toBinBuffer = function () {
    var os = new TarsStream.TarsOutputStream();
    this._writeTo(os);
    return os.getBinBuffer();
};
tars.LogInfo.new = function () {
    return new tars.LogInfo();
};
tars.LogInfo.create = function (is) {
    return tars.LogInfo._readFrom(is);
};


var __tars_Log$logger$EN = function (app, server, file, format, buffer) {
    var os = new TarsStream.TarsOutputStream();
    os.writeString(1, app);
    os.writeString(2, server);
    os.writeString(3, file);
    os.writeString(4, format);
    os.writeList(5, buffer);
    return os.getBinBuffer();
};

var __tars_Log$logger$DE = function (data) {
    try {
        return {
            "request" : data.request,
            "response" : {
                "costtime" : data.request.costtime
            }
        };
    } catch (e) {
        throw {
            "request" : data.request,
            "response" : {
                "costtime" : data.request.costtime,
                "error" : {
                    "code" : TarsError.CLIENT.DECODE_ERROR,
                    "message" : e.message
                }
            }
        };
    }
};

var __tars_Log$logger$ER = function (data) {
    throw {
        "request" : data.request,
        "response" : {
            "costtime" : data.request.costtime,
            "error" : data.error
        }
    }
};

tars.LogProxy.prototype.logger = function (app, server, file, format, buffer) {
    return this._worker.tars_invoke("logger", __tars_Log$logger$EN(app, server, file, format, buffer), arguments[arguments.length - 1]).then(__tars_Log$logger$DE, __tars_Log$logger$ER);
};

var __tars_Log$loggerbyInfo$EN = function (info, buffer) {
    var os = new TarsStream.TarsOutputStream();
    os.writeStruct(1, info);
    os.writeList(2, buffer);
    return os.getBinBuffer();
};

var __tars_Log$loggerbyInfo$DE = function (data) {
    try {
        return {
            "request" : data.request,
            "response" : {
                "costtime" : data.request.costtime
            }
        };
    } catch (e) {
        throw {
            "request" : data.request,
            "response" : {
                "costtime" : data.request.costtime,
                "error" : {
                    "code" : TarsError.CLIENT.DECODE_ERROR,
                    "message" : e.message
                }
            }
        };
    }
};

var __tars_Log$loggerbyInfo$ER = function (data) {
    throw {
        "request" : data.request,
        "response" : {
            "costtime" : data.request.costtime,
            "error" : data.error
        }
    }
};

tars.LogProxy.prototype.loggerbyInfo = function (info, buffer) {
    return this._worker.tars_invoke("loggerbyInfo", __tars_Log$loggerbyInfo$EN(info, buffer), arguments[arguments.length - 1]).then(__tars_Log$loggerbyInfo$DE, __tars_Log$loggerbyInfo$ER);
};



