import styles from "./Dashboard.module.css";
import { adminFetchUsers, adminIntegrateData, adminUpdateUserStatus } from "../../components/extents/request/fetching";
import { createResource, Index } from "solid-js";

const Dashboard = () => {
  const [users, { refetch }] = createResource(adminFetchUsers);

  const handleChange = async (user: any) => {
    const res = await adminUpdateUserStatus(user.user_email);
    if (!res.ok) return alert("Failed to update user status!");

    refetch();
  };
  return (
    <>
      <div class={styles.userContainer}>
        <Index each={users()}>
          {(user, index) => (
            <div class={styles.userCard}>
              {/* {`https://randomuser.me/api/portraits/men/${index + 20}.jpg`} */}
              <img src="" style={{ "background-color": "royalblue", "background-position": "center" }} />
              <div class={styles.userInfo}>
                <h3>{user().user_name ? user().user_name : ""}</h3>
                <p>{user().user_email}</p>
                <a href="#">User Logs</a>
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
          )}
        </Index>
      </div>

      <div>
        <h3>Process Image to Server</h3>
      </div>
      <button
        onClick={async () => {
          const integrateMedias = await adminIntegrateData();
        }}>
        Click
      </button>
    </>
  );
};

export default Dashboard;
