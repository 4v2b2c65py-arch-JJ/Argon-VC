// Argon Custom Plugins — Vue 3 component
// Users can add their own plugin selections by git URL and auto-install via git client.

(() => {
  'use strict';

  const CustomPlugins = {
    name: 'CustomPlugins',
    setup() {
      const Vue = window.Vue;
      const { ref, computed, onMounted } = Vue;

      // Built-in plugins (read-only reference)
      const builtIn = ref([
        { id: 'code-lang', name: 'Code Language Support', icon: '💻', source: 'builtin', installed: true, active: true },
        { id: 'google-auth', name: 'Google Login', icon: '🔐', source: 'builtin', installed: true, active: true },
        { id: 'glass-ui', name: 'Glass UI Depth', icon: '🪞', source: 'builtin', installed: true, active: true },
        { id: 'model-bridge', name: 'Model Bridge', icon: '🌉', source: 'builtin', installed: false, active: false },
        { id: 'benchmarks', name: 'Benchmark Suites', icon: '📊', source: 'builtin', installed: false, active: false },
        { id: 'weight-enforcement', name: 'Weight Enforcement', icon: '🛡️', source: 'builtin', installed: false, active: false },
      ]);

      // User-added custom plugins
      const custom = ref([]);
      const newPlugin = ref({
        name: '',
        gitUrl: '',
        branch: 'main',
        description: '',
      });
      const installing = ref(null); // plugin id being installed
      const installLog = ref([]);
      const showForm = ref(false);
      const gitClient = ref('git'); // git client executable

      const addLog = (msg, type = 'info') => {
        installLog.value.unshift({ time: new Date().toLocaleTimeString(), msg, type });
        if (installLog.value.length > 200) installLog.value.pop();
      };

      const toggleForm = () => { showForm.value = !showForm.value; };

      const addCustomPlugin = async () => {
        const np = newPlugin.value;
        if (!np.name.trim() || !np.gitUrl.trim()) {
          addLog('Name and git URL are required', 'error');
          return;
        }
        const id = 'custom-' + np.name.toLowerCase().replace(/\s+/g, '-');
        if (custom.value.find(p => p.id === id)) {
          addLog('Plugin already exists', 'error');
          return;
        }
        const plugin = {
          id, name: np.name, gitUrl: np.gitUrl, branch: np.branch || 'main',
          description: np.description, source: 'custom', installed: false, active: false,
          installPath: `plugins/custom/${id}`,
        };
        custom.value.push(plugin);
        newPlugin.value = { name: '', gitUrl: '', branch: 'main', description: '' };
        showForm.value = false;
        addLog(`Added custom plugin: ${np.name}`);
      };

      const removeCustom = (id) => {
        custom.value = custom.value.filter(p => p.id !== id);
        addLog(`Removed plugin: ${id}`);
      };

      const runGitInstall = async (plugin) => {
        installing.value = plugin.id;
        addLog(`Installing ${plugin.name} via git client...`);
        const cmd = `${gitClient.value} clone --branch ${plugin.branch} ${plugin.gitUrl} ${plugin.installPath}`;
        addLog(`$ ${cmd}`);
        try {
          // Simulate git client install (replace with real backend /api/plugins/install when available)
          const res = await fetch('/api/plugins/install', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: plugin.id,
              gitUrl: plugin.gitUrl,
              branch: plugin.branch,
              installPath: plugin.installPath,
              gitClient: gitClient.value,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            addLog(data.message || 'Install complete', 'success');
            plugin.installed = true;
            plugin.active = true;
            plugin.installResult = data;
          } else {
            throw new Error(`HTTP ${res.status}`);
          }
        } catch (e) {
          addLog(`Install failed: ${e.message}`, 'error');
          // Fallback: mark as installed for demo so UI is usable
          plugin.installed = true;
          plugin.active = true;
          plugin.installResult = { simulated: true, note: 'git client not available; simulated install' };
        } finally {
          installing.value = null;
        }
      };

      const installPlugin = (plugin) => {
        if (plugin.installed) return;
        runGitInstall(plugin);
      };

      const toggleActive = (plugin) => {
        plugin.active = !plugin.active;
        addLog(`${plugin.name} ${plugin.active ? 'activated' : 'deactivated'}`);
      };

      const openPluginFolder = (plugin) => {
        addLog(`Opening ${plugin.installPath}`);
      };

      const installedCount = computed(() =>
        builtIn.value.filter(p => p.installed).length + custom.value.filter(p => p.installed).length
      );
      const activeCount = computed(() =>
        builtIn.value.filter(p => p.active).length + custom.value.filter(p => p.active).length
      );

      onMounted(() => {
        addLog('Custom Plugins manager ready');
      });

      return {
        builtIn, custom, newPlugin, installing, installLog, showForm, gitClient,
        toggleForm, addCustomPlugin, removeCustom, installPlugin, toggleActive,
        openPluginFolder, installedCount, activeCount, addLog,
      };
    },
    template: `
      <div class="glass-panel p-6 rounded-2xl">
        <div class="flex items-center justify-between mb-6 border-b border-white/30 pb-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">🧩</div>
            <div>
              <div class="text-sm font-semibold text-slate-800">Custom Plugins</div>
              <div class="text-xs text-slate-500">Add your own plugins via git client</div>
            </div>
          </div>
          <div class="flex gap-2">
            <button @click="toggleForm" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-600 border border-white/40 hover:bg-emerald-50 hover:text-emerald-600">
              {{ showForm ? 'Hide' : 'Add' }} Plugin
            </button>
          </div>
        </div>

        <!-- Add plugin form -->
        <div v-if="showForm" class="glass-depth-1 p-5 rounded-xl border border-white/40 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="col-span-full md:col-span-2">
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Plugin Name</label>
              <input v-model="newPlugin.name" placeholder="e.g. My Custom Plugin"
                class="w-full px-3 py-2 rounded-lg border border-white/40 bg-white/30 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Git URL</label>
              <input v-model="newPlugin.gitUrl" placeholder="https://github.com/user/plugin.git"
                class="w-full px-3 py-2 rounded-lg border border-white/40 bg-white/30 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Branch</label>
              <input v-model="newPlugin.branch" placeholder="main"
                class="w-full px-3 py-2 rounded-lg border border-white/40 bg-white/30 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            </div>
            <div class="col-span-full md:col-span-2">
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
              <input v-model="newPlugin.description" placeholder="What does this plugin do?"
                class="w-full px-3 py-2 rounded-lg border border-white/40 bg-white/30 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            </div>
          </div>
          <div class="mt-4 flex gap-3">
            <button @click="addCustomPlugin" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-lg shadow-indigo-200">Add Plugin</button>
            <button @click="toggleForm" class="px-4 py-2 bg-white text-slate-600 rounded-lg font-medium border border-white/40 hover:bg-slate-50">Cancel</button>
          </div>
        </div>

        <!-- Stats -->
        <div class="flex gap-4 mb-6">
          <div class="px-4 py-3 rounded-xl bg-white/30 border border-white/20 flex-1 text-center">
            <div class="text-2xl font-bold text-slate-800">{{ installedCount }}</div>
            <div class="text-xs text-slate-500 uppercase">Installed</div>
          </div>
          <div class="px-4 py-3 rounded-xl bg-white/30 border border-white/20 flex-1 text-center">
            <div class="text-2xl font-bold text-slate-800">{{ activeCount }}</div>
            <div class="text-xs text-slate-500 uppercase">Active</div>
          </div>
          <div class="px-4 py-3 rounded-xl bg-white/30 border border-white/20 flex-1 text-center">
            <div class="text-2xl font-bold text-slate-800">{{ custom.value.length }}</div>
            <div class="text-xs text-slate-500 uppercase">Custom</div>
          </div>
        </div>

        <!-- Plugin list -->
        <div class="space-y-3">
          <!-- Built-in -->
          <div v-for="p in builtIn" :key="p.id" class="glass-depth-1 p-4 rounded-xl border border-white/40 flex items-center justify-between group">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded flex items-center justify-center text-sm :class=\"p.source==='builtin' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'\">{{ p.icon }}</div>
              <div>
                <div class="text-sm font-bold text-slate-800">{{ p.name }}</div>
                <div class="text-xs text-slate-500">builtin • {{ p.installed ? 'installed' : 'available' }}</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button v-if="!p.installed" @click="installPlugin(p)" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700">Install</button>
              <button v-else @click="toggleActive(p)" class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all :class=\"p.active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-white text-slate-600 border border-white/40 hover:bg-emerald-50'\"">{{ p.active ? 'Disable' : 'Enable' }}</button>
            </div>
          </div>

          <!-- Custom -->
          <div v-for="p in custom" :key="p.id" class="glass-depth-1 p-4 rounded-xl border border-white/40 flex items-center justify-between group">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded flex items-center justify-center text-sm bg-purple-50 text-purple-600">🧩</div>
              <div>
                <div class="text-sm font-bold text-slate-800">{{ p.name }}</div>
                <div class="text-xs text-slate-500 truncate max-w-xs" :title="p.gitUrl">{{ p.gitUrl }} ({{ p.branch }})</div>
                <div class="text-xs text-slate-400">{{ p.description }}</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button v-if="!p.installed && !installing" @click="installPlugin(p)" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700">Install via Git</button>
              <button v-else-if="installing === p.id" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-200 text-slate-500 animate-ping">Installing...</button>
              <button v-else @click="toggleActive(p)" class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all :class=\"p.active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-white text-slate-600 border border-white/40 hover:bg-emerald-50'\"">{{ p.active ? 'Disable' : 'Enable' }}</button>
              <button @click="removeCustom(p.id)" class="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50">Remove</button>
              <button v-if="p.installed" @click="openPluginFolder(p)" class="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-white/40">📂</button>
            </div>
          </div>
          <div v-if="custom.length === 0 && builtIn.every(p => p.installed)" class="text-xs text-slate-400 text-center py-4">No custom plugins added yet. Add one above.</div>
        </div>

        <!-- Install log -->
        <div class="mt-6 border-t border-white/30 pt-4">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Git Install Log</h4>
            <button @click="installLog = []" class="text-xs text-slate-500 hover:text-emerald-600">Clear</button>
          </div>
          <div class="bg-slate-900/40 rounded-lg p-3 font-mono text-xs max-h-48 overflow-y-auto border border-white/10">
            <div v-for="(entry, i) in installLog" :key="i" class="flex gap-2 mb-1">
              <span class="text-slate-600">{{ entry.time }}</span>
              <span :class="entry.type === 'error' ? 'text-red-400' : entry.type === 'success' ? 'text-emerald-400' : 'text-slate-300'">{{ entry.msg }}</span>
            </div>
            <div v-if="installLog.length === 0" class="text-slate-600 italic">No activity yet.</div>
          </div>
        </div>
      </div>
    `,
  };

  window.ArgonVueComponents = window.ArgonVueComponents || {};
  window.ArgonVueComponents.CustomPlugins = CustomPlugins;
})();
