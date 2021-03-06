# parse-server-ovh-storage-adapter
parse-server adapter for Object storage (OVH Cloud Storage, OpenStack "Swift" )

**This adapter is writen for project DIVA APPS.**


# installation

`npm install --save parse-server-ovh-storage-adapter`

Or 

`yarn add parse-server-ovh-storage-adapter`

# Usage with parse-server

### Using a config file

```
{
  "appId": 'my_app_id',
  "masterKey": 'my_master_key',
  // other options
  "filesAdapter": {
    "module": "parse-server-ovh-storage-adapter",
    "options": {
      region:   OVH_REGION,
      container:OVH_CONTAINER,
      username: OVH_USERNAME,
      password: OVH_PASSWORD,
      authURL:  OVH_AUTH_URL,
      tenantId: OVH_TENANT_ID,
      baseUrl:  OVH_BASE_URL
    }
  }
}
```

### Passing as an instance

```
var OVHAdapter = require('parse-server-ovh-storage-adapter');

const fileOVHAdapter = new OVHAdapter({
      region:   OVH_REGION,
      container:OVH_CONTAINER,
      username: OVH_USERNAME,
      password: OVH_PASSWORD,
      authURL:  OVH_AUTH_URL,
      tenantId: OVH_TENANT_ID,
      baseUrl:  OVH_BASE_URL
});

var api = new ParseServer({
	appId: 'my_app',
	masterKey: 'master_key',
	filesAdapter: fileOVHAdapter
})
```

Key  | Sample value
------------- | -------------
OVH_REGION  | `SBG1`
OVH_CONTAINER  | `CONTAINER/SubFolder`
OVH_USERNAME | `Username`
OVH_PASSWORD | `Password`
OVH_AUTH_URL | `https://auth.cloud.ovh.net/v2.0/`
OVH_TENANT_ID | `abcxyzmnqrty`
OVH_BASE_URL | `https://storage.sbg1.cloud.ovh.net/v1/AUTH_abcxyzmnqrty/CONTAINER/SubFolder`

