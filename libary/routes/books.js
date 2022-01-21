const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
     
      next(error);
    }
  }
}



/*  Shows the full list of books. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll({order: [["createdAt", "DESC"]]})
  res.render("books/index", { books: books });
}));

/* Shows the create new book form. */
router.get('/new', (req, res) => {
  res.render("books/new", { book: {}, title: "New Book", button: "Create New Book" });
});

/* Posts a new book to the database. */
router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body); 
    res.redirect("/books/");
  }catch (error) {
    if(error.name === "SequelizeValidationError") {
      book= await Book.build(req.body);
      res.render("books/new", { book, errors: error.errors, title: "New Book", button: "Create New Book" })
    } else {
      throw error;
    } 
  } 
}));

/* Shows book detail form. */
router.get("/:id", asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id)
  if(book) {
    res.render("books/edit", { book: book, title: "Update Book", button: "Update Book"  });
  } else {
    res.render('books/errors')
  //res.sendStatus(404);
  }
}));


/* Updates book info in the database. */
router.post('/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id)
    if(book) {
      await book.update(req.body)
      res.redirect("/books/"); 
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("books/edit", { book, errors: error.errors, title: "Update Book", button: "Update Book"  })
    } else {
      throw error;
    }
  }

}));


/* Deletes a book. */
router.post('/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
  res.redirect("/books");
  } else {
    res.sendStatus(404);
  }  
}));

module.exports = router;