import styles from "./NotFound.module.css";

const NotFound = (props: any) => {
  return (
    <div inert class={styles.main_not_found}>
      <div class={styles.fof}>
        <h1>{props.errorCode || "Error 500"}</h1>
        <p>{props.message || "Page you are looking for could not be found."}</p>
      </div>
    </div>
  );
};

export default NotFound;
