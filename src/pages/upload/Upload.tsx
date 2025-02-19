import { createSignal } from "solid-js";
import styles from "./Upload.module.css";
import { UploadIcon } from "../../components/svgIcons";

const Upload = () => {
  // Handle the confirmation to allow file upload
  const handleConfirmation = () => {
    document.getElementById("uploadPopover")?.hidePopover();
    fileUploaded();
  };

  // Handle file upload event
  const handleFileUpload = (event: any) => {
    const files = event.target.files;
    console.log("Files uploaded:", files);
    // Handle the actual file upload logic here
  };

  // Check localStorage to see if the user has agreed
  const [hasAgreed, setHasAgreed] = createSignal(localStorage.getItem("NoticeUpload") === "true");

  // Handle the checkbox change event
  const handleCheckboxChange = (event: any) => {
    const isChecked = event.target.checked;
    setHasAgreed(isChecked);

    // Store the user's choice in localStorage
    localStorage.setItem("UploadInstruction", isChecked.toString());
    fileUploaded();
  };

  // console.log("MOUNT UPLOAD");

  return (
    <>
      <button
        on:click={() => {
          document.getElementById("uploadPopover")?.showPopover();

          if (hasAgreed()) return fileUploaded();
        }}>
        {UploadIcon()}
      </button>

      <div popover="auto" id="uploadPopover" class={styles.uploadDialog}>
        <div class={styles.checkboxLabel}>
          <h2 class={styles.dialogTitle}>Upload Instructions</h2>
          <label>
            <input type="checkbox" required onChange={handleCheckboxChange} class={styles.checkboxInput} />
            Don't show again.
          </label>
        </div>

        <div class={styles.instructionsContent}>
          <p>
            <b>Select</b> <u>Photos</u> or <u>Videos</u> to upload to your gallery.
          </p>
          <p>
            + Files should have a <b>size</b> of less than <b>2 GB</b>.
          </p>
          <p>
            + The total <b>size</b> of all files should not exceed <b>10 GB</b> per session.
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
          <button class={styles.confirmButton} onClick={handleConfirmation}>
            Confirm
          </button>
          <button class={styles.cancelButton} onClick={() => document.getElementById("uploadPopover")?.hidePopover()}>
            Cancel
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
        onChange={handleFileUpload}
      />
    </>
  );
};

export default Upload;

const fileUploaded = () => {
  document.getElementById("fileInput")?.click();
};
