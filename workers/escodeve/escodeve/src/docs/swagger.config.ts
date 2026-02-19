export const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'ESCODEVE - Super Admin API',
    version: '1.0.0',
    description: 'API pour la gestion des écoles par le Super Admin'
  },
  servers: [
    {
      url: 'http://localhost:8790',
      description: 'Serveur de développement'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      School: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          logo: { type: 'string', nullable: true },
          isActive: { type: 'boolean' },
          plan: { type: 'string', enum: ['BASIC', 'PREMIUM'] },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      CreateSchool: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
          logo: { type: 'string' },
          plan: { type: 'string', enum: ['BASIC', 'PREMIUM'], default: 'BASIC' }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        }
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string' },
              role: { type: 'string' }
            }
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    }
  },
  paths: {
    '/auth/register-super-admin': {
      post: {
        tags: ['Authentication'],
        summary: 'Créer un Super Admin',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'Super Admin créé avec succès',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    user: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        role: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          },
          500: {
            description: 'Erreur serveur',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login Super Admin',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Login réussi',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' }
              }
            }
          },
          401: {
            description: 'Email ou mot de passe incorrect',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/schools': {
      get: {
        tags: ['Schools'],
        summary: 'Liste toutes les écoles',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Liste des écoles',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/School' }
                }
              }
            }
          },
          401: {
            description: 'Token manquant ou invalide',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      },
      post: {
        tags: ['Schools'],
        summary: 'Créer une école',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateSchool' }
            }
          }
        },
        responses: {
          201: {
            description: 'École créée',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/School' }
              }
            }
          },
          401: {
            description: 'Non autorisé',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/schools/{id}': {
      put: {
        tags: ['Schools'],
        summary: 'Modifier une école',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateSchool' }
            }
          }
        },
        responses: {
          200: {
            description: 'École modifiée',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/School' }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Schools'],
        summary: 'Supprimer une école',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        responses: {
          200: {
            description: 'École supprimée',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
