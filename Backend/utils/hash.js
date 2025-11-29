const bcrypt = require('bcryptjs');

const hashPassword = async (plain) => {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
  return bcrypt.hash(plain, saltRounds);
};

const comparePassword = (plain, hash) => {
  return bcrypt.compare(plain, hash);
};

module.exports = { hashPassword, comparePassword };
