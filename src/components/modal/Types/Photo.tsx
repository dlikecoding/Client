import { Component } from "solid-js";
import { MediaType } from "../../../context/ViewContext";

interface PhotoProps {
  media: MediaType;
}

const Photo: Component<PhotoProps> = (props) => {
  return <img inert loading="lazy" src={props.media.SourceFile} alt={`Modal Image`} />;
};

export default Photo;
