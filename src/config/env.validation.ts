import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().min(8).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default('1h'),
  JWT_REFRESH_EXPIRES_IN_DAYS: Joi.number().integer().min(1).default(7),
  CORS_ORIGINS: Joi.string().default(
    'http://localhost:3000,http://localhost:3001,http://localhost:3002',
  ),
  LOG_LEVEL: Joi.string()
    .valid('fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent')
    .default('info'),
  LOGIN_THROTTLE_TTL: Joi.number().integer().min(1000).default(60000),
  LOGIN_THROTTLE_LIMIT: Joi.number().integer().min(1).default(5),
});

export function parseCorsOrigins(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}
