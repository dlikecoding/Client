import styles from "../Group.module.css";
import { A } from "@solidjs/router";
import { useManageURLContext } from "../../../context/ManageUrl";
import { Index } from "solid-js";

const ByYears = (props: any) => {
  const { params, updatePage } = useManageURLContext();
  const medias = () => props.medias;

  let targetRef: HTMLAnchorElement | null = null;
  requestAnimationFrame(() => {
    if (targetRef) targetRef.scrollIntoView({ behavior: "instant", block: "center" });
  });

  return (
    <Index each={medias()}>
      {(photo) => (
        <A
          ref={(el) => (photo().create_year === params.year ? (targetRef = el) : undefined)}
          class={styles.mediaContainer}
          onClick={() => {
            updatePage({ year: photo().create_year, month: photo().create_month });
          }}
          href="/library/month">
          <div inert class={styles.overlayText}>
            <h3>{photo().create_year}</h3>
          </div>
          <img inert loading="lazy" alt="Year Photos" src={photo().thumb_path} />
        </A>
      )}
    </Index>
  );
};

export default ByYears;
