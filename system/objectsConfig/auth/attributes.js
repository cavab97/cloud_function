export const auth = {
  customClaims: {
    role: {
      director: false,
      executive: false,
      admin: false,
      user: true
    },
    accessLevel: 50,
    plan: null
  },
  disabled: false,
  displayName: null,
  email: null,
  emailVerified: false,
  metadata: {},
  passwordHash: null,
  passwordSalt: null,
  phoneNumber: null,
  photoURL: null,
  providerData: [],
  tenantId: null,
  tokensValidAfterTime: null,
  uid: null
};
