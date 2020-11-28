//authenticates user

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");
const SECRET = process.env.SECRET;

//The opts object contains jwt token and the secret key.
//When this object is passed in JwtStrategy, we get jwt_payload in our callback 
// (remember our jwt_payload consist of id and username), we then try to find a user 
// with a matching id field in our database and return either no error and the user object or 
// false if the user was not found.
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET;

module.exports = passport => {
   passport.use(
      new JwtStrategy(opts, (jwt_payload, done) => {
         User.findOne({ _id: jwt_payload.id })
            .then(user => {
               if (user) {
                  return done(null, user);
               } else {
                  return done(null, false);
               }
            })
            .catch(err =>
               console.log({ error: "Error authenticating the user" })
            );
      })
   );
};