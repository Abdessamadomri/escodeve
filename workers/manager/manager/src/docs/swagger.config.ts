export const swaggerConfig = {
  openapi: "3.0.0",
  info: {
    title: "Manager API",
    version: "1.0.0",
    description: "API de gestion pour professeurs, staff, étudiants et parents",
  },
  servers: [{ url: "http://127.0.0.1:8787", description: "Développement" }],
  paths: {
    "/teacher": {
      get: {
        tags: ["Teacher"],
        summary: "Liste tous les professeurs",
        responses: {
          "200": { description: "Liste des professeurs" },
        },
      },
      post: {
        tags: ["Teacher"],
        summary: "Créer un professeur",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Marie Dupont" },
                  email: { type: "string", example: "marie@school.com" },
                  subject: { type: "string", example: "Mathématiques" },
                  salaryType: {
                    type: "string",
                    enum: ["fixed", "hourly"],
                    example: "fixed",
                  },
                  salaryAmount: { type: "number", example: 3000 },
                  schoolId: { type: "integer", example: 1 },
                },
                required: [
                  "name",
                  "email",
                  "subject",
                  "salaryType",
                  "salaryAmount",
                  "schoolId",
                ],
              },
            },
          },
        },
        responses: {
          "200": { description: "Professeur créé" },
        },
      },
    },
    "/teacher/{id}": {
      put: {
        tags: ["Teacher"],
        summary: "Modifier un professeur",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  subject: { type: "string" },
                  salaryType: { type: "string", enum: ["fixed", "hourly"] },
                  salaryAmount: { type: "number" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Professeur modifié" },
        },
      },
      delete: {
        tags: ["Teacher"],
        summary: "Supprimer un professeur",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Professeur supprimé" },
        },
      },
    },
    "/staff": {
      get: {
        tags: ["Staff"],
        summary: "Liste tout le staff",
        responses: {
          "200": { description: "Liste du staff" },
        },
      },
      post: {
        tags: ["Staff"],
        summary: "Créer un staff",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Jean Martin" },
                  email: { type: "string", example: "jean@school.com" },
                  role: { type: "string", example: "secretary" },
                  salaryAmount: { type: "number", example: 2500 },
                  schoolId: { type: "integer", example: 1 },
                },
                required: ["name", "email", "role", "salaryAmount", "schoolId"],
              },
            },
          },
        },
        responses: {
          "200": { description: "Staff créé" },
        },
      },
    },
    "/staff/{id}": {
      put: {
        tags: ["Staff"],
        summary: "Modifier un staff",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  role: { type: "string" },
                  salaryAmount: { type: "number" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Staff modifié" },
        },
      },
      delete: {
        tags: ["Staff"],
        summary: "Supprimer un staff",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Staff supprimé" },
        },
      },
    },
    "/student": {
      get: {
        tags: ["Student"],
        summary: "Liste tous les étudiants",
        responses: {
          "200": { description: "Liste des étudiants" },
        },
      },
      post: {
        tags: ["Student"],
        summary: "Créer un étudiant",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Alice Dupont" },
                  email: { type: "string", example: "alice@example.com" },
                  schoolId: { type: "integer", example: 1 },
                  parentId: { type: "integer", example: 1 },
                  classId: { type: "integer", example: 1 },
                },
                required: ["name", "email", "schoolId"],
              },
            },
          },
        },
        responses: {
          "200": { description: "Étudiant créé" },
        },
      },
    },
    "/student/{id}": {
      put: {
        tags: ["Student"],
        summary: "Modifier un étudiant",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  parentId: { type: "integer" },
                  classId: { type: "integer" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Étudiant modifié" },
        },
      },
      delete: {
        tags: ["Student"],
        summary: "Supprimer un étudiant",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Étudiant supprimé" },
        },
      },
    },
    "/parent": {
      get: {
        tags: ["Parent"],
        summary: "Liste tous les parents",
        responses: {
          "200": { description: "Liste des parents avec leurs enfants" },
        },
      },
      post: {
        tags: ["Parent"],
        summary: "Créer un parent",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "John Doe" },
                  email: { type: "string", example: "john@example.com" },
                  phone: { type: "string", example: "+33612345678" },
                },
                required: ["name", "email"],
              },
            },
          },
        },
        responses: {
          "200": { description: "Parent créé" },
        },
      },
    },
    "/parent/{id}": {
      put: {
        tags: ["Parent"],
        summary: "Modifier un parent",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  phone: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Parent modifié" },
        },
      },
      delete: {
        tags: ["Parent"],
        summary: "Supprimer un parent",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Parent supprimé" },
        },
      },
    },
  },
};
