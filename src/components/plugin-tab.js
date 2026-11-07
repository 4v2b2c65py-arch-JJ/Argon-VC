/* Plugin Tab component for Argon frontend */
(function() {
  'use strict';

  const PLUGINS = [
    {
      id: 'code-lang',
      name: 'Code Language Support',
      desc: 'Syntax highlighting and language elements for CSS, React, Framer, Python, Rust.',
      icon: '💻',
      langs: ['css', 'react', 'framer', 'python', 'rust'],
      active: true,
    },
    {
      id: 'google-auth',
      name: 'Google Login',
      desc: 'Secure OAuth2 authentication with Google Identity Services.',
      icon: '🔐',
      langs: ['oauth2', 'jwt'],
      active: true,
    },
    {
      id: 'glass-ui',
      name: 'Glass UI Depth',
      desc: 'Framer-inspired glassmorphism with depth layers and backdrop blur.',
      icon: '🪞',
      langs: ['framer', 'tailwind', 'css3'],
      active: true,
    },
    {
      id: 'model-bridge',
      name: 'Model Bridge',
      desc: 'Route requests across OpenAI, Ollama, and llama.cpp providers.',
      icon: '🌉',
      langs: ['python', 'rust'],
      active: false,
    },
    {
      id: 'benchmarks',
      name: 'Benchmark Suites',
      desc: 'Model scoring vs WordPress baseline, FLOPS, architecture, design.',
      icon: '📊',
      langs: ['python', 'chart'],
      active: false,
    },
    {
      id: 'weight-enforcement',
      name: 'Weight Enforcement',
      desc: 'Model weight non-replication to protect tier/mesh structure.',
      icon: '🛡️',
      langs: ['python', 'rust'],
      active: false,
    },
  ];

  function renderPluginTab(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold glass-text">Plugin Tab</h3>
          <span class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
            ${PLUGINS.filter(p => p.active).length} active / ${PLUGINS.length} total
          </span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    `;

    PLUGINS.forEach(p => {
      html += `
        <div class="glass-panel p-6 rounded-xl border ${p.active ? 'border-emerald-200/50 bg-emerald-50/30' : 'border-white/30'} transition-all hover:border-emerald-300/50">
          <div class="flex items-start gap-4 mb-4">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center text-xl ${p.active ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}">
              ${p.icon}
            </div>
            <div class="flex-1">
              <h4 class="font-bold text-slate-800">${p.name}</h4>
              <p class="text-sm text-slate-500 mt-1">${p.desc}</p>
            </div>
          </div>
          <div class="flex gap-2 mb-4">
            ${p.langs.map(l => `<span class="code-lang-badge lang-${l}">${l}</span>`).join('')}
          </div>
          <div class="flex items-center justify-between pt-4 border-t border-white/30">
            <span class="text-xs font-medium ${p.active ? 'text-emerald-600' : 'text-slate-400'}">
              ${p.active ? 'Active' : 'Inactive'}
            </span>
            <button class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${p.active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-white text-slate-600 border border-white/40 hover:bg-emerald-50 hover:text-emerald-600'}">
              ${p.active ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
    container.innerHTML = html;
  }

  // Expose globally
  window.renderPluginTab = renderPluginTab;

  // Auto-render if container exists
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const c = document.getElementById('plugin-tab-container');
      if (c) renderPluginTab('plugin-tab-container');
    });
  } else {
    const c = document.getElementById('plugin-tab-container');
    if (c) renderPluginTab('plugin-tab-container');
  }

})();
