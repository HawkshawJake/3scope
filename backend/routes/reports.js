const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Report = require('../models/Report');
const Emission = require('../models/Emission');
const Supplier = require('../models/Supplier');

const router = express.Router();

// @desc    Get all reports for user
// @route   GET /api/reports
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { reportType, status, page = 1, limit = 10 } = req.query;

    const query = { user: req.user.id };
    if (reportType) query.reportType = reportType;
    if (status) query.status = status;

    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Report.countDocuments(query);

    res.status(200).json({
      success: true,
      count: reports.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      data: reports
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reports'
    });
  }
});

// @desc    Generate new report
// @route   POST /api/reports/generate
// @access  Private
router.post('/generate', [
  body('reportType').notEmpty().withMessage('Report type is required'),
  body('title').notEmpty().withMessage('Report title is required'),
  body('parameters.reportingPeriod.startDate').isISO8601().withMessage('Valid start date required'),
  body('parameters.reportingPeriod.endDate').isISO8601().withMessage('Valid end date required'),
  body('format').optional().isIn(['pdf', 'excel', 'csv', 'json']).withMessage('Invalid format')
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

    const reportData = {
      ...req.body,
      user: req.user.id,
      status: 'generating'
    };

    const report = await Report.create(reportData);

    // In a real implementation, you would queue the report generation
    // For now, we'll simulate generating the report
    setTimeout(async () => {
      try {
        // Fetch relevant data based on report type and parameters
        const emissions = await Emission.find({
          user: req.user.id,
          'reportingPeriod.startDate': { $gte: new Date(req.body.parameters.reportingPeriod.startDate) },
          'reportingPeriod.endDate': { $lte: new Date(req.body.parameters.reportingPeriod.endDate) }
        });

        const suppliers = await Supplier.find({
          user: req.user.id,
          isActive: true
        });

        // Generate report data
        const generatedData = {
          emissions: {
            scope1: { total: 0, categories: [] },
            scope2: { total: 0, categories: [] },
            scope3: { total: 0, categories: [] },
            grandTotal: 0
          },
          suppliers: suppliers.map(s => ({
            name: s.company.name,
            type: s.relationship.type,
            emissions: s.emissionsData.totalCo2e,
            status: s.connectionStatus
          })),
          generatedAt: new Date()
        };

        // Calculate totals
        emissions.forEach(emission => {
          generatedData.emissions[`scope${emission.scope}`].total += emission.totalCo2e;
          generatedData.emissions.grandTotal += emission.totalCo2e;
        });

        // Update report with generated data
        await Report.findByIdAndUpdate(report._id, {
          status: 'completed',
          data: generatedData,
          'metadata.generationTime': 2000,
          'metadata.dataPoints': emissions.length + suppliers.length
        });
      } catch (error) {
        console.error('Report generation error:', error);
        await Report.findByIdAndUpdate(report._id, { status: 'failed' });
      }
    }, 2000);

    res.status(202).json({
      success: true,
      message: 'Report generation started',
      data: report
    });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating report'
    });
  }
});

// @desc    Get report by ID
// @route   GET /api/reports/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching report'
    });
  }
});

// @desc    Download report
// @route   GET /api/reports/:id/download
// @access  Private
router.get('/:id/download', async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    if (report.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Report is not ready for download'
      });
    }

    // Increment download count
    report.fileInfo.downloadCount += 1;
    await report.save();

    // In a real implementation, you would return the actual file
    res.status(200).json({
      success: true,
      message: 'Report download started',
      data: {
        filename: `${report.reportType}_${report.parameters.reportingPeriod.year || 'report'}.${report.format}`,
        downloadUrl: `/api/reports/${report._id}/file`,
        size: report.fileInfo.size || 1024000
      }
    });
  } catch (error) {
    console.error('Download report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while downloading report'
    });
  }
});

module.exports = router;