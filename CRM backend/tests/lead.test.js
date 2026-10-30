const request = require('supertest');
const app = require('../src/app');
const Lead = require('../src/models/Lead');
const User = require('../src/models/User');
const { generateToken } = require('../src/utils/jwt');

jest.mock('../src/models/Lead');
jest.mock('../src/models/User');

describe('Lead & Enquiry API Endpoints', () => {
  const counselorId = '507f1f77bcf86cd799439011';
  const otherCounselorId = '507f1f77bcf86cd799439022';
  const validLeadId = '507f191e810c19729de860ea';

  let counselorToken;

  beforeEach(() => {
    jest.clearAllMocks();
    counselorToken = generateToken({
      id: counselorId,
      email: 'counselor@crm.com',
      role: 'counselor'
    });

    // Mock User.findById for authMiddleware
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: counselorId,
        name: 'Alex Counselor',
        email: 'counselor@crm.com',
        role: 'counselor'
      })
    });
  });

  describe('POST /api/leads/public (Public Form Submission)', () => {
    it('should allow anyone to submit an enquiry without authentication', async () => {
      const mockLeadData = {
        _id: validLeadId,
        name: 'John Student',
        email: 'student@example.com',
        phone: '+1234567890',
        courseInterest: 'Full Stack Web Development',
        message: 'Interested in the evening batch',
        status: 'unclaimed',
        claimedBy: null,
        claimedAt: null,
        source: 'public_form',
        createdAt: new Date()
      };

      Lead.create.mockResolvedValue(mockLeadData);

      const res = await request(app)
        .post('/api/leads/public')
        .send({
          name: 'John Student',
          email: 'student@example.com',
          phone: '+1234567890',
          courseInterest: 'Full Stack Web Development',
          message: 'Interested in the evening batch'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('unclaimed');
      expect(res.body.data.courseInterest).toBe('Full Stack Web Development');
    });

    it('should return 400 when required fields are missing in public form', async () => {
      const res = await request(app)
        .post('/api/leads/public')
        .send({
          name: 'Incomplete Student'
          // missing email, phone, courseInterest
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/leads/unclaimed (Public/Unclaimed Enquiries inside CRM)', () => {
    it('should reject request without authentication token with 401', async () => {
      const res = await request(app).get('/api/leads/unclaimed');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return unclaimed leads for authenticated counselors', async () => {
      const mockUnclaimedLeads = [
        {
          _id: validLeadId,
          name: 'Student One',
          email: 's1@example.com',
          phone: '9876543210',
          courseInterest: 'Data Science',
          status: 'unclaimed',
          claimedBy: null
        }
      ];

      Lead.countDocuments.mockResolvedValue(1);
      Lead.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue(mockUnclaimedLeads)
          })
        })
      });

      const res = await request(app)
        .get('/api/leads/unclaimed')
        .set('Authorization', `Bearer ${counselorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].status).toBe('unclaimed');
    });
  });

  describe('PATCH /api/leads/:id/claim (Claiming an Enquiry)', () => {
    it('should allow authenticated counselor to claim an unclaimed lead', async () => {
      const mockClaimedLead = {
        _id: validLeadId,
        name: 'Student One',
        email: 's1@example.com',
        phone: '9876543210',
        courseInterest: 'Data Science',
        status: 'claimed',
        claimedBy: {
          _id: counselorId,
          name: 'Alex Counselor',
          email: 'counselor@crm.com'
        },
        claimedAt: new Date()
      };

      Lead.findOneAndUpdate.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockClaimedLead)
      });

      const res = await request(app)
        .patch(`/api/leads/${validLeadId}/claim`)
        .set('Authorization', `Bearer ${counselorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('claimed');
      expect(res.body.data.claimedBy._id).toBe(counselorId);
    });

    it('should return 409 Conflict if lead is already claimed by another counselor', async () => {
      // findOneAndUpdate returns null (because status was not unclaimed)
      Lead.findOneAndUpdate.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      // findById reveals it was already claimed by otherCounselorId
      Lead.findById.mockResolvedValue({
        _id: validLeadId,
        status: 'claimed',
        claimedBy: otherCounselorId
      });

      const res = await request(app)
        .patch(`/api/leads/${validLeadId}/claim`)
        .set('Authorization', `Bearer ${counselorToken}`);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already been claimed by another counselor');
    });

    it('should return 400 Bad Request if lead was already claimed by the same counselor', async () => {
      Lead.findOneAndUpdate.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      Lead.findById.mockResolvedValue({
        _id: validLeadId,
        status: 'claimed',
        claimedBy: counselorId
      });

      const res = await request(app)
        .patch(`/api/leads/${validLeadId}/claim`)
        .set('Authorization', `Bearer ${counselorToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('You have already claimed this enquiry');
    });

    it('should return 404 Not Found if lead does not exist', async () => {
      Lead.findOneAndUpdate.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });
      Lead.findById.mockResolvedValue(null);

      const res = await request(app)
        .patch(`/api/leads/${validLeadId}/claim`)
        .set('Authorization', `Bearer ${counselorToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Enquiry not found');
    });
  });

  describe('GET /api/leads/claimed (Leads Claimed by Logged-in Counselor)', () => {
    it('should fetch only leads claimed by the authenticated user', async () => {
      const mockMyLeads = [
        {
          _id: validLeadId,
          name: 'My Student',
          status: 'claimed',
          claimedBy: {
            _id: counselorId,
            name: 'Alex Counselor'
          }
        }
      ];

      Lead.countDocuments.mockResolvedValue(1);
      Lead.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue(mockMyLeads)
            })
          })
        })
      });

      const res = await request(app)
        .get('/api/leads/claimed')
        .set('Authorization', `Bearer ${counselorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].status).toBe('claimed');
    });
  });

  describe('GET /api/leads/:id (Single Lead Access Control)', () => {
    it('should allow counselor to view unclaimed lead', async () => {
      Lead.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue({
          _id: validLeadId,
          name: 'Student One',
          status: 'unclaimed',
          claimedBy: null
        })
      });

      const res = await request(app)
        .get(`/api/leads/${validLeadId}`)
        .set('Authorization', `Bearer ${counselorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('unclaimed');
    });

    it('should allow counselor to view lead claimed by themselves', async () => {
      Lead.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue({
          _id: validLeadId,
          name: 'Student One',
          status: 'claimed',
          claimedBy: { _id: counselorId }
        })
      });

      const res = await request(app)
        .get(`/api/leads/${validLeadId}`)
        .set('Authorization', `Bearer ${counselorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should forbid (403) counselor from viewing lead claimed by another counselor', async () => {
      Lead.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue({
          _id: validLeadId,
          name: 'Student One',
          status: 'claimed',
          claimedBy: { _id: otherCounselorId }
        })
      });

      const res = await request(app)
        .get(`/api/leads/${validLeadId}`)
        .set('Authorization', `Bearer ${counselorToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('claimed by another counselor');
    });
  });
});

