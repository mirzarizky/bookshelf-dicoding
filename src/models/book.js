const { nanoid } = require("nanoid");

const books = [];

const findBookById = (id) => {
  return new Promise((resolve, reject) => {
    const book = books.filter((book) => book.id === id)[0];
    if (book !== undefined) {
      return resolve(book);
    }

    return reject(null);
  });
};

const addBook = (book) => {
  return new Promise((resolve, reject) => {
    const id = nanoid(16);
    const instertedAt = new Date().toISOString();
    const updatedAt = instertedAt;
    const finished = book.pageCount === book.readPage;

    const newBook = {
      id,
      ...book,
      finished,
      instertedAt,
      updatedAt,
    };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;
    if (isSuccess) {
      return resolve(newBook);
    }

    return reject(null);
  });
};

const updateBook = (id, updatedBook) => {
  return new Promise((resolve, reject) => {
    return findBookById(id)
      .then(() => {
        const updatedAt = new Date().toISOString();
        const index = books.findIndex((book) => book.id === id);
        if (index !== -1) {
          books[index] = {
            ...books[index],
            ...updatedBook,
            updatedAt,
          };

          return resolve(books[index]);
        }
      })
      .catch((reason) => reject(reason));
  });
};

const deleteBook = (id) => {
  return new Promise((resolve, reject) => {
    return findBookById(id)
      .then(() => {
        const index = books.findIndex((book) => book.id === id);
        if (index !== -1) {
          books.splice(index, 1);

          return resolve(books[index]);
        }
      })
      .catch((reason) => reject(reason));
  });
};

module.exports = { books, addBook, findBookById, updateBook, deleteBook };
