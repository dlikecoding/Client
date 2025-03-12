import { Portal } from "solid-js/web";
// import styles from "./Profile.module.css";
const Profile = () => {
  return (
    <Portal>
      <main class="mainHomePage currentActivePage">
        <header style={{ position: "relative" }}>
          <div>
            <h1>Profile</h1>
          </div>
          <div class="buttonContainer">
            <button>Custom</button>
          </div>
        </header>
      </main>
    </Portal>
  );
};

export default Profile;
