const { PrismaClient } = require("../../generated/prisma");
const { Passport } = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const bcrypt = require("bcryptjs");

const passport = new Passport();
const client = new PrismaClient();

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await client.user.findFirst({
        where: { username: username },
      });

      if (!user) return done(null, false, { message: "Invalid Username!" });

      const doesPasswordMatch = bcrypt.compare(password, user.password);

      if (!doesPasswordMatch)
        return done(null, false, { message: "Incorrect Password!" });

      return done(null, user);
    } catch (error) {
      done(error);
    }
  }),
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await client.user.findFirst({
      where: { id: id },
    });

    if (!user) return done(null, false);

    return done(null, user);
  } catch (error) {
    done(error);
  }
});
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwt_payload, done) => {
      try {
        const user = await client.user.findFirst({
          where: { id: jwt_payload.sub },
        });

        if (!user) return done(null, false);

        return done(null, user);
      } catch (error) {
        done(error);
      }
    },
  ),
);

module.exports = passport;
