import { auth } from "../../utils/helper";

export function getUserByUid({uid = null}){
  return new Promise((resolve, reject) => {
    return auth
    .getUserByUid({uid})
      .then(user => {
        return resolve(user);
      })
      .catch(error => {
        return reject(error);
      });
  });
}

export function getUserByEmail({email = null}){
  return new Promise((resolve, reject) => {
    return auth
    .getUserByEmail({email})
      .then(user => {
        return resolve(user);
      })
      .catch(error => {
        return reject(error);
      });
  });
}

export function setCustomUserClaims({ uid, customClaims }) {
  return new Promise((resolve, reject) => {
    auth
      .setCustomUserClaims({ uid, customClaims })
      .then(({ status }) => {
        return resolve({ status });
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function updateCustomUserClaims({ uid, customClaims }) {
  return new Promise((resolve, reject) => {
    auth
      .updateCustomUserClaims({ uid, customClaims })
      .then((status) => {
        return resolve(status);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function createUser({
  email = null,
  emailVerified = false,
  phoneNumber = undefined,
  password = null,
  displayName = undefined,
  photoURL = undefined,
  disabled = false
}) {
  return new Promise((resolve, reject) => {
    return auth
      .createUser({
        email,
        emailVerified,
        phoneNumber,
        password,
        displayName,
        photoURL,
        disabled
      })
      .then(user => {
        return resolve(user);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function updateUser(uid,{
  email = null,
  displayName = undefined,
  photoURL = undefined
}) {
  return new Promise((resolve, reject) => {
    return auth
      .updateUser(uid,{
        email,
        displayName,
        photoURL,
      })
      .then(user => {
        return resolve(user);
      })
      .catch(error => {
        reject(error);
      });
  });
}