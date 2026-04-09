const getRequiredEnv = (key) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

module.exports = {
  databaseUrl: getRequiredEnv('DATABASE_URL'),
  isProduction: process.env.NODE_ENV === 'production',
  jwtSecret: getRequiredEnv('JWT_SECRET'),
  port: Number(process.env.PORT) || 5000,
};
