const mongoose = require('mongoose');
const {Schema} = require("mongoose");
const schema = mongoose.Schema;
const bCrypt = require('bcrypt-nodejs');

// define our model
const userSchema = new Schema({
    email: {type: String, unique: true, lowercase: true},
    password: String
});

// on Save Hook, encrypt password
//Before saving a model, run this function
userSchema.pre('save', function (next){
    // get access to the user model
    const user = this;

    // generate a salt then run callback
    bCrypt.genSalt(10, function (err, salt){
        if (err){return next(err)}

        // hash  (encrypt) our password using the salt
        bCrypt.hash(user.password, salt, null, function (err, hash){
            if (err){return next(err)}

            // overwrite plain text password with encrypt password
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (candidatePassword, callback){
    bCrypt.compare(candidatePassword, this.password, function (err, isMatch){
        if (err){ return callback(err);}
        callback(null, isMatch);
    })

}

// create the model class
const modelClass = mongoose.model('user', userSchema);

//export the model
module.exports = modelClass;