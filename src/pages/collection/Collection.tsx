import Navigate from "../Navigate";

const Collection = (props: any) => {
  return (
    <main class="mainHomePage currentActivePage">
      {props.children}
      <Navigate />
    </main>
  );
};

export default Collection;
