import { A, useParams } from "@solidjs/router";

const FooterCollection = () => {
  const params = useParams();

  return (
    <>
      <A href="/collection" inactiveClass="inactive_button" activeClass="active_button">
        Portfolio
      </A>
      <A
        href={`/${params.pages}/${params.id}`}
        on:click={() => console.log(`${params.pages} ${params.id}`)}
        inactiveClass="inactive_button"
        activeClass="active_button">
        View
      </A>
    </>
  );
};

export default FooterCollection;
