import { useParams } from "@solidjs/router";

const PhotoView = () => {
  const params = useParams();

  const pages = {
    favorite: "Favorite",
    deleted: "Recently Deleted",
    hidden: "Hidden",
    duplicate: "Duplicate",
    all: "",
    album: "Album",
    dataset: "Dataset",
  };
  const currentPage = pages[params.pages as keyof typeof pages];
  return (
    <>
      <h1>{currentPage}</h1>
      <p>
        PhotoView - ID: {params.id} - Page: {params.pages}
      </p>
    </>
  );
};

export default PhotoView;
