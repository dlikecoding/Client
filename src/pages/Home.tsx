import { A } from "@solidjs/router";

const Home = (props: any) => {
  return (
    <main>
      <h1>Homepage</h1>
      {props.children}

      <nav style={{ color: "orange" }}>
        <li>
          <A href="/library">Library</A>
        </li>
        <li>
          <A href="/collection">Collection</A>
        </li>
        <li>
          <A href="#">Upload</A>
        </li>
      </nav>
    </main>
  );
};

export default Home;
