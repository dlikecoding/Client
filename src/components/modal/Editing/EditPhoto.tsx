import { Component, onMount } from "solid-js";
import LayoutEditing from "./LayoutEditing";

import BrusherDrawing from "./eraser/Brusher";
import Dropdown from "./options.tsx/Dropdown";
import { useManageURLContext } from "../../../context/ManageUrl";
import { useViewMediaContext } from "../../../context/ViewContext";

type EditPhotoProps = {
  photo: HTMLImageElement;
};

const EditPhoto: Component<EditPhotoProps> = (props) => {
  const { setOpenModal } = useViewMediaContext();

  const handleCancel = () => setOpenModal("isEditing", false);

  const handleDone = () => {
    // photo save logic
    setOpenModal("isEditing", false);
  };

  const { setView } = useManageURLContext();
  onMount(() => setView("modalObjFit", true));

  return (
    <LayoutEditing onCancel={handleCancel} onDone={handleDone} dropdown={Dropdown()}>
      <BrusherDrawing photo={props.photo} />
    </LayoutEditing>
  );
};

export default EditPhoto;
