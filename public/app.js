const { useState, useEffect, useMemo } = React;

// API configuration
const API_BASE = '/api';

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'impact', label: 'Impact Studio' },
  { id: 'add-project', label: 'Add Project' },
  { id: 'submit-mrv', label: 'Submit MRV' },
  { id: 'registry', label: 'Registry' },
  { id: 'about', label: 'About' }
];

const quickActions = [
  {
    icon: '⚡',
    title: 'Launch a Project',
    desc: 'Tokenize a new blue carbon initiative in minutes.',
    target: 'add-project'
  },
  {
    icon: '🛰️',
    title: 'Verify MRV Data',
    desc: 'Upload verification data and mint credits efficiently.',
    target: 'submit-mrv'
  },
  {
    icon: '📡',
    title: 'Explore Registry',
    desc: 'Browse a real-time ledger of trusted projects.',
    target: 'registry'
  }
];

const featureHighlights = [
  {
    icon: '🔒',
    title: 'Immutable Ledger',
    desc: 'Every project entry is hashed, timestamped, and permanently auditable.'
  },
  {
    icon: '🌐',
    title: 'Global Transparency',
    desc: 'Stakeholders can verify credits, MRV data, and issuance instantly.'
  },
  {
    icon: '📈',
    title: 'Impact Intelligence',
    desc: 'Live dashboards translate hectares protected into carbon, revenue, and ROI.'
  }
];

const howItWorks = [
  {
    step: '01',
    title: 'Register',
    desc: 'Submit a project profile with location, area, and stakeholders.'
  },
  {
    step: '02',
    title: 'Verify',
    desc: 'MRV partners upload on-chain verification data and evidence.'
  },
  {
    step: '03',
    title: 'Tokenize',
    desc: 'Credits are minted and ready for climate action marketplaces.'
  }
];

const sampleSpotlights = [
  {
    id: 'BC-FOREVER-01',
    name: 'Azure Delta Mangrove Shield',
    location: 'Sundarbans, India',
    credits: 12500,
    status: 'Verified'
  },
  {
    id: 'BC-FOREVER-02',
    name: 'Reefline Seagrass Revival',
    location: 'Palawan, Philippines',
    credits: 9800,
    status: 'Monitoring'
  },
  {
    id: 'BC-FOREVER-03',
    name: 'Pacific Tidal Wetlands',
    location: 'Baja California, Mexico',
    credits: 6700,
    status: 'Verification'
  }
];

const testimonials = [
  {
    quote: 'We reduced MRV turnaround from weeks to hours and unlocked new funding.',
    name: 'Aarav Patel',
    role: 'Mangrove Alliance Lead'
  },
  {
    quote: 'The live registry builds trust with buyers and regulators instantly.',
    name: 'Sophia Ng',
    role: 'Carbon Market Analyst'
  },
  {
    quote: 'The impact studio helped us showcase a real investment story.',
    name: 'Lucas Romero',
    role: 'Blue Carbon Fund'
  }
];

const faqItems = [
  {
    question: 'What is blue carbon?',
    answer: 'Blue carbon refers to carbon captured by ocean and coastal ecosystems such as mangroves, seagrass, and tidal marshes.'
  },
  {
    question: 'How is project data verified?',
    answer: 'Independent MRV partners upload evidence that is permanently tied to project IDs on-chain.'
  },
  {
    question: 'Can I integrate this registry with other tools?',
    answer: 'Yes. The API is built to feed dashboards, markets, and climate reporting workflows.'
  }
];

const trustBadges = ['UN Climate Lab', 'Blue Carbon Initiative', 'Ocean DAO', 'Global MRV Network'];
const isValidEmail = (value) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value);

// Main App Component
function BlueCarbonApp() {
  const [activeSection, setActiveSection] = useState('home');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    verifiedProjects: 0,
    pendingProjects: 0,
    estimatedCarbon: 0
  });
  const [newProject, setNewProject] = useState({
    name: '',
    location: '',
    credits: '',
    organization: '',
    contactEmail: ''
  });
  const [mrvReport, setMrvReport] = useState({ projectId: '', carbonSequestered: '', verifierName: '' });
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [registryFilter, setRegistryFilter] = useState('all');
  const [registrySearch, setRegistrySearch] = useState('');
  const [impactArea, setImpactArea] = useState(25);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');

  // Load projects and stats on component mount
  useEffect(() => {
    loadProjects();
    loadStats();
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activeSection]);

  const loadProjects = async () => {
    try {
      const response = await fetch(`${API_BASE}/projects`);
      const result = await response.json();
      if (result.success) {
        setProjects(result.data || []);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/stats`);
      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const connectWallet = async () => {
    setIsWalletConnected(true);
    setWalletAddress('0x742d35Cc6634C0532925a3b8D404d3aABb8c4532');
  };

  const addProject = async () => {
    if (!newProject.name || !newProject.location || !newProject.credits || !newProject.organization || !newProject.contactEmail) {
      alert('Please fill all fields');
      return;
    }
    if (!isValidEmail(newProject.contactEmail)) {
      alert('Please enter a valid contact email');
      return;
    }

    setLoading(true);
    try {
      const projectData = {
        projectName: newProject.name,
        organization: newProject.organization,
        contactEmail: newProject.contactEmail,
        areaHectares: parseInt(newProject.credits) / 50,
        location: {
          state: 'Unknown',
          district: newProject.location
        },
        mangroveSpecies: ['Mixed Species']
      };

      const response = await fetch(`${API_BASE}/projects/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      });

      const result = await response.json();

      if (result.success) {
        alert(`✅ Project submitted! ID: ${result.projectId}`);
        setNewProject({ name: '', location: '', credits: '', organization: '', contactEmail: '' });
        loadProjects();
        loadStats();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Network error: ' + error.message);
    }
    setLoading(false);
  };

  const submitMRV = async () => {
    if (!mrvReport.projectId || !mrvReport.carbonSequestered || !mrvReport.verifierName) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/projects/${mrvReport.projectId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ verifiedBy: mrvReport.verifierName })
      });

      const result = await response.json();

      if (result.success) {
        alert('✅ MRV report submitted successfully!');
        setMrvReport({ projectId: '', carbonSequestered: '', verifierName: '' });
        loadProjects();
        loadStats();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Network error: ' + error.message);
    }
    setLoading(false);
  };

  const handleNavigate = (section) => {
    setActiveSection(section);
  };

  const filteredProjects = useMemo(() => {
    const search = registrySearch.trim().toLowerCase();
    return projects
      .filter((project) => {
        if (!search) return true;
        const name = project.projectName?.toLowerCase() || '';
        const location = project.location?.district?.toLowerCase() || '';
        return name.includes(search) || location.includes(search) || project.projectId?.toLowerCase().includes(search);
      })
      .filter((project) => {
        if (registryFilter === 'verified') return project.verified;
        if (registryFilter === 'pending') return !project.verified;
        return true;
      })
      .sort((a, b) => (b.credits || 0) - (a.credits || 0));
  }, [projects, registryFilter, registrySearch]);

  const spotlightProjects = useMemo(() => {
    if (projects.length) {
      return projects.slice(0, 3).map((project, index) => ({
        id: project.projectId || `BC-${index}`,
        name: project.projectName || 'Blue Carbon Initiative',
        location: project.location?.district || 'Coastal Region',
        credits: project.credits || 0,
        status: project.verified ? 'Verified' : 'Monitoring'
      }));
    }
    return sampleSpotlights;
  }, [projects]);

  const activityFeed = useMemo(() => {
    if (!projects.length) {
      return [
        { label: 'New project submitted', detail: 'Azure Delta Mangrove Shield' },
        { label: 'MRV completed', detail: 'Reefline Seagrass Revival' },
        { label: 'Credits minted', detail: 'Pacific Tidal Wetlands' }
      ];
    }
    return projects.slice(0, 3).map((project) => ({
      label: project.verified ? 'Credits minted' : 'Project submitted',
      detail: project.projectName
    }));
  }, [projects]);

  const impactMetrics = useMemo(() => {
    const credits = Math.round(impactArea * 50);
    const annualCapture = Math.round(credits * 1.2);
    const households = Math.max(1, Math.round(credits / 12));
    const coastline = Math.round(impactArea * 0.85);
    return { credits, annualCapture, households, coastline };
  }, [impactArea]);

  const handleSubscribe = () => {
    if (!isValidEmail(newsletterEmail.trim())) {
      setNewsletterStatus('Please enter a valid email to receive updates.');
      return;
    }
    setNewsletterStatus('Thanks! You will receive the next registry intelligence update.');
    setNewsletterEmail('');
  };

  // Navigation Component
  const Navigation = () => (
    <nav className="fixed top-0 w-full z-50">
      <div className="glass-effect border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <i>🌊</i>
              <span className="text-xl font-bold text-white">🌍 Blue Carbon Registry</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`transition-colors ${activeSection === item.id ? 'text-white' : 'text-white/70 hover:text-white'}`}
                >
                  {item.label}
                </button>
              ))}
              {!isWalletConnected ? (
                <button
                  onClick={connectWallet}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-full transition-colors"
                >
                  👛 Connect Wallet
                </button>
              ) : (
                <div className="bg-green-500/20 border border-green-500/30 text-green-300 px-4 py-2 rounded-full text-sm">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </div>
              )}
            </div>
            <button
              className="md:hidden text-white text-xl"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">{mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}</span>
              <span aria-hidden="true">{mobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`block w-full text-left px-4 py-2 rounded-xl ${
                  activeSection === item.id ? 'bg-white/10 text-white' : 'text-white/70'
                }`}
              >
                {item.label}
              </button>
            ))}
            {!isWalletConnected ? (
              <button
                onClick={connectWallet}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-full transition-colors"
              >
                👛 Connect Wallet
              </button>
            ) : (
              <div className="bg-green-500/20 border border-green-500/30 text-green-300 px-4 py-2 rounded-full text-sm text-center">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );

  // Home Component
  const HomeSection = () => (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-teal-500/20 border border-teal-500/30 rounded-full px-4 py-2 mb-8">
            <i>🛡️</i>
            <span className="text-teal-300 text-sm font-medium ml-2">Blockchain-Powered Carbon Tracking</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            🌍 <span className="text-gradient">Blue Carbon Registry</span>
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            A premium registry for blue carbon projects with live verification, tokenized credits, and investor-ready
            impact intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isWalletConnected ? (
              <button
                onClick={connectWallet}
                className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105"
              >
                👉 Connect Wallet to Get Started
              </button>
            ) : (
              <button
                onClick={() => handleNavigate('registry')}
                className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105"
              >
                Explore Carbon Registry →
              </button>
            )}
            <button
              onClick={() => handleNavigate('impact')}
              className="border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all"
            >
              Visit Impact Studio
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '🌿', value: stats.estimatedCarbon.toLocaleString(), label: 'Total Carbon Credits' },
            { icon: '📋', value: stats.totalProjects, label: 'Registered Projects' },
            { icon: '✅', value: stats.verifiedProjects, label: 'Verified Projects' },
            { icon: '⏳', value: stats.pendingProjects, label: 'Projects in Review' }
          ].map((stat, index) => (
            <div key={index} className="glass-effect rounded-2xl p-6 text-center card-hover">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {quickActions.map((action) => (
            <div key={action.title} className="glass-effect rounded-2xl p-6 card-hover">
              <div className="text-3xl mb-4">{action.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{action.title}</h3>
              <p className="text-gray-400 mb-6">{action.desc}</p>
              <button
                onClick={() => handleNavigate(action.target)}
                className="text-teal-300 font-semibold hover:text-white transition-colors"
              >
                Go now →
              </button>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {featureHighlights.map((feature) => (
            <div key={feature.title} className="glass-effect rounded-2xl p-6 card-hover">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="glass-effect rounded-3xl p-8 mt-12 gradient-border">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-3">How the registry works</h2>
              <p className="text-gray-400 max-w-2xl">
                A streamlined flow from submission to verification ensures every credit is trusted and tradable.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              {howItWorks.map((item) => (
                <div key={item.step} className="bg-white/5 rounded-2xl p-4 min-w-[180px]">
                  <div className="text-teal-300 text-sm font-semibold">{item.step}</div>
                  <div className="text-white font-semibold mt-1">{item.title}</div>
                  <div className="text-gray-400 text-sm mt-2">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Impact Studio Section
  const ImpactSection = () => (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-4xl mb-4">🧭</div>
          <h1 className="text-4xl font-bold text-white mb-4">Impact Studio</h1>
          <p className="text-xl text-gray-300">Model project impact, explore live activity, and showcase top initiatives.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="glass-effect rounded-3xl p-8 gradient-border">
            <h3 className="text-2xl font-semibold text-white mb-4">Impact Calculator</h3>
            <p className="text-gray-400 mb-6">
              Slide to model the hectares you plan to protect and see estimated credits, CO₂ capture, and households
              offset.
            </p>
            <div className="bg-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">Protected area (hectares)</span>
                <span className="text-white font-semibold">{impactArea} ha</span>
              </div>
              <input
                type="range"
                min="5"
                max="200"
                value={impactArea}
                onChange={(event) => setImpactArea(Number(event.target.value))}
                className="range-input"
                aria-label="Select protected area in hectares"
              />
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-xs text-gray-400">Estimated Credits</div>
                  <div className="text-xl font-bold text-white">{impactMetrics.credits.toLocaleString()}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-xs text-gray-400">Annual CO₂ Capture</div>
                  <div className="text-xl font-bold text-white">{impactMetrics.annualCapture.toLocaleString()} t</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-xs text-gray-400">Households Offset</div>
                  <div className="text-xl font-bold text-white">{impactMetrics.households}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-xs text-gray-400">Coastline Protected</div>
                  <div className="text-xl font-bold text-white">{impactMetrics.coastline} km</div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-effect rounded-3xl p-8 gradient-border">
            <h3 className="text-2xl font-semibold text-white mb-4">Live Coastline Radar</h3>
            <p className="text-gray-400 mb-6">Track project activity hotspots and MRV updates in real time.</p>
            <div className="relative bg-white/5 rounded-2xl h-64 map-grid overflow-hidden">
              <div className="map-marker" style={{ top: '25%', left: '30%' }}></div>
              <div className="map-marker" style={{ top: '55%', left: '55%' }}></div>
              <div className="map-marker" style={{ top: '35%', left: '70%' }}></div>
              <div className="absolute bottom-4 left-4 bg-white/10 px-3 py-2 rounded-lg text-xs text-white">
                12 active MRV nodes
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {activityFeed.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm text-gray-300">
                  <span>{item.label}</span>
                  <span className="text-teal-300">{item.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {spotlightProjects.map((project) => (
            <div key={project.id} className="glass-effect rounded-2xl p-6 card-hover">
              <div className="flex items-center justify-between">
                <span className="badge-pill bg-teal-500/20 text-teal-300">{project.status}</span>
                <span className="text-xs text-gray-400">{project.id}</span>
              </div>
              <h3 className="text-xl font-semibold text-white mt-4">{project.name}</h3>
              <p className="text-gray-400 mt-2">{project.location}</p>
              <div className="text-2xl font-bold text-white mt-4">{project.credits.toLocaleString()} tCO₂e</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-10">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="glass-effect rounded-2xl p-6">
              <p className="text-gray-300 mb-6">“{testimonial.quote}”</p>
              <div className="text-white font-semibold">{testimonial.name}</div>
              <div className="text-sm text-gray-400">{testimonial.role}</div>
            </div>
          ))}
        </div>

        <div className="glass-effect rounded-3xl p-8 mt-10 text-center">
          <p className="text-sm text-gray-400 mb-4">Trusted by</p>
          <div className="flex flex-wrap justify-center gap-4">
            {trustBadges.map((badge) => (
              <span key={badge} className="bg-white/10 px-4 py-2 rounded-full text-sm text-white">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Add Project Component
  const AddProjectSection = () => (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-4xl mb-4">➕</div>
          <h1 className="text-4xl font-bold text-white mb-4">Register New Carbon Project</h1>
          <p className="text-xl text-gray-300">Enter project details to create a permanent record on the blockchain.</p>
        </div>

        <div className="glass-effect rounded-3xl p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">Project Name</label>
              <input
                type="text"
                placeholder="e.g., Mangrove Restoration Project"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Organization</label>
              <input
                type="text"
                placeholder="e.g., Coastal Restoration Alliance"
                value={newProject.organization}
                onChange={(e) => setNewProject({ ...newProject, organization: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Contact Email</label>
              <input
                type="email"
                placeholder="e.g., hello@bluecarbon.org"
                value={newProject.contactEmail}
                onChange={(e) => setNewProject({ ...newProject, contactEmail: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Location</label>
              <input
                type="text"
                placeholder="e.g., Kerala, India"
                value={newProject.location}
                onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Estimated Carbon Credits</label>
              <input
                type="number"
                placeholder="e.g., 500"
                value={newProject.credits}
                onChange={(e) => setNewProject({ ...newProject, credits: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <button
              onClick={addProject}
              disabled={loading || !isWalletConnected}
              className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 disabled:scale-100"
            >
              {loading ? '⏳ Submitting...' : isWalletConnected ? '✅ Add Project' : 'Connect wallet to continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // MRV Section Component
  const MRVSection = () => (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-4xl mb-4">📊</div>
          <h1 className="text-4xl font-bold text-white mb-4">Submit MRV Report</h1>
          <p className="text-xl text-gray-300">Upload verified monitoring data for an existing project.</p>
        </div>

        <div className="glass-effect rounded-3xl p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">Project ID</label>
              <select
                value={mrvReport.projectId}
                onChange={(e) => setMrvReport({ ...mrvReport, projectId: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.projectId} value={project.projectId}>
                    {project.projectId} - {project.projectName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Carbon Sequestered (tons)</label>
              <input
                type="number"
                placeholder="e.g., 150"
                value={mrvReport.carbonSequestered}
                onChange={(e) => setMrvReport({ ...mrvReport, carbonSequestered: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Verifier Name</label>
              <input
                type="text"
                placeholder="e.g., Climate Verification Institute"
                value={mrvReport.verifierName}
                onChange={(e) => setMrvReport({ ...mrvReport, verifierName: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              onClick={submitMRV}
              disabled={loading || !isWalletConnected}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 disabled:scale-100"
            >
              {loading ? '⏳ Submitting...' : isWalletConnected ? '📤 Submit MRV' : 'Connect wallet to continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Registry Component
  const RegistrySection = () => (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-4xl mb-4">📋</div>
          <h1 className="text-4xl font-bold text-white mb-4">Carbon Project Registry</h1>
          <p className="text-xl text-gray-300">Browse all projects currently registered on the blockchain.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Projects', value: stats.totalProjects },
            { label: 'Verified', value: stats.verifiedProjects },
            { label: 'Pending', value: stats.pendingProjects }
          ].map((summary) => (
            <div key={summary.label} className="glass-effect rounded-2xl p-6 text-center">
              <div className="text-sm text-gray-400">{summary.label}</div>
              <div className="text-2xl font-bold text-white mt-2">{summary.value}</div>
            </div>
          ))}
        </div>

        <div className="glass-effect rounded-3xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by project name, ID, or location"
              value={registrySearch}
              onChange={(event) => setRegistrySearch(event.target.value)}
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All' },
                { value: 'verified', label: 'Verified' },
                { value: 'pending', label: 'Pending' }
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setRegistryFilter(filter.value)}
                  className={`badge-pill border ${
                    registryFilter === filter.value
                      ? 'bg-teal-500/20 text-teal-300 border-teal-400/40'
                      : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-4 px-4 text-white font-semibold">Project ID</th>
                  <th className="text-left py-4 px-4 text-white font-semibold">Project Name</th>
                  <th className="text-left py-4 px-4 text-white font-semibold">Location</th>
                  <th className="text-left py-4 px-4 text-white font-semibold">Carbon Credits</th>
                  <th className="text-left py-4 px-4 text-white font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.projectId} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <span className="text-teal-400 font-mono">{project.projectId}</span>
                    </td>
                    <td className="py-4 px-4 text-white font-medium">{project.projectName}</td>
                    <td className="py-4 px-4 text-gray-300">{project.location?.district || 'Unknown'}</td>
                    <td className="py-4 px-4">
                      <span className="text-emerald-400 font-bold">{(project.credits || 0).toLocaleString()}</span>
                      <span className="text-gray-400 text-sm ml-1">tCO₂e</span>
                    </td>
                    <td className="py-4 px-4">
                      {project.verified ? (
                        <span className="inline-flex items-center bg-green-500/20 border border-green-500/30 text-green-300 px-3 py-1 rounded-full text-sm">
                          ✅ Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 px-3 py-1 rounded-full text-sm">
                          ⏳ Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!filteredProjects.length && (
            <div className="text-center text-gray-400 mt-8">
              No projects match your search yet. Submit a new project or adjust the filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // About Component
  const AboutSection = () => (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-4xl mb-4">ℹ️</div>
          <h1 className="text-4xl font-bold text-white mb-4">About Blue Carbon Registry</h1>
        </div>

        <div className="glass-effect rounded-3xl p-8">
          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Blue Carbon ecosystems—mangroves, seagrass, and tidal wetlands—capture{' '}
              <strong className="text-teal-400">10x more carbon</strong> per hectare than forests. Yet, they are often
              overlooked in carbon markets.
            </p>

            <h3 className="text-2xl font-bold text-white mb-6">This platform solves the problem by:</h3>

            <div className="space-y-6">
              {[
                {
                  icon: '✅',
                  title: 'Transparent Carbon Project Tracking',
                  desc: 'Every project is recorded on an immutable blockchain, providing complete transparency and eliminating fraud.'
                },
                {
                  icon: '✅',
                  title: 'Verifiable MRV Reports',
                  desc: 'Monitoring, Reporting, and Verification data is cryptographically secured and publicly auditable.'
                },
                {
                  icon: '✅',
                  title: 'Global Access to Climate Action',
                  desc: 'Democratizing access to carbon project information for global participation.'
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="text-2xl mr-4 mt-1">{item.icon}</div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">{item.title}</h4>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-10">
              {faqItems.map((faq) => (
                <div key={faq.question} className="bg-white/5 rounded-2xl p-5">
                  <div className="text-white font-semibold mb-2">{faq.question}</div>
                  <div className="text-sm text-gray-400">{faq.answer}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-3xl p-8 mt-10 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Stay in the loop</h3>
          <p className="text-gray-400 mb-6">Get weekly updates on the newest blue carbon projects and MRV milestones.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              placeholder="your@email.com"
              value={newsletterEmail}
              onChange={(event) => setNewsletterEmail(event.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <button
              onClick={handleSubscribe}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Subscribe
            </button>
          </div>
          {newsletterStatus && <p className="text-sm text-teal-300 mt-3">{newsletterStatus}</p>}
        </div>
      </div>
    </div>
  );

  // Footer Component
  const Footer = () => (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <i>🌊</i>
          <span className="text-xl font-bold text-white">🌍 Blue Carbon Registry</span>
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Revolutionizing blue carbon markets through blockchain technology for transparent, verifiable, and trusted
          carbon offset tracking.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-gray-400">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => handleNavigate(item.id)} className="hover:text-white">
              {item.label}
            </button>
          ))}
        </div>
        <div className="border-t border-white/10 mt-8 pt-8 text-gray-500">
          <p>© 2024 Blue Carbon Registry. Powered by blockchain technology for climate action.</p>
        </div>
      </div>
    </footer>
  );

  // Main render
  return (
    <div className="min-h-screen bg-aurora relative overflow-hidden">
      <div className="orb orb-one" aria-hidden="true"></div>
      <div className="orb orb-two" aria-hidden="true"></div>
      <div className="orb orb-three" aria-hidden="true"></div>

      <Navigation />

      {activeSection === 'home' && <HomeSection />}
      {activeSection === 'impact' && <ImpactSection />}
      {activeSection === 'add-project' && <AddProjectSection />}
      {activeSection === 'submit-mrv' && <MRVSection />}
      {activeSection === 'registry' && <RegistrySection />}
      {activeSection === 'about' && <AboutSection />}

      <Footer />
    </div>
  );
}

// Render the app
ReactDOM.render(<BlueCarbonApp />, document.getElementById('root'));
