import { Component } from "solid-js";
import LayoutEditing from "./LayoutEditing";
import { useViewMediaContext } from "../../../context/ViewContext";

type EditVideoProps = {
  video: HTMLVideoElement;
};

const EditVideo: Component<EditVideoProps> = (props) => {
  const { setIsEditing } = useViewMediaContext();

  const handleCancel = () => setIsEditing(false);
  const handleDone = () => {
    // implement video save logic
    setIsEditing(false);
  };

  return (
    <LayoutEditing onCancel={handleCancel} onDone={handleDone}>
      {/* Media-specific logic/UI */}
      <div style={{ color: "white" }}></div>
    </LayoutEditing>
  );
};

export default EditVideo;
