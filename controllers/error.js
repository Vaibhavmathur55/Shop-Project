exports.error = (req, res, next) => {
    res.status(404).render('error', {
    pgTitle: 'Error', 
    path: '/error',
    isAuthenticated: req.session.isLoggedIn
    })
}