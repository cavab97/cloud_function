import { database } from "../../utils/helper";

export const db = database.database;
export const GeoPoint = database.GeoPoint;
export const Time = database.time;

export function create({ objectName, objectId = null, objectData = {}, createdByUid = null }) {
  console.log("object");
  return new Promise((resolve, reject) => {
    database
      .createObject({ objectName, objectId, objectData, createdByUid })
      .then((result) => {
        return resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function createObjectsWithRelation({
  objectName,
  objectData = [],
  createdByUid = null,
  relatedParties = [{ partyName: null, partyId: null, partyData: null }],
}) {
  return new Promise((resolve, reject) => {
    database
      .createObjectsWithRelation({
        objectName,
        objectData,
        createdByUid,
        relatedParties,
      })
      .then((result) => {
        return resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function createWithRelation({
  objectName,
  objectId = null,
  objectData = {},
  createdByUid = null,
  relatedParties = [{ partyName: null, partyId: null, partyData: null }],
  subjectObjectRelation = {},
}) {
  return new Promise((resolve, reject) => {
    database
      .createObjectWithRelation({
        objectName,
        objectId,
        objectData,
        createdByUid,
        relatedParties,
        subjectObjectRelation,
      })
      .then((result) => {
        return resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function update({
  objectName = null,
  objectId = null,
  objectData = {},
  objectArrayUnionData = {},
  objectArrayRemoveData = {},
  updatedByUid = null,
}) {
  return new Promise((resolve, reject) => {
    database
      .updateObject({
        objectName,
        objectId,
        objectData,
        objectArrayUnionData,
        objectArrayRemoveData,
        updatedByUid,
      })
      .then((result) => {
        return resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function remove({ objectName = null, objectId = null, deletedByUid = null }) {
  return new Promise((resolve, reject) => {
    database
      .deleteObject({ objectName, objectId, deletedByUid })
      .then((result) => {
        return resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function restore({ objectName = null, objectId = null }) {
  return new Promise((resolve, reject) => {
    database
      .restoreObject({ objectName, objectId })
      .then((result) => {
        return resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function read({ objectName = null, objectIds = [], dataCategory = "Private0" }) {
  console.log("name+id+datacat: " + objectName + dataCategory);
  console.log("objid: " + JSON.stringify(objectIds));
  return new Promise((resolve, reject) => {
    database
      .readObjects({ objectName, objectIds, dataCategory })
      .then((result) => {
        console.log("result: " + JSON.stringify(result));
        return resolve(result);
      })
      .catch((error) => {
        console.log("error read: " + error);
        reject(error);
      });
  });
}

export function readRelatedObjects({
  subjectName = null,
  subjectIds = [],
  objectName = null,
  directObjectName = null,
  directObjectIds = [],
}) {
  return new Promise((resolve, reject) => {
    database
      .readRelatedObjects({
        subjectName,
        subjectIds,
        objectName,
        directObjectName,
        directObjectIds,
      })
      .then((result) => {
        return resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function createRelation({
  subjectName = null,
  subjectIds = [],
  objectName = null,
  objectIds = [],
  directObjectName = null,
  directObjectIds = [],
  subjectObjectRelation = {},
}) {
  return new Promise((resolve, reject) => {
    database
      .createSubjectObjectRelation({
        subjectName,
        subjectIds,
        objectName,
        objectIds,
        directObjectName,
        directObjectIds,
        subjectObjectRelation,
      })
      .then((result) => {
        return resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function fanOutToRelation({
  objectName = null,
  objectId = null,
  objectBeforeData = {},
  objectAfterData = {},
  objectAttributes = {},
  fanOutTargetObjectNames = [],
}) {
  return new Promise((resolve, reject) => {
    database
      .fanOutObject({
        objectName,
        objectId,
        objectBeforeData,
        objectAfterData,
        objectAttributes,
        fanOutTargetObjectNames,
      })
      .then((result) => {
        return resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function distributeObject({
  objectName = null,
  objectId = null,
  objectData = {},
  parties = [{ partyName: null, partyId: null }],
}) {
  return new Promise((resolve, reject) => {
    database
      .distributeObject({
        objectName,
        objectId,
        objectData,
        parties,
      })
      .then((result) => {
        return resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
