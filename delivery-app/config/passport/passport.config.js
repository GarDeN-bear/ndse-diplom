import bcrypt from "bcrypt";
import passport from "passport";
import LocalStrategy from "passport-local";

import User from "../../src/db/users.js";

passport.use(
  "local",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false);
        }

        const passwordState = await bcrypt.compare(password, user.passwordHash);

        if (!passwordState) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("-__v");
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
