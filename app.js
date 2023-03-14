const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const config = require('./config');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 7900;
// var errorHandler = require('errorhandler');

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(
  session({
    secret:'889999###%^&',
    saveUninitialized:true,
    resave:false,

  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(__dirname + "/uploads"));

app.use((req,res,next)=>{
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});


//set template engine
app.set('view engine','ejs');
//db connection
var producationString = process.env.DB_URI; //local system database

var options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
//   useFindAndModify:false
};

var db = mongoose.connect(producationString, options, function (err) {
  if (err) {
    console.log(err + "connection failed");
  } else {
    console.log("Connected to database ", producationString);
  }
});

//mongo on connection emit
mongoose.connection.on("connected", function (err) {
  console.log("MongoDB connection successful");
  
});
//mongo on error emit
mongoose.connection.on("error", function (err) {
  console.log("MongoDB Error: ", err);
});
//mongo on dissconnection emit
mongoose.connection.on("disconnected", function () {
  console.log("mongodb disconnected and trying for reconnect");
});

const userRoute = require('./routes/route');
app.use('/',userRoute);

app.listen(port,()=>{
    console.log(`server started at http://localhost:${port}`);
})