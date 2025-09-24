const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  projectId: { 
    type: String, 
    unique: true,
    default: () => 'BC-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5)
  },
  projectName: { type: String, required: true },
  organization: { type: String, required: true },
  contactEmail: { type: String, required: true },
  location: {
    state: String,
    district: String,
    latitude: Number,
    longitude: Number
  },
  areaHectares: { type: Number, required: true },
  mangroveSpecies: [String],
  startDate: { type: Date, default: Date.now },
  
  // Blockchain fields
  blockchainAddress: String,
  tokenId: String,
  transactionHash: String,
  
  // Verification
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  verifiedBy: String,
  verificationDate: Date,

}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);