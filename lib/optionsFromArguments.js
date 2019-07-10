'use strict';

const DEFAULT_OVH_REGION = 'SBG1';

function requiredOrFromEnvironment(options, key, env) {
  options[key] = options[key] || process.env[env];
  if (!options[key]) {
    throw `OVHAdapter requires option '${key}' or env. variable ${env}`;
  }
  return options;
}

function fromEnvironmentOrDefault(options, key, env, defaultValue) {
  options[key] = options[key] || process.env[env] || defaultValue;
  // If we used the overrides,
  // make sure they take priority
  if(options.OVHoverrides){
    if(options.OVHoverrides[key]){
      options[key] = options.OVHoverrides[key];
    }else if (options.OVHoverrides.params && options.OVHoverrides.params.Container) {
      options.container = options.OVHoverrides.params.Container;
    }
  }
  return options;
}

function fromOptionsDictionaryOrDefault(options, key, defaultValue) {
  options[key] = options[key] || defaultValue;
  return options;
}

const optionsFromArguments = function optionsFromArguments(args) {
  const stringOrOptions = args[0];
  let options = {};
  let OVHoverrides = {};
  let otherOptions;

  if (typeof stringOrOptions == 'string') {
    if (args.length == 1) {
      options.container = stringOrOptions;
    } else if (args.length == 2) {
      options.container = stringOrOptions;
      if (typeof args[1] != 'object') {
        throw new Error('Failed to configure OVHAdapter. Arguments don\'t make sense');
      }
      otherOptions = args[1];
    } else if (args.length > 2) {
      if (typeof args[1] != 'string' || typeof args[2] != 'string') {
        throw new Error('Failed to configure OVHAdapter. Arguments don\'t make sense');
      }
      options.username = args[0];
      options.password = args[1];
      options.container = args[2];
      options.tenantId = args[3];
      otherOptions = args[4];
    }
    if (otherOptions) {
      options.debug = otherOptions.debug;
      options.authURL = otherOptions.authURL;
    }
  } else {
    if (args.length == 1) {
      Object.assign(options, stringOrOptions);
    } else if (args.length == 2) {
      Object.assign(options, stringOrOptions);
      OVHoverrides = args[1];

      if (OVHoverrides.params) {
        options.container = OVHoverrides.params.Container;
      }
    } else if (args.length > 2) {
      throw new Error('Failed to configure OVHAdapter. Arguments don\'t make sense');
    }
  }

  options = fromOptionsDictionaryOrDefault(options, 'OVHoverrides', OVHoverrides);
  options = requiredOrFromEnvironment(options, 'container', 'OVH_CONTAINER');
  options = fromEnvironmentOrDefault(options, 'username', 'OVH_USERNAME', null);
  options = fromEnvironmentOrDefault(options, 'password', 'OVH_PASSWORD', null);
  options = fromEnvironmentOrDefault(options, 'region', 'OVH_REGION', DEFAULT_OVH_REGION);
  options = fromEnvironmentOrDefault(options, 'debug', 'OVH_DEBUG', false);
  options = fromEnvironmentOrDefault(options, 'tenantId', 'OVH_TENANT_ID', null);
  options = fromEnvironmentOrDefault(options, 'authURL', 'OVH_AUTH_URL', 'https://auth.cloud.ovh.net/v2.0/');

  return options;
}

module.exports = optionsFromArguments;
