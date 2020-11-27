import * as authService from "../auth";
import * as httpUtils from "../../utils/http";

export function identityChecking({ uid = null, role = null }) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!uid) {
        throw new Object({
          code: httpUtils.FunctionsErrorCode.unauthenticated,
          message: "Authenticated needed.",
        });
      }

      if (!role) return resolve(null);

      const requester = await authService.getUserByUid({ uid });

      if (
        !requester.customClaims ||
        (requester.customClaims && !requester.customClaims.role[role])
      ) {
        throw new Object({
          code: httpUtils.FunctionsErrorCode.permissionDenied,
          message: "Insufficient permission to perform the action.",
        });
      }

      return resolve(requester);
    } catch (error) {
      return reject(error);
    }
  });
}
