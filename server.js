const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api', (req, res) => {
  res.json({ 
    message: '🚀 Blue Carbon Blockchain API is running!',
    database: 'In-memory (hackathon demo)',
    hackathon: 'Smart India Hackathon 2024'
  });
});

// In-memory database (for demo)
let projects = [];
let projectId = 1;

// API Routes
app.get('/api/projects', (req, res) => {
  res.json({ 
    success: true, 
    count: projects.length,
    data: projects 
  });
});

app.post('/api/projects/submit', (req, res) => {
  try {
    const projectData = req.body;
    const project = {
      id: projectId++,
      projectId: 'BC-' + Date.now(),
      ...projectData,
      status: 'pending',
      verified: false,
      credits: projectData.areaHectares * 50, // Mock carbon calculation
      owner: '0x' + Math.random().toString(16).substr(2, 40),
      blockchainAddress: '0x' + Math.random().toString(16).substr(2, 40),
      tokenId: Math.floor(Math.random() * 1000).toString(),
      createdAt: new Date().toISOString(),
      timestamp: new Date().toISOString()
    };
    
    projects.push(project);
    
    res.json({
      success: true,
      message: '✅ Project submitted successfully! Awaiting NCCR verification.',
      projectId: project.projectId,
      blockchainAddress: project.blockchainAddress,
      data: project
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/projects/:projectId/verify', (req, res) => {
  const { projectId } = req.params;
  const { verifiedBy = 'NCCR Admin' } = req.body;
  
  const project = projects.find(p => p.projectId === projectId);
  if (!project) {
    return res.status(404).json({
      success: false,
      error: 'Project not found'
    });
  }
  
  project.status = 'verified';
  project.verified = true;
  project.verifiedBy = verifiedBy;
  project.verificationDate = new Date();
  
  res.json({
    success: true,
    message: '🎉 Project verified successfully! Carbon credits minted on blockchain.',
    data: project
  });
});

app.get('/api/stats', (req, res) => {
  const totalProjects = projects.length;
  const verifiedProjects = projects.filter(p => p.verified).length;
  const pendingProjects = projects.filter(p => !p.verified).length;
  const estimatedCarbon = projects.reduce((total, p) => total + (p.credits || 0), 0);
  
  res.json({
    success: true,
    data: {
      totalProjects,
      verifiedProjects,
      pendingProjects,
      estimatedCarbon
    }
  });
});

// Simple catch-all route for SPA - FIXED
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎯 Backend running on http://localhost:${PORT}`);
  console.log(`📊 Serving frontend from /public directory`);
  console.log(`🌍 Access your app at: http://localhost:${PORT}`);
});
