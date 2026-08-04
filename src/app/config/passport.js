import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User, { IsActive, Role } from "../modules/user/user.model.js";

import {
  Strategy as GoogleStrategy,
} from "passport-google-oauth20";
import { envVars } from "./env.js";



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


passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(null, false, {
            message: "No email found",
          });
        }

        let user = await User.findOne({ email });

        if (user && !user.isVerified) {
          return done(null, false, {
            message: "User is not verified",
          });
        }

        if (
          user &&
          (user.isActive === IsActive.BLOCKED ||
            user.isActive === IsActive.INACTIVE)
        ) {
          return done(null, false, {
            message: `User is ${user.isActive}`,
          });
        }

        if (user && user.isDeleted) {
          return done(null, false, {
            message: "User is deleted",
          });
        }

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            picture: profile.photos?.[0]?.value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }

        return done(null, user);
      } catch (error) {
        console.error("Google Strategy Error:", error);
        return done(error);
      }
    }
  )
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
