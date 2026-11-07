/* Argon Usage Dashboard — tokens, cost, rate limit, RPO */
(function() {
  'use strict';

  const UsageDashboardUI = (containerId, opts = {}) => {
    const container = document.getElementById(containerId);
    if (!container) return null;

    const state = {
      plan: 'Pro',
      planPrice: 19.99,
      requestsRemaining: 59,
      tokensRemaining: 9500,
      concurrentCalls: 5,
      maxFileSize: '50 MB',
      totalRequests: 1247,
      totalTokens: 89450,
      totalCost: 178.90,
      avgLatency: 240,
      successRate: 98.5,
      rpo: 42.50,
      monthlyRevenue: 1275.00,
      endpoints: [
        { name: '/chat/completions', requests: 850, tokens: 65000, cost: 130.00 },
        { name: '/voice/transcribe', requests: 200, tokens: 12000, cost: 24.00 },
        { name: '/files/upload', requests: 150, tokens: 8000, cost: 16.00 },
        { name: '/calls/initiate', requests: 47, tokens: 4450, cost: 8.90 },
      ],
    };

    const render = () => {
      container.innerHTML = `
        <div class="space-y-6">
          <!-- Header -->
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold glass-text">Usage Dashboard</h2>
              <p class="text-sm text-slate-500">Token usage, rate limits, and earnings</p>
            </div>
            <div class="flex gap-3">
              <button class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium shadow-lg shadow-emerald-200">Export CSV</button>
              <button class="px-4 py-2 glass-panel text-slate-700 rounded-xl text-sm font-medium border border-white/50 hover:bg-white/40">Refresh</button>
            </div>
          </div>

          <!-- Plan & Rate Limit -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="glass-panel p-5 rounded-2xl">
              <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Current Plan</div>
              <div class="text-lg font-bold text-slate-800">${state.plan}</div>
              <div class="text-xs text-slate-500 mt-1">\$${state.planPrice}/month</div>
            </div>
            <div class="glass-panel p-5 rounded-2xl">
              <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Requests Remaining</div>
              <div class="text-lg font-bold text-slate-800">${state.requestsRemaining}</div>
              <div class="text-xs text-slate-500 mt-1">per minute</div>
            </div>
            <div class="glass-panel p-5 rounded-2xl">
              <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tokens Remaining</div>
              <div class="text-lg font-bold text-slate-800">${state.tokensRemaining.toLocaleString()}</div>
              <div class="text-xs text-slate-500 mt-1">per minute</div>
            </div>
            <div class="glass-panel p-5 rounded-2xl">
              <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Concurrent Calls</div>
              <div class="text-lg font-bold text-slate-800">${state.concurrentCalls}</div>
              <div class="text-xs text-slate-500 mt-1">max simultaneous</div>
            </div>
          </div>

          <!-- Usage Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="glass-panel p-5 rounded-2xl">
              <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Requests</div>
              <div class="text-2xl font-bold text-slate-800">${state.totalRequests.toLocaleString()}</div>
              <div class="text-xs text-slate-500 mt-1">this month</div>
            </div>
            <div class="glass-panel p-5 rounded-2xl">
              <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Tokens</div>
              <div class="text-2xl font-bold text-slate-800">${state.totalTokens.toLocaleString()}</div>
              <div class="text-xs text-slate-500 mt-1">processed</div>
            </div>
            <div class="glass-panel p-5 rounded-2xl">
              <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Cost</div>
              <div class="text-2xl font-bold text-slate-800">\$${state.totalCost.toFixed(2)}</div>
              <div class="text-xs text-slate-500 mt-1">estimated</div>
            </div>
          </div>

          <!-- Earnings RPO -->
          <div class="glass-panel p-6 rounded-2xl">
            <div class="flex items-center justify-between mb-4">
              <div>
                <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Revenue Per Order (RPO)</div>
                <div class="text-3xl font-bold text-emerald-600">\$${state.rpo.toFixed(2)}</div>
              </div>
              <div class="text-right">
                <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Monthly Revenue</div>
                <div class="text-lg font-bold text-slate-800">\$${state.monthlyRevenue.toFixed(2)}</div>
              </div>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-3 mb-4">
              <div class="bg-emerald-600 h-3 rounded-full transition-all duration-1000" style="width: 78%"></div>
            </div>
            <div class="flex justify-between text-xs text-slate-500">
              <span>78% of plan quota</span>
              <span>\$${state.monthlyRevenue.toFixed(2)} / \$${(state.planPrice * 50).toFixed(0)} projected</span>
            </div>
          </div>

          <!-- Latency & Success -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="glass-panel p-5 rounded-2xl">
              <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Avg Latency</div>
              <div class="text-2xl font-bold text-slate-800">${state.avgLatency}ms</div>
              <div class="text-xs text-slate-500 mt-1">p95 response time</div>
            </div>
            <div class="glass-panel p-5 rounded-2xl">
              <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Success Rate</div>
              <div class="text-2xl font-bold text-emerald-600">${state.successRate}%</div>
              <div class="text-xs text-emerald-600 mt-1">requests successful</div>
            </div>
          </div>

          <!-- Endpoint Breakdown -->
          <div class="glass-panel p-6 rounded-2xl">
            <h4 class="text-sm font-bold text-slate-700 mb-4">Endpoint Usage</h4>
            <div class="space-y-3">
              ${state.endpoints.map(ep => {
                const pct = (ep.requests / state.totalRequests * 100).toFixed(1);
                return `
                <div class="flex items-center justify-between px-4 py-3 rounded-xl glass-depth-1 border border-white/40">
                  <div>
                    <div class="text-sm font-medium text-slate-800">${ep.name}</div>
                    <div class="text-xs text-slate-500">${ep.requests} requests · ${ep.tokens.toLocaleString()} tokens</div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-bold text-slate-800">\$${ep.cost.toFixed(2)}</div>
                    <div class="text-xs text-slate-500">${pct}%</div>
                  </div>
                </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      `;
    };

    render();
    return { state, render };
  };

  window.ArgonUsageDashboard = UsageDashboardUI;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const c = document.getElementById('dashboard-container');
      if (c) window.ArgonUsageDashboard('dashboard-container');
    });
  } else {
    const c = document.getElementById('dashboard-container');
    if (c) window.ArgonUsageDashboard('dashboard-container');
  }

})();
