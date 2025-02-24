import { useMediaContext } from "../../../context/Medias";

const Select = () => {
  const { isSelected, setIsSelected } = useMediaContext();

  const footerBar = document.getElementById("navigationBar") as HTMLElement;

  const handleSelectClick = () => {
    setIsSelected((prev) => !prev); // Toggle the selection state

    // Hide navigation bar when Select button clicked
    footerBar.style.display = isSelected() ? "none" : "";
  };

  return (
    <button onClick={handleSelectClick} style={{ padding: "5px 10px" }}>
      {!isSelected() ? "Select" : "Cancel"}
    </button>
  );
};

export default Select;
