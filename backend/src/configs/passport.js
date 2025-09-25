const { PrismaClient } = require("../../generated/prisma");
const { Passport } = require("passport");
const { Strategy: jwtStrategy, ExtractJwt } = require("passport-jwt");

const prisma = new PrismaClient();
const passport = new Passport();
passport.use(
  new jwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwt_payload, done) => {
      try {
        const user = await prisma.user.findFirst({
          where: { id: jwt_payload.sub },
        });

        if (!user) return done(null, false);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findFirst({ where: { id: id } });

    if (!user) done(null, false);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
