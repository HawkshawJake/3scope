const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Emission = require('../models/Emission');
const { authorize, checkOwnership } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all emissions for user
// @route   GET /api/emissions
// @access  Private
router.get('/', [
  query('scope').optional().isIn(['1', '2', '3']),
  query('year').optional().isInt({ min: 2020, max: new Date().getFullYear() + 1 }),
  query('status').optional().isIn(['draft', 'submitted', 'verified', 'published']),
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

    const { scope, year, status, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { user: req.user.id };
    if (scope) query.scope = parseInt(scope);
    if (year) query['reportingPeriod.year'] = parseInt(year);
    if (status) query.status = status;

    // Execute query with pagination
    const emissions = await Emission.find(query)
      .sort({ 'reportingPeriod.year': -1, scope: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'name email company');

    // Get total count for pagination
    const total = await Emission.countDocuments(query);

    res.status(200).json({
      success: true,
      count: emissions.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      data: emissions
    });
  } catch (error) {
    console.error('Get emissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching emissions'
    });
  }
});

// @desc    Get single emission
// @route   GET /api/emissions/:id
// @access  Private
router.get('/:id', checkOwnership(Emission), async (req, res) => {
  try {
    const emission = await Emission.findById(req.params.id).populate('user', 'name email company');
    
    res.status(200).json({
      success: true,
      data: emission
    });
  } catch (error) {
    console.error('Get emission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching emission'
    });
  }
});

// @desc    Create new emission
// @route   POST /api/emissions
// @access  Private
router.post('/', [
  body('scope').isIn([1, 2, 3]).withMessage('Scope must be 1, 2, or 3'),
  body('reportingPeriod.year').isInt({ min: 2020, max: new Date().getFullYear() + 1 }).withMessage('Invalid reporting year'),
  body('entries').isArray({ min: 1 }).withMessage('At least one emission entry is required'),
  body('entries.*.source').notEmpty().withMessage('Emission source is required'),
  body('entries.*.amount').isFloat({ min: 0 }).withMessage('Emission amount must be positive'),
  body('entries.*.co2eAmount').isFloat({ min: 0 }).withMessage('CO2e amount must be positive')
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

    // Add user to emission data
    req.body.user = req.user.id;
    req.body.company = req.user.company;

    const emission = await Emission.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Emission created successfully',
      data: emission
    });
  } catch (error) {
    console.error('Create emission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating emission'
    });
  }
});

// @desc    Update emission
// @route   PUT /api/emissions/:id
// @access  Private
router.put('/:id', [
  checkOwnership(Emission),
  body('entries').optional().isArray().withMessage('Entries must be an array'),
  body('status').optional().isIn(['draft', 'submitted', 'verified', 'published']).withMessage('Invalid status')
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

    // Don't allow updating if emission is published (unless admin)
    if (req.resource.status === 'published' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot modify published emissions'
      });
    }

    req.body.lastModified = new Date();

    const emission = await Emission.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Emission updated successfully',
      data: emission
    });
  } catch (error) {
    console.error('Update emission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating emission'
    });
  }
});

// @desc    Delete emission
// @route   DELETE /api/emissions/:id
// @access  Private
router.delete('/:id', checkOwnership(Emission), async (req, res) => {
  try {
    // Don't allow deleting if emission is published (unless admin)
    if (req.resource.status === 'published' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete published emissions'
      });
    }

    await Emission.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Emission deleted successfully'
    });
  } catch (error) {
    console.error('Delete emission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting emission'
    });
  }
});

// @desc    Get emissions summary
// @route   GET /api/emissions/summary
// @access  Private
router.get('/summary/stats', [
  query('year').optional().isInt({ min: 2020, max: new Date().getFullYear() + 1 })
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

    const { year = new Date().getFullYear() } = req.query;

    // Aggregate emissions by scope
    const summary = await Emission.aggregate([
      {
        $match: {
          user: req.user._id,
          'reportingPeriod.year': parseInt(year)
        }
      },
      {
        $group: {
          _id: '$scope',
          totalCo2e: { $sum: '$totalCo2e' },
          entryCount: { $sum: { $size: '$entries' } },
          lastUpdated: { $max: '$lastModified' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Calculate totals
    const totalEmissions = summary.reduce((total, scope) => total + scope.totalCo2e, 0);

    // Get monthly trends
    const monthlyTrends = await Emission.aggregate([
      {
        $match: {
          user: req.user._id,
          'reportingPeriod.year': parseInt(year)
        }
      },
      {
        $group: {
          _id: {
            scope: '$scope',
            month: '$reportingPeriod.month'
          },
          totalCo2e: { $sum: '$totalCo2e' }
        }
      },
      {
        $sort: { '_id.month': 1, '_id.scope': 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        year: parseInt(year),
        totalEmissions,
        scopeSummary: summary,
        monthlyTrends
      }
    });
  } catch (error) {
    console.error('Get emissions summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching emissions summary'
    });
  }
});

// @desc    Bulk import emissions
// @route   POST /api/emissions/bulk
// @access  Private
router.post('/bulk', [
  authorize('admin', 'manager'),
  body('emissions').isArray({ min: 1 }).withMessage('Emissions array is required'),
  body('emissions.*.scope').isIn([1, 2, 3]).withMessage('Each emission must have a valid scope')
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

    const { emissions } = req.body;

    // Add user and company to each emission
    const processedEmissions = emissions.map(emission => ({
      ...emission,
      user: req.user.id,
      company: req.user.company
    }));

    const createdEmissions = await Emission.insertMany(processedEmissions);

    res.status(201).json({
      success: true,
      message: `${createdEmissions.length} emissions created successfully`,
      data: createdEmissions
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during bulk import'
    });
  }
});

module.exports = router;