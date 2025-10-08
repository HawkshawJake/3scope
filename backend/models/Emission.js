const mongoose = require('mongoose');

const emissionEntrySchema = new mongoose.Schema({
  source: {
    type: String,
    required: [true, 'Please provide an emission source'],
    maxlength: [100, 'Source name cannot be more than 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Please provide an emission category']
  },
  amount: {
    type: Number,
    required: [true, 'Please provide emission amount'],
    min: [0, 'Emission amount cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Please provide unit'],
    enum: ['kg', 'tonnes', 'lbs'],
    default: 'kg'
  },
  co2eAmount: {
    type: Number,
    required: [true, 'Please provide CO2e amount'],
    min: [0, 'CO2e amount cannot be negative']
  },
  activityData: {
    type: Number,
    required: [true, 'Please provide activity data']
  },
  emissionFactor: {
    type: Number,
    required: [true, 'Please provide emission factor']
  },
  emissionFactorSource: {
    type: String,
    required: [true, 'Please provide emission factor source'],
    enum: ['DEFRA', 'EPA', 'IEA', 'IPCC', 'Custom']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  location: {
    facility: String,
    city: String,
    country: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  period: {
    startDate: {
      type: Date,
      required: [true, 'Please provide start date']
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide end date']
    }
  },
  dataQuality: {
    type: String,
    enum: ['measured', 'calculated', 'estimated'],
    default: 'calculated'
  },
  verificationStatus: {
    type: String,
    enum: ['unverified', 'internal', 'third-party'],
    default: 'unverified'
  },
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }]
});

const emissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: [true, 'Please provide company name']
  },
  scope: {
    type: Number,
    required: [true, 'Please provide emission scope'],
    enum: [1, 2, 3]
  },
  reportingPeriod: {
    year: {
      type: Number,
      required: [true, 'Please provide reporting year'],
      min: [2020, 'Year must be 2020 or later'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
    },
    quarter: {
      type: Number,
      enum: [1, 2, 3, 4]
    },
    month: {
      type: Number,
      min: 1,
      max: 12
    }
  },
  entries: [emissionEntrySchema],
  totalCo2e: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'verified', 'published'],
    default: 'draft'
  },
  methodology: {
    standard: {
      type: String,
      enum: ['GHG Protocol', 'ISO 14064-1', 'DEFRA', 'Custom'],
      default: 'GHG Protocol'
    },
    version: String,
    notes: String
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate total CO2e when entries are modified
emissionSchema.pre('save', function(next) {
  if (this.entries && this.entries.length > 0) {
    this.totalCo2e = this.entries.reduce((total, entry) => {
      return total + (entry.co2eAmount || 0);
    }, 0);
  }
  next();
});

// Index for better query performance
emissionSchema.index({ user: 1, scope: 1, 'reportingPeriod.year': 1 });
emissionSchema.index({ company: 1, 'reportingPeriod.year': 1 });

module.exports = mongoose.model('Emission', emissionSchema);