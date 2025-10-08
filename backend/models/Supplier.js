const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    name: {
      type: String,
      required: [true, 'Please provide supplier company name'],
      maxlength: [100, 'Company name cannot be more than 100 characters']
    },
    registrationNumber: String,
    website: String,
    logo: String
  },
  contactInfo: {
    primaryContact: {
      name: String,
      email: String,
      phone: String,
      position: String
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String
    }
  },
  relationship: {
    type: {
      type: String,
      required: [true, 'Please specify relationship type'],
      enum: [
        'Direct Supplier',
        'Transportation',
        'IT Services',
        'Materials',
        'Manufacturing',
        'Energy Provider',
        'Consulting',
        'Other'
      ]
    },
    tier: {
      type: Number,
      enum: [1, 2, 3],
      default: 1
    },
    contractValue: {
      amount: Number,
      currency: {
        type: String,
        default: 'USD'
      }
    },
    contractPeriod: {
      startDate: Date,
      endDate: Date
    }
  },
  industry: {
    sector: {
      type: String,
      enum: [
        'Manufacturing',
        'Technology',
        'Transportation & Logistics',
        'Energy & Utilities',
        'Materials & Mining',
        'Construction',
        'Agriculture',
        'Services',
        'Other'
      ]
    },
    naicsCode: String,
    sicCode: String
  },
  location: {
    region: String,
    operatingCountries: [String],
    headquarters: {
      country: String,
      city: String
    }
  },
  emissionsData: {
    scope1: {
      type: Number,
      default: 0
    },
    scope2: {
      type: Number,
      default: 0
    },
    scope3: {
      type: Number,
      default: 0
    },
    totalCo2e: {
      type: Number,
      default: 0
    },
    dataSource: {
      type: String,
      enum: ['connected', 'manual', 'estimated'],
      default: 'manual'
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    verificationLevel: {
      type: String,
      enum: ['unverified', 'self-reported', 'third-party-verified'],
      default: 'unverified'
    }
  },
  connectionStatus: {
    type: String,
    enum: ['not-connected', 'invited', 'connected', 'disconnected'],
    default: 'not-connected'
  },
  platformData: {
    connectedUserId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    invitationSent: Date,
    lastSyncDate: Date,
    syncFrequency: {
      type: String,
      enum: ['real-time', 'daily', 'weekly', 'monthly'],
      default: 'monthly'
    }
  },
  performance: {
    emissionsTrend: {
      type: String,
      enum: ['improving', 'stable', 'declining', 'unknown'],
      default: 'unknown'
    },
    sustainabilityScore: {
      type: Number,
      min: 0,
      max: 100
    },
    certifications: [{
      name: String,
      issuingBody: String,
      validUntil: Date
    }],
    targets: [{
      type: String,
      target: String,
      deadline: Date,
      progress: Number
    }]
  },
  riskAssessment: {
    emissionRisk: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    dataQualityRisk: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    geographicRisk: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low'
    },
    businessContinuityRisk: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low'
    }
  },
  documents: [{
    type: String,
    filename: String,
    path: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  notes: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Calculate total CO2e when scope emissions are updated
supplierSchema.pre('save', function(next) {
  if (this.emissionsData) {
    this.emissionsData.totalCo2e = 
      (this.emissionsData.scope1 || 0) + 
      (this.emissionsData.scope2 || 0) + 
      (this.emissionsData.scope3 || 0);
  }
  next();
});

// Index for better query performance
supplierSchema.index({ user: 1, 'company.name': 1 });
supplierSchema.index({ 'relationship.type': 1 });
supplierSchema.index({ connectionStatus: 1 });

module.exports = mongoose.model('Supplier', supplierSchema);