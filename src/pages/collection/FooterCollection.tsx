import { A, useParams } from "@solidjs/router";

const FooterCollection = () => {
  const params = useParams();

  return (
    <>
      <A href="/collection" inactiveClass="" activeClass="">
        Portfolio
      </A>
      <A href="#" on:click={() => console.log(`${params.pages} ${params.id}`)} inactiveClass="" activeClass="">
        View
      </A>
    </>
  );
};

export default FooterCollection;
