import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";
import { AuthProvider } from "../../context/AuthProvider";

const AuthGuard = (props: any) => {
  const navigate = useNavigate();

  // onMount(async () => {
  //   const response = await fetch("/api/v1/auth/check", { credentials: "include" });
  //   if (!response.ok) navigate("/login", { replace: true });
  // });

  return <AuthProvider>{props.children}</AuthProvider>;
};

export default AuthGuard;
