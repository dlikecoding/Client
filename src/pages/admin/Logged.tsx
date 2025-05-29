import { createResource, createSignal, For, Show } from "solid-js";
import { fetchDeleteSystemlogs, fetchSystemLogs } from "../../components/extents/request/fetching";
import styles from "./Logged.module.css";
import { formatTimeAgo } from "solidjs-use";
import { createStore } from "solid-js/store";

type DeleteLog = {
  sysIds: number[];
  uIds: number[];
};

const Logged = () => {
  const [loadedSystemLogs, { refetch: sysRefetch }] = createResource(fetchSystemLogs);
  // const [loadedSystemLogs, { refetch: sysRefetch }] = createResource(fetchLogs);

  const [deleteLog, setDeleteLog] = createStore<DeleteLog>({
    sysIds: [],
    uIds: [],
  });

  const [isSelectSystemLog, setIsSelectSystemLog] = createSignal<boolean>(false);
  const [isSelectUserLog, setIsSelectUserLog] = createSignal<boolean>(false);

  return (
    <>
      <h1>Logs Management</h1>

      <Show when={loadedSystemLogs() && loadedSystemLogs()?.length! > 0}>
        <div class={styles.headerLog}>
          <h3 style={{ margin: 0, padding: 0 }}>System Logs</h3>
          <button
            style={{
              color: `${deleteLog.sysIds.length <= 0 ? "var(--button-active-color)" : "var(--button-delete-color)"}`,
            }}
            onClick={async () => {
              if (deleteLog.sysIds.length > 0) {
                // delete list of ids
                console.log(deleteLog.sysIds);

                const deleteStatus = await fetchDeleteSystemlogs(deleteLog.sysIds);
                if (!deleteStatus.ok) return alert("Delete System logs failed.");

                setDeleteLog("sysIds", []);
                sysRefetch();
              }

              setIsSelectSystemLog((prev) => !prev);
            }}>
            {isSelectSystemLog() ? (deleteLog.sysIds.length > 0 ? "Delete" : "Cancel") : "Select"}
          </button>
        </div>
      </Show>

      <div class={styles.logContainer}>
        <For each={loadedSystemLogs()}>
          {(sysId) => (
            <div class={styles.logInfo}>
              <Show when={isSelectSystemLog()}>
                <input
                  type="checkbox"
                  id={`system-log-${sysId.error_log_id}`}
                  name={`system-log-${sysId.error_log_id}`}
                  onInput={(e) => {
                    if (e.target.checked) return setDeleteLog("sysIds", (prev) => [...prev, sysId.error_log_id]);
                    setDeleteLog("sysIds", (prev) => prev.filter((id) => id !== sysId.error_log_id));
                  }}
                />
              </Show>

              <label for={`system-log-${sysId.error_log_id}`}>
                <h3>{sysId.file_error}</h3>
                <p>{sysId.func_occur}</p>
              </label>

              <div>
                <p>{formatTimeAgo(new Date(sysId.mark_at))}</p>
                <button
                  style={{ "font-size": "12px", "text-decoration": "underline" }}
                  onClick={() => alert(`${sysId.stack_trace}`)}>
                  stack trace...
                </button>
              </div>
            </div>
          )}
        </For>
      </div>
      {/* 
      
      
      <div class={styles.headerLog}>
        <h3 style={{ margin: 0, padding: 0 }}>User Logs</h3>
        <button
          style={{
            color: `${deleteSysLogIds.length === 0 ? "var(--button-active-color)" : "var(--button-delete-color)"}`,
          }}
          onClick={() => {
            if (deleteSysLogIds.length !== 0) {
              // delete list of ids
              console.log(deleteSysLogIds);

              setDeleteSysLogIds([]);
              sysRefetch();
            }

            setIsSelectSystemLog((prev) => !prev);
          }}>
          {isSelectSystemLog() ? (deleteSysLogIds.length > 0 ? "Delete" : "Cancel") : "Select"}
        </button>
      </div>

      <div class={styles.logContainer}>
        <For each={loadedSystemLogs()}>
          {(sysId) => (
            <div class={styles.logInfo}>
              <Show when={isSelectSystemLog()}>
                <input
                  type="checkbox"
                  id={`system-log-${sysId.error_log_id}`}
                  name={`system-log-${sysId.error_log_id}`}
                  onInput={(e) => {
                    if (e.target.checked) return setDeleteSysLogIds((prev) => [...prev, sysId]);
                    setDeleteSysLogIds((prev) => prev.filter((id) => id !== sysId));
                  }}
                />
              </Show>

              <label for={`system-log-${sysId.error_log_id}`}>
                <h3>{sysId.file_error}</h3>
                <p>{sysId.func_occur}</p>
              </label>

              <div>
                <p>{formatTimeAgo(new Date(sysId.mark_at))}</p>
                <button
                  style={{ "font-size": "12px", "text-decoration": "underline" }}
                  onClick={() => alert(`${sysId.stack_trace}`)}>
                  stack trace...
                </button>
              </div>
            </div>
          )}
        </For>
      </div> */}
    </>
  );
};

export default Logged;
