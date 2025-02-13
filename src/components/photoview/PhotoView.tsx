import { ViewMediaProvider } from "../../context/ViewContext";
import ContextView from "./ContextView";

const PhotoView = () => {
  return (
    <ViewMediaProvider>
      <ContextView />
    </ViewMediaProvider>
  );
};

export default PhotoView;
