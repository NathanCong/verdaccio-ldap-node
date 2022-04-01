/**
 * verdaccio-ldap-node
 */
'use strict';

const ldapjs = require('ldapjs');

function Auth(config, stuff) {
  const _this = Object.create(Auth.prototype);
  _this._users = {};
  _this._config = config; // config for this module
  _this._logger = stuff.logger; // verdaccio logger
  return _this;
}

Auth.prototype.authenticate = function(username, password, callback) {
  const _this = this;
  // 1.Initial LDAP client
  const client = ldapjs.createClient({
    url: (_this._config || {}).ldapUrl,
    timeout: 2000,
    connectTimeout: 2000,
    reconnect: false,
  });
  // 2.Check username & password
  client.bind(`${username}@xdf.cn`, password, function(err) {
    if (err) {
      _this._logger.warn({ username, err }, `verdaccio-ldap-node error ${err}`);
      callback(null, false);
      return;
    }
    client.unbind();
    callback(null, [username]);
  });
};

module.exports = Auth;
