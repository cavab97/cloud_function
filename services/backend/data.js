import * as httpUtils from "../../utils/http";

export function validation({ target = {}, reference = {} }) {
  console.log("data");
  if (Array.isArray(target) && target.length !== 0) {
    target.forEach((field, index) => {
      if (typeof field !== typeof reference[0]) {
        if (typeof field === "string" && reference[0] === null) {
          return null;
        }
        throw new Object({
          code: httpUtils.FunctionsErrorCode.failedPrecondition,
          message: `${field} invalid data type.`,
        });
      } else if (field && typeof field === "object") {
        validation({ target: field, reference: reference[0] });
      }
      return null;
    });
  } else if (target && typeof target === "object") {
    Object.keys(target).forEach((field) => {
      const targetKey = target[field];
      const referenceKey = reference[field];

      if (typeof targetKey !== typeof referenceKey) {
        if (typeof targetKey === "string" && referenceKey === null) {
          return null;
        }
        throw new Object({
          code: httpUtils.FunctionsErrorCode.failedPrecondition,
          message: `${field} invalid data type.`,
        });
      } else if (targetKey && typeof targetKey === "object") {
        validation({ target: targetKey, reference: referenceKey });
      }
      return null;
    });
  }
}

export function objectNotExist({ message = "Object does not found" }) {
  throw new Object({
    code: httpUtils.FunctionsErrorCode.notFound,
    message,
  });
}

export function objectExist({ message = "Object already existed" }) {
  throw new Object({
    code: httpUtils.FunctionsErrorCode.alreadyExists,
    message,
  });
}

export function objectExhausted({ message = "Number of object already exceed fixed value." }) {
  throw new Object({
    code: httpUtils.FunctionsErrorCode.resourceExhausted,
    message,
  });
}

export function invalidArgument({ message = "Invalid Argument." }) {
  throw new Object({
    code: httpUtils.FunctionsErrorCode.invalidArgument,
    message,
  });
}

export function unavailable({ message = "Currently unavailable." }) {
  throw new Object({
    code: httpUtils.FunctionsErrorCode.unavailable,
    message,
  });
}

export function deadlineExceeded({ message = "Deadline exceeded." }) {
  throw new Object({
    code: httpUtils.FunctionsErrorCode.deadlineExceeded,
    message,
  });
}
