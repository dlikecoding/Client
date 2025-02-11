import styles from "./Buttons.module.css";
// import { useMediaContext } from "../../../context/Medias";
import { createEffect } from "solid-js";

const Select = () => {
  // const { setItems, isSelected, setIsSelected } = useMediaContext();

  // const handleSelectClick = () => {
  //   setIsSelected((prev) => !prev); // Toggle the selection state
  // };

  // createEffect(() => {
  //   if (!isSelected()) {
  //     setItems(new Map<number, string>());
  //   }
  // });

  return (
    <button onClick={() => console.log()} style={{ padding: "5px 10px" }}>
      {/* {!isSelected() ? "Select" : "Cancel"} */}
      Select
    </button>
  );
};

export default Select;
