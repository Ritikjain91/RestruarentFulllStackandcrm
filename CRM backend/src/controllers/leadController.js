const Lead = require('../models/Lead');

/**
 * @desc    Submit a public enquiry form (Prospective client)
 * @route   POST /api/leads/public
 * @access  Public (No authentication required)
 */
const submitPublicEnquiry = async (req, res, next) => {
  try {
    const { name, email, phone, courseInterest, message, source } = req.body;

    const lead = await Lead.create({
      name,
      email: email.toLowerCase(),
      phone,
      courseInterest,
      message: message || '',
      source: source || 'public_form',
      status: 'unclaimed',
      claimedBy: null,
      claimedAt: null
    });

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully. A counselor will connect with you soon.',
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all unclaimed public enquiries
 * @route   GET /api/leads/unclaimed
 * @access  Private (Authenticated Employee/Counselor)
 */
const getUnclaimedLeads = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const filter = {
      status: 'unclaimed',
      claimedBy: null
    };

    // Optional search across name, email, course interest
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { courseInterest: searchRegex }
      ];
    }

    if (req.query.courseInterest) {
      filter.courseInterest = new RegExp(req.query.courseInterest, 'i');
    }

    const [total, leads] = await Promise.all([
      Lead.countDocuments(filter),
      Lead.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
    ]);

    res.status(200).json({
      success: true,
      count: leads.length,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      data: leads
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Claim an unclaimed enquiry
 * @route   PATCH /api/leads/:id/claim  (also supports POST)
 * @access  Private (Authenticated Employee/Counselor)
 */
const claimLead = async (req, res, next) => {
  try {
    const leadId = req.params.id;
    const userId = req.user._id;

    // Atomic find and update to prevent race conditions when two counselors claim simultaneously
    const claimedLead = await Lead.findOneAndUpdate(
      {
        _id: leadId,
        status: 'unclaimed',
        claimedBy: null
      },
      {
        status: 'claimed',
        claimedBy: userId,
        claimedAt: new Date()
      },
      {
        new: true,
        runValidators: true
      }
    ).populate('claimedBy', 'name email role');

    if (!claimedLead) {
      // Check why the update did not match: does the lead exist?
      const existingLead = await Lead.findById(leadId);

      if (!existingLead) {
        return res.status(404).json({
          success: false,
          message: 'Enquiry not found'
        });
      }

      if (existingLead.claimedBy && existingLead.claimedBy.toString() === userId.toString()) {
        return res.status(400).json({
          success: false,
          message: 'You have already claimed this enquiry',
          data: existingLead
        });
      }

      return res.status(409).json({
        success: false,
        message: 'This enquiry has already been claimed by another counselor'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Enquiry claimed successfully. It is now private to your account.',
      data: claimedLead
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all leads claimed by the logged in counselor
 * @route   GET /api/leads/claimed
 * @access  Private (Authenticated Employee/Counselor)
 */
const getMyClaimedLeads = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const filter = {
      status: 'claimed',
      claimedBy: req.user._id
    };

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { courseInterest: searchRegex }
      ];
    }

    const [total, leads] = await Promise.all([
      Lead.countDocuments(filter),
      Lead.find(filter)
        .populate('claimedBy', 'name email role')
        .sort({ claimedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
    ]);

    res.status(200).json({
      success: true,
      count: leads.length,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      data: leads
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single lead by ID (if unclaimed or claimed by current counselor)
 * @route   GET /api/leads/:id
 * @access  Private (Authenticated Employee/Counselor)
 */
const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('claimedBy', 'name email role');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    // If claimed by someone else, it is private
    if (lead.status === 'claimed' && lead.claimedBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This enquiry has been claimed by another counselor.'
      });
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitPublicEnquiry,
  getUnclaimedLeads,
  claimLead,
  getMyClaimedLeads,
  getLeadById
};

