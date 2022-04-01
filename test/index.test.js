"use strict";

const Auth = require('../index');

const config = {
  ldapUrl: 'ldap://172.24.210.11:389',
};

const stuff = {
  logger: console,
};

const auth = new Auth(config, stuff);

auth.authenticate('congyunan', 'xxx', function() {});
