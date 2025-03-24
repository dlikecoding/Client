import { createContext, useContext, JSX, ParentComponent } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";

type AuthContextType = {
  loggedUser: UserLogged;
  setLoggedUser: SetStoreFunction<UserLogged>;
};

type UserLogged = {
  userEmail: string;
  userName: string;
  roleType: "user" | "admin";
  status: "active" | "suppended";
};

const defaultUser: UserLogged = {
  userEmail: "",
  userName: "",
  roleType: "user",
  status: "suppended",
};

const AuthContext = createContext<AuthContextType>(undefined);

export const AuthProvider: ParentComponent = (props) => {
  const [loggedUser, setLoggedUser] = createStore<UserLogged>(defaultUser);

  return <AuthContext.Provider value={{ loggedUser, setLoggedUser }}>{props.children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Authenticate must be used within an AuthProvider");
  return context;
};
