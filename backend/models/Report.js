const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  reportType: {
    type: String,
    required: [true, 'Please specify report type'],
    enum: [
      // Core GHG Protocol Reports
      'annual-ghg',
      'scope1',
      'scope2', 
      'scope3',
      // Compliance Reports
      'csrd',
      'tcfd',
      'cdp',
      'ghg-protocol',
      'gri-305',
      'iso-14064',
      'sec-climate',
      // Management Reports
      'emission-trends',
      'carbon-intensity',
      'reduction-progress',
      'forecasting',
      'financial-impact',
      // Supplier Reports
      'supply-chain-map',
      'supplier-performance',
      'connection-report',
      // Offset Reports
      'offset-ledger',
      'net-emissions',
      'mitigation-projects'
    ]
  },
  title: {
    type: String,
    required: [true, 'Please provide report title']
  },
  description: String,
  parameters: {
    reportingPeriod: {
      startDate: {
        type: Date,
        required: [true, 'Please provide start date']
      },
      endDate: {
        type: Date,
        required: [true, 'Please provide end date']
      },
      year: Number,
      quarter: Number
    },
    scopes: [{
      type: Number,
      enum: [1, 2, 3]
    }],
    locations: [String],
    suppliers: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Supplier'
    }],
    includeVerifiedOnly: {
      type: Boolean,
      default: false
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  data: {
    emissions: {
      scope1: {
        total: { type: Number, default: 0 },
        categories: [mongoose.Schema.Types.Mixed]
      },
      scope2: {
        total: { type: Number, default: 0 },
        categories: [mongoose.Schema.Types.Mixed]
      },
      scope3: {
        total: { type: Number, default: 0 },
        categories: [mongoose.Schema.Types.Mixed]
      },
      grandTotal: { type: Number, default: 0 }
    },
    suppliers: [mongoose.Schema.Types.Mixed],
    trends: [mongoose.Schema.Types.Mixed],
    charts: [mongoose.Schema.Types.Mixed],
    calculations: mongoose.Schema.Types.Mixed
  },
  status: {
    type: String,
    enum: ['generating', 'completed', 'failed', 'scheduled'],
    default: 'generating'
  },
  format: {
    type: String,
    enum: ['pdf', 'excel', 'csv', 'json'],
    default: 'pdf'
  },
  fileInfo: {
    filename: String,
    path: String,
    size: Number,
    downloadCount: {
      type: Number,
      default: 0
    }
  },
  schedule: {
    isScheduled: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['weekly', 'monthly', 'quarterly', 'annually']
    },
    nextRun: Date,
    lastRun: Date,
    recipients: [String], // email addresses
    isActive: {
      type: Boolean,
      default: true
    }
  },
  metadata: {
    generationTime: Number, // milliseconds
    dataPoints: Number,
    framework: String,
    version: String,
    methodology: String
  },
  sharing: {
    isPublic: {
      type: Boolean,
      default: false
    },
    shareToken: String,
    sharedWith: [{
      email: String,
      permission: {
        type: String,
        enum: ['view', 'download'],
        default: 'view'
      },
      sharedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  auditTrail: [{
    action: {
      type: String,
      enum: ['generated', 'downloaded', 'shared', 'modified', 'scheduled']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: String
  }]
}, {
  timestamps: true
});

// Index for better query performance
reportSchema.index({ user: 1, reportType: 1 });
reportSchema.index({ status: 1, 'schedule.nextRun': 1 });
reportSchema.index({ 'parameters.reportingPeriod.year': 1 });

module.exports = mongoose.model('Report', reportSchema);