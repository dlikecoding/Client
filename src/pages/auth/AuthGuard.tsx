import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";

const AuthGuard = (props: any) => {
  const navigate = useNavigate();

  onMount(async () => {
    const response = await fetch("/api/v1/auth/check", { credentials: "include" });
    if (!response.ok) navigate("/login", { replace: true });
  });

  return props.children; // Render content only if authenticated
};

export default AuthGuard;
