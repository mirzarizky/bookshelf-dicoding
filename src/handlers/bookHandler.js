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
          status: "error",
          message: `Gagal menambahkan buku. ${message}`,
        });
        response.code(400);

        return response;
      });
  } catch (err) {
    const response = h.response({
      status: "error",
      message: "Catatan gagal ditambahkan",
    });
    response.code(500);

    return response;
  }
};

const getAllBookHandler = () => ({
  status: "success",
  data: { books },
});

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
          return {
            status: "success",
            data: { message: "Buku berhasil diperbarui" },
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
      return {
        status: "success",
        data: { message: "Buku berhasil dihapus" },
      };
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