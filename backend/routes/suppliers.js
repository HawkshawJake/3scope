const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Supplier = require('../models/Supplier');
const { authorize, checkOwnership } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all suppliers for user
// @route   GET /api/suppliers
// @access  Private
router.get('/', [
  query('connectionStatus').optional().isIn(['not-connected', 'invited', 'connected', 'disconnected']),
  query('tier').optional().isIn(['1', '2', '3']),
  query('type').optional(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { connectionStatus, tier, type, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { user: req.user.id, isActive: true };
    if (connectionStatus) query.connectionStatus = connectionStatus;
    if (tier) query['relationship.tier'] = parseInt(tier);
    if (type) query['relationship.type'] = type;

    // Execute query with pagination
    const suppliers = await Supplier.find(query)
      .sort({ 'emissionsData.totalCo2e': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'name email company')
      .populate('platformData.connectedUserId', 'name email company');

    // Get total count for pagination
    const total = await Supplier.countDocuments(query);

    res.status(200).json({
      success: true,
      count: suppliers.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      data: suppliers
    });
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching suppliers'
    });
  }
});

// @desc    Get single supplier
// @route   GET /api/suppliers/:id
// @access  Private
router.get('/:id', checkOwnership(Supplier), async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id)
      .populate('user', 'name email company')
      .populate('platformData.connectedUserId', 'name email company');
    
    res.status(200).json({
      success: true,
      data: supplier
    });
  } catch (error) {
    console.error('Get supplier error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching supplier'
    });
  }
});

// @desc    Create new supplier
// @route   POST /api/suppliers
// @access  Private
router.post('/', [
  body('company.name').notEmpty().withMessage('Company name is required'),
  body('relationship.type').isIn([
    'Direct Supplier', 'Transportation', 'IT Services', 'Materials',
    'Manufacturing', 'Energy Provider', 'Consulting', 'Other'
  ]).withMessage('Valid relationship type is required'),
  body('relationship.tier').optional().isIn([1, 2, 3]).withMessage('Tier must be 1, 2, or 3'),
  body('emissionsData.scope1').optional().isFloat({ min: 0 }).withMessage('Scope 1 emissions must be positive'),
  body('emissionsData.scope2').optional().isFloat({ min: 0 }).withMessage('Scope 2 emissions must be positive'),
  body('emissionsData.scope3').optional().isFloat({ min: 0 }).withMessage('Scope 3 emissions must be positive')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Add user to supplier data
    req.body.user = req.user.id;

    const supplier = await Supplier.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Supplier created successfully',
      data: supplier
    });
  } catch (error) {
    console.error('Create supplier error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating supplier'
    });
  }
});

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
// @access  Private
router.put('/:id', [
  checkOwnership(Supplier),
  body('company.name').optional().notEmpty().withMessage('Company name cannot be empty'),
  body('relationship.type').optional().isIn([
    'Direct Supplier', 'Transportation', 'IT Services', 'Materials',
    'Manufacturing', 'Energy Provider', 'Consulting', 'Other'
  ]).withMessage('Valid relationship type is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Supplier updated successfully',
      data: supplier
    });
  } catch (error) {
    console.error('Update supplier error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating supplier'
    });
  }
});

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id
// @access  Private
router.delete('/:id', checkOwnership(Supplier), async (req, res) => {
  try {
    // Soft delete by setting isActive to false
    await Supplier.findByIdAndUpdate(req.params.id, { isActive: false });

    res.status(200).json({
      success: true,
      message: 'Supplier deleted successfully'
    });
  } catch (error) {
    console.error('Delete supplier error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting supplier'
    });
  }
});

// @desc    Get supply chain network data for visualization
// @route   GET /api/suppliers/network
// @access  Private
router.get('/network/visualization', async (req, res) => {
  try {
    const suppliers = await Supplier.find({ 
      user: req.user.id, 
      isActive: true 
    }).select('company relationship emissionsData connectionStatus');

    // Transform data for network visualization
    const networkData = {
      name: req.user.company,
      type: 'root',
      emissions: {
        scope1: 0, // These would come from user's own emissions
        scope2: 0,
        scope3: 0
      },
      total: 0,
      children: suppliers.map(supplier => ({
        name: supplier.company.name,
        type: supplier.relationship.tier === 1 ? 'tier1' : 'tier2',
        relationship: supplier.relationship.type,
        emissions: {
          scope1: supplier.emissionsData.scope1 || 0,
          scope2: supplier.emissionsData.scope2 || 0,
          scope3: supplier.emissionsData.scope3 || 0
        },
        total: supplier.emissionsData.totalCo2e || 0,
        connectionStatus: supplier.connectionStatus,
        children: [] // Future: could include sub-suppliers
      }))
    };

    res.status(200).json({
      success: true,
      data: networkData
    });
  } catch (error) {
    console.error('Get network data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching network data'
    });
  }
});

// @desc    Get supplier performance analytics
// @route   GET /api/suppliers/analytics
// @access  Private
router.get('/analytics/performance', async (req, res) => {
  try {
    // Get supplier analytics
    const analytics = await Supplier.aggregate([
      { $match: { user: req.user._id, isActive: true } },
      {
        $group: {
          _id: '$relationship.type',
          totalSuppliers: { $sum: 1 },
          totalEmissions: { $sum: '$emissionsData.totalCo2e' },
          avgEmissions: { $avg: '$emissionsData.totalCo2e' },
          connectedCount: {
            $sum: { $cond: [{ $eq: ['$connectionStatus', 'connected'] }, 1, 0] }
          },
          verifiedCount: {
            $sum: { $cond: [{ $eq: ['$emissionsData.verificationLevel', 'third-party-verified'] }, 1, 0] }
          }
        }
      },
      { $sort: { totalEmissions: -1 } }
    ]);

    // Get connection status summary
    const connectionSummary = await Supplier.aggregate([
      { $match: { user: req.user._id, isActive: true } },
      {
        $group: {
          _id: '$connectionStatus',
          count: { $sum: 1 },
          totalEmissions: { $sum: '$emissionsData.totalCo2e' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        performanceByType: analytics,
        connectionSummary
      }
    });
  } catch (error) {
    console.error('Get supplier analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching supplier analytics'
    });
  }
});

// @desc    Invite supplier to platform
// @route   POST /api/suppliers/:id/invite
// @access  Private
router.post('/:id/invite', [
  checkOwnership(Supplier),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').optional().isLength({ max: 500 }).withMessage('Message too long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, message } = req.body;
    const supplier = await Supplier.findById(req.params.id);

    // Update supplier with invitation details
    supplier.connectionStatus = 'invited';
    supplier.platformData.invitationSent = new Date();
    await supplier.save();

    // In a real implementation, you would send an email here
    console.log(`Invitation sent to ${email} for supplier ${supplier.company.name}`);

    res.status(200).json({
      success: true,
      message: 'Invitation sent successfully',
      data: {
        supplierName: supplier.company.name,
        invitedEmail: email,
        invitationDate: supplier.platformData.invitationSent
      }
    });
  } catch (error) {
    console.error('Invite supplier error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending invitation'
    });
  }
});

module.exports = router;