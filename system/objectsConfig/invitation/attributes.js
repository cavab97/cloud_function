export default function attributes({
  title = null,
  type = null,
  action = null,
  subjectName = null,
  subjectIds = [],
  directObjectName = null,
  directObjectIds = [],
  canceled = false,
  accepted = false,
  rejected = false,
  created = {
      at : null,
      by : null
  },
  deleted = {
      at : null,
      by : null
  },
  updated = {
      at : null,
      by : null
  },
  id = null
}){
  const packaging = {
    id,
    title,
    type,
    action,
    canceled,
    accepted,
    rejected,
    created,
    deleted,
    updated,
    subjectName,
    subjectIds,
    directObjectName,
    directObjectIds,
  };
  const shared = {
    ...packaging,
  };

  const confidential = {
    ...shared
  };

  return { packaging, shared, confidential };
}
