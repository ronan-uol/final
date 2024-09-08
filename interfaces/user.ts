export interface User {
  name: string;
  email: string;
  password: string;
  lastSignIn: string;
  createdOn: string;
  partnershipId: string;
}

export interface UserWithId extends Omit<User, "password"> {
  id: string;
}

export interface PartnerWithId extends UserWithId {
  partnerId: string;
}
