/* Argon Account Linking — Amazon, eBay, and other external accounts */
(function() {
  'use strict';

  const AccountLinkInterface = (containerId, opts = {}) => {
    const container = document.getElementById(containerId);
    if (!container) return null;

    const accounts = [
      {
        id: 'amazon',
        name: 'Amazon',
        icon: '📦',
        color: 'bg-orange-100 text-orange-700 border-orange-200',
        connected: false,
        features: ['Order history', 'Purchase tracking', 'Product links'],
      },
      {
        id: 'ebay',
        name: 'eBay',
        icon: '🛒',
        color: 'bg-red-100 text-red-700 border-red-200',
        connected: false,
        features: ['Auction alerts', 'Sold items', 'Watch list'],
      },
      {
        id: 'shopify',
        name: 'Shopify',
        icon: '🛍️',
        color: 'bg-green-100 text-green-700 border-green-200',
        connected: false,
        features: ['Store data', 'Order sync', 'Customer info'],
      },
      {
        id: 'etsy',
        name: 'Etsy',
        icon: '🧵',
        color: 'bg-pink-100 text-pink-700 border-pink-200',
        connected: false,
        features: ['Shop stats', 'Listing management', 'Reviews'],
      },
      {
        id: 'walmart',
        name: 'Walmart',
        icon: '🏪',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        connected: false,
        features': ['Receipt scanning', 'Savings catcher', 'Order history'],
      },
    ];

    const render = () => {
      container.innerHTML = `
        <div class="glass-panel p-6 rounded-2xl">
          <div class="flex items-center justify-between mb-6 border-b border-white/30 pb-3">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">🔗</div>
              <div>
                <div class="text-sm font-semibold text-slate-800">Account Linking</div>
                <div class="text-xs text-slate-500">Connect Amazon, eBay, and more</div>
              </div>
            </div>
            <div class="text-xs font-medium text-slate-500">
              ${accounts.filter(a => a.connected).length} connected
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${accounts.map(acc => `
              <div class="glass-depth-1 p-5 rounded-2xl border border-white/40 hover:border-${acc.color.split(' ')[1]}/50 transition-all group cursor-pointer" onclick="linkAccount('${acc.id}')">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center text-xl ${acc.color}">
                    ${acc.icon}
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-bold text-slate-800">${acc.name}</div>
                    <div class="text-xs text-slate-500">${acc.features.join(', ')}</div>
                  </div>
                  <div class="w-6 h-6 rounded-full ${acc.connected ? 'bg-emerald-500' : 'bg-slate-300'} flex items-center justify-center text-xs">
                    ${acc.connected ? '✓' : '+'}
                  </div>
                </div>
                <div class="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
                  <span class="text-xs font-medium ${acc.connected ? 'text-emerald-600' : 'text-slate-400'}">
                    ${acc.connected ? 'Connected' : 'Connect'}
                  </span>
                  <button class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${acc.connected 
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                    : 'bg-white text-slate-600 border border-white/40 hover:bg-emerald-50 hover:text-emerald-600'}">
                    ${acc.connected ? 'Manage' : 'Link'}
                  </button>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="mt-8 pt-6 border-t border-white/30">
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Connected Accounts</h4>
            <div class="space-y-2" id="connected-list">
              ${accounts.filter(a => a.connected).map(a => `
                <div class="flex items-center justify-between px-4 py-2 rounded-xl bg-white/20">
                  <div class="flex items-center gap-3">
                    <span class="text-xl">${a.icon}</span>
                    <div>
                      <div class="text-sm font-medium text-slate-800">${a.name}</div>
                      <div class="text-xs text-slate-500">Linked · ${new Date().toLocaleDateString()}</div>
                    </div>
                  </div>
                  <button class="px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded">Disconnect</button>
                </div>
              `).join('') || '<div class="text-xs text-slate-400 text-center">No accounts connected yet</div>'}
            </div>
          </div>
        </div>
      `;
    };

    render();
    return { state: accounts, render };
  };

  // Global link account handler
  window.linkAccount = (providerId) => {
    const btn = event.target.closest('button');
    const original = btn.textContent;
    btn.textContent = 'Connecting...';
    btn.className = 'px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-600 border border-white/40';
    btn.disabled = true;

    // Simulate OAuth flow
    setTimeout(() => {
      btn.textContent = 'Connected';
      btn.className = 'px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200';
      btn.disabled = false;

      // Update connected list
      const list = document.getElementById('connected-list');
      if (list) {
        const names = { amazon: 'Amazon', ebay: 'eBay', shopify: 'Shopify', etsy: 'Etsy', walmart: 'Walmart' };
        const icons = { amazon: '📦', ebay: '🛒', shopify: '🛍️', etsy: '🧵', walmart: '🏪' };
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between px-4 py-2 rounded-xl bg-white/20';
        div.innerHTML = `
          <div class="flex items-center gap-3">
            <span class="text-xl">${icons[providerId]}</span>
            <div>
              <div class="text-sm font-medium text-slate-800">${names[providerId]}</div>
              <div class="text-xs text-slate-500">Linked · just now</div>
            </div>
          </div>
          <button class="px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded">Disconnect</button>
        `;
        // Replace "no accounts" message if present
        if (list.querySelector('.text-center')) {
          list.innerHTML = '';
        }
        list.appendChild(div);
      }

      // Update counter
      const counter = document.querySelector('.text-xs.font-medium.text-slate-500');
      if (counter) {
        const connected = document.querySelectorAll('#connected-list > div').length;
        counter.textContent = connected + ' connected';
      }
    }, 1500);
  };

  window.ArgonAccounts = AccountLinkInterface;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const c = document.getElementById('accounts-container');
      if (c) window.ArgonAccounts('accounts-container');
    });
  } else {
    const c = document.getElementById('accounts-container');
    if (c) window.ArgonAccounts('accounts-container');
  }

})();
