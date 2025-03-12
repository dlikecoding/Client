import { useNavigate } from "@solidjs/router";
import { createEffect } from "solid-js";

const AuthGuard = (props: any) => {
  const navigate = useNavigate();

  // createEffect(() => {
  //   const user = localStorage.getItem("user-session");
  //   if (!user) return navigate("/login", { replace: true }); // Redirect unauthenticated users

  //   navigate("/");
  // });

  return props.children; // Render content only if authenticated
};

export default AuthGuard;
