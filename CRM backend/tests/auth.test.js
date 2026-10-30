const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const { generateToken } = require('../src/utils/jwt');

// Mock User model to run tests without requiring a live MongoDB server
jest.mock('../src/models/User');

describe('Auth API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new employee successfully', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: '507f1f77bcf86cd799439011',
        name: 'John Counselor',
        email: 'counselor@example.com',
        role: 'counselor',
        phone: '1234567890',
        createdAt: new Date(),
        updatedAt: new Date(),
        toJSON() {
          return {
            _id: this._id,
            name: this.name,
            email: this.email,
            role: this.role,
            phone: this.phone
          };
        }
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Counselor',
          email: 'counselor@example.com',
          password: 'Password123!',
          phone: '1234567890'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.data.email).toBe('counselor@example.com');
    });

    it('should return 400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('should return 409 when email already exists', async () => {
      User.findOne.mockResolvedValue({
        _id: '507f1f77bcf86cd799439011',
        email: 'existing@example.com'
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'existing@example.com',
          password: 'Password123!'
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should log in an existing employee with correct credentials', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        name: 'John Counselor',
        email: 'counselor@example.com',
        role: 'counselor',
        comparePassword: jest.fn().mockResolvedValue(true),
        toJSON() {
          return {
            _id: this._id,
            name: this.name,
            email: this.email,
            role: this.role
          };
        }
      };

      User.findOne.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'counselor@example.com',
          password: 'Password123!'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.data.email).toBe('counselor@example.com');
    });

    it('should return 401 when email is not found', async () => {
      User.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'notfound@example.com',
          password: 'Password123!'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email or password');
    });

    it('should return 401 when password does not match', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        email: 'counselor@example.com',
        comparePassword: jest.fn().mockResolvedValue(false)
      };

      User.findOne.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'counselor@example.com',
          password: 'WrongPassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email or password');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user profile when valid token is supplied', async () => {
      const token = generateToken({ id: '507f1f77bcf86cd799439011', email: 'counselor@example.com' });

      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          _id: '507f1f77bcf86cd799439011',
          name: 'John Counselor',
          email: 'counselor@example.com',
          role: 'counselor'
        })
      });

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('counselor@example.com');
    });

    it('should return 401 if authorization header is missing', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('No authentication token provided');
    });
  });
});

