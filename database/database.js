const books = [
  {
    ISBN:"12345Book",
    title:"tesla",
    pubDate:"2021-07-01",
    language:"en",
    numPage: 250,
    author: [1,2],
    publications:[1],
    category:["tech","space","education"]
  }
]

const author = [
  {
    id:1,
    name:"Sahil",
    books:["12345Book","secretBook"]
  },
  {
    id:2,
    name:"Elon Musk",
    books:["12345Book"]
  }
]

const publication = [
  {
    id:1,
    name:"writex",
    books:["12345Book"]
  },
  {
    id:2,
    name:"Spacex",
    books:[]
  }
]

module.exports= {books,author,publication};
