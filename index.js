/**
 * verdaccio-ldap
 */
'use strict';

const LdapClient = require('node-ldap');

function Auth(config, stuff) {
  const self = Object.create(Auth.prototype);
  self._users = {};
  // config for this module
  self._config = config;
  // verdaccio logger
  self._logger = stuff.logger;
  // pass verdaccio logger to ldapauth
  self._config.client_options.log = stuff.logger;
  // initial ldapUrl
  self._config.client_options.ldapUrl = '';
  return self;
}

Auth.prototype.authenticate = function(username, password, callback) {
  // initial LDAP client
  const client = new LdapClient(this._config.client_options);
  // start auth
  client.auth(`${username}@xdf.cn`, password)
    .then(function() {
      callback(null, [ username ]);
    })
    .catch(function(error) {
      this._logger.warn({ username, error }, `verdaccio-ldap error ${error}`);
      callback(null, false);
    })
    .finally(function() {
      client.disconnect();
    });
};

module.exports = Auth;
