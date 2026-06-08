export const securityConfig = {
  bcrypt: {
    saltRounds: 12
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '15m',
    refreshExpiresIn: '7d'
  },
  session: {
    maxAge: 15 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
    loginMax: 10,
    paymentMax: 5
  }
};
