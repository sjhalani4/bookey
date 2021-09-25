const express = require("express");
//Database
const database= require("./database");

//Initialize express
const booksy = express();
/*----------------------BOOKS-------------------------------------------*/
/*
Route             /
Description       Get all the books
Access            PUBLIC
Parameter         None
Methods           GET
*/
booksy.get("/",(req,res)=>{
  return res.json({books:database.books});
});
/*----------------------------------------------------------------------------*/

/*
Route             /is
Description       Get specific book on the basis of id
Access            PUBLIC
Parameter         isbn
Methods           GET
*/
booksy.get("/is/:isbn",(req,res)=>{
  const getSpecificBook = database.books.filter(
    (book)=> book.ISBN === req.params.isbn
  )
  if(getSpecificBook.length===0){
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

booksy.get("/c/:category",(req,res)=>{
  const getSpecificBook= database.books.filter(
    (book)=> book.category.includes(req.params.category)
  )
  if(getSpecificBook.length===0){
    return res.json({error:`No book found for ${req.params.category} category`})
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
booksy.get("/l/:lang" , (req,res)=> {
  const getSpecificBook = database.books.filter(
    (book)=> book.language === req.params.lang
  )
  if(getSpecificBook.length===0){
    return res.json({error:`No book found for ${req.params.lang} language`})
  }
  return res.json ({book:getSpecificBook})

});
/*----------------------------------Author------------------------------------------*/
/*
Route             /author
Description       Get all authors
Access            PUBLIC
Parameter         None
Methods           GET
*/
booksy.get("/author", (req,res)=>{
return res.json({authors:database.author});

});
/*----------------------------------------------------------------------------*/
/*
Route             /author
Description       Get a specific author based on id
Access            PUBLIC
Parameter         id
Methods           GET
*/
booksy.get("/author/:id", (req,res)=>{

  const getSpecificAuthor = database.author.filter(
    (author) => author.id===parseInt(req.params.id)
  )
  if(getSpecificAuthor.length===0){
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
booksy.get("/author/books/:isbn",(req,res)=>{
  const getSpecificAuthor=database.author.filter(
    (author)=>author.books.includes(req.params.isbn)
  );
  if(getSpecificAuthor.length===0){
    return res.json({error:`No author found for the book of ${req.params.isbn} id`});
  }
  return res.json ({author:getSpecificAuthor})
});
/*----------------------------------------------------------------------------*/

/*----------------------------------Publications------------------------------------------*/
/*
Route             /publication
Description       Get all publication
Access            PUBLIC
Parameter         None
Methods           GET
*/
booksy.get("/publication",(req,res)=>{
    return res.json({Publications:database.publication});
});
/*----------------------------------------------------------------------------*/
/*
Route             /publication
Description       Get specific publication
Access            PUBLIC
Parameter         pub
Methods           GET
*/
booksy.get("/publication/:pub",(req,res)=>{
  const getSpecificPublication = database.publication.filter(
    (publication)=> publication.id === parseInt(req.params.pub)
  );

if(getSpecificPublication.length===0){
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
booksy.get("/publication/books/:isbn", (req,res)=>{
  const getSpecificPublication= database.publication.filter(
    (publication)=> publication.books.includes(req.params.isbn)
  );
  if(getSpecificPublication.length===0){
    return res.json({error:`No publication found for the book of ${req.params.isbn} id`})
  }
  return res.json ({publications:getSpecificPublication});
});

booksy.listen(3000,()=>{
  console.log("server is up and running");
});