import styles from "./SlideUp.module.css";

type SlideUpProps = {
  idElement: string;
  noticeText?: string;
  confirmBtn: () => void;
  infoText: () => string | "";
};

export const SlideUp = (props: SlideUpProps) => {
  let divPopover: HTMLElement;

  return (
    <>
      <div ref={(el) => (divPopover = el)} popover="auto" id={props.idElement} class={styles.slideupContents}>
        {props.noticeText && <p>{props.noticeText}</p>}

        <button
          class={styles.deleteBtn}
          onClick={() => {
            props.confirmBtn();
            divPopover.hidePopover();
          }}>
          {props.infoText()}
          {/* Delete {items().size} Photo(s) */}
        </button>

        <button class={styles.cancelBtn} onClick={() => divPopover.hidePopover()}>
          Cancel
        </button>
      </div>
    </>
  );
};
