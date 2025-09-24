const { useState, useEffect } = React;

// API configuration
const API_BASE = '/api';

// Main App Component
function BlueCarbonApp() {
  const [activeSection, setActiveSection] = useState('home');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ totalProjects: 0, verifiedProjects: 0, estimatedCarbon: 0 });
  const [newProject, setNewProject] = useState({ name: '', location: '', credits: '' });
  const [mrvReport, setMrvReport] = useState({ projectId: '', carbonSequestered: '', verifierName: '' });
  const [loading, setLoading] = useState(false);

  // Load projects and stats on component mount
  useEffect(() => {
    loadProjects();
    loadStats();
  }, []);

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
    if (!newProject.name || !newProject.location || !newProject.credits) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const projectData = {
        projectName: newProject.name,
        organization: "User Organization",
        contactEmail: "user@example.com",
        areaHectares: parseInt(newProject.credits) / 50, // Convert credits to hectares
        location: {
          state: "Unknown",
          district: newProject.location
        },
        mangroveSpecies: ["Mixed Species"]
      };

      const response = await fetch(`${API_BASE}/projects/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData)
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`✅ Project submitted! ID: ${result.projectId}`);
        setNewProject({ name: '', location: '', credits: '' });
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
          'Content-Type': 'application/json',
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

  // Navigation Component
  const Navigation = () => (
    <nav className="fixed top-0 w-full z-50 glass-effect border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <i>🌊</i>
            <span className="text-xl font-bold text-white">🌍 Blue Carbon Registry</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {['home', 'add-project', 'submit-mrv', 'registry', 'about'].map(section => (
              <button 
                key={section}
                onClick={() => setActiveSection(section)}
                className={`transition-colors capitalize ${activeSection === section ? 'text-white' : 'text-white/80 hover:text-white'}`}
              >
                {section.replace('-', ' ')}
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
        </div>
      </div>
    </nav>
  );

  // Home Component
  const HomeSection = () => (
    <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
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
            A blockchain-powered platform for transparent and trusted carbon offset tracking. 
            Blue Carbon ecosystems are critical for absorbing CO₂ and fighting climate change.
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
                onClick={() => setActiveSection('registry')}
                className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105"
              >
                Explore Carbon Registry →
              </button>
            )}
            <button 
              onClick={() => setActiveSection('about')}
              className="border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '🌿', value: stats.estimatedCarbon.toLocaleString(), label: 'Total Carbon Credits' },
            { icon: '📋', value: stats.totalProjects, label: 'Registered Projects' },
            { icon: '✅', value: stats.verifiedProjects, label: 'Verified Projects' },
            { icon: '🔒', value: '100%', label: 'Transparency' }
          ].map((stat, index) => (
            <div key={index} className="glass-effect rounded-2xl p-6 text-center">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Add Project Component
  const AddProjectSection = () => (
    <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
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
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Location</label>
              <input
                type="text"
                placeholder="e.g., Kerala, India"
                value={newProject.location}
                onChange={(e) => setNewProject({...newProject, location: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Estimated Carbon Credits</label>
              <input
                type="number"
                placeholder="e.g., 500"
                value={newProject.credits}
                onChange={(e) => setNewProject({...newProject, credits: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <button
              onClick={addProject}
              disabled={loading || !isWalletConnected}
              className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 disabled:scale-100"
            >
              {loading ? '⏳ Submitting...' : '✅ Add Project'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // MRV Section Component
  const MRVSection = () => (
    <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
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
                onChange={(e) => setMrvReport({...mrvReport, projectId: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select a project</option>
                {projects.map(project => (
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
                onChange={(e) => setMrvReport({...mrvReport, carbonSequestered: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Verifier Name</label>
              <input
                type="text"
                placeholder="e.g., Climate Verification Institute"
                value={mrvReport.verifierName}
                onChange={(e) => setMrvReport({...mrvReport, verifierName: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              onClick={submitMRV}
              disabled={loading || !isWalletConnected}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 text-white py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 disabled:scale-100"
            >
              {loading ? '⏳ Submitting...' : '📤 Submit MRV'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Registry Component
  const RegistrySection = () => (
    <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-4xl mb-4">📋</div>
          <h1 className="text-4xl font-bold text-white mb-4">Carbon Project Registry</h1>
          <p className="text-xl text-gray-300">Browse all projects currently registered on the blockchain.</p>
        </div>

        <div className="glass-effect rounded-3xl p-8">
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
                {projects.map(project => (
                  <tr key={project.projectId} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <span className="text-teal-400 font-mono">{project.projectId}</span>
                    </td>
                    <td className="py-4 px-4 text-white font-medium">{project.projectName}</td>
                    <td className="py-4 px-4 text-gray-300">{project.location.district}</td>
                    <td className="py-4 px-4">
                      <span className="text-emerald-400 font-bold">{project.credits.toLocaleString()}</span>
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
        </div>
      </div>
    </div>
  );

  // About Component
  const AboutSection = () => (
    <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-4xl mb-4">ℹ️</div>
          <h1 className="text-4xl font-bold text-white mb-4">About Blue Carbon Registry</h1>
        </div>

        <div className="glass-effect rounded-3xl p-8">
          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Blue Carbon ecosystems—mangroves, seagrass, and tidal wetlands—capture <strong className="text-teal-400">10x more carbon</strong> per hectare than forests. Yet, they are often overlooked in carbon markets.
            </p>

            <h3 className="text-2xl font-bold text-white mb-6">This platform solves the problem by:</h3>
            
            <div className="space-y-6">
              {[
                { icon: '✅', title: 'Transparent Carbon Project Tracking', desc: 'Every project is recorded on an immutable blockchain, providing complete transparency and eliminating fraud.' },
                { icon: '✅', title: 'Verifiable MRV Reports', desc: 'Monitoring, Reporting, and Verification data is cryptographically secured and publicly auditable.' },
                { icon: '✅', title: 'Global Access to Climate Action', desc: 'Democratizing access to carbon project information for global participation.' }
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
          </div>
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
          Revolutionizing blue carbon markets through blockchain technology for transparent, 
          verifiable, and trusted carbon offset tracking.
        </p>
        <div className="border-t border-white/10 mt-8 pt-8 text-gray-500">
          <p>© 2024 Blue Carbon Registry. Powered by blockchain technology for climate action.</p>
        </div>
      </div>
    </footer>
  );

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900">
      <Navigation />
      
      {activeSection === 'home' && <HomeSection />}
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