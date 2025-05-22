import { createMemo } from "solid-js";
import { useMediaContext } from "../../../context/Medias";

const Select = () => {
  const { setItems, isSelected, setIsSelected } = useMediaContext();

  createMemo(() => {
    // Hide navigation bar when Select button clicked
    if (isSelected()) {
      document.querySelectorAll(".footer_nav").forEach((el) => {
        (el as HTMLElement).classList.add("hideFooter");
      });
    } else {
      document.querySelectorAll(".footer_nav").forEach((el) => {
        (el as HTMLElement).classList.remove("hideFooter");
      });
      setItems(new Map());
    }
  });

  return (
    <button onClick={() => setIsSelected((prev) => !prev)} style={{ "padding-left": "15px", "padding-right": "15px" }}>
      {!isSelected() ? "Select" : "Cancel"}
    </button>
  );
};

export default Select;
