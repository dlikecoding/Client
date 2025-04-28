import styles from "./Dashboard.module.css";
import {
  adminFetchAdminDashboard,
  adminIntegrateData,
  adminUpdateUserStatus,
} from "../../components/extents/request/fetching";
import { createResource, Index, Show } from "solid-js";
import { createStore } from "solid-js/store";
import ImportLoading from "../../components/extents/ImportLoading";
import Loading from "../../components/extents/Loading";
import NotFound from "../../components/extents/NotFound";

export interface loadedDashboard {
  users?: any[];
  sysStatus: boolean;
}

export interface ProcessMesg {
  mesg: string;
  status: boolean;
}

const Dashboard = () => {
  const [dashboardData, { mutate, refetch }] = createResource<loadedDashboard>(adminFetchAdminDashboard);

  const handleChange = async (user: any) => {
    const res = await adminUpdateUserStatus(user.user_email);
    if (!res.ok) return alert("Failed to update user status!");

    mutate((data) => {
      if (!data?.users) return data;

      const userIndex = data.users.findIndex((u) => u.user_email === user.user_email);
      if (userIndex === -1) return data;

      const newUsers = [...data.users];
      newUsers[userIndex] = { ...newUsers[userIndex], status: !newUsers[userIndex].status };
      return { ...data, users: newUsers };
    });
  };

  const [streamMesg, setStreamMesg] = createStore<ProcessMesg>({ mesg: "", status: false });

  const integrateMedias = async () => {
    setStreamMesg("mesg", "Sent request to Server");
    await adminIntegrateData(setStreamMesg);
    refetch();
  };

  const externalMedias = async () => {
    const path = importExternal.path;
    if (!path) return alert("Do not accept empty path");
    console.log("Import external medias: ", path);
  };

  const [importExternal, setImportExternal] = createStore({
    path: "",
    aiMode: false,
  });

  return (
    <>
      {dashboardData.loading && <Loading />}
      {dashboardData.error && <NotFound />}

      <h3>Import Medias From {!dashboardData()?.sysStatus ? "Internal Directory" : "External Drive"} </h3>
      <div class={styles.reindexForm}>
        <fieldset>
          <legend>
            {!dashboardData()?.sysStatus ? "Start importing media to server" : "Select preferred path for medias"}
          </legend>

          <Show when={dashboardData()?.sysStatus}>
            <div>
              <label for="importPath">External Drive:</label>
              <input
                class="inputSearch"
                type="text"
                name="importPath"
                id="importPath"
                autocomplete="off"
                placeholder="/Volumes/External/Photos"
                onInput={(e) => setImportExternal("path", e.target.value)}
              />
            </div>
          </Show>

          <div>
            <input
              type="checkbox"
              name="detectModel"
              id="detectModel"
              value="detectModel"
              onChange={() => setImportExternal("aiMode", !importExternal.aiMode)}
            />
            <label for="detectModel">AI Detection Mode ({importExternal.aiMode ? "enable" : "disabled"})</label>
          </div>
          <button
            class={styles.processButtons}
            onClick={() => (dashboardData()?.sysStatus ? externalMedias() : integrateMedias())}>
            Start Progress
          </button>
        </fieldset>
      </div>

      <Show when={streamMesg.mesg}>
        <ImportLoading streamMesg={streamMesg} setStreamMesg={setStreamMesg} />
      </Show>

      <h3 style={{ "margin-top": "50px" }}>Users Active Status</h3>
      <div class={styles.userContainer}>
        <Index each={dashboardData()?.users}>
          {(user, index) => (
            <div class={styles.userCard}>
              <img src="/src/assets/svgs/avatar.svg" style={{ "background-position": "center" }} />
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
    </>
  );
};

export default Dashboard;
