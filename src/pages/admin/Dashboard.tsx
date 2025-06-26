import styles from "./Dashboard.module.css";
import {
  adminBackup,
  adminFetchAdminDashboard,
  adminIntegrateData,
  adminOptimizeStorage,
  adminReindex,
  adminRestore,
  adminUpdateUserStatus,
} from "../../components/extents/request/fetching";
import { createResource, Index, Show } from "solid-js";
import { createStore } from "solid-js/store";
import ImportLoading from "../../components/extents/ImportLoading";
import Loading from "../../components/extents/Loading";
import NotFound from "../../components/extents/NotFound";
import { SlideUp } from "../../components/photoview/actionNav/popover/SlideUp";
import Logged from "./Logged";

export interface loadedDashboard {
  users?: UserType[];
  sysStatus: boolean;
  lastBackup: string;
  lastRestore: string;
  missedData: { thumbnail: number; hashcode: number; caption: number };
}

type UserType = {
  user_name: string;
  user_email: string;
  status: boolean;
  reg_user_id: string;
};

export interface ProcessMesg {
  mesg: string;
  isRunning: boolean;
}

export interface ImportArgs {
  path: string;
  aimode: 0 | 1;
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

  const [streamMesg, setStreamMesg] = createStore<ProcessMesg>({ mesg: "", isRunning: false });

  const [importArgs, setImportArgs] = createStore<ImportArgs>({
    path: "",
    aimode: 0,
  });

  const integrateMedias = async () => {
    setStreamMesg({ mesg: "Start processing internal media", isRunning: true });
    await adminIntegrateData(setStreamMesg, importArgs, "internal");
    refetch();
  };

  const externalMedias = async () => {
    const path = importArgs.path;
    if (!path) return alert("Do not accept empty path");

    setStreamMesg({ mesg: `Start processing medias in ${importArgs.path}`, isRunning: true });
    await adminIntegrateData(setStreamMesg, importArgs, "external");
  };

  const backupData = async () => {
    setStreamMesg({ mesg: `Start backing up PhotoX System to external drive`, isRunning: true });
    await adminBackup(setStreamMesg);
    refetch();
  };

  const restoreData = async () => {
    const data = await adminRestore();
    alert(data.message);
    refetch();
  };

  const optimizaStorage = async () => {
    setStreamMesg({ mesg: `Start optimizing videos in local server`, isRunning: true });
    await adminOptimizeStorage(setStreamMesg);
    refetch();
  };

  const shouldReindex = () => {
    const data = dashboardData();
    if (!data || !data.missedData) return false;
    const arrayOfMissingData = Object.values(data.missedData);
    const allZeros = arrayOfMissingData.every((e) => e == 0);
    return !allZeros;
  };

  const reindexMissingData = async () => {
    if (!shouldReindex()) return;
    setStreamMesg({ mesg: "Start reindexing medias", isRunning: true });
    await adminReindex(setStreamMesg);

    refetch();
  };
  return (
    <main class={"mainHomePage"}>
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
                id="importPath"
                autocomplete="off"
                placeholder="/Volumes/External/Photos"
                onInput={(e) => setImportArgs("path", e.target.value)}
              />
            </div>
          </Show>

          <div>
            <input
              type="checkbox"
              id="detectModel"
              onChange={() => setImportArgs("aimode", importArgs.aimode === 0 ? 1 : 0)}
            />
            <label for="detectModel">
              Computer Vision for Search Engine ({importArgs.aimode ? "Enabled" : "Disabled"})
            </label>
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

      <h3 style={{ "margin-top": "50px" }}>Server Recovery</h3>
      <div class={styles.maintainSys}>
        <div class={styles.backup}>
          <div>Last backup: {dashboardData()?.lastBackup || "N/A"}</div>
          {/* <button onClick={backupData}>Backup</button> */}

          <button popoverTarget="backup-database">Backup</button>
          <SlideUp
            idElement="backup-database"
            noticeText={
              "WARNING! All existing data on your external drive will be deleted and replace with current data in PhotoX system. This action can not be undone."
            }
            confirmBtn={backupData}
            infoText={() => "Backup PhotoX"}
          />
        </div>

        <Show when={dashboardData()?.lastBackup}>
          <div class={styles.restore}>
            <div>Last restored: {dashboardData()?.lastRestore || "N/A"}</div>
            <button popoverTarget="restore-database">Restore</button>
            <SlideUp
              idElement="restore-database"
              noticeText={"All existing database will be replace with the new data. This action can not be undone."}
              confirmBtn={restoreData}
              infoText={() => "Restore Database"}
            />
          </div>
        </Show>

        <div class={styles.backup}>
          <div>Storage Optimize</div>
          <button style={{ background: "purple" }} popoverTarget="optimal-storage">
            Optimize
          </button>
          <SlideUp
            idElement="optimal-storage"
            noticeText={"Start reducing frames per second for slow motion videos. This action can not be undone."}
            confirmBtn={optimizaStorage}
            infoText={() => "Optimize Storage"}
          />
        </div>

        <Show when={shouldReindex()}>
          <div class={`${styles.backup} ${styles.reindex}`}>
            <div>
              <div>Thumnail</div>
              <div>{dashboardData()?.missedData.thumbnail}</div>
            </div>
            <div>
              <div>Hashcode</div>
              <div>{dashboardData()?.missedData.hashcode}</div>
            </div>
            <div>
              <div>Caption</div>
              <div>{dashboardData()?.missedData.caption}</div>
            </div>
            <button onClick={reindexMissingData}>Reindex</button>
          </div>
        </Show>
      </div>

      <Show when={dashboardData() && dashboardData()?.users && dashboardData()?.users?.length! > 0}>
        <h3 style={{ "margin-top": "50px" }}>Users Active Status</h3>
        <div class={styles.userContainer}>
          <Index each={dashboardData()?.users}>
            {(user) => (
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
      </Show>

      <Logged />
    </main>
  );
};

export default Dashboard;
