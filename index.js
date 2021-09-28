require("dotenv").config();

const express = require("express");
//mongoose (asynchronous interpreter)
const mongoose= require("mongoose");
//body-parser
const bodyParser = require("body-parser");
//Database
const database= require("./database/database");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//Initialize express
const booksy = express();

//Initialize body-bodyParser
booksy.use(bodyParser.urlencoded({extended:true}));
booksy.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL
).then(() => console.log("Connection Established"));
/*----------------------BOOKS-------------------------------------------*/

/***************************** GET API ***********************/
/*
Route             /
Description       Get all the books
Access            PUBLIC
Parameter         None
Methods           GET
*/
booksy.get("/",async (req,res)=>{
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});
/*----------------------------------------------------------------------------*/

/*
Route             /is
Description       Get specific book on the basis of id
Access            PUBLIC
Parameter         isbn
Methods           GET
*/
booksy.get("/is/:isbn",async(req,res)=>{
const getSpecificBook= await BookModel.findOne({ISBN:req.params.isbn});
  //In mongoose we can't use .length property but we can use null operator
  if(!getSpecificBook){
    return res.json({error:`No book found for the ISBN of ${req.params.isbn}`})
  }
  return res.json ({book:getSpecificBook})
});
/*----------------------------------------------------------------------------*/
/*
Route             /c
Description       Get specific book on the basis of category
Access            PUBLIC
Parameter         category
Methods           GET
*/

booksy.get("/c/:category",async(req,res)=>{
  const getSpecificBook= await BookModel.findOne({category:req.params.category});
    //In mongoose we can't use .length property but we can use null operator
    if(!getSpecificBook){
      return res.json({error:`No book found for the category of ${req.params.category}`})
    }
    return res.json ({book:getSpecificBook})

});
/*----------------------------------------------------------------------------*/
/*
Route             /l
Description       Get specific book on the basis of language
Access            PUBLIC
Parameter         lang
Methods           GET
*/
booksy.get("/l/:lang" , async(req,res)=> {
  const getSpecificBook= await BookModel.findOne({language:req.params.lang});
    //In mongoose we can't use .length property but we can use null operator
    if(!getSpecificBook){
      return res.json({error:`No book found for ${req.params.lang} language`})
    }
    return res.json ({book:getSpecificBook})

  });
/***************************** POST API ***********************/
/*
Route             /book/new
Description       Add new books
Access            PUBLIC
Parameter         None
Methods           POST
*/
booksy.post("/book/new",async(req,res)=>{
  const {newBook} = req.body;
  const AddNewBook= BookModel.create(newBook);

  return res.json({
    books:newBook,
    message:"Book was added!!"
  });
});
/*----------------------------------------------------------------------------*/
/***************************** PUT API ***********************/
/*
Route             book/update
Description       Update book on isbn
Access            PUBLIC
Parameter         isbn
Methods           PUT
*/

booksy.put("/book/update/:isbn", async(req,res)=>{
  const updatedBook = await BookModel.findOneAndUpdate(
    {
    ISBN:req.params.isbn
  },
  {
    title:req.body.bookTitle
  },
  {
    new:true /* true->you want to show up updated database on the frontend of postman and mongodb*/
  }
);
return res.json({
  books:updatedBook
});
});

/***************************** DELETE API ***********************/
/*
Route             /book/delete
Description       Delete book
Access            PUBLIC
Parameter         isbn
Methods           DELETE
*/
booksy.delete("/book/delete/:isbn",async(req,res)=>{
  //whichever book that doesnot match with the isbn, just send that to updatedBook
  //and rest will be filtered out
const updatedBookDatabase = await BookModel.findOneAndDelete(
  {
    ISBN:req.params.isbn
  }
)
  return res.json({books:updatedBookDatabase});

});
/*
Route             /book/delete/author
Description       Delete author from a book
Access            PUBLIC
Parameter         isbn,authorId
Methods           DELETE
*/
booksy.delete("/book/delete/author/:isbn/:authorId",async(req,res)=>{
  //update the BookDatabase
  const updatedBookDatabase=await BookModel.findOneAndUpdate(
    {
      ISBN:req.params.isbn
    },
    {
      $pull:{
            author:req.params.authorId
            }
    },
    {
      new:true
    }
  );


  //update the AuthorDatabase

  const updatedAuthorDatabase = await AuthorModel.findOneAndUpdate(
    {
      id:req.params.authorId
    },
    {
      $pull:{
            books:req.params.isbn
            }
    }
  );

    return res.json({
      book:updatedBookDatabase,
      author:updatedAuthorDatabase,
      message:"author is no-more present in the list"
    });
  });






/*----------------------------------Author------------------------------------------*/
/*
Route             /author
Description       Get all authors
Access            PUBLIC
Parameter         None
Methods           GET
*/
booksy.get("/author", async (req,res)=>{
  const getAllAuthors = await AuthorModel.find();
return res.json(getAllAuthors);

});
/*----------------------------------------------------------------------------*/
/*
Route             /author
Description       Get a specific author based on id
Access            PUBLIC
Parameter         id
Methods           GET
*/
booksy.get("/author/:id", async(req,res)=>{
  const getSpecificAuthor = await AuthorModel.findOne({id:parseInt(req.params.id)})


  if(!getSpecificAuthor){
    return res.json({error:`No author found for ${req.params.id} id`})
  }
  return res.json ({author:getSpecificAuthor})

});
/*----------------------------------------------------------------------------*/
/*
Route             /author/books
Description       Get all authors based on books
Access            PUBLIC
Parameter         isbn
Methods           GET
*/
booksy.get("/author/books/:isbn",async(req,res)=>{
const getSpecificAuthor=await AuthorModel.findOne({books:req.params.isbn});
  if(!getSpecificAuthor){
    return res.json({error:`No author found for the book of ${req.params.isbn} id`});
  }
  return res.json ({author:getSpecificAuthor})
});
/***************************** POST API ***********************/
/*
Route             /author/new
Description       Add new author
Access            PUBLIC
Parameter         None
Methods           POST
*/
booksy.post("/author/new",async(req,res)=>{
  const { newAuthor } = req.body;
  const addNewAuthor = AuthorModel.create(newAuthor);
    return res.json(
      {
        author: addNewAuthor,
        message: "Author was added!!!"
      }
    )}
    );


    /***************************** PUT API ***********************/
    /*
    Route             /book/author/update
    Description       Update/Add new author
    Access            PUBLIC
    Parameter         isbn
    Methods           PUT
    */

    booksy.put("/book/author/update/:isbn",async(req,res)=>{
      //update the book Database
const updatedBook = await BookModel.findOneAndUpdate(
  {
     ISBN: req.params.isbn
  },
  {
    $push:{
                author:req.body.newAuthor
              }
  },
  {
    new:true
  }

);
      //update the author databaase

      const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
          id:req.body.newAuthor
        },
        {
          $push:{
                      books:req.params.isbn
                    }
        },
        {
          new:true
        }
      );
      return res.json({
        books:updatedBook,
        author:updatedAuthor,
        message:"New Author was added"
      });
    });

/*----------------------------------Publications------------------------------------------*/
/*
Route             /publication
Description       Get all publication
Access            PUBLIC
Parameter         None
Methods           GET
*/
booksy.get("/publication",async(req,res)=>{
  const getAllPublications = await PublicationModel.find();
    return res.json(getAllPublications);
});
/*----------------------------------------------------------------------------*/
/*
Route             /publication
Description       Get specific publication
Access            PUBLIC
Parameter         pub
Methods           GET
*/
booksy.get("/publication/:pub",async(req,res)=>{
  const getSpecificPublication = await PublicationModel.findOne({id:parseInt(req.params.pub)});

if(!getSpecificPublication){
  return res.json({error:`No publication found  of ${req.params.pub} id`});
}
return res.json ({publications:getSpecificPublication})
});
/*----------------------------------------------------------------------------*/
/*
Route             /publication
Description       Get specific publication based on books
Access            PUBLIC
Parameter         isbn
Methods           GET
*/
booksy.get("/publication/books/:isbn", async(req,res)=>{

  const getSpecificPublication= await PublicationModel.findOne({books:req.params.isbn})

  if(!getSpecificPublication){
    return res.json({error:`No publication found for the book of ${req.params.isbn} id`})
  }
  return res.json ({publications:getSpecificPublication});
});
/***************************** POST API ***********************/
/*
Route             /publication/new
Description       Add new publication
Access            PUBLIC
Parameter         None
Methods           POST
*/
booksy.post("/publication/new",async(req,res)=>{
  const {newPublication} = req.body;
const addNewPublication = PublicationModel.create(newPublication)


  return res.json({
    publication:addNewPublication,
    message:"publication added"
  });
});
/***************************** PUT API ***********************/
/*
Route             /publication/update/book
Description       Update/Add new publication
Access            PUBLIC
Parameter         isbn
Methods           PUT
*/

booksy.put("/publication/update/book/:isbn",async(req,res)=>{
  //update the publication database
const updatedPublicationDatabase = await PublicationModel.findOneAndUpdate(
{
  id:parseInt(req.body.pubId)
},
  {
    $addToSet:{books:req.params.isbn}
  },
  {
    new:true
  }
);

    //update the book Database

    const updatedBookDatabase = await BookModel.findOneAndUpdate(
      {
        ISBN: req.params.isbn
      },
      {
        publications:parseInt(req.body.pubId)
      },
      {
        new:true
      }
    );

    return res.json({
      books:updatedBookDatabase,
      publications:updatedPublicationDatabase,
      message:"successfully updated publications"
    })
  });



booksy.listen(3000,()=>{
  console.log("server is up and running");
});
