export default function attributes({
  id = null,

  userListRef = null,
  userIds = [],
  data = {
    objectName:null,
    objectId:null,
    action:null
  },
  title = null,
  body = null,
  ttl = null,
  expiration = null,
  priority = 'default', // 'default' | 'normal'| 'high'

  //ios
  subtitle = null,
  sound = 'default', // 'default' | null
  badge = 0,

  //android
  channelId =null,

  created = { at: null, by: null },
  deleted = { at: null, by: null },
  updated = { at: null, by: null },
}) {
  const packaging = {
    userListRef,
    userIds,
    data,
    title,
    body,
    ttl,
    expiration,
    priority,
    subtitle,
    sound,
    badge,
    channelId,


    created,
    deleted,
    updated,
    id,
  };

  const shared = {
    ...packaging,
  };

  const confidential = {
    ...shared,
  };

  return {
    packaging,
    shared,
    confidential
  };
}
