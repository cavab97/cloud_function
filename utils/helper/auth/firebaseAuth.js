import admin from "firebase-admin";

const auth = admin.auth;

export function getUserByUid({ uid = null }) {
  console.log("getUserByUid");
  return new Promise((resolve, reject) => {
    return auth()
      .getUser(uid)
      .then((user) => {
        return resolve(user);
      })
      .catch((error) => {
        return reject(error);
      });
  });
}

export function getUserByEmail({ email = null }) {
  return new Promise((resolve, reject) => {
    return auth()
      .getUserByEmail(email)
      .then((user) => {
        return resolve(user);
      })
      .catch((error) => {
        return reject(error);
      });
  });
}

export function setCustomUserClaims({ uid, customClaims }) {
  return new Promise((resolve, reject) => {
    return auth()
      .setCustomUserClaims(uid, customClaims)
      .then(() => {
        return resolve({ status: "Custom claims set successfully" });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function updateCustomUserClaims({ uid, customClaims }) {
  return new Promise(async (resolve, reject) => {
    const user = await auth().getUser(uid);
    const previousClaims = user.customClaims;
    const updatedClaims = { previousClaims, ...customClaims };

    return setCustomUserClaims({ uid, customClaims: updatedClaims })
      .then((result) => {
        return resolve(result);
      })
      .catch((error) => {
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
  disabled = false,
}) {
  return new Promise((resolve, reject) => {
    return auth()
      .createUser({
        email,
        emailVerified,
        phoneNumber,
        password,
        displayName,
        photoURL,
        disabled,
      })
      .then((user) => {
        return resolve(user);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function updateUser(uid, { email = null, displayName = undefined, photoURL = undefined }) {
  return new Promise((resolve, reject) => {
    return auth()
      .updateUser(uid, {
        email,
        displayName,
        photoURL,
      })
      .then((user) => {
        return resolve(user);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
