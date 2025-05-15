import { Component } from "solid-js";
import { Setter } from "solid-js";
import LayoutEditing from "./LayoutEditing";

type EditVideoProps = {
  video: HTMLVideoElement;
  setIsEditing: Setter<boolean>;
};

const EditVideo: Component<EditVideoProps> = (props) => {
  const handleCancel = () => props.setIsEditing(false);
  const handleDone = () => {
    // implement video save logic
    props.setIsEditing(false);
  };

  return (
    <LayoutEditing onCancel={handleCancel} onDone={handleDone}>
      {/* Media-specific logic/UI */}
      <div style={{ color: "white" }}></div>
    </LayoutEditing>
  );
};

export default EditVideo;
