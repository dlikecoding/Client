import { A } from "@solidjs/router";
import styles from "./Guard.module.css";

const Signup = () => {
  const errorMessage = "Error";
  return (
    <div class={styles.ring}>
      <i style={{ "--clr": "#0051ff" }}></i>
      <i style={{ "--clr": "#fb00ff" }}></i>
      <i style={{ "--clr": "#41de2f" }}></i>
      <form class={styles.login} action="/signup" method="post">
        <h2>Register</h2>

        <p style={{ color: "red" }}>{errorMessage}</p>

        <div class={styles.inputBx}>
          <input type="text" name="username" placeholder="Username" minLength="10" autocomplete="off" required />
        </div>
        <div class={styles.inputBx}>
          <input type="email" name="email" placeholder="Email" autocomplete="off" required />
        </div>
        <div class={styles.inputBx}>
          <input type="password" name="password" placeholder="Password" minLength="10" autocomplete="off" required />
        </div>

        <div class={styles.inputBx}>
          <input type="submit" value="Create Account" />
        </div>
        <div class={styles.links}>
          <div></div>
          <A href="/login" style={{ "text-align": "right" }}>
            Already have an account?
          </A>
        </div>
      </form>
    </div>
  );
};

export default Signup;
