const User = require('../models/user')
const bcrypt = require('bcryptjs')

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
      path: '/login',
      pgTitle: 'Login',
      errorMsg: req.flash('error')[0]
    })
  };

exports.postLogin = (req, res, next) => {
  const extractedEmail = req.body.email
  const extractedPassword = req.body.password
  //Left one for database and right for extracted value
  User.findOne({email: extractedEmail}).then(user => {
    if(!user){
/*We don't know whether user entered an invalid e-mail or anything. Hence in the render method, we don't know if we want to include some error message. So, we store some data before we redirect which we then use in the brand new request that is triggered by the redirect using session. But we don't want to store the error message in the session permanently, instead flash it onto the session and once the error message was then used, pull it out of the session so that for subsequent requests, this error message is not part of the session anymore */
      //Key under which error message is stored
      req.flash('error', 'Invalid Email or password')
      return res.redirect('/login');
    }
    //Compare the entered password with the one in database
    return bcrypt.compare(extractedPassword, user.password).then(doMatch => {
       //If correct password, redirect to homepage with all routes present, so setting up a session
      if(doMatch){
      //Reaching the session object in request
        req.session.isLoggedIn = true;
        req.session.user = user;
        //Return to avoid execution of redirection to '/login'
        return req.session.save(err => {
        res.redirect('/')
      })
      }
      req.flash('error', 'Invalid email or password.');
      //Incorrect password
      res.redirect('/login');
    })
  })
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/');
  })
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
      path: '/signup',
      pgTitle: 'Signup',
      errorMsg: req.flash('error')[0]
    });
  };

exports.postSignup = (req, res, next) => {
  //We need to get email and password. Also need to check is user with that email address exist to avoid duplicacy
  const extractedEmail = req.body.email
  const extractedPassword = req.body.password
  //Left one for database and right for extracted value
  User.findOne({email: extractedEmail}).then(userDoc => {
    if(userDoc){
      req.flash('error', 'E-Mail exists already, please pick a different one.');
      return res.redirect('/signup');
    }
    //To encrypt password, using salt value as 12, means 12 rounds of hashing will be considered highly secured
    return bcrypt.hash(extractedPassword, 12)
  })
  .then(hashedPassword => {
    const user = new User({
      email: extractedEmail,
      password: hashedPassword,
      cart: { items: [] }
    })
    return user.save()
  })
  .then(result => {
    res.redirect('/login')
  })
};
  