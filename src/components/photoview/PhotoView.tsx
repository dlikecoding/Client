import { MediaContextProvider } from "../../context/Medias";
import { ViewMediaProvider } from "../../context/ViewContext";
import ContextView from "./ContextView";

const PhotoView = () => {
  return (
    <MediaContextProvider>
      <ViewMediaProvider>
        <ContextView />
      </ViewMediaProvider>
    </MediaContextProvider>
  );
};

export default PhotoView;
