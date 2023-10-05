const User = require('../models/user')

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
      })
}


exports.postLogin = (req, res, next) => {
  // fetch the user
  User
  .findById("6515e109cc5a0165389b85f0")
  .then(user => {
    // Store the user in the session
    req.session.user = user  
    req.session.isLoggedIn = true
    res.redirect('/')    
  })
  .catch(err => console.log(err))
}
  
exports.postLogout = (req, res, next) => {
 req.session.destroy(err =>{
  console.log(err);
  res.redirect('/')    
 })
}
  
