const User = require('../models/User');
const  jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user){
    const timeStamp = new Date().getTime();
    return jwt.encode({sub: user.id, iat: timeStamp }, config.secret)
}
exports.signIn = function (req, res, next){
     // user has already had their email and password auth'd
    // we just need to give them a token
    res.send({token: tokenForUser(req.user)});
}

exports.signup = function (req, res, next){

    // extract email and password from HTTP request
    const email = req.body.email;
    const password = req.body.password;

    if (! email || !password){
        return res.status(442).send({error: 'You must provide email and password'});
    }

    //check if a user with the given email exists
    User.findOne({email: email}, function (err, existingUser){
        if (err){return next(err)}

        //if a user with email does exist, return an error
        if (existingUser){
            return res.status(422).send({err: 'Email is in user'})
        }
        //if a user with email does not exist, create and save user record
        const user = new User({
            email: email,
            password: password
        });
        user.save(function (err){
            if (err){return next(err)}
            //respond to request indicating the user was created
            res.json({token: tokenForUser(user )})
        });
    });
}