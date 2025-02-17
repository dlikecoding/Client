import { createSignal, Show } from "solid-js";
import styles from "./Upload.module.css";

const Upload = () => {
  const [isDialogOpen, setIsDialogOpen] = createSignal(false);

  // Handle the confirmation to allow file upload
  const handleConfirmation = () => {
    setIsDialogOpen(false); // Close the confirmation dialog
    fileUploaded();
  };

  // Handle file upload event
  const handleFileUpload = (event: any) => {
    const files = event.target.files;
    console.log("Files uploaded:", files);
    // Handle the actual file upload logic here
  };

  // Check localStorage to see if the user has agreed
  const [hasAgreed, setHasAgreed] = createSignal(localStorage.getItem("NoticeUploadInstruction") === "true");

  // Handle the checkbox change event
  const handleCheckboxChange = (event: any) => {
    const isChecked = event.target.checked;
    setHasAgreed(isChecked);

    // Store the user's choice in localStorage
    localStorage.setItem("NoticeUploadInstruction", isChecked.toString());
    fileUploaded();
  };

  return (
    <>
      <button
        on:click={() => {
          document.getElementById("uploadPopover")?.showPopover();

          if (hasAgreed()) return fileUploaded();
        }}>
        {UploadIconPath()}
      </button>

      {/* <Show when={!hasAgreed()}> */}
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
      {/* </Show> */}

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

const UploadIconPath = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path
      stroke-width="2.5"
      d="M1 45h1l4-4c5-4 8-9 11-14 5-7 12-6 18-3 8-12 19-17 31-14 12 4 19 11 20 28 7 0 11 5 15 9v17l-3 1c-3 6-8 8-14 8H63c0-3 0-4 3-4l19-1c6-1 11-6 11-12 0-7-4-13-11-14-4 0-4-2-4-5-1-17-14-26-30-21-5 2-9 5-11 11-2 3-3 4-7 2-5-4-13-2-15 6-1 3-1 4-4 6-6 3-9 8-8 15 0 5 4 9 9 11l9 2h15c0 3 0 4-3 4H17c-6 0-10-4-13-8l-3-2V45z"
    />
    <path stroke-width="2.5" d="m44 51 6-8-1 3 16 11c-7 4-8-2-12-4v36h-4V53c-4 1-5 9-12 4l7-6z" />
  </svg>
);

const fileUploaded = () => {
  document.getElementById("fileInput")?.click();
};
