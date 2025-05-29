import styles from "./Guard.module.css";
import { A } from "@solidjs/router";
import { createSignal } from "solid-js";
import { AuthenticationResponseJSON, startAuthentication, WebAuthnError } from "@simplewebauthn/browser";
import { createStore } from "solid-js/store";
import { reqMethodHelper } from "../../components/extents/request/fetching";

const Login = () => {
  const [message, setMessage] = createStore({ status: false, msg: "" });

  const [email, setEmail] = createSignal<string>();
  const signInAccount = async () => {
    setMessage("status", true);

    // 1. Get challenge from server
    const initResponse = await fetch(`api/v1/auth/init-auth?email=${email()}`, {
      credentials: "same-origin",
    });

    const options = await initResponse.json();
    if (!initResponse.ok) return setMessage({ status: false, msg: options.error });

    // 2. Get passkey
    let authenticationJSON: AuthenticationResponseJSON;
    try {
      // Pass the options to the authenticator and wait for a response
      authenticationJSON = await startAuthentication({ optionsJSON: options });
    } catch (error) {
      if (error instanceof WebAuthnError && error.name === "NotAllowedError") {
        return setMessage({ status: false, msg: "Authenticator does not allowed." });
      }
      return setMessage({ status: false, msg: "Authenticator was missing biometric verification." });
    }

    // 3. Save passkey in DB
    const verifyResponse = await reqMethodHelper("api/v1/auth/verify-auth", "POST", authenticationJSON);
    const verifyData = await verifyResponse.json();

    if (!verifyResponse.ok) return setMessage({ status: false, msg: verifyData.error });

    if (!verifyData.verified) return setMessage({ status: false, msg: `Failed to Sign In` });
    window.location.replace("/library/");
  };

  return (
    <div class={styles.ring}>
      <i style={{ "--clr": "#0051ff" }}></i>
      <i style={{ "--clr": "#fb00ff" }}></i>
      <i style={{ "--clr": "#41de2f" }}></i>
      <div class={styles.login}>
        <h2>Login</h2>

        <p style={{ color: message.status ? "green" : "red" }}>{message.msg}</p>

        <div class={styles.inputBx}>
          <input
            onInput={(e) => {
              setEmail(e.target.value);
            }}
            onFocus={() => setMessage("msg", "")}
            type="email"
            name="email"
            placeholder="Email"
            autocomplete="off"
            autofocus
            required
          />
        </div>

        <div class={styles.inputBx}>
          <input type="button" onClick={signInAccount} value="Sign In" disabled={message.status} />
        </div>
        <div class={styles.links}>
          <A href="#">Lost key</A>
          <A href="/signup">Need an account?</A>
        </div>
      </div>
    </div>
  );
};

export default Login;
