const express = require('express');
const { body, param } = require('express-validator');
const {
  submitPublicEnquiry,
  getUnclaimedLeads,
  claimLead,
  getMyClaimedLeads,
  getLeadById
} = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');

const router = express.Router();

/**
 * Validation rules for public enquiry submission
 */
const publicEnquiryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Client name is required')
    .isLength({ max: 100 })
    .withMessage('Name must not exceed 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('courseInterest')
    .trim()
    .notEmpty()
    .withMessage('Course interest is required')
    .isLength({ max: 150 })
    .withMessage('Course interest must not exceed 150 characters'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Message must not exceed 1000 characters'),
  body('source')
    .optional()
    .isIn(['public_form', 'counselor_referral', 'online_campaign'])
    .withMessage('Invalid lead source'),
  validate
];

/**
 * Lead ID parameter validation
 */
const leadIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid lead/enquiry ID format'),
  validate
];

// Public endpoint - No authentication required
router.post('/public', publicEnquiryValidation, submitPublicEnquiry);

// Protected endpoints - Counselor/Employee authentication required
router.get('/unclaimed', protect, getUnclaimedLeads);
router.get('/claimed', protect, getMyClaimedLeads);
router.get('/my-leads', protect, getMyClaimedLeads); // convenient alias
router.patch('/:id/claim', protect, leadIdValidation, claimLead);
router.post('/:id/claim', protect, leadIdValidation, claimLead); // also accept POST
router.get('/:id', protect, leadIdValidation, getLeadById);

module.exports = router;

