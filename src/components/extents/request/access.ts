import { AuthenticationResponseJSON, startAuthentication } from "@simplewebauthn/browser";
import { UserLogged } from "../../../context/AuthProvider";
import { authHelper } from "./fetching";

export const authenticateUser = async (user: UserLogged) => {
  try {
    const options: any = await authHelper(`/api/v1/auth/init-auth?email=${user.userEmail}`);
    if (!options) return false;

    let authenticationJSON: AuthenticationResponseJSON;
    try {
      authenticationJSON = await startAuthentication({ optionsJSON: options });
    } catch (e) {
      return false;
    }

    if (authenticationJSON) return true;
    return false;
  } catch (error) {
    console.error("Authentication failed", error);
    alert("Authentication failed. Please try again.");
    return false;
  }
};
