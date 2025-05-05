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
    <button onClick={() => setIsSelected((prev) => !prev)} style={{ padding: "5px 10px" }}>
      {!isSelected() ? "Select" : "Cancel"}
    </button>
  );
};

export default Select;

function hideElementsByClass(className: string) {
  document.querySelectorAll(`.${className}`).forEach((el) => {
    (el as HTMLElement).style.display = "none";
  });
}
