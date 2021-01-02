
let express = require('express'); //imported package called express
const session = require('express-session');
let sess;
let path = require('path');
let fs=require('fs');


var logger = require('morgan');
const e = require('express');

var app = express(); //this is our server

// view engine setup
app.set('views', path.join(__dirname, 'views'));//views is where all the HTML is
app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public'))); // setting path for all static files
app.listen(3000);

app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

app.get('/', function(req,res){
  res.render ('login', {message:''});
}); //functon is executed whenever a get request is sent to the server


module.exports = app;
app.post('/register', function(req,res){
  const username =req.body.username ;
  const userPassword = req.body.password;
  if(createUser(username,userPassword)==2){
   res.redirect('/home');
   sess= req.session
   sess.User_name= req.body.username;

  // currentUser= username;
  }
  else if (createUser(username,userPassword)==1){
    res.render('registration',{valid: "Username taken"});
    //res.json({ valid: true });

   }
  else{
    res.render('registration',{valid: "Please enter valid username and password"});
  }
  

});

function createUser(name, Password) {
    
 if (name == "" || Password == "") {
     console.log("enter valid string");
     return 0;    
  }
  
  const user = {
      User_name: name,
      User_password: Password,
      wishlist: []
  }
      var data= fs.readFileSync('database.json');
      var users=JSON.parse(data);
    
     if (validateUser(user,users)) {
         console.log("username  or password taken");
         return 1;

      }

     users.push(user);
     let JSON_User = JSON.stringify(users);
     fs.writeFileSync('database.json',JSON_User );
     return 2;

  }

  function validateUser(user,users){
    if (users.length==0)
    return false;
  
    for (let i = 0; i < users.length; i++) {
      if (users[i].User_name == user.User_name)
         return true;
  }
  return false;
  

}



app.post('/', function(req,res){
  const username =req.body.username ;
  const userPassword = req.body.password;

  if (validateLogIn(username,userPassword)==0){
    res.render('login',{ message:"Please enter valid username or password"});
  }
  else if (validateLogIn(username,userPassword)==1){
    res.redirect('/home');
    sess= req.session
    sess.User_name= req.body.username;
  //  currentUser = username;
  }
  else {
      res.render('login',{ message:"Username or Password incorrect"});
    }

});
app.get('/home',function(req,res){
  res.render('home');
})

function validateLogIn(name, password) {

  if(name=="" || password=="")
    return 0;

  var data= fs.readFileSync('database.json');
  var users=JSON.parse(data);


  for (let i = 0; i < users.length; i++) {
      let found=false;

      if (users[i].User_name == name && users[i].User_password == password) {
              return 1;
      }
    }
    return 2;

     

}

app.get('/registration',function(req,res){
  res.render('registration',{valid:""});
});
app.get('/novel',function(req,res){
  res.render('novel');
});
app.get('/poetry',function(req,res){
  res.render('poetry');
});
app.get('/fiction',function(req,res){
  res.render('fiction');
});
app.get('/readlist',function(req,res){
  res.render('readlist');
});
app.get('/flies',function(req,res){
  res.render('flies');
});
app.get('/grapes',function(req,res){
  res.render('grapes');
});
app.get('/dune',function(req,res){
  res.render('dune');
});
app.get('/mockingbird',function(req,res){
  res.render('mockingbird');
});
app.get('/leaves',function(req,res){
  res.render('leaves');
});
app.get('/sun',function(req,res){
  res.render('sun');
});


app.post('/dune', function(req,res){ //specify different action name for each book
  const bookURL = req.url;
  addToWishList(bookURL);

});
app.post('/leaves', function(req,res){ //specify different action name for each book
  const bookURL = req.url;
  addToWishList(bookURL);

});
app.post('/grapes', function(req,res){ //specify different action name for each book
  const bookURL = req.url;
  addToWishList(bookURL);

});
app.post('/sun', function(req,res){ //specify different action name for each book
  const bookURL = req.url;
  addToWishList(bookURL);

});
app.post('/mockingbird', function(req,res){ //specify different action name for each book
  const bookURL = req.url;
  addToWishList(bookURL);

});
app.post('/flies', function(req,res){ //specify different action name for each book
  const bookURL = req.url;
  addToWishList(bookURL);

});
app.post('/readlist', function(req, res) {
  let html = displayBook();
  res.render('readlist', {wishlist: html});
});

app.post('/removedune', function(req, res) {
  let url = "/dune";
  removeBook(url);
  let html = displayBook();
  res.render('readlist', {wishlist: html});
})


function removeBook(url){
  let data2= fs.readFileSync('database.json');
  let users = JSON.parse(data2);
  let wishlist;
  for(let j=0; j<users.length; j++){
    if (users[j].User_name == sess.User_name){
      wishlist = users[j].wishlist
      for(let i=0; i<wishlist.length; i++){
        if (wishlist[i].url = url){
             wishlist.splice(i);
             break;
        }
      }
    }
  }
    let JSON_User = JSON.stringify(users);
    fs.writeFileSync('database.json',JSON_User );
}

function displayBook (){
  console.log(sess.User_name);
  let data= fs.readFileSync('database.json');
  let users = JSON.parse(data)
  let html ="";
  let wlist;
  for(let j=0; j<users.length; j++){
    if (users[j].User_name == sess.User_name){ 
        wlist= users[j].wishlist;
    }
  }
    for(let i=0; i<wlist.length; i++){
      html += 
      ` <div class="container">
        <img id="image" src=${wlist[i].image} width="193" height="300">
           <br>
             <label class="label"> ${wlist[i].name} </label>
           <br>
        <button onclick="location.href = ${wlist[i].url};"  class="btn btn-secondary ml-3"> Go To Book Page </button>
        <form type="submit" method='post' action='/remove${wlist[i].name}'>
        <button class="btn btn-secondary ml-3"> Remove From Wishlist </button>
        </form>
  </div>  `
      }
      return html;
}
function addToWishList(url){
  let data= fs.readFileSync('books.json');
  let books = JSON.parse(data)
  let book;
  for(let i=0; i<books.length; i++){
    if (books[i].url == url ){
      book = books[i];
      break;
    }
  }
  let data2= fs.readFileSync('database.json');
  let users = JSON.parse(data2)
  for(let j=0; j<users.length; j++){
    if (users[j].User_name == sess.User_name){
      users[j].wishlist.push(book);
      let JSON_User = JSON.stringify(users);
      fs.writeFileSync('database.json',JSON_User );
      return;
    }
  } 
  
}




