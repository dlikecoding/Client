import styles from "./Logged.module.css";
import { createMemo, createResource, createSignal, For, Show } from "solid-js";
import { fetchDeleteLogs, fetchAllLogs } from "../../components/extents/request/fetching";
import { formatTimeAgo } from "solidjs-use";
import { createStore } from "solid-js/store";
import { CloseIcon } from "../../components/svgIcons";

type DeleteLog = {
  sysIds: number[];
  uIds: number[];
};

export type LoadLogs = {
  system: any[];
  user: any[];
};

const Logged = () => {
  const [allLogs, { refetch }] = createResource(fetchAllLogs);
  const [deleteLog, setDeleteLog] = createStore<DeleteLog>({ sysIds: [], uIds: [] });
  const [isSelectSystemLog, setIsSelectSystemLog] = createSignal(false);
  const [isSelectUserLog, setIsSelectUserLog] = createSignal(false);

  const systemLogs = createMemo(() => allLogs()?.system || []);
  const userLogs = createMemo(() => allLogs()?.user || []);

  const handleDelete = async (type: "system" | "user") => {
    const ids = type === "system" ? deleteLog.sysIds : deleteLog.uIds;
    if (ids.length === 0) return;

    const deleteStatus = await fetchDeleteLogs(ids, type);
    if (!deleteStatus.ok) return alert(`Delete ${type} logs failed.`);

    if (type === "system") setDeleteLog("sysIds", []);
    else setDeleteLog("uIds", []);

    refetch();
  };

  const toggleSelection = (type: "system" | "user") => {
    if (type === "system") {
      if (isSelectSystemLog() && deleteLog.sysIds.length > 0) handleDelete("system");
      setIsSelectSystemLog((prev) => !prev);
    } else {
      if (isSelectUserLog() && deleteLog.uIds.length > 0) handleDelete("user");
      setIsSelectUserLog((prev) => !prev);
    }
  };

  const toggleSysId = (checked: boolean, id: number) => {
    if (checked) setDeleteLog("sysIds", (prev) => [...prev, id]);
    else setDeleteLog("sysIds", (prev) => prev.filter((x) => x !== id));
  };

  const toggleUserId = (checked: boolean, id: number) => {
    if (checked) setDeleteLog("uIds", (prev) => [...prev, id]);
    else setDeleteLog("uIds", (prev) => prev.filter((x) => x !== id));
  };

  const renderSystemLogs = () => (
    <div class={styles.logContainer}>
      <For each={systemLogs()}>
        {(log) => (
          <div class={styles.logInfo}>
            <Show when={isSelectSystemLog()}>
              <input
                type="checkbox"
                id={`system-log-${log.error_log_id}`}
                onInput={(e) => toggleSysId(e.target.checked, log.error_log_id)}
              />
            </Show>

            <label for={`system-log-${log.error_log_id}`}>
              <h3>{log.file_error}</h3>
              <p>{log.func_occur}</p>
            </label>

            <div>
              <p>{formatTimeAgo(new Date(log.mark_at))}</p>
              <button style={{ "font-size": "12px" }} onClick={() => alert(log.stack_trace)}>
                Stack trade...
              </button>
            </div>
          </div>
        )}
      </For>
    </div>
  );

  const renderUserLogs = () => (
    <div class={styles.logContainer}>
      <For each={userLogs()}>
        {(log) => (
          <div class={styles.logInfo}>
            <Show when={isSelectUserLog()}>
              <input
                type="checkbox"
                id={`user-log-${log.user_log_id}`}
                onInput={(e) => toggleUserId(e.target.checked, log.user_log_id)}
              />
            </Show>

            <label for={`user-log-${log.user_log_id}`}>
              <h3>{log.RegterUser}</h3>
              <p>IP: {log.ip_address}</p>
              <p>Last Login: {new Date(log.last_logged_in).toLocaleString()}</p>
            </label>

            <div>
              <p>{formatTimeAgo(new Date(log.logged_at))}</p>
              <button style={{ "font-size": "12px" }} onClick={() => alert(log.user_agent)}>
                User agent...
              </button>
            </div>
          </div>
        )}
      </For>
    </div>
  );

  let popoverDiv: HTMLDivElement | null = null;
  const [getLogs, setGetLogs] = createSignal(false);
  return (
    <>
      <h3 style={{ "margin-top": "50px" }}>Logs Manager</h3>
      <button popovertarget="info-contents" onClick={() => setGetLogs((prev) => !prev)}>
        show
      </button>
      <Show when={getLogs()}>
        <div ref={(el) => (popoverDiv = el)} popover="auto" id="info-contents" class={styles.mainPopoverLog}>
          <h1>Logs Management</h1>

          {/* System Logs */}
          <Show when={systemLogs().length > 0}>
            <div class={styles.headerLog}>
              <h3>System Logs</h3>
              <button
                style={{
                  color: `${deleteLog.sysIds.length > 0 ? "var(--button-delete-color)" : "var(--button-active-color)"}`,
                }}
                onClick={() => toggleSelection("system")}>
                {isSelectSystemLog() ? (deleteLog.sysIds.length > 0 ? "Delete" : "Cancel") : "Select"}
              </button>
            </div>
            {renderSystemLogs()}
          </Show>

          {/* User Logs */}
          <Show when={userLogs().length > 0}>
            <div class={styles.headerLog}>
              <h3>User Logs</h3>
              <button
                style={{
                  color: `${deleteLog.uIds.length > 0 ? "var(--button-delete-color)" : "var(--button-active-color)"}`,
                }}
                onClick={() => toggleSelection("user")}>
                {isSelectUserLog() ? (deleteLog.uIds.length > 0 ? "Delete" : "Cancel") : "Select"}
              </button>
            </div>
            {renderUserLogs()}
          </Show>

          <button
            style={{ position: "absolute", bottom: 0, right: 0, margin: "40px" }}
            onClick={() => setGetLogs(false)}>
            {CloseIcon()}
          </button>
        </div>
      </Show>
    </>
  );
};

export default Logged;
