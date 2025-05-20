import { RecoverButtonIcon } from "../../../svgIcons";
import { SlideUp } from "../popover/SlideUp";

import { useMediaContext } from "../../../../context/Medias";
import { ButtonProps } from "../ActionNav";

export const Recover = (props: ButtonProps) => {
  const { items } = useMediaContext();
  const recoverMes = () => `Recover ${items().size} Photo(s)`;

  return (
    <>
      <button popovertarget="recover-contents">{RecoverButtonIcon()}</button>
      <SlideUp
        idElement="recover-contents"
        noticeText={"Recovery deleted media back to server"}
        confirmBtn={props.action}
        infoText={recoverMes}
      />
    </>
  );
};
