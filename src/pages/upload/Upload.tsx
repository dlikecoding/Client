import styles from "./Upload.module.css";
import { Portal } from "solid-js/web";
import { createStore } from "solid-js/store";
import { createSignal, Show } from "solid-js";

import ImportLoading from "../../components/extents/ImportLoading";
import { UploadIcon } from "../../components/svgIcons";
import { forUploadFiles } from "../../components/extents/request/fetching";
import { ProcessMesg } from "../admin/Dashboard";

const GB = 1024 * 1024 * 1024;

const MAX_BODY_SIZE = 5 * GB; // limit total files size
const MAX_UPLOAD_FILE_SIZE = 1 * GB; // limit per file

const Upload = () => {
  const [streamMesg, setStreamMesg] = createStore<ProcessMesg>({ mesg: "", status: false });
  const [files, setFiles] = createSignal<File[]>([]);

  const handleFileChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;

    if (input.files) setFiles(Array.from(input.files) as File[]);

    const totalFileSize = 0;
    files().forEach((f) => f.size + totalFileSize);
    if (totalFileSize > MAX_BODY_SIZE) return;

    const formData = new FormData();
    files().forEach((file) => {
      if (file.size >= MAX_UPLOAD_FILE_SIZE) return;
      formData.append("uploadFiles", file);
    });

    setStreamMesg("mesg", "Started Uploading...");
    await forUploadFiles(setStreamMesg, formData);

    input.value = "";
  };

  const [hasAgreed, setHasAgreed] = createSignal<boolean>(localStorage.getItem("NoticeUpload") === "false");
  const clickedConfirm = () => {
    document.getElementById("uploadPopover")?.hidePopover();
    fileUploaded();
  };

  const changeCheckbox = (event: any) => {
    const isChecked = event.target.checked;
    setHasAgreed(isChecked);
    localStorage.setItem("NoticeUpload", isChecked.toString());
  };

  return (
    <>
      <Show when={streamMesg.mesg}>
        <Portal>
          <ImportLoading streamMesg={streamMesg} setStreamMesg={setStreamMesg} />
        </Portal>
      </Show>

      <button
        onClick={() => {
          if (!hasAgreed()) return document.getElementById("uploadPopover")?.showPopover();
          fileUploaded();
        }}>
        {UploadIcon()}
      </button>

      <div popover="auto" id="uploadPopover" class={styles.uploadDialog}>
        <div class={styles.checkboxLabel}>
          <h2 class={styles.dialogTitle}>Upload Instructions</h2>

          <div class={styles.checkboxInput}>
            <input type="checkbox" id="dontShowAgain" name="dontShowAgain" onChange={changeCheckbox} />
            <label for="dontShowAgain">Don't show again.</label>
          </div>
        </div>

        <div class={styles.instructionsContent}>
          <p>
            <b>Select</b> <u>Photos</u> or <u>Videos</u> to upload to your gallery.
          </p>
          <p>
            + Files should have a <b>size</b> of less than <b>1 GB</b>.
          </p>
          <p>
            + The total <b>size</b> of all files should not exceed <b>5 GB</b> per session.
          </p>
          <p>
            + Before uploading, select the <b>Most Compatible</b> option:
          </p>
          <ul>
            <li>
              Photo Library → Options → <u>Most Compatible</u>
            </li>
          </ul>
        </div>

        {/* <div class={styles.checkboxLabel}>
          <label>
            <input type="checkbox" id="enabledAI" name="enabledAI" value="enabledAI" class={styles.checkboxInput} />
            Enable AI Detection
          </label>
        </div> */}

        <div class={styles.dialogActions}>
          <button class={styles.cancelButton} onClick={() => document.getElementById("uploadPopover")?.hidePopover()}>
            Cancel
          </button>
          <button class={styles.confirmButton} onClick={clickedConfirm}>
            OK
          </button>
        </div>
      </div>

      <input
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

const fileUploaded = () => document.getElementById("fileInput")?.click();
