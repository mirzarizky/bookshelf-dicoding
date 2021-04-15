const {
  addBookHandler,
  getAllBookHandler,
  getBookByIDHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
} = require("./handlers/bookHandler");

const routes = [
  {
    method: "POST",
    path: "/books",
    handler: addBookHandler,
  },
  {
    method: "GET",
    path: "/books",
    handler: getAllBookHandler,
  },
  {
    method: "GET",
    path: "/books/{bookId}",
    handler: getBookByIDHandler,
  },
  {
    method: "PUT",
    path: "/books/{bookId}",
    handler: updateBookByIdHandler,
  },
  {
    method: "DELETE",
    path: "/books/{bookId}",
    handler: deleteBookByIdHandler,
  },
];

module.exports = routes;
