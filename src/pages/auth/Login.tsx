import { A } from "@solidjs/router";
import styles from "./Guard.module.css";

const Login = () => {
  const errorMessage = "Error";
  return (
    <div class={styles.ring}>
      <i style={{ "--clr": "#0051ff" }}></i>
      <i style={{ "--clr": "#fb00ff" }}></i>
      <i style={{ "--clr": "#41de2f" }}></i>
      <form class={styles.login} action="/login" method="post">
        <h2>Login</h2>

        <p style={{ color: "red" }}>{errorMessage}</p>

        <div class={styles.inputBx}>
          <input type="text" name="username" placeholder="Username" autocomplete="off" required />
        </div>
        <div class={styles.inputBx}>
          <input type="password" name="password" placeholder="Password" autocomplete="off" required />
        </div>

        <div class={styles.inputBx}>
          <input type="submit" value="Sign in" />
        </div>
        <div class={styles.links}>
          <A href="#">Forget Password</A>
          <A href="/signup">Need an Account?</A>
        </div>
      </form>
    </div>
  );
};

export default Login;
