import { useMediaContext } from "../../../../context/Medias";
import { FavoriteButtonIcon } from "../../../svgIcons";

type FavoriteProps = {
  action: () => void;
  status: boolean;
};

export const Favorite = (props: FavoriteProps) => {
  const { items } = useMediaContext();

  return (
    <button onClick={props.action} disabled={props.status}>
      {FavoriteButtonIcon()}
    </button>
  );
};
