const express = require('express');
const Project = require('../models/project');
const router = express.Router();

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ 
      success: true, 
      count: projects.length,
      data: projects 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE new project
router.post('/submit', async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      // Mock blockchain data for demo
      blockchainAddress: '0x' + Math.random().toString(16).substr(2, 40),
      tokenId: Math.floor(Math.random() * 1000).toString()
    });
    
    await project.save();
    
    res.status(201).json({ 
      success: true, 
      message: '✅ Project submitted successfully! Awaiting NCCR verification.',
      projectId: project.projectId,
      blockchainAddress: project.blockchainAddress,
      data: project
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// VERIFY project (Admin)
router.post('/:projectId/verify', async (req, res) => {
  try {
    const project = await Project.findOne({ projectId: req.params.projectId });
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    project.status = 'verified';
    project.verifiedBy = req.body.verifiedBy || 'NCCR Admin';
    project.verificationDate = new Date();
    
    await project.save();

    res.json({
      success: true,
      message: '🎉 Project verified successfully! Carbon credits minted on blockchain.',
      data: project
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;


