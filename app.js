const express = require("express")
const app = express()

const bodyParser = require("body-parser")
const path = require('path')
const mongoose = require('mongoose')
const schema = mongoose.Schema
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')
const errorController = require('./controllers/error')
const User = require('./models/user')
const flash = require('connect-flash')
const { doubleCsrf } = require("csrf-csrf");

const {doubleCsrfProtection} = doubleCsrf({
  getSecret: () => 'any long string, used to generate the hash of the token',
  getTokenFromRequest: (req) => req.body.csrfToken
})


app.post('/signup', doubleCsrfProtection, (req, res) => {
  // Handle the request here
  res.locals.doubleCsrfToken = req.csrfToken();
  res.setHeader('__Host-psifi.x-csrf-token', res.locals.doubleCsrfToken);
  res.send('Response');
});

const mongoStore = new MongoDBStore({
    //Requires connection string to know on which database server to store data
    uri: 'mongodb+srv://mathurvidhi2505:%24VidhiM%4025@cluster0.mjodwc6.mongodb.net/shop',
    collection: 'sessions'
})

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))
//'secret' is used for signing the hash which secretly stores ID in the cookie. resave is set to false, means session won't be saved on every request done, or every response send, but only when something changed in session. saveUninitialised set to false, means no session gets saved for a something unchanged about it
app.use(session({secret: 'MySecret', resave: false, saveUninitialized: false, store: mongoStore}))
app.use(doubleCsrfProtection)
//To use this flash middleware anywhere in application
app.use(flash())

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated;
  res.locals.csrfToken = req.csrfToken(true);
  next();
});

//Registering a middleware to store user as a request if found id 
app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    //Storing user while sending request
    User.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  });


app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)
app.use(errorController.error)


mongoose.connect('mongodb+srv://mathurvidhi2505:%24VidhiM%4025@cluster0.mjodwc6.mongodb.net/shop?retryWrites=true&w=majority')
.then(result => {
    app.listen(3000)
})


