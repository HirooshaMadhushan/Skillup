import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Skillup API',
      version: '1.0.0',
      description: 'API documentation for Skillup Learning Management System',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            fullName: { type: 'string' },
            isVerified: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Role: {
          type: 'object',
          properties: {
            name: { type: 'string', enum: ['ADMIN', 'TUTOR', 'LEARNER'] },
          },
        },
        LearnerProfile: {
          type: 'object',
          properties: {
            interests: { type: 'string' },
            learningGoals: { type: 'string' },
          },
        },
        TutorProfile: {
          type: 'object',
          properties: {
            expertise: { type: 'string' },
            qualification: { type: 'string' },
            experience: { type: 'integer' },
            hourlyRate: { type: 'number' },
            isAvailable: { type: 'boolean' },
            verificationStatus: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] },
          },
        },
        Lesson: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            contentUrl: { type: 'string' },
            contentType: { type: 'string', enum: ['VIDEO', 'PDF', 'TEXT'] },
            difficulty: { type: 'string', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] },
            isPremium: { type: 'boolean' },
            categoryId: { type: 'string', format: 'uuid' },
            tutorId: { type: 'string', format: 'uuid' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
          },
        },
        Tag: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            startTime: { type: 'string', format: 'date-time' },
            endTime: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'] },
            notes: { type: 'string' },
            learnerId: { type: 'string', format: 'uuid' },
            tutorId: { type: 'string', format: 'uuid' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                tokens: {
                  type: 'object',
                  properties: {
                    accessToken: { type: 'string' },
                    refreshToken: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/utils/auth.validation.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
