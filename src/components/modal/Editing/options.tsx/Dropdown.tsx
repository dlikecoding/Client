import { createSignal } from "solid-js";
import styles from "./Dropdown.module.css";

const Dropdown = () => {
  const [selected, setSelected] = createSignal("remove");

  return (
    <div class={styles.dropdownWrapper}>
      <select class={styles.customSelect} value={selected()} onInput={(e) => setSelected(e.currentTarget.value)}>
        <option value="remove">Erase Unwanted</option>
        <option value="replace">Replace Object</option>
        <option value="generate">Generate Photos</option>
      </select>
    </div>
  );
};

export default Dropdown;
