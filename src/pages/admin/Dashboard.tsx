import { Portal } from "solid-js/web";
import styles from "./Dashboard.module.css";
import { adminFetchUsers, adminUpdateUserStatus } from "../../components/extents/request/fetching";
import { createResource, Index } from "solid-js";

const Dashboard = () => {
  const [users, { refetch }] = createResource(adminFetchUsers);

  const handleChange = async (user: any) => {
    const res = await adminUpdateUserStatus(user.user_email);
    console.log(res);
    refetch();
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
              console.log(user());
              return (
                <div class={styles.userCard}>
                  <img src={`https://randomuser.me/api/portraits/women/${index + 20}.jpg`} alt="User 1" />
                  <div class={styles.userInfo}>
                    <h3>{user().user_name ? user().user_name : ""}</h3>
                    <p>{user().user_email}</p>
                    <a href="#">View Profile</a>
                  </div>
                  <div class={styles.userStatus}>
                    <p> {user().status ? "Active" : "Suspended"}</p>

                    <div class={styles.toggleStatus}>
                      <input
                        checked={user().status}
                        onInput={() => handleChange(user())}
                        type="checkbox"
                        id={`toggle-${user().reg_user_id}`}
                      />
                      <label for={`toggle-${user().reg_user_id}`}></label>
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
