export const deleteComicBook = async (comicBookId: number) => {
  return `Deleted comic book with id: ${comicBookId}`;
};

export const getAllComicBooks = async () => {
  return [
    {
      id: 1,
      title: "Avengers",
      issue_number: 1,
      publisher_id: 2,
      published_date: "2018-05-02",
      created_at: new Date(),
    },
    {
      id: 2,
      title: "Batman",
      issue_number: 1,
      publisher_id: 1,
      published_date: "2016-06-15",
      created_at: new Date(),
    },
  ];
};

export const getComicBookById = async (comicBookId: number) => {
  return [
    {
      id: comicBookId,
      title: "Avengers",
      issue_number: 1,
      publisher_id: 2,
      published_date: "2018-05-02",
      created_at: new Date(),
    },
  ];
};

export const postComicBook = async () => {
  return `Created comic book`;
};

export const putComicBook = async (comicBookId: number) => {
  return `Updated comic book with id: ${comicBookId}`;
};
