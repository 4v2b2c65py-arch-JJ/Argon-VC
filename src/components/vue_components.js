// Argon Vue Components — Vue 3 versions of UI sections, mounted on top of React
// Each component is registered globally and composed by the main Vue app.

(() => {
  'use strict';

  const { ref, onMounted, onUnmounted, computed } = window.Vue;

  // Escape helper
  const esc = (t) => {
    const d = document.createElement('div');
    d.textContent = t;
    return d.innerHTML;
  };

  // ---- Vue Chat ----
  const VueChat = {
    name: 'VueChat',
    props: { model: { type: String, default: 'argon' } },
    setup(props) {
      const messages = ref([
        { role: 'assistant', content: 'Hello! I am Argon, your model API assistant. How can I help you today?', timestamp: Date.now() },
      ]);
      const input = ref('');
      const streaming = ref(false);
      const scrollEl = ref(null);

      const renderMsg = (m) => {
        const isUser = m.role === 'user';
        return `
          <div class="flex ${isUser ? 'justify-end' : 'justify-start'} mb-4">
            <div class="max-w-[85%] px-4 py-3 rounded-2xl ${isUser ? 'bg-emerald-600 text-white rounded-tr-none' : 'glass-panel text-slate-800 border border-white/40 rounded-tl-none'} shadow-md">
              <div class="text-xs font-medium mb-1 ${isUser ? 'text-emerald-100' : 'text-slate-500'}">
                ${isUser ? 'You' : 'Argon'} · ${new Date(m.timestamp || Date.now()).toLocaleTimeString()}
              </div>
              <div class="whitespace-pre-wrap break-words">${esc(m.content)}</div>
            </div>
          </div>
        `;
      };

      const scrollBottom = () => {
        if (scrollEl.value) scrollEl.value.scrollTop = scrollEl.value.scrollHeight;
      };

      const send = async () => {
        const text = input.value.trim();
        if (!text || streaming.value) return;
        messages.value.push({ role: 'user', content: text, timestamp: Date.now() });
        input.value = '';
        streaming.value = true;
        scrollBottom();

        const base = [
          `I received: ${text}`,
          `That's interesting: ${text}`,
          `Argon analysis of "${text}":`,
          `Processing your message: ${text}`,
        ][Math.floor(Math.random() * 4)];
        let result = '';
        const words = base.split(' ');
        for (const w of words) {
          await new Promise((r) => setTimeout(r, 25 + Math.random() * 40));
          result += (result ? ' ' : '') + w;
          messages.value[messages.value.length - 1] = {
            role: 'assistant',
            content: result + '▮',
            timestamp: Date.now(),
          };
          scrollBottom();
        }
        messages.value[messages.value.length - 1] = {
          role: 'assistant',
          content: base,
          timestamp: Date.now(),
          tokens: Math.ceil(base.length / 4),
        };
        streaming.value = false;
        scrollBottom();
      };

      onMounted(scrollBottom);

      return {
        messages,
        input,
        streaming,
        model: props.model,
        scrollEl,
        send,
        esc,
      };
    },
    template: `
      <div class="glass-panel p-6 rounded-2xl h-full flex flex-col h-[600px]">
        <div class="flex items-center justify-between mb-6 border-b border-white/30 pb-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white">A</div>
            <div>
              <div class="text-sm font-semibold text-slate-800">Argon Chat (Vue)</div>
              <div class="text-xs text-slate-500">Model: {{ model }}</div>
            </div>
          </div>
        </div>
        <div ref="scrollEl" class="flex-1 overflow-y-auto p-4 space-y-4">
          <div v-for="(m, i) in messages" :key="i" v-html="renderMsg(m)"></div>
          <div v-if="streaming" class="flex justify-start mb-4">
            <div class="px-4 py-3 rounded-2xl glass-panel text-slate-800 border border-white/40 max-w-[85%] rounded-tl-none">
              <div class="flex gap-1">
                <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" style="animation-delay:0.2s"></span>
                <span class="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-ping" style="animation-delay:0.4s"></span>
              </div>
            </div>
          </div>
        </div>
        <div class="p-4 border-t border-white/40 bg-white/30 rounded-b-2xl">
          <div class="flex gap-3">
            <input v-model="input" type="text" placeholder="Message Argon..." @keypress.enter="send"
              class="flex-1 px-4 py-3 rounded-xl glass-depth-1 border border-white/40 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
            <button @click="send" :disabled="streaming || !input.trim()"
              class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-lg shadow-emerald-200 disabled:opacity-50">
              Send
            </button>
          </div>
        </div>
      </div>
    `,
  };

  // ---- Vue Voice ----
  const VueVoice = {
    name: 'VueVoice',
    setup() {
      const recording = ref(false);
      const transcribing = ref(false);
      const transcript = ref('');
      const duration = ref(0);
      let timer = null;
      let mediaRecorder = null;

      const fmt = (s) => {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, '0')}`;
      };

      const toggle = async () => {
        if (recording.value) {
          if (mediaRecorder) mediaRecorder.stop();
          mediaRecorder.stream.getTracks().forEach((t) => t.stop());
          if (timer) clearInterval(timer);
          recording.value = false;
        } else {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start(1000);
            recording.value = true;
            transcribing.value = false;
            transcript.value = '';
            duration.value = 0;
            timer = setInterval(() => { duration.value += 1; }, 1000);
            mediaRecorder.onstop = async () => {
              recording.value = false;
              transcribing.value = true;
              await new Promise((r) => setTimeout(r, 1200));
              const mocks = [
                'Hello, can you help with my account?',
                'I would like to upload a file.',
                'What is my rate limit?',
                'Start a live call to support.',
                'Link my Amazon account.',
              ];
              transcript.value = mocks[Math.floor(Math.random() * mocks.length)];
              transcribing.value = false;
            };
          } catch (e) {
            alert('Microphone access required.');
          }
        }
      };

      onUnmounted(() => { if (timer) clearInterval(timer); });

      return { recording, transcribing, transcript, duration, fmt, toggle };
    },
    template: `
      <div class="glass-panel p-6 rounded-2xl text-center">
        <div class="flex items-center justify-between mb-6 border-b border-white/30 pb-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">🎙</div>
            <div>
              <div class="text-sm font-semibold text-slate-800">Voice (Vue)</div>
              <div class="text-xs text-slate-500">Record &amp; transcribe</div>
            </div>
          </div>
        </div>
        <div class="flex flex-col items-center justify-center gap-4">
          <div class="relative">
            <div class="w-32 h-32 rounded-full bg-white/20 border border-white/30 flex items-center justify-center mb-4 relative overflow-hidden">
              <div class="absolute inset-0 border-4 border-emerald-500/30 rounded-full animate-spin"></div>
              <div class="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold relative z-10 shadow-lg shadow-emerald-200">
                {{ recording ? '●' : '🎙' }}
              </div>
            </div>
            <div class="absolute -top-3 -right-3 w-6 h-6 rounded-full" :class="{'bg-red-500 animate-pulse': recording, 'bg-slate-300': !recording}"></div>
          </div>
          <div class="text-2xl font-mono font-bold text-slate-700 mb-2">{{ fmt(duration) }}</div>
          <button @click="toggle" :class="recording ? 'bg-red-600 hover:bg-red-700 animate-pulse scale-95' : 'bg-emerald-600 hover:bg-emerald-700'"
            class="px-8 py-4 rounded-full font-bold text-white shadow-lg transition-all transform">
            {{ recording ? '⏹ Stop' : '🎤 Start' }} Recording
          </button>
          <div v-if="transcribing" class="flex items-center gap-2 text-sm text-emerald-600">
            <span class="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></span> Transcribing...
          </div>
        </div>
        <div v-if="transcript" class="mt-6 pt-6 border-t border-white/30 text-left">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Transcript</div>
          <div class="glass-depth-1 p-4 rounded-xl text-slate-800 whitespace-pre-wrap break-words max-h-40 overflow-y-auto">{{ transcript }}</div>
        </div>
      </div>
    `,
  };

  // ---- Vue Files ----
  const VueFiles = {
    name: 'VueFiles',
    props: { initialFiles: { type: Array, default: () => [] } },
    setup(props) {
      const files = ref([
        { name: 'document.pdf', size: 245760, type: 'application/pdf' },
        { name: 'image.png', size: 512000, type: 'image/png' },
        { name: 'data.csv', size: 102400, type: 'text/csv' },
        ...props.initialFiles,
      ]);
      const uploading = ref(false);
      const progress = ref(0);

      const fmtSize = (b) => {
        if (b === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(b) / Math.log(k));
        return parseFloat((b / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };

      const handleFiles = (e) => {
        const fl = Array.from(e.target.files);
        if (!fl.length) return;
        uploading.value = true;
        progress.value = 0;
        let p = 0;
        const iv = setInterval(() => {
          p += 13;
          progress.value = Math.min(p, 100);
          if (progress.value >= 100) {
            clearInterval(iv);
            uploading.value = false;
            fl.forEach((f) => files.value.unshift({ name: f.name, size: f.size, type: f.type }));
          }
        }, 150);
      };

      return { files, uploading, progress, fmtSize, handleFiles };
    },
    template: `
      <div class="glass-panel p-6 rounded-2xl">
        <div class="flex items-center justify-between mb-6 border-b border-white/30 pb-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">📁</div>
            <div>
              <div class="text-sm font-semibold text-slate-800">Files (Vue)</div>
              <div class="text-xs text-slate-500">Attach files to chat</div>
            </div>
          </div>
          <div class="text-xs text-slate-500">{{ files.length }} files</div>
        </div>
        <div @click="handleFiles($event)" class="border-2 border-dashed border-white/40 rounded-2xl p-8 text-center hover:bg-white/20 hover:border-emerald-400/50 transition-all cursor-pointer group relative">
          <input type="file" multiple class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" @change="handleFiles">
          <div class="flex flex-col items-center gap-3">
            <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
              <span class="text-2xl">📤</span>
            </div>
            <p class="text-sm font-medium text-slate-700 group-hover:text-emerald-600">Click to upload files</p>
            <p class="text-xs text-slate-500">PDF, PNG, JPG, CSV up to 50MB (Pro)</p>
          </div>
        </div>
        <div v-if="uploading" class="mt-4">
          <div class="flex justify-between text-xs text-slate-500 mb-1"><span>Uploading...</span><span>{{ progress }}%</span></div>
          <div class="w-full bg-slate-200 rounded-full h-2"><div class="bg-emerald-600 h-2 rounded-full transition-all duration-300" :style="{ width: progress + '%' }"></div></div>
        </div>
        <div class="mt-6">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-bold text-slate-700">Your Files</h4>
          </div>
          <div class="space-y-2">
            <div v-for="f in files" :key="f.name" class="flex items-center justify-between px-4 py-3 rounded-xl glass-depth-1 border border-white/40">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center :class=\"f.type.startsWith('image') ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'\"">{{ f.type.startsWith('image') ? '🖼' : '📄' }}</div>
                <div>
                  <div class="text-sm font-medium text-slate-800 truncate" :title="f.name">{{ f.name }}</div>
                  <div class="text-xs text-slate-500">{{ f.type }} · {{ fmtSize(f.size) }}</div>
                </div>
              </div>
              <button class="px-3 py-1.5 text-xs text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">Download</button>
            </div>
          </div>
        </div>
      </div>
    `,
  };

  // ---- Vue Calls ----
  const VueCalls = {
    name: 'VueCalls',
    setup() {
      const calling = ref(false);
      const incall = ref(false);
      const duration = ref(0);
      const number = ref('');
      let timer = null;
      let raf = null;

      const fmt = (s) => {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, '0')}`;
      };

      const dial = (type) => {
        if (!number.value.trim()) { alert('Enter a phone number'); return; }
        calling.value = true;
        setTimeout(() => {
          calling.value = false;
          incall.value = true;
          duration.value = 0;
          timer = setInterval(() => { duration.value += 1; }, 1000);
          startRing();
        }, 2000);
      };

      const end = () => {
        calling.value = false;
        incall.value = false;
        duration.value = 0;
        if (timer) clearInterval(timer);
        if (raf) cancelAnimationFrame(raf);
      };

      const startRing = () => {
        const cvs = document.getElementById('argon-call-ring');
        if (!cvs) return;
        const ctx = cvs.getContext('2d');
        cvs.width = 120; cvs.height = 120;
        let angle = 0;
        const animate = () => {
          if (!incall.value) return;
          angle += 0.05;
          ctx.clearRect(0, 0, 120, 120);
          ctx.lineWidth = 4;
          ctx.strokeStyle = '#10b981';
          ctx.beginPath(); ctx.arc(60, 60, 40, 0, angle % (Math.PI * 2)); ctx.stroke();
          ctx.strokeStyle = '#3b82f6';
          ctx.beginPath(); ctx.arc(60, 60, 32, 0, (angle * 1.5) % (Math.PI * 2)); ctx.stroke();
          raf = requestAnimationFrame(animate);
        };
        animate();
      };

      onUnmounted(() => { if (timer) clearInterval(timer); if (raf) cancelAnimationFrame(raf); });

      return { calling, incall, duration, number, fmt, dial, end };
    },
    template: `
      <div class="glass-panel p-6 rounded-2xl">
        <div class="flex items-center justify-between mb-6 border-b border-white/30 pb-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">📞</div>
            <div>
              <div class="text-sm font-semibold text-slate-800">Live Call (Vue)</div>
              <div class="text-xs text-slate-500">Call via phone number</div>
            </div>
          </div>
        </div>
        <div v-if="!calling && !incall" class="text-center">
          <div class="mb-6">
            <input v-model="number" type="tel" placeholder="+1 (555) 000-0000"
              class="w-full px-4 py-3 rounded-xl glass-depth-1 border border-white/40 text-center text-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50">
          </div>
          <div class="flex gap-3 justify-center">
            <button @click="dial('voice')" class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-lg shadow-emerald-200">📞 Voice</button>
            <button @click="dial('video')" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-200">🎥 Video</button>
          </div>
        </div>
        <div v-else-if="calling && !incall" class="text-center py-10">
          <div class="w-20 h-20 rounded-full border-4 border-orange-500/30 flex items-center justify-center text-4xl text-orange-500 mb-6 relative animate-ping">📞</div>
          <h3 class="text-xl font-bold text-slate-800 mb-1">Calling Support Agent</h3>
          <p class="text-sm text-slate-500">Ringing...</p>
          <button @click="end" class="mt-8 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold">Decline</button>
        </div>
        <div v-if="incall" class="text-center">
          <canvas id="argon-call-ring" class="w-32 h-32 mx-auto mb-6"></canvas>
          <div class="text-3xl font-mono font-bold text-slate-700">{{ fmt(duration) }}</div>
          <div class="text-sm text-slate-500 mt-1">Support Agent • Voice</div>
          <div class="mt-8 flex justify-center gap-4">
            <button class="px-6 py-3 bg-white text-slate-700 rounded-xl font-semibold border border-white/40 hover:bg-slate-50">🔇 Mute</button>
            <button @click="end" class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-lg shadow-red-200">📴 End</button>
          </div>
        </div>
      </div>
    `,
  };

  // ---- Vue Accounts ----
  const VueAccounts = {
    name: 'VueAccounts',
    setup() {
      const accounts = ref([
        { id: 'amazon', name: 'Amazon', icon: '📦', color: 'bg-orange-100 text-orange-700 border-orange-200', connected: false, features: ['Order history', 'Purchase tracking'] },
        { id: 'ebay', name: 'eBay', icon: '🛒', color: 'bg-red-100 text-red-700 border-red-200', connected: false, features: ['Auction alerts', 'Sold items'] },
        { id: 'shopify', name: 'Shopify', icon: '🛍️', color: 'bg-green-100 text-green-700 border-green-200', connected: false, features: ['Store data', 'Order sync'] },
        { id: 'etsy', name: 'Etsy', icon: '🧵', color: 'bg-pink-100 text-pink-700 border-pink-200', connected: false, features: ['Shop stats', 'Listing mgmt'] },
        { id: 'walmart', name: 'Walmart', icon: '🏪', color: 'bg-blue-100 text-blue-700 border-blue-200', connected: false, features: ['Receipt scanning', 'Savings catcher'] },
      ]);
      const linked = ref([]);

      const link = (id) => {
        const acc = accounts.value.find((a) => a.id === id);
        if (!acc) return;
        acc.connected = true;
        linked.value.push(acc);
      };

      return { accounts, linked, link };
    },
    template: `
      <div class="glass-panel p-6 rounded-2xl">
        <div class="flex items-center justify-between mb-6 border-b border-white/30 pb-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">🔗</div>
            <div>
              <div class="text-sm font-semibold text-slate-800">Account Linking (Vue)</div>
              <div class="text-xs text-slate-500">Connect Amazon, eBay, and more</div>
            </div>
          </div>
          <div class="text-xs font-medium text-slate-500">{{ linked.length }} connected</div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="a in accounts" :key="a.id" class="glass-depth-1 p-5 rounded-2xl border border-white/40 hover:border-emerald-400/50 transition-all cursor-pointer group" @click="link(a.id)">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center text-xl :class="a.color">{{ a.icon }}</div>
              <div class="flex-1">
                <div class="text-sm font-bold text-slate-800">{{ a.name }}</div>
                <div class="text-xs text-slate-500">{{ a.features.join(', ') }}</div>
              </div>
              <div class="w-6 h-6 rounded-full :class=\"a.connected ? 'bg-emerald-500' : 'bg-slate-300'\" flex items-center justify-center text-xs">{{ a.connected ? '✓' : '+' }}</div>
            </div>
            <div class="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
              <span class="text-xs font-medium :class=\"a.connected ? 'text-emerald-600' : 'text-slate-400'\">{{ a.connected ? 'Connected' : 'Connect' }}</span>
              <button class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all :class=\"a.connected ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-white text-slate-600 border border-white/40 hover:bg-emerald-50 hover:text-emerald-600'\"">{{ a.connected ? 'Manage' : 'Link' }}</button>
            </div>
          </div>
        </div>
        <div class="mt-8 pt-6 border-t border-white/30">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Connected Accounts</h4>
          <div class="space-y-2">
            <div v-for="a in linked" :key="a.id" class="flex items-center justify-between px-4 py-2 rounded-xl bg-white/20">
              <div class="flex items-center gap-3">
                <span class="text-xl">{{ a.icon }}</span>
                <div>
                  <div class="text-sm font-medium text-slate-800">{{ a.name }}</div>
                  <div class="text-xs text-slate-500">Linked · just now</div>
                </div>
              </div>
              <button class="px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded">Disconnect</button>
            </div>
            <div v-if="linked.length === 0" class="text-xs text-slate-400 text-center">No accounts connected yet</div>
          </div>
        </div>
      </div>
    `,
  };

  // ---- Vue Dashboard ----
  const VueDashboard = {
    name: 'VueDashboard',
    setup() {
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
      return { state };
    },
    template: `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold glass-text">Usage Dashboard (Vue)</h2>
            <p class="text-sm text-slate-500">Token usage, rate limits, and earnings</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="glass-panel p-5 rounded-2xl">
            <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Plan</div>
            <div class="text-lg font-bold text-slate-800">{{ state.plan }}</div>
            <div class="text-xs text-slate-500 mt-1">$ {{ state.planPrice }}/mo</div>
          </div>
          <div class="glass-panel p-5 rounded-2xl">
            <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Req Remaining</div>
            <div class="text-lg font-bold text-slate-800">{{ state.requestsRemaining }}</div>
          </div>
          <div class="glass-panel p-5 rounded-2xl">
            <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tok Remaining</div>
            <div class="text-lg font-bold text-slate-800">{{ state.tokensRemaining.toLocaleString() }}</div>
          </div>
          <div class="glass-panel p-5 rounded-2xl">
            <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Calls</div>
            <div class="text-lg font-bold text-slate-800">{{ state.concurrentCalls }}</div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="glass-panel p-5 rounded-2xl">
            <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Requests</div>
            <div class="text-2xl font-bold text-slate-800">{{ state.totalRequests.toLocaleString() }}</div>
          </div>
          <div class="glass-panel p-5 rounded-2xl">
            <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Tokens</div>
            <div class="text-2xl font-bold text-slate-800">{{ state.totalTokens.toLocaleString() }}</div>
          </div>
          <div class="glass-panel p-5 rounded-2xl">
            <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Cost</div>
            <div class="text-2xl font-bold text-slate-800">$ {{ state.totalCost.toFixed(2) }}</div>
          </div>
        </div>
        <div class="glass-panel p-6 rounded-2xl">
          <div class="flex items-center justify-between mb-4">
            <div>
              <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">RPO</div>
              <div class="text-3xl font-bold text-emerald-600">$ {{ state.rpo.toFixed(2) }}</div>
            </div>
            <div class="text-right">
              <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Monthly Revenue</div>
              <div class="text-lg font-bold text-slate-800">$ {{ state.monthlyRevenue.toFixed(2) }}</div>
            </div>
          </div>
          <div class="w-full bg-slate-200 rounded-full h-3 mb-4"><div class="bg-emerald-600 h-3 rounded-full transition-all duration-1000" style="width:78%"></div></div>
          <div class="flex justify-between text-xs text-slate-500"><span>78% of quota</span><span>$ {{ state.monthlyRevenue.toFixed(2) }} projected</span></div>
        </div>
        <div class="glass-panel p-6 rounded-2xl">
          <h4 class="text-sm font-bold text-slate-700 mb-4">Endpoint Usage</h4>
          <div class="space-y-3">
            <div v-for="ep in state.endpoints" :key="ep.name" class="flex items-center justify-between px-4 py-3 rounded-xl glass-depth-1 border border-white/40">
              <div>
                <div class="text-sm font-medium text-slate-800">{{ ep.name }}</div>
                <div class="text-xs text-slate-500">{{ ep.requests }} req · {{ ep.tokens.toLocaleString() }} tok</div>
              </div>
              <div class="text-right">
                <div class="text-sm font-bold text-slate-800">$ {{ ep.cost.toFixed(2) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  };

  // ---- Vue Shaders Preview ----
  const VueShaders = {
    name: 'VueShaders',
    setup() {
      const shaders = ref([
        { name: 'glass_depth.uvx', desc: 'Glass depth blur — full-screen background pass', layers: 3 },
        { name: 'neural_pulse.uvx', desc: 'Neural pulse — animated gradient mesh for chat/voice', layers: 2 },
        { name: 'call_ring.uvx', desc: 'Call ring — pulsing ring animation for live calls', layers: 1 },
      ]);
      return { shaders };
    },
    template: `
      <div class="glass-panel p-6 rounded-2xl">
        <div class="flex items-center justify-between mb-6 border-b border-white/30 pb-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">🌀</div>
            <div>
              <div class="text-sm font-semibold text-slate-800">UVX Shaders (Vue)</div>
              <div class="text-xs text-slate-500">Depth-layer shader programs</div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="s in shaders" :key="s.name" class="glass-depth-1 p-4 rounded-xl border border-white/40">
            <div class="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">{{ s.name }}</div>
            <div class="text-xs text-slate-600 mb-3">{{ s.desc }}</div>
            <div class="flex gap-1">
              <span v-for="i in s.layers" :key="i" class="w-2 h-2 rounded-full bg-emerald-500/60"></span>
            </div>
          </div>
        </div>
      </div>
    `,
  };

  window.ArgonVueComponents = {
    RateTicker: window.ArgonRateTicker,
    VueChat, VueVoice, VueFiles, VueCalls, VueAccounts, VueDashboard, VueShaders,
  };
})();
