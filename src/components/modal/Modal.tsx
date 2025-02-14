import { useViewMediaContext } from "../../context/ViewContext";
import styles from "./Modal.module.css";

const Modal = (props: any) => {
  const { displayMedias, setDisplayMedia } = useViewMediaContext();

  return (
    <div class={styles.modalContainer} style={{ "z-index": 4 }}>
      <div class={styles.header}>
        <h2>Modal Title</h2>
        <p>This is a modal content.</p>
      </div>
      <img src={displayMedias.at(0)?.ThumbPath} alt="Modal Image" />
      <button
        onClick={() => {
          console.log("Hello");
        }}>
        Close
      </button>
      <footer>
        <button>A</button>
        <button>A</button>
        <button>A</button>
        <button>A</button>
      </footer>
    </div>
  );
};

export default Modal;
