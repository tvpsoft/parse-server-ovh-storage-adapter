'use strict';
// OVHAdapter
//
// Stores Parse files in OVH Storage Object.

var OVHStorage = require('./lib/OVHObjectStorage');
var optionsFromArguments = require('./lib/optionsFromArguments');

// Creates an OVHStorage session.
// Providing OVHStorage usernale, password, tennantId and container are mandatory
// Region will use sane defaults if omitted
function OVHStorageAdapter() {
  var options = optionsFromArguments(arguments);
  this._region = options.region;
  this._container = options.container;
  this._username = options.username;
  this._password = options.password;
  this._authURL = options.authURL;
  this._tenantId = options.tenantId;
  this._baseUrl = options.baseUrl;

  let ovhOptions = {
    username: this._username,
    password: this._password,
    authURL:  this._authURL,
    tenantId: this._tenantId,
    region:   this._region
  };

  this._ovhClient = new OVHStorage(ovhOptions);
  this._hasContainer = false;
}

OVHStorageAdapter.prototype.createConnection = function() {
  var promise;
  if (this._hasContainer) {
    promise = Promise.resolve();
  } else {
    promise = new Promise((resolve) => {
      this._ovhClient.connection(() => {
        this._hasContainer = true;
        resolve();
      },(err) => {
        console.log("Not connected " + err);
      });
    });
  }
  return promise;
}

// For a given config object, filename, and data, store a file in OVH
// Returns a promise containing the OVH object creation response
OVHStorageAdapter.prototype.createFile = function(filename, data, contentType) {
  const nameToSave = this._container + filename;
  return this.createConnection().then(() => {
    return new Promise((resolve, reject) => {
      this._ovhClient.object().set(data, nameToSave, resolve, reject);
    });
  });
}

OVHStorageAdapter.prototype.deleteFile = function(filename) {
  return this.createConnection().then(() => {
    return new Promise((resolve, reject) => {
      const fileNameToDelete = this._container + filename;
      this._ovhClient.object().delete(fileNameToDelete, resolve, reject);
    });
  });
}

// Search for and return a file if found by filename
// Returns a promise that succeeds with the buffer result from S3
OVHStorageAdapter.prototype.getFileData = function(filename) {
  const fileNameToGet = this._container + filename;
  return this.createConnection().then(() => {
    return new Promise((resolve, reject) => {
      this._ovhClient.object().get(fileNameToGet, null, resolve, reject);
    });
  });
}

// Generates and returns the location of a file stored in S3 for the given request and filename
// The location is the direct S3 link if the option is set, otherwise we serve the file through parse-server
OVHStorageAdapter.prototype.getFileLocation = function(config, filename) {
  return (this._baseUrl + '/' + filename);
}

module.exports = OVHStorageAdapter;
module.exports.default = OVHStorageAdapter;
