import { useMediaContext } from "../../../context/Medias";
import { createEffect } from "solid-js";

const Select = () => {
  const { setItems, isSelected, setIsSelected } = useMediaContext();

  const handleSelectClick = () => {
    setIsSelected((prev) => !prev); // Toggle the selection state
  };

  createEffect(() => {
    const footerBar = document.getElementById("navigationBar");

    if (!isSelected()) {
      setItems(new Map<number, string>());
      footerBar?.classList.remove("hideFooter");
    } else {
      footerBar?.classList.add("hideFooter");
    }
  });

  return (
    <button onClick={handleSelectClick} style={{ padding: "5px 10px" }}>
      {!isSelected() ? "Select" : "Cancel"}
    </button>
  );
};

export default Select;
