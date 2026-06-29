import { UserModel } from "src/domain/models";

export type SignUpResponse = Pick<
  UserModel,
  | 'id'
  | 'name'
  | 'email'
  | 'phoneNumber'
>;