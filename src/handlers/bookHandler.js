const {
  books,
  addBook,
  findBookById,
  updateBook,
  deleteBook,
} = require("../models/book");

const addBookHandler = (request, h) => {
  try {
    const book = drawBook(request);

    return validateBook(book)
      .then((book) => {
        return addBook(book)
          .then((newBook) => newBook)
          .catch((err) => err);
      })
      .then((newBook) => {
        const response = h.response({
          status: "success",
          message: "Buku berhasil ditambahkan",
          data: { bookId: newBook.id },
        });
        response.code(201);

        return response;
      })
      .catch((message) => {
        const response = h.response({
          status: "fail",
          message: `Gagal menambahkan buku. ${message}`,
        });
        response.code(400);

        return response;
      });
  } catch (err) {
    const response = h.response({
      status: "fail",
      message: "Catatan gagal ditambahkan",
    });
    response.code(500);

    return response;
  }
};

const getAllBookHandler = (request) => {
  const { name, reading, finished } = request.query;
  let filteredBooks = books;

  if (name) {
    filteredBooks = books.filter((book) =>
      eval(`/${name.toLowerCase()}/`).test(book.name.toLowerCase())
    );
  }

  if (reading) {
    filteredBooks = books.filter((book) => book.reading == reading);
  }

  if (finished) {
    filteredBooks = books.filter((book) => book.finished == finished);
  }

  const selectedKeys = ["id", "name", "publisher"];
  const booksWithSelectedKeys = filteredBooks.map((book) =>
    selectedKeys.reduce((prev, current) => {
      prev[current] = book[current];

      return prev;
    }, {})
  );
  return {
    status: "success",
    data: {
      books: booksWithSelectedKeys,
    },
  };
};

const getBookByIDHandler = (request, h) => {
  const { bookId } = request.params;

  return findBookById(bookId)
    .then((book) => {
      return {
        status: "success",
        data: {
          book,
        },
      };
    })
    .catch(() => {
      const response = h.response({
        status: "fail",
        message: "Buku tidak ditemukan",
      });
      response.code(404);

      return response;
    });
};

const updateBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = drawBook(request);

  return validateBook(book)
    .then((book) => {
      return updateBook(bookId, book)
        .then(() => {
          return h.response({
            status: "success",
            message: "Buku berhasil diperbarui",
          });
        })
        .catch(() => {
          const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Id tidak ditemukan",
          });
          response.code(404);

          return response;
        });
    })
    .catch((message) => {
      const response = h.response({
        status: "fail",
        message: `Gagal memperbarui buku. ${message}`,
      });
      response.code(400);

      return response;
    });
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  return deleteBook(bookId)
    .then(() => {
      return h.response({
        status: "success",
        message: "Buku berhasil dihapus",
      });
    })
    .catch(() => {
      const response = h.response({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan",
      });
      response.code(404);

      return response;
    });
};

const validateBook = (book) => {
  return new Promise((resolve, reject) => {
    if (!book.name) {
      return reject("Mohon isi nama buku");
    }

    if (book.readPage > book.pageCount) {
      return reject("readPage tidak boleh lebih besar dari pageCount");
    }

    return resolve(book);
  });
};

const drawBook = (request) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  return {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  };
};

module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookByIDHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};
