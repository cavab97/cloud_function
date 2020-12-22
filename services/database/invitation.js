import { database } from "../../utils/helper";

const objectName = "invitation";

export function create({ objectId = null, objectData = {}, createdByUid = null }) {
  console.log("invitation");
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

export function update({
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

export function createRelation({
  subjectName = null,
  subjectIds = [],
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

export function readInvitations({ objectIds = [] }) {
  return new Promise((resolve, reject) => {
    database
      .readObjects({ objectName, objectIds, dataCategory: "Private0" })
      .then((result) => {
        return resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
