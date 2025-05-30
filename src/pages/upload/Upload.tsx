import styles from "./Upload.module.css";
import { Portal } from "solid-js/web";
import { createStore } from "solid-js/store";
import { createSignal, Show } from "solid-js";

import ImportLoading from "../../components/extents/ImportLoading";
import { UploadIcon } from "../../components/svgIcons";
import { forUploadFiles } from "../../components/extents/request/fetching";
import { ProcessMesg } from "../admin/Dashboard";

const GB = 1024 * 1024 * 1024;

const MAX_BODY_SIZE = 2 * GB; // limit total files size
const MAX_UPLOAD_FILE_SIZE = 1 * GB; // limit per file

const Upload = () => {
  // When status is false, show spining. Otherwise, show close (X) button on True
  const [streamMesg, setStreamMesg] = createStore<ProcessMesg>({ mesg: "", isRunning: false });
  const [selectAiMode, setSelectAiMode] = createSignal<0 | 1>(0);

  const resetFileInput = (message: string = "") => {
    if (fileInputEl) fileInputEl.value = "";
    if (message !== "") setStreamMesg({ mesg: message, isRunning: false });
  };

  const handleFileChange = async (event: Event) => {
    setStreamMesg({ mesg: "Started Uploading...", isRunning: true });

    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const selectedFiles = Array.from(input.files);

    let totalFileSize = 0;

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      if (file.size >= MAX_UPLOAD_FILE_SIZE) return resetFileInput("File size over limited");
      totalFileSize += file.size;
      formData.append("uploadFiles", file);
    });

    if (totalFileSize > MAX_BODY_SIZE) return resetFileInput("Total size exceed limit!");

    await forUploadFiles(setStreamMesg, formData, selectAiMode());

    resetFileInput();
  };

  // const [hasAgreed, setHasAgreed] = createSignal<boolean>(localStorage.getItem("NoticeUpload") === "false");
  const clickedConfirm = () => {
    popoverDiv?.hidePopover();
    fileInputEl?.click();
  };

  // const changeCheckbox = (event: any) => {
  //   const isChecked = event.target.checked;
  //   setHasAgreed(isChecked);
  //   localStorage.setItem("NoticeUpload", isChecked.toString());
  // };

  let popoverDiv: HTMLDivElement | null = null;
  let fileInputEl: HTMLInputElement | null = null;
  return (
    <>
      <Show when={streamMesg.mesg}>
        <Portal>
          <ImportLoading streamMesg={streamMesg} setStreamMesg={setStreamMesg} />
        </Portal>
      </Show>

      <button popovertarget="upload-contents">{UploadIcon()}</button>

      <div ref={(el) => (popoverDiv = el)} popover="auto" id="upload-contents" class={styles.uploadDialog}>
        <h2 class={styles.dialogTitle}>Upload Instructions</h2>

        <div class={styles.instructionsContent}>
          <p>
            Each file should have a <b>size</b> of less than <b>1 GB</b>.
          </p>
          <p>
            The <b>total size</b> of all files should not exceed <b>2 GB</b> per session.
          </p>
          <p>
            Before uploading, select the <b>Most Compatible</b> option:
          </p>
          <ul>
            <li>
              Photo Library → Options → <u>Most Compatible</u>
            </li>
          </ul>
        </div>

        <div class={styles.checkboxLabel} style={{ "justify-content": "center", gap: "5px", "padding-bottom": "10px" }}>
          <input
            type="checkbox"
            id="enabledAI"
            class={styles.checkboxInput}
            onChange={() => setSelectAiMode((prev) => (prev === 0 ? 1 : 0))}
          />
          <label for="enabledAI">Computer Vision for Searching ({selectAiMode() ? "Enabled" : "Disabled"})</label>
        </div>

        <div class={styles.dialogActions}>
          <button class={styles.cancelButton} onClick={() => popoverDiv?.hidePopover()}>
            Cancel
          </button>
          <button class={styles.confirmButton} onClick={clickedConfirm}>
            OK
          </button>
        </div>
      </div>
      <input
        ref={(el) => (fileInputEl = el)}
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        accept="image/*, video/*"
        multiple
        required
        onChange={handleFileChange}
      />
    </>
  );
};

export default Upload;
