import { createContext, useContext, createSignal, onMount, ParentComponent } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";

type AuthContextType = {
  loggedUser: userLogged;
  setLoggedUser: SetStoreFunction<userLogged>;
};

type userLogged = {
  email: string;
  isAuth: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: ParentComponent = (props) => {
  const [loggedUser, setLoggedUser] = createStore({ email: "", isAuth: false });

  return <AuthContext.Provider value={{ loggedUser, setLoggedUser }}>{props.children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Authenticate must be used within an AuthProvider");
  return context;
};
