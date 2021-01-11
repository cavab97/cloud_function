export default function attributes({
  role = {
    absoluteDeveloper: false,
    developer: false,
    director: false,
    executive: false,
    admin: false,
    merchant: false,
    user: true,
  },
  accessLevel = 50,
  plan = null,
  disabled = false,
  displayName = null,
  name = { firstName: null, lastName: null },
  address = {
    line1: null,
    line2: null,
    postcode: null,
    state: null,
    country: null,
  },
  dateOfBirth = null,
  gender = null,
  username = null,
  email = null,
  emailVerified = false,
  identityNumber = null,
  phoneNumber = null,
  notificationToken = [null],
  photoURL = null,
  providerId = null,
  lastLoginAt = null,
  created = { at: null, by: null },
  deleted = { at: null, by: null },
  updated = { at: null, by: null },
  shopIds = [null],
  id = null,
}) {
  const packaging = {
    id,
    name,
    displayName,
    photoURL,
    notificationToken,
    role,
    shopIds,
    created,
    deleted,
    updated,
  };

  const shared = {
    ...packaging,
    gender,
  };

  const confidential = {
    ...shared,
    username,
    dateOfBirth,
    address,
    email,
    phoneNumber,
    identityNumber,
    providerId,
    lastLoginAt,
    accessLevel,
    plan,
    disabled,
    emailVerified,
  };

  const receivableState = {
    displayName,
    name,
    address,
    dateOfBirth,
    identityNumber,
    gender,
    email,
    phoneNumber,
    notificationToken,
    photoURL,
    role,
    shopIds,
  };

  const manualUpdatableState = {
    confidential: {
      displayName,
      name,
      address,
      dateOfBirth,
      identityNumber,
      gender,
      email,
      photoURL,
      shopIds,
    },
  };

  const notificationTokenState = {
    confidential: {},
  };

  return {
    packaging,
    shared,
    confidential,
    receivableState,
    manualUpdatableState,
    notificationTokenState,
  };
}
