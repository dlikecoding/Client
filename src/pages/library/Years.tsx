import styles from "./Group.module.css";
import { A } from "@solidjs/router";
import { GroupMedia } from "./GroupView";
import { useManageURLContext } from "../../context/ManageUrl";
import { onMount } from "solid-js";

type TypeYears = {
  photo: GroupMedia;
};

const Years = (props: TypeYears) => {
  const photo = () => props.photo;

  const { params, updatePage } = useManageURLContext();
  let target: HTMLAnchorElement | undefined = undefined;

  onMount(() => {
    requestAnimationFrame(() => {
      if (!params.year || !target) return;
      target.scrollIntoView({ behavior: "instant", block: "center" });
    });
  });

  return (
    <A
      ref={(el) => {
        if (photo().create_year === params.year) target = el;
      }}
      class={styles.mediaContainer}
      onClick={() => updatePage({ year: photo().create_year, month: photo().create_month })}
      href="/library/month">
      <div inert class={styles.overlayText}>
        <h3>{photo().create_year}</h3>
      </div>
      <img inert loading="lazy" alt="Year Photos" src={photo().thumb_path} />
    </A>
  );
};

export default Years;
