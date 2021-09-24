const Authentication = require('./controller/Authentication')
const passportService = require('./services/passport');
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignIn = passport.authenticate('local', {session: false});

module.exports = function (app){
    app.get('/', requireAuth, function (req, res){
        res.send({hi: 'there'})
    })
    app.post('/signIn', requireSignIn, Authentication.signIn)
    app.post('/signup', Authentication.signup)
}