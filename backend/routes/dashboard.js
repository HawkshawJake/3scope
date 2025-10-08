const express = require('express');
const Emission = require('../models/Emission');
const Supplier = require('../models/Supplier');
const Report = require('../models/Report');

const router = express.Router();

// @desc    Get dashboard overview data
// @route   GET /api/dashboard/overview
// @access  Private
router.get('/overview', async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    
    // Get current year emissions summary
    const emissionsSummary = await Emission.aggregate([
      {
        $match: {
          user: req.user._id,
          'reportingPeriod.year': currentYear
        }
      },
      {
        $group: {
          _id: '$scope',
          totalCo2e: { $sum: '$totalCo2e' },
          entryCount: { $sum: { $size: '$entries' } }
        }
      }
    ]);

    // Calculate total emissions
    const totalEmissions = emissionsSummary.reduce((total, scope) => total + scope.totalCo2e, 0);

    // Get supplier summary
    const supplierSummary = await Supplier.aggregate([
      {
        $match: {
          user: req.user._id,
          isActive: true
        }
      },
      {
        $group: {
          _id: null,
          totalSuppliers: { $sum: 1 },
          connectedSuppliers: {
            $sum: { $cond: [{ $eq: ['$connectionStatus', 'connected'] }, 1, 0] }
          },
          totalScope3: { $sum: '$emissionsData.totalCo2e' }
        }
      }
    ]);

    // Get recent reports
    const recentReports = await Report.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('reportType title status createdAt');

    // Get monthly trends for current year
    const monthlyTrends = await Emission.aggregate([
      {
        $match: {
          user: req.user._id,
          'reportingPeriod.year': currentYear
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
        $sort: { '_id.month': 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEmissions,
        emissionsByScope: emissionsSummary,
        suppliers: supplierSummary[0] || {
          totalSuppliers: 0,
          connectedSuppliers: 0,
          totalScope3: 0
        },
        recentReports,
        monthlyTrends,
        year: currentYear
      }
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data'
    });
  }
});

// @desc    Get emissions data for charts
// @route   GET /api/dashboard/emissions-chart
// @access  Private
router.get('/emissions-chart', async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    
    // Get monthly emissions data
    const monthlyData = await Emission.aggregate([
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

    // Transform data for frontend charts
    const chartData = {
      scope1: new Array(12).fill(0),
      scope2: new Array(12).fill(0),
      scope3: new Array(12).fill(0)
    };

    monthlyData.forEach(item => {
      const monthIndex = (item._id.month || 1) - 1;
      const scopeKey = `scope${item._id.scope}`;
      if (chartData[scopeKey] && monthIndex >= 0 && monthIndex < 12) {
        chartData[scopeKey][monthIndex] = item.totalCo2e;
      }
    });

    res.status(200).json({
      success: true,
      data: chartData
    });
  } catch (error) {
    console.error('Emissions chart data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching chart data'
    });
  }
});

module.exports = router;