/**
 * verdaccio-ldap-node
 */
"use strict";

const LdapClient = require("node-ldap");

function Auth(config, stuff) {
  const _this = Object.create(Auth.prototype);
  _this._users = {};
  // config for this module
  _this._config = config;
  // verdaccio logger
  _this._logger = stuff.logger;
  return _this;
}

Auth.prototype.authenticate = function (username, password, callback) {
  const _this = this;
  // initial LDAP client
  const client = new LdapClient(_this._config);
  // start auth
  client
    .auth(`${username}@xdf.cn`, password)
    .then(function () {
      callback(null, [username]);
    })
    .catch(function (error) {
      _this._logger.warn({ username, error }, `verdaccio-ldap error ${error}`);
      callback(null, false);
    })
    .finally(function () {
      client.disconnect();
    });
};

module.exports = Auth;
