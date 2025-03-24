import { Portal } from "solid-js/web";
import styles from "./Dashboard.module.css";
import { adminFetchUsers } from "../../components/extents/request/fetching";
import { createResource, createSignal, Index } from "solid-js";

const Dashboard = () => {
  const [users, { refetch }] = createResource(adminFetchUsers);

  const [isChecked, setIsChecked] = createSignal(false);

  const handleChange = (accountId: number) => {
    setIsChecked(!isChecked());
    if (isChecked()) {
      console.log(`Checkbox ${accountId} is unchecked`);
    } else {
      console.log(`Checkbox ${accountId} is checked`);
    }
  };
  return (
    <Portal>
      <main class="mainHomePage currentActivePage">
        <header style={{ position: "relative" }}>
          <div>
            <h1>Dashboard</h1>
          </div>
          <div class="buttonContainer">
            <button>{}</button>
          </div>
        </header>
        {/* user_id: 4, user_name: "undefined", user_email: "newaccount@mail.com", request_status: 0, request_at:
        2025-03-23T21:39:45.000Z, role_type: null, created_at: null, status: null, */}
        <div class={styles.userContainer}>
          <Index each={users()}>
            {(user, index) => {
              // console.log(user());
              return (
                <div class={styles.userCard}>
                  <img src={`https://randomuser.me/api/portraits/women/${index + 20}.jpg`} alt="User 1" />
                  <div class={styles.userInfo}>
                    <h3>{user().user_name ? user().user_name : ""}</h3>
                    <p>{user().user_email}</p>
                    <a href="#">View Profile</a>
                  </div>
                  <div class={styles.userStatus}>
                    <p> {user().status === "active" ? "Active" : "Suspended"}</p>

                    <div class={styles.toggleStatus}>
                      <input
                        checked={user().status === "active"}
                        onInput={() => handleChange(user().account_id)}
                        type="checkbox"
                        id={`mode-toggle-${index}`}
                      />
                      <label for={`mode-toggle-${index}`}></label>
                    </div>
                  </div>
                </div>
              );
            }}
          </Index>
        </div>
      </main>
    </Portal>
  );
};

export default Dashboard;
