import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../modules/user/user.model.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, {
            message: "User does not exist",
          });
        }

        const isGoogleAuthenticated = user.auths?.some(
          (provider) => provider.provider === "google",
        );

        if (isGoogleAuthenticated && !user.password) {
          return done(null, false, {
            message:
              "Please sign in with Google first, then set a password if you want to log in using email and password.",
          });
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) {
          return done(null, false, {
            message: "Password does not match",
          });
        }

        return done(null, user);
      } catch (error) {
        console.error(error);
        return done(error);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);

    done(null, user);
  } catch (error) {
    done(error);
  }
});
