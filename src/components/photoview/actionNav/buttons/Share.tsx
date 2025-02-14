import { useMediaContext } from "../../../../context/Medias";
import { ShareButtonIcon } from "../../../svgIcons";

export const Share = () => {
  const { items } = useMediaContext();

  return (
    <button onClick={() => {}} disabled={items().size < 1}>
      {ShareButtonIcon()}
    </button>
  );
};
