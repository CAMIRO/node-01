const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')

require("dotenv").config();

const errorController = require("./controllers/error");
const User = require('./models/user')

const { DB_USER, DB_PASSWORD, DB_CLUSTER } = process.env;
const MONGODB_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}.mongodb.net/shop`;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})

const csrfProtection = csrf()

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Creating the session
app.use(
  session({ 
    secret: 'my secret', 
    resave: false, 
    saveUninitialized: false, 
    store 
}))
// Using CSRF TOKEN protection
app.use(csrfProtection)

// initializing the flash error handler
app.use(flash())

// Signing Up with a registered User
app.use((req, res, next) => {
  if (!req.session.user) {
    return next()
  }
  User
  .findById(req.session.user._id)
  .then(user => {
    req.user = user
    next()    
  })
  .catch(err => console.log(err))
})

// Setting Up the global log boolean and the csrf token accross all views
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(3000)
  })
  .catch(err => console.log(err))
