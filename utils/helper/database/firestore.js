import admin from "firebase-admin";

const firestore = admin.firestore;

export const database = firestore();

export const GeoPoint = (latitude, longitude) =>
  new firestore.GeoPoint(latitude, longitude);
export const time = firestore.Timestamp;

export function readData({ ref }) {
  return new Promise((resolve, reject) => {
    firestore()
      .doc(ref)
      .get()
      .then((snapshot) => {
        const exists = snapshot.exists;
        if (exists) {
          return resolve({ ...snapshot.data(), id: snapshot.id });
        } else {
          return resolve(null);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const readTable = ({ ref }) => firestore().collection(ref);

export function writeData({ ref, data }) {
  return new Promise((resolve, reject) => {
    firestore()
      .doc(ref)
      .set(data, { merge: true })
      .then((result) => {
        return resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function updateData({
  ref = null,
  data = {},
  arrayUnionData = {},
  arrayRemoveData = {},
}) {
  Object.keys(arrayUnionData).forEach((key) => {
    return (data = {
      ...data,
      [key]: firestore.FieldValue.arrayUnion(arrayUnionData[key]),
    });
  });

  Object.keys(arrayRemoveData).forEach((key) => {
    return (data = {
      ...data,
      [key]: firestore.FieldValue.arrayRemove(arrayRemoveData[key]),
    });
  });

  return new Promise((resolve, reject) => {
    firestore()
      .doc(ref)
      .update(data)
      .then((result) => {
        return resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function readObjects({
  objectName = null,
  objectIds = [],
  dataCategory = "",
}) {
  return new Promise((resolve, reject) => {
    const objectPromises = [];

    objectIds.forEach((objectId) => {
      const objectRef = `${objectName}${dataCategory}/${objectId}`;
      objectPromises.push(readData({ ref: objectRef }));
    });

    Promise.all(objectPromises)
      .then((objects) => resolve(objects))
      .catch((error) => {
        reject(error);
      });
  });
}

export function batchWrite(
  dataArray = [
    { operation: "set", ref: null, data: null, option: { merga: false } },
  ]
) {
  return new Promise(async (resolve, reject) => {
    try {
      const batchArray = [firestore().batch()];
      let operationCounter = 0;
      let batchIndex = 0;

      dataArray.forEach((dat) => {
        const { operation, ref, data, option = { merga: false } } = dat;
        batchArray[batchIndex][operation](ref, data, option);
        operationCounter++;

        if (operationCounter === 499) {
          batchArray.push(firestore().batch());
          batchIndex++;
          operationCounter = 0;
        }
      });

      const commitArray = batchArray.map((batch) => {
        return batch.commit();
      });

      const resultArray = await Promise.all(commitArray);

      resolve(resultArray);
    } catch (error) {
      reject(error);
    }
  });
}

export function createObjectsWithRelation({
  objectName = null,
  objectData = [],
  createdByUid = null,
  relatedParties = [{ partyName: null, partyId: null, partyData: null }],
}) {
  return new Promise((resolve, reject) => {
    const objectIds = [];
    const batchDataArray = [];

    objectData.forEach((objectData, index) => {
      let objectId = objectData.packaging.id;
      if (!objectId) {
        objectId = firestore().collection(`${objectName}Packaging0`).doc().id;
        objectIds[index] = objectId;
      }
  
      const objectPackagingRef = firestore().doc(
        `${objectName}Packaging0/${objectId}`
      );
      const objectPublicRef = firestore().doc(`${objectName}Public0/${objectId}`);
      const objectPrivateRef = firestore().doc(
        `${objectName}Private0/${objectId}`
      );
  
      let { packaging, shared, confidential } = objectData;
  
      packaging = {
        ...packaging,
        id: objectId,
        created: {
          at: time.now(),
          by: createdByUid,
        },
      };
      shared = { ...shared, ...packaging };
      confidential = { ...confidential, ...shared };
  
      batchDataArray.push({
        operation: "set",
        ref: objectPackagingRef,
        data: packaging,
        option: { merge: true },
      });
  
      batchDataArray.push({
        operation: "set",
        ref: objectPublicRef,
        data: shared,
        option: { merge: true },
      });
  
      batchDataArray.push({
        operation: "set",
        ref: objectPrivateRef,
        data: confidential,
        option: { merge: true },
      });
  
      relatedParties.forEach((party) => {
        const { partyName, partyId, partyData } = party;
  
        if (!partyName || !partyId) return null;
  
        const partyRef = firestore().doc(
          `${partyName}Packaging0/${partyId}/${objectName}Packaging0/${objectId}`
        );
  
        const objectRef = firestore().doc(
          `${objectName}Packaging0/${objectId}/${partyName}Packaging0/${partyId}`
        );
  
        const subjectObjectRelation = objectData.subjectObjectRelation;

        batchDataArray.push({
          operation: "set",
          ref: partyRef,
          data: { ...packaging, subjectObjectRelation },
          option: { merge: true },
        });
  
        batchDataArray.push({
          operation: "set",
          ref: objectRef,
          data: { ...partyData, subjectObjectRelation },
          option: { merge: true },
        });
        return null;
      });
    });

    return batchWrite(batchDataArray)
      .then((result) => {
        return resolve({
          objectIds,
          objectData,
          result,
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function createObjectWithRelation({
  objectName = null,
  objectId = null,
  objectData = {},
  createdByUid = null,
  relatedParties = [{ partyName: null, partyId: null, partyData: null }],
  subjectObjectRelation = {},
}) {
  return new Promise((resolve, reject) => {
    if (!objectId) {
      objectId = firestore().collection(`${objectName}Packaging0`).doc().id;
    }

    const objectPackagingRef = firestore().doc(
      `${objectName}Packaging0/${objectId}`
    );
    const objectPublicRef = firestore().doc(`${objectName}Public0/${objectId}`);
    const objectPrivateRef = firestore().doc(
      `${objectName}Private0/${objectId}`
    );

    let { packaging, shared, confidential } = objectData;

    packaging = {
      ...packaging,
      id: objectId,
      created: {
        at: time.now(),
        by: createdByUid,
      },
    };
    shared = { ...shared, ...packaging };
    confidential = { ...confidential, ...shared };

    const batchDataArray = [];

    batchDataArray.push({
      operation: "set",
      ref: objectPackagingRef,
      data: packaging,
      option: { merge: true },
    });

    batchDataArray.push({
      operation: "set",
      ref: objectPublicRef,
      data: shared,
      option: { merge: true },
    });

    batchDataArray.push({
      operation: "set",
      ref: objectPrivateRef,
      data: confidential,
      option: { merge: true },
    });

    relatedParties.forEach((party) => {
      const { partyName, partyId, partyData } = party;

      if (!partyName || !partyId) return null;

      const partyRef = firestore().doc(
        `${partyName}Packaging0/${partyId}/${objectName}Packaging0/${objectId}`
      );

      const objectRef = firestore().doc(
        `${objectName}Packaging0/${objectId}/${partyName}Packaging0/${partyId}`
      );

      batchDataArray.push({
        operation: "set",
        ref: partyRef,
        data: { ...packaging, subjectObjectRelation },
        option: { merge: true },
      });

      batchDataArray.push({
        operation: "set",
        ref: objectRef,
        data: { ...partyData, subjectObjectRelation },
        option: { merge: true },
      });
      return null;
    });

    return batchWrite(batchDataArray)
      .then((result) => {
        return resolve({
          objectId,
          objectData: { packaging, shared, confidential },
          result,
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function createObject({
  objectName,
  objectId = null,
  objectData = {},
  createdByUid = null,
}) {
  return new Promise((resolve, reject) => {
    if (!objectId) {
      objectId = firestore().collection(`${objectName}Packaging0`).doc().id;
    }
    const objectPackagingRef = firestore().doc(
      `${objectName}Packaging0/${objectId}`
    );
    const objectPublicRef = firestore().doc(`${objectName}Public0/${objectId}`);
    const objectPrivateRef = firestore().doc(
      `${objectName}Private0/${objectId}`
    );

    let { packaging, shared, confidential } = objectData;

    packaging = {
      ...packaging,
      id: objectId,
      created: {
        at: time.now(),
        by: createdByUid,
      },
    };
    shared = { ...shared, ...packaging };
    confidential = {
      ...confidential,
      ...shared,
    };

    // const objectBatch = firestore().batch();

    // objectBatch.set(objectPackagingRef, packaging, { merge: true });
    // objectBatch.set(objectPublicRef, shared, { merge: true });
    // objectBatch.set(objectPrivateRef, confidential, { merge: true });

    // objectBatch
    //   .commit()
    //   .then((result) => {
    //     return resolve({
    //       objectId,
    //       objectData: { packaging, shared, confidential },
    //       result,
    //     });
    //   })
    //   .catch((error) => {
    //     reject(error);
    //   });

    const batchDataArray = [];

    batchDataArray.push({
      operation: "set",
      ref: objectPackagingRef,
      data: packaging,
      option: { merge: true },
    });

    batchDataArray.push({
      operation: "set",
      ref: objectPublicRef,
      data: shared,
      option: { merge: true },
    });

    batchDataArray.push({
      operation: "set",
      ref: objectPrivateRef,
      data: confidential,
      option: { merge: true },
    });

    batchWrite(batchDataArray)
      .then((result) => {
        return resolve({
          objectId,
          objectData: { packaging, shared, confidential },
          result,
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function createSubjectObjectRelation({
  subjectName = null,
  subjectIds = [],
  objectName = null,
  objectIds = [],
  directObjectName = null,
  directObjectIds = [],
  subjectObjectRelation = {},
}) {
  return new Promise(async (resolve, reject) => {
    try {
      const dataCategory = "Packaging0";
      const readPromises = [];

      // const relationBatch = firestore().batch();
      const batchDataArray = [];

      readPromises.push(
        readObjects({
          objectName: subjectName,
          objectIds: subjectIds,
          dataCategory,
        })
      );
      readPromises.push(readObjects({ objectName, objectIds, dataCategory }));
      readPromises.push(
        readObjects({
          objectName: directObjectName,
          objectIds: directObjectIds,
          dataCategory,
        })
      );

      const [
        subjectPackagings,
        objectPackagings,
        directObjectPackagings,
      ] = await Promise.all(readPromises);

      subjectIds.forEach((subjectId) => {
        objectPackagings.forEach((objectPackaging, index) => {
          const subjectObjectPackagingRelationRef = firestore().doc(
            `${subjectName}Packaging0/${subjectId}/${objectName}Packaging0/${objectIds[index]}`
          );
          objectPackaging = { ...objectPackaging, subjectObjectRelation };
          batchDataArray.push({
            operation: "set",
            ref: subjectObjectPackagingRelationRef,
            data: objectPackaging,
          });
          // relationBatch.set(subjectObjectPackagingRelationRef, objectPackaging);
        });
      });

      objectIds.forEach((objectId) => {
        subjectPackagings.forEach((subjectPackaging, index) => {
          const objectSubjectPackagingRelationRef = firestore().doc(
            `${objectName}Packaging0/${objectId}/${subjectName}Packaging0/${subjectIds[index]}`
          );
          subjectPackaging = { ...subjectPackaging, subjectObjectRelation };

          batchDataArray.push({
            operation: "set",
            ref: objectSubjectPackagingRelationRef,
            data: subjectPackaging,
          });

          // relationBatch.set(
          //   objectSubjectPackagingRelationRef,
          //   subjectPackaging
          // );
        });

        directObjectPackagings.forEach((directObjectPackaging, index) => {
          const objectDirectObjectPackagingRelationRef = firestore().doc(
            `${objectName}Packaging0/${objectId}/${directObjectName}Packaging0/${directObjectIds[index]}`
          );
          directObjectPackaging = {
            ...directObjectPackaging,
            subjectObjectRelation,
          };

          batchDataArray.push({
            operation: "set",
            ref: objectDirectObjectPackagingRelationRef,
            data: directObjectPackaging,
          });

          // relationBatch.set(
          //   objectDirectObjectPackagingRelationRef,
          //   directObjectPackaging
          // );
        });
      });

      directObjectIds.forEach((directObjectId) => {
        objectPackagings.forEach((objectPackaging, index) => {
          const directObjectObjectPackagingRelationRef = firestore().doc(
            `${directObjectName}Packaging0/${directObjectId}/${objectName}Packaging0/${objectIds[index]}`
          );
          objectPackaging = { ...objectPackaging, subjectObjectRelation };

          batchDataArray.push({
            operation: "set",
            ref: directObjectObjectPackagingRelationRef,
            data: objectPackaging,
          });

          // relationBatch.set(
          //   directObjectObjectPackagingRelationRef,
          //   objectPackaging
          // );
        });
      });

      // return relationBatch.commit().then((result) => {
      //   return resolve(result);
      // });
      return batchWrite(batchDataArray).then((result) => {
        return resolve(result);
      });
    } catch (error) {
      return reject(error);
    }
  });
}

export function readRelatedObjects({
  subjectName = null,
  subjectIds = [],
  subjectDataCategory = "Packaging0",
  objectName = null,
  objectDataCategory = "Packaging0",
  directObjectName = null,
  directObjectIds = [],
}) {
  return new Promise(async (resolve, reject) => {
    try {
      const objectPromises = [];

      subjectIds.forEach((subjectId) => {
        const objectRef = `${subjectName}${subjectDataCategory}/${subjectId}/${objectName}${objectDataCategory}`;
        objectPromises.push(
          readTable({ ref: objectRef })
            .where(
              `subjectObjectRelation.${directObjectName}`,
              "array-contains-any",
              directObjectIds
            )
            .get()
        );
      });

      const objectSet = await Promise.all(objectPromises);

      const relatedObjects = [];

      objectSet.forEach((objects) => {
        const result = [];
        objects.forEach((object) => {
          result.push(object.data());
        });
        relatedObjects.push(result);
      });

      resolve(relatedObjects);
    } catch (error) {
      reject(error);
    }
  });
}

export function updateObject({
  objectName = null,
  objectId = null,
  objectData = {},
  objectArrayUnionData = {},
  objectArrayRemoveData = {},
  updatedByUid = null,
}) {
  return new Promise((resolve, reject) => {
    const objectPrivateRef = `${objectName}Private0/${objectId}`;

    let { packaging, shared, confidential } = objectData;

    delete confidential["created"];
    delete confidential["deleted"];
    delete confidential["updated"];

    objectData = {
      ...confidential,
      updated: {
        at: time.now(),
        by: updatedByUid,
      },
    };

    updateData({
      ref: objectPrivateRef,
      data: objectData,
      arrayUnionData: objectArrayUnionData,
      arrayRemoveData: objectArrayRemoveData,
    })
      .then((result) => {
        return resolve({
          objectId,
          objectData,
          result,
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function deleteObject({
  objectName = null,
  objectId = null,
  deletedByUid = null,
  additionUpdate = null
}) {
  return new Promise((resolve, reject) => {
    const objectPrivateRef = `${objectName}Private0/${objectId}`;

    const objectData = {
      ...additionUpdate,
      deleted: {
        at: time.now(),
        by: deletedByUid,
      },
    };

    updateData({
      ref: objectPrivateRef,
      data: objectData,
    })
      .then((result) => {
        return resolve({
          objectId,
          objectData,
          result,
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function restoreObject({ objectName = null, objectId = null }) {
  return new Promise((resolve, reject) => {
    const objectPrivateRef = `${objectName}Private0/${objectId}`;

    const objectData = {
      deleted: {
        at: null,
        by: null,
      },
    };

    updateData({
      ref: objectPrivateRef,
      data: objectData,
    })
      .then((result) => {
        return resolve({
          objectId,
          objectData,
          result,
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function fanOutObject({
  objectName = null,
  objectId = null,
  objectBeforeData = {},
  objectAfterData = {},
  objectAttributes = {},
  fanOutTargetObjectNames = [],
}) {
  return new Promise(async (resolve, reject) => {
    try {
      // const fanOutBatch = firestore().batch();

      const { packaging, shared, confidential } = objectAttributes;

      const changedObjectCategories = modifiedObjectDataCategories({
        objectBeforeData,
        objectAfterData,
        objectAttributes,
      });

      const { isPackagingChanged, isSharedChanged } = changedObjectCategories;

      const batchDataArray = [];

      if (isSharedChanged || isPackagingChanged) {
        const objectPublicRef = firestore().doc(
          `${objectName}Public0/${objectId}`
        );
        // fanOutBatch.set(objectPublicRef, shared);
        batchDataArray.push({
          operation: "set",
          ref: objectPublicRef,
          data: shared,
          option: { merge: true },
        });
      }

      if (isPackagingChanged) {
        const targetPromises = [];

        const objectPackagingRef = firestore().doc(
          `${objectName}Packaging0/${objectId}`
        );
        // fanOutBatch.set(objectPackagingRef, packaging);

        batchDataArray.push({
          operation: "set",
          ref: objectPackagingRef,
          data: packaging,
          option: { merge: true },
        });

        fanOutTargetObjectNames.forEach((targetObjectName) => {
          targetPromises.push(
            firestore()
              .collection(
                `${objectName}Packaging0/${objectId}/${targetObjectName}Packaging0`
              )
              .select()
              .get()
          );
        });

        const fanOutTargetObjectsSnapshot = await Promise.all(targetPromises);

        const fanOutTargetObjectIdSet = fanOutTargetObjectsSnapshot.map(
          (objectSnapshot) => {
            const objectIds = objectSnapshot.docs.map((doc) => {
              return doc.id;
            });
            return objectIds;
          }
        );

        fanOutTargetObjectNames.forEach((targetObjectName, index) => {
          fanOutTargetObjectIdSet[index].forEach((targetObjectId) => {
            const targetObjectRef = firestore().doc(
              `${targetObjectName}Packaging0/${targetObjectId}/${objectName}Packaging0/${objectId}`
            );
            // fanOutBatch.set(targetObjectRef, packaging);
            batchDataArray.push({
              operation: "set",
              ref: targetObjectRef,
              data: packaging,
              option: { merge: true },
            });
          });
        });
      }
      // return fanOutBatch.commit().then((result) => {
      //   return resolve(result);
      // });
      return batchWrite(batchDataArray).then((result) => {
        return resolve(result);
      });
    } catch (error) {
      return reject(error);
    }
  });
}

export function modifiedObjectDataCategories({
  objectBeforeData = {},
  objectAfterData = {},
  objectAttributes = {},
}) {
  const updatedFields = Object.keys(objectAfterData).map((fieldKey) => {
    if (
      JSON.stringify(objectAfterData[fieldKey]) !==
      JSON.stringify(objectBeforeData[fieldKey])
    ) {
      return fieldKey;
    }
    return null;
  });

  const deletedField = Object.keys(objectBeforeData).map((fieldKey) => {
    if (objectAfterData[fieldKey] === undefined) {
      return fieldKey;
    }
    return null;
  });

  const modifiedFields = [...updatedFields, ...deletedField];

  let modifiedDataCategories = {
    isPackagingChanged: false,
    isSharedChanged: false,
    isConfidentialChanged: false,
  };

  modifiedFields.forEach((field) => {
    if (field in objectAttributes.packaging) {
      modifiedDataCategories.isPackagingChanged = true;
    } else if (field in objectAttributes.shared) {
      modifiedDataCategories.isSharedChanged = true;
    } else if (field in objectAttributes.confidential) {
      modifiedDataCategories.isConfidentialChanged = true;
    }
  });

  return modifiedDataCategories;
}

export function distributeObject({
  objectName = null,
  objectId = null,
  objectData = {},
  parties = [{ partyName: null, partyId: null }],
}) {
  return new Promise((resolve, reject) => {
    
    if (!objectId) {
      return null
    }

    let { packaging, shared, confidential } = objectData;

    const batchDataArray = [];

    parties.forEach((party) => {
      const { partyName, partyId } = party;

      if (!partyName || !partyId) return null;

      const partyRef = firestore().doc(
        `${partyName}Packaging0/${partyId}/${objectName}Packaging0/${objectId}`
      );

      batchDataArray.push({
        operation: "set",
        ref: partyRef,
        data: { ...packaging },
        option: { merge: true },
      });

      return null;
    });

    return batchWrite(batchDataArray)
      .then((result) => {
        return resolve({
          objectId,
          objectData: { packaging, shared, confidential },
          result,
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}
