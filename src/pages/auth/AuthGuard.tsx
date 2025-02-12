import { useNavigate } from "@solidjs/router";
import { createEffect } from "solid-js";

const AuthGuard = (props: any) => {
  const navigate = useNavigate();

  createEffect(() => {
    const user = true; //localStorage.getItem("user");
    if (!user) {
      navigate("/login", { replace: true }); // Redirect unauthenticated users
    }
  });

  return props.children; // Render content only if authenticated
};

export default AuthGuard;
