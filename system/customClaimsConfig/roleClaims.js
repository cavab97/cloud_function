export const roleClaims = {
  user: {
    role: {
      absoluteDeveloper: false,
      developer: false,
      director: false,
      executive: false,
      admin: false,
      user: true
    },
    accessLevel: 50,
  },
  admin: {
    role: {
      absoluteDeveloper: false,
      developer: false,
      director: false,
      executive: false,
      admin: true,
      user: true
    },
    accessLevel: 60,
  },
  executive: {
    role: {
      absoluteDeveloper: false,
      developer: false,
      director: false,
      executive: true,
      admin: true,
      user: true
    },
    accessLevel: 70,
  },
  director: {
    role: {
      absoluteDeveloper: false,
      developer: false,
      director: true,
      executive: true,
      admin: true,
      user: true
    },
    accessLevel: 80,
  },
  developer: {
    role: {
      absoluteDeveloper: false,
      developer: true,
      director: true,
      executive: true,
      admin: true,
      user: true
    },
    accessLevel: 90,
  },
  absoluteDeveloper: {
    role: {
      absoluteDeveloper: true,
      developer: true,
      director: true,
      executive: true,
      admin: true,
      user: true
    },
    accessLevel: 100,
  }
};
