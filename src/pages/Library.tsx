import TimeLine from "./TimeLine";

const Library = (props: any) => {
  return (
    <div>
      <h1>Library</h1>
      {props.children}
      <TimeLine />
    </div>
  );
};

export default Library;
