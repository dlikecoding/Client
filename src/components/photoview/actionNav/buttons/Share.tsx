import { useMediaContext } from "../../../../context/Medias";
import { ShareButtonIcon } from "../../../svg-icons";

export const Share = () => {
  const { items } = useMediaContext();

  return (
    <button onClick={() => {}} disabled={items().size < 1}>
      {ShareButtonIcon()}
    </button>
  );
};
