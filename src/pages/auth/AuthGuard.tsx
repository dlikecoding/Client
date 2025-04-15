import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";
import { useAuthContext } from "../../context/AuthProvider";

const AuthGuard = (props: any) => {
  const navigate = useNavigate();
  const { setLoggedUser } = useAuthContext();
  onMount(async () => {
    const response = await fetch("/api/v1/user/verified", { credentials: "include" });
    if (!response.ok) return navigate("/login", { replace: true });
    try {
      const user = await response.json();
      if (!user.error) setLoggedUser(user);
    } catch (error) {
      console.log(error);
    }
  });

  return props.children;
};

export default AuthGuard;
