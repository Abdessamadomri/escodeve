import { Context } from 'hono';
import { HTTP_STATUS, ERROR_MESSAGES, DB_ERRORS } from '../shared/constants';

export function handleError(err: any, c: Context) {
  console.error('Error:', err);

  if (err.code === DB_ERRORS.DUPLICATE_KEY) {
    return c.json({ error: ERROR_MESSAGES.EMAIL_EXISTS }, HTTP_STATUS.BAD_REQUEST);
  }

  if (err.code === DB_ERRORS.FOREIGN_KEY) {
    return c.json(
      { error: 'Référence invalide' },
      HTTP_STATUS.BAD_REQUEST
    );
  }

  return c.json(
    { error: ERROR_MESSAGES.INTERNAL_ERROR, details: err.message },
    HTTP_STATUS.INTERNAL_SERVER_ERROR
  );
}
