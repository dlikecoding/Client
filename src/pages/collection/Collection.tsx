import TimeLine from "../TimeLine";

const Collection = (props: any) => {
  return (
    <div>
      <h1>Collection</h1>
      {props.children}
      <TimeLine />
    </div>
  );
};

export default Collection;
