import { UserModel } from "src/domain/models";
import { SignUpResponse } from "../responses/sign-up.response";

export function mapToSignUpResponse(user: UserModel): SignUpResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phoneNumber: user.phoneNumber,
  };
}