export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  REQUIRED_FIELDS: 'Tous les champs sont requis',
  EMAIL_EXISTS: 'Email déjà existant',
  NOT_FOUND: 'Ressource non trouvée',
  INTERNAL_ERROR: 'Internal Server Error',
  VALIDATION_ERROR: 'Erreur de validation',
} as const;

export const DB_ERRORS = {
  DUPLICATE_KEY: '23505',
  FOREIGN_KEY: '23503',
} as const;
