export default function attributes({
  name = null,
  absoluteDeveloper = [],
  developer = [],
  director = [],
  Executive = [],
  admin = [],
  android = {
    latestVersion: null,
    latestVersionDescription: null,
    playstoreUrl: null,
    updated : {
      at:null,
      by:null
    },
    forceUpdate:false,
  },
  ios = {
    latestVersion: null,
    latestVersionDescription: null,
    appstoreUrl: null,
    updated : {
      at:null,
      by:null
    },
    forceUpdate:false,
  },
  web = {
    latestVersion: null,
    latestVersionDescription: null,
    webUrl: null,
    updated : {
      at:null,
      by:null
    },
    forceUpdate:false,
  },
  created = {
    at: null,
    by: null
  },
  deleted = {
    at: null,
    by: null
  },
  updated = {
    at: null,
    by: null
  },
  id = null
}) {
  const packaging = {
    id,
    name,
    android,
    ios,
    web,
    absoluteDeveloper,
    developer,
    director,
    Executive,
    admin,
    created,
    deleted,
    updated
  };

  const shared = {
    ...packaging
  };

  const confidential = {
    ...shared
  };

  return { packaging, shared, confidential };
}
