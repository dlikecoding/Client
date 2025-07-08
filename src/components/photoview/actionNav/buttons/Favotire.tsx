import { createMemo } from "solid-js";
import { FavoriteButtonIcon } from "../../../svgIcons";
import { useMediaContext } from "../../../../context/Medias";
import { useViewMediaContext } from "../../../../context/ViewContext";

type FavoriteProps = {
  action: () => void;
  openModal: () => boolean;
};

export const Favorite = (props: FavoriteProps) => {
  const { items } = useMediaContext();
  const { displayMedias } = useViewMediaContext();

  /** change fill or not for the status of heart on click:
   * For example:
   * - if model is not open, do not fill the heart
   * - otherwise, fill the heart when user clicked on it, or when user change
   * to the other image where is favorite*/
  const isFill = createMemo(() => {
    if (!props.openModal()) return false;
    if (!items().size) return false;

    const index = items().keys().next().value;

    if (index === undefined || index < 0) return false;

    if (displayMedias[index]) return displayMedias[index].favorite;

    return false;
  });

  return <button onClick={props.action}>{FavoriteButtonIcon(isFill())}</button>;
};
