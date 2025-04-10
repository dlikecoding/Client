import styles from "./Groups.module.css";
import { A } from "@solidjs/router";
import { useManageURLContext } from "../../../context/ManageUrl";
import { createSignal, Index, onMount } from "solid-js";

const ByYears = (props: any) => {
  const { params, updatePage } = useManageURLContext();
  const medias = () => props.medias;

  const [targetRef, setTargetRef] = createSignal<HTMLAnchorElement | null>(null);

  onMount(() => {
    if (targetRef()) targetRef()!.scrollIntoView({ behavior: "instant", block: "center" });
  });

  return (
    <Index each={medias()}>
      {(photo) => (
        <A
          ref={(el) => (photo().create_year === params.year ? setTargetRef(el) : undefined)}
          class={styles.mediaContainer}
          onClick={() => {
            updatePage({ year: photo().create_year, month: photo().create_month });
          }}
          href="/library/month">
          <div class={styles.overlayText}>
            <h3>{photo().create_year}</h3>
          </div>
          <img loading="lazy" alt="Year Photos" src={photo().thumb_path} />
        </A>
      )}
    </Index>
  );
};

export default ByYears;
