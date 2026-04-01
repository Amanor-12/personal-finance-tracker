const getRequiredEnv = (key) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

module.exports = {
  port: Number(process.env.PORT) || 5000,
  databaseUrl: getRequiredEnv('DATABASE_URL'),
  jwtSecret: getRequiredEnv('JWT_SECRET'),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
