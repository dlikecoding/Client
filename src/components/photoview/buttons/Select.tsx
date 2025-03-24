import { createMemo } from "solid-js";
import { useMediaContext } from "../../../context/Medias";

const Select = () => {
  const { setItems, isSelected, setIsSelected } = useMediaContext();

  const footerBar = document.getElementById("navigationBar") as HTMLElement;

  createMemo(() => {
    // Hide navigation bar when Select button clicked
    if (isSelected()) {
      footerBar.style.display = "none";
    } else {
      footerBar.style.display = "";
      setItems(new Map());
    }
  });

  return (
    <button onClick={() => setIsSelected((prev) => !prev)} style={{ padding: "5px 10px" }}>
      {!isSelected() ? "Select" : "Cancel"}
    </button>
  );
};

export default Select;
