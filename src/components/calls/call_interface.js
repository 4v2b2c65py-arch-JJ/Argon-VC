/* Argon Live Call System — phone number calling service */
(function() {
  'use strict';

  const CallInterface = (containerId, opts = {}) => {
    const container = document.getElementById(containerId);
    if (!container) return null;

    const state = {
      isCalling: false,
      isInCall: false,
      callDuration: 0,
      timer: null,
      phoneNumber: '',
      callType: 'voice', // voice or video
      remoteName: 'Support Agent',
      remoteStatus: 'Ringing...',
    };

    const formatTime = (seconds) => {
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const render = () => {
      const showDialer = !state.isCalling && !state.isInCall;
      const showCalling = state.isCalling && !state.isInCall;
      const showActive = state.isInCall;

      container.innerHTML = `
        <div class="glass-panel p-6 rounded-2xl">
          <div class="flex items-center justify-between mb-6 border-b border-white/30 pb-3">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">📞</div>
              <div>
                <div class="text-sm font-semibold text-slate-800">Live Call System</div>
                <div class="text-xs text-slate-500">Call via phone number</div>
              </div>
            </div>
          </div>

          <!-- Dialer -->
          ${showDialer ? `
            <div class="text-center">
              <div class="mb-6">
                <input id="call-number" type="tel" placeholder="+1 (555) 000-0000" 
                  class="w-full px-4 py-3 rounded-xl glass-depth-1 border border-white/40 text-center text-lg font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  value="${state.phoneNumber}">
              </div>
              <div class="flex gap-3 justify-center">
                <button id="call-voice" class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-lg shadow-emerald-200 transition-all">
                  📞 Voice Call
                </button>
                <button id="call-video" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all">
                  🎥 Video Call
                </button>
              </div>
              <p class="mt-3 text-xs text-slate-500">Enter a phone number to start a live call</p>
            </div>
          ` : ''}

          <!-- Calling state -->
          ${showCalling ? `
            <div class="text-center py-10">
              <div class="w-20 h-20 rounded-full border-4 border-orange-500/30 flex items-center justify-center text-4xl text-orange-500 mb-6 relative animate-ping">
                <span class="absolute inset-0 flex items-center justify-center text-2xl">📞</span>
              </div>
              <h3 class="text-xl font-bold text-slate-800 mb-1">Calling ${state.remoteName}</h3>
              <p class="text-sm text-slate-500">${state.remoteStatus}</p>
              <div class="mt-8 flex justify-center gap-4">
                <button id="call-cancel" class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all">
                  Decline
                </button>
              </div>
            </div>
          ` : ''}

          <!-- Active call -->
          ${showActive ? `
            <div class="text-center">
              <div class="relative">
                <canvas id="call-ring-canvas" class="w-32 h-32 mx-auto mb-6"></canvas>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <div class="text-3xl font-mono font-bold text-slate-700">${formatTime(state.callDuration)}</div>
                  <div class="text-sm text-slate-500 mt-1">${state.remoteName} • ${state.callType}</div>
                </div>
              </div>
              <div class="mt-8 flex justify-center gap-4">
                <button id="call-mute" class="px-6 py-3 bg-white text-slate-700 rounded-xl font-semibold shadow-md border border-white/40 transition-all hover:bg-slate-50">
                  🔇 Mute
                </button>
                <button id="call-end" class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-lg shadow-red-200 transition-all">
                  📴 End Call
                </button>
              </div>
              <p class="mt-4 text-xs text-slate-400">Call is active · Secure connection</p>
            </div>
          ` : ''}
        </div>
      `;

      // Wire events
      const numberInput = container.querySelector('#call-number');
      if (numberInput) {
        numberInput.addEventListener('input', (e) => { state.phoneNumber = e.target.value; });
      }

      const voiceBtn = container.querySelector('#call-voice');
      if (voiceBtn) voiceBtn.addEventListener('click', () => initiateCall('voice'));

      const videoBtn = container.querySelector('#call-video');
      if (videoBtn) videoBtn.addEventListener('click', () => initiateCall('video'));

      const cancelBtn = container.querySelector('#call-cancel');
      if (cancelBtn) cancelBtn.addEventListener('click', endCall);

      const endBtn = container.querySelector('#call-end');
      if (endBtn) endBtn.addEventListener('click', endCall);

      const muteBtn = container.querySelector('#call-mute');
      if (muteBtn) muteBtn.addEventListener('click', () => {
        muteBtn.textContent = muteBtn.textContent.includes('🔇') ? '🔊 Unmute' : '🔇 Mute';
      });

      // Start call ring animation if active
      if (state.isInCall) {
        startCallRing();
      }
    };

    const initiateCall = (type) => {
      if (!state.phoneNumber.trim()) {
        alert('Please enter a phone number');
        return;
      }
      state.callType = type;
      state.isCalling = true;
      state.remoteStatus = 'Ringing...';
      render();

      // Simulate call connecting
      setTimeout(() => {
        state.isCalling = false;
        state.isInCall = true;
        state.callDuration = 0;
        state.remoteStatus = 'Connected';
        startCallTimer();
        startCallRing();
        render();
      }, 2500);
    };

    const endCall = () => {
      state.isCalling = false;
      state.isInCall = false;
      state.callDuration = 0;
      if (state.timer) clearInterval(state.timer);
      render();
    };

    const startCallTimer = () => {
      state.timer = setInterval(() => {
        state.callDuration += 1;
        const el = container.querySelector('.font-mono');
        if (el) el.textContent = formatTime(state.callDuration);
      }, 1000);
    };

    const startCallRing = () => {
      const canvas = container.querySelector('#call-ring-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = 120;
      canvas.height = 120;
      let angle = 0;
      const animate = () => {
        if (!state.isInCall) return;
        angle += 0.05;
        ctx.clearRect(0, 0, 120, 120);
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(60, 60, 40, 0, angle % (Math.PI * 2));
        ctx.stroke();
        ctx.strokeStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(60, 60, 32, 0, (angle * 1.5) % (Math.PI * 2));
        ctx.stroke();
        requestAnimationFrame(animate);
      };
      animate();
    };

    render();
    return { state, render, initiateCall, endCall };
  };

  window.ArgonCall = CallInterface;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const c = document.getElementById('calls-container');
      if (c) window.ArgonCall('calls-container');
    });
  } else {
    const c = document.getElementById('calls-container');
    if (c) window.ArgonCall('calls-container');
  }

})();
