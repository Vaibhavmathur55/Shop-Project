 //Done so that these routes load only if session exist
 module.exports = (req, res, next) => {
    if(!req.session.isLoggedIn){
    return res.redirect('/login')
  }
  next()
}
