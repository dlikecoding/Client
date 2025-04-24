import { A } from "@solidjs/router";
import styles from "./Guard.module.css";
import { startRegistration, WebAuthnError, type RegistrationResponseJSON } from "@simplewebauthn/browser";
import { createStore } from "solid-js/store";

interface UserInput {
  name?: string;
  email?: string;
}

const Signup = () => {
  const [message, setMessage] = createStore({ status: false, msg: "" });
  const [user, setUser] = createStore<UserInput>();

  const createAccount = async () => {
    setMessage("status", true);

    // 1. Get challenge from server
    const initResponse = await fetch(`api/v1/auth/init-register?email=${user.email}&username=${user.name}`, {
      credentials: "include",
    });

    const options = await initResponse.json();
    if (!initResponse.ok) return setMessage({ status: false, msg: options.error }); // Stop further execution

    // 2. Create passkey
    // const registrationJSON = await startRegistration(options); // Make sure startRegistration is defined elsewhere
    let registrationJSON: RegistrationResponseJSON;
    try {
      // Pass the options to the authenticator and wait for a response
      registrationJSON = await startRegistration({ optionsJSON: options });
    } catch (error) {
      if (error instanceof WebAuthnError) {
        if (error.name === "NotAllowedError")
          return setMessage({ status: false, msg: "Authenticator was missing biometric verification." });
      }
      return setMessage({ status: false, msg: "Authenticator was missing biometric verification." });
    }

    // 3. Save passkey in DB
    const verifyResponse = await fetch(`api/v1/auth/verify-register`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registrationJSON),
    });

    const verifyData = await verifyResponse.json();
    if (!verifyResponse.ok) return setMessage({ status: false, msg: verifyData.error });

    if (!verifyData.verified) return setMessage({ status: false, msg: `Failed to register` });
    window.location.replace("/login");

    // ? setMessage({ status: true, msg: `Successfully registered ${user.email}` })
  };
  return (
    <div class={styles.ring}>
      <i style={{ "--clr": "#0051ff" }}></i>
      <i style={{ "--clr": "#fb00ff" }}></i>
      <i style={{ "--clr": "#41de2f" }}></i>
      <div class={styles.login}>
        <h2>Register</h2>

        <p style={{ color: message.status ? "green" : "red" }}>{message.msg}</p>

        <div class={styles.inputBx}>
          <input
            onInput={(e) => setUser("email", e.target.value)}
            onFocus={() => setMessage("msg", "")}
            type="email"
            name="email"
            placeholder="Email*"
            autocomplete="off"
            autofocus
            required
          />
        </div>

        <div class={styles.inputBx}>
          <input
            onInput={(e) => setUser("name", e.target.value)}
            onFocus={() => setMessage("msg", "")}
            type="text"
            name="username"
            placeholder="Full Name"
            minLength="5"
            autocomplete="off"
            required
          />
        </div>

        <div class={styles.inputBx}>
          <input type="button" onClick={createAccount} value="Create Account" disabled={message.status} />
        </div>
        <div class={styles.links}>
          <div></div>
          <A href="/login" style={{ "text-align": "right" }}>
            Already have an account?
          </A>
        </div>
      </div>
    </div>
  );
};

export default Signup;
