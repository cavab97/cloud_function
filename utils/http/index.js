import * as functions from "firebase-functions";

export function successResponse({
  objectName = null,
  ids = [],
  action = null,
  message = "Successed",
}) {
  const status = "Successed";
  console.log("successResponse");
  return {
    objectName,
    ids,
    status,
    action: `${action} ${objectName}`,
    message,
  };
}

export function failedResponse({
  code = FunctionsErrorCode.internal,
  objectName = null,
  ids = [],
  action = null,
  message = "Failed",
}) {
  const status = "Failed";

  new functions.https.HttpsError(code, message, {
    objectName,
    ids,
    status,
    action: `${action} ${objectName}`,
    message,
  });
}

export const FunctionsErrorCode = {
  ok: "ok",
  cancelled: "cancelled",
  unknown: "unknown",
  invalidArgument: "invalid-argument",
  deadlineExceeded: "deadline-exceeded",
  notFound: "not-found",
  alreadyExists: "already-exists",
  permissionDenied: "permission-denied",
  resourceExhausted: "resource-exhausted",
  failedPrecondition: "failed-precondition",
  aborted: "aborted",
  outOfRange: "out-of-range",
  unimplemented: "unimplemented",
  internal: "internal",
  unavailable: "unavailable",
  dataLoss: "data-loss",
  unauthenticated: "unauthenticated",
};
