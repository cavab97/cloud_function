export const system = {
  invite: {
    user: {
      asAdmin: ({
        subjectName = null,
        subjectIds = null,
        directObjectName = null,
        directObjectIds = null
      }) => {
        const relation = {
          subjectName,
          subjectIds,
          directObjectName,
          directObjectIds
        };
        return relation;
      }
    }
  }
};
