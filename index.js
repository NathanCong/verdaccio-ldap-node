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
  // 1.Create LDAP client
  const client = ldapjs.createClient({
    url: (_this._config || {}).ldapUrl,
    timeout: 5000,
    connectTimeout: 5000,
    reconnect: false,
  });
  // 2.Check LDAP connection
  client.on('error', function(err) {
    _this._logger.warn({ username, err }, `verdaccio-ldap-node error ${err}`);
    callback(null, false);
  });
  client.on('connect', function() {
    // 3.Check username & password
    client.bind(`${username}@xdf.cn`, password, function(err) {
      if (err) {
        _this._logger.warn({ username, err }, `verdaccio-ldap-node error ${err}`);
        callback(null, false);
      } else {
        client.unbind();
        callback(null, [username]);
      }
      client.destroy();
    });
  });
};

module.exports = Auth;
