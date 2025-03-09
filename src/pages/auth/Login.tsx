import { A } from "@solidjs/router";
import styles from "./Guard.module.css";
import { createSignal } from "solid-js";
import { startAuthentication, WebAuthnError } from "@simplewebauthn/browser";
import { createStore } from "solid-js/store";

const Login = () => {
  const [message, setMessage] = createStore({ status: false, msg: "" });

  const [email, setEmail] = createSignal<string>();
  const signInAccount = async () => {
    // 1. Get challenge from server
    const initResponse = await fetch(`api/v1/users/init-auth?email=${email()}`, {
      credentials: "include",
    });

    const options = await initResponse.json();
    if (!initResponse.ok) return setMessage({ status: false, msg: "error.message" });

    // 2. Get passkey
    // const authenticationJSON = await startAuthentication({ optionsJSON: options });
    // console.log(authenticationJSON);
    let authenticationJSON: any;
    try {
      // Pass the options to the authenticator and wait for a response
      authenticationJSON = await startAuthentication({
        optionsJSON: options,
        useBrowserAutofill: false,
        verifyBrowserAutofillInput: false,
      });
    } catch (error) {
      if (error instanceof WebAuthnError) {
        return error.message === "NotAllowedError"
          ? setMessage({ status: false, msg: "Authenticator was probably already registered by user" })
          : setMessage({ status: false, msg: "An unknown error occurred during registration." });
      }
      return console.log(error);
    }

    // 3. Save passkey in DB
    const verifyResponse = await fetch(`api/v1/users/verify-auth`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authenticationJSON),
    });
    61;
    const verifyData = await verifyResponse.json();
    if (!verifyResponse.ok) return setMessage({ status: false, msg: verifyData.error });

    if (!verifyData.verified) return setMessage({ status: false, msg: `Failed to Sign In` });

    // `Successfully Logged In ${email()}`
    localStorage.setItem("user-session", email() || "");
    window.location.href = "/";
  };

  return (
    <div class={styles.ring}>
      <i style={{ "--clr": "#0051ff" }}></i>
      <i style={{ "--clr": "#fb00ff" }}></i>
      <i style={{ "--clr": "#41de2f" }}></i>
      <form class={styles.login} action="/login" method="post">
        <h2>Login</h2>

        <p style={{ color: message.status ? "green" : "red" }}>{message.msg}</p>

        <div class={styles.inputBx}>
          <input
            onInput={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            placeholder="Email"
            autocomplete="off"
            required
          />
        </div>

        <div class={styles.inputBx}>
          <input type="button" onClick={signInAccount} value="Sign In" />
        </div>
        <div class={styles.links}>
          <A href="#">Forget Password</A>
          <A href="/signup">Need an account?</A>
        </div>
      </form>
    </div>
  );
};

export default Login;
