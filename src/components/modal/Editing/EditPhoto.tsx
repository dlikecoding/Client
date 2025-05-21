import { Component, onMount, Setter } from "solid-js";
import LayoutEditing from "./LayoutEditing";

import BrusherDrawing from "./eraser/Brusher";
import Dropdown from "./options.tsx/Dropdown";
import { useManageURLContext } from "../../../context/ManageUrl";

type EditPhotoProps = {
  photo: HTMLImageElement;
  setIsEditing: Setter<boolean>;
};

const EditPhoto: Component<EditPhotoProps> = (props) => {
  const handleCancel = () => props.setIsEditing(false);
  const handleDone = () => {
    // photo save logic
    props.setIsEditing(false);
  };

  const { setView } = useManageURLContext();

  onMount(() => setView("modalObjFit", false));
  return (
    <LayoutEditing onCancel={handleCancel} onDone={handleDone} dropdown={Dropdown()}>
      <BrusherDrawing photo={props.photo} />
    </LayoutEditing>
  );
};

export default EditPhoto;
