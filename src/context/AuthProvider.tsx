import { createContext, useContext, JSX, ParentComponent, onMount, onCleanup } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";

type AuthContextType = {
  loggedUser: UserLogged;
  setLoggedUser: SetStoreFunction<UserLogged>;
};

export type UserLogged = {
  userId: string;
  userEmail: string;
  userName: string;
  roleType: "user" | "admin";
  status: "active" | "suppended";
};

const defaultUser: UserLogged = {
  userId: "",
  userEmail: "",
  userName: "",
  roleType: "user",
  status: "suppended",
};

const AuthContext = createContext<AuthContextType>(undefined);

export const AuthProvider: ParentComponent = (props) => {
  const [loggedUser, setLoggedUser] = createStore<UserLogged>(defaultUser);

  if (import.meta.env.VITE_DEV_MODE !== "dev") {
    // Prevent user use right click on website
    onMount(() => {
      document.addEventListener("contextmenu", (e) => e.preventDefault());
    });

    onCleanup(() => {
      document.removeEventListener("contextmenu", (e) => e.preventDefault());
    });
  }

  return <AuthContext.Provider value={{ loggedUser, setLoggedUser }}>{props.children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Authenticate must be used within an AuthProvider");
  return context;
};
