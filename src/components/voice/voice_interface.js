/* Argon Voice Interface — audio recording & transcription */
(function() {
  'use strict';

  const VoiceInterface = (containerId, opts = {}) => {
    const container = document.getElementById(containerId);
    if (!container) return null;

    const state = {
      isRecording: false,
      isTranscribing: false,
      mediaRecorder: null,
      audioChunks: [],
      transcript: '',
      duration: 0,
      timer: null,
    };

    const formatTime = (seconds) => {
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const render = () => {
      const btnClass = state.isRecording
        ? 'bg-red-600 hover:bg-red-700 text-white ring-2 ring-red-500/30 animate-pulse'
        : 'bg-emerald-600 hover:bg-emerald-700 text-white';
      const icon = state.isRecording ? '⏹' : '🎤';

      container.innerHTML = `
        <div class="glass-panel p-6 rounded-2xl text-center">
          <div class="flex items-center justify-between mb-6 border-b border-white/30 pb-3">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">🎙</div>
              <div>
                <div class="text-sm font-semibold text-slate-800">Voice Interface</div>
                <div class="text-xs text-slate-500">Record &amp; transcribe</div>
              </div>
            </div>
          </div>

          <div class="flex flex-col items-center justify-center gap-4">
            <div class="relative">
              <div class="w-32 h-32 rounded-full bg-white/20 border border-white/30 flex items-center justify-center mb-4 relative overflow-hidden">
                <div class="absolute inset-0 border-4 border-emerald-500/30 rounded-full animate-spin"></div>
                <div class="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold relative z-10 shadow-lg shadow-emerald-200">
                  ${state.isRecording ? '●' : '🎙'}
                </div>
              </div>
              <div class="absolute -top-3 -right-3 w-6 h-6 rounded-full ${state.isRecording ? 'bg-red-500' : 'bg-slate-300'} ${state.isRecording ? 'animate-pulse' : ''}"></div>
            </div>

            <div class="text-2xl font-mono font-bold text-slate-700 mb-2">
              ${formatTime(state.duration)}
            </div>

            <button id="voice-record" class="px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all transform ${btnClass} ${state.isRecording ? 'scale-95' : ''}" :disabled="${state.isTranscribing}">
              ${icon} ${state.isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>

            ${state.isTranscribing ? `
              <div class="flex items-center gap-2 text-sm text-emerald-600">
                <span class="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></span>
                Transcribing...
              </div>
            ` : ''}
          </div>

          ${state.transcript ? `
            <div class="mt-6 pt-6 border-t border-white/30 text-left">
              <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Transcript</div>
              <div class="glass-depth-1 p-4 rounded-xl text-slate-800 whitespace-pre-wrap break-words max-h-40 overflow-y-auto">
                ${state.transcript}
              </div>
            </div>
          ` : ''}
        </div>
      `;

      const recordBtn = container.querySelector('#voice-record');
      recordBtn.addEventListener('click', toggleRecording);
    };

    const toggleRecording = async () => {
      if (state.isRecording) {
        stopRecording();
      } else {
        await startRecording();
      }
    };

    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        state.mediaRecorder = new MediaRecorder(stream);
        state.audioChunks = [];
        state.duration = 0;
        state.isRecording = true;
        state.transcript = '';
        state.isTranscribing = false;

        state.mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) state.audioChunks.push(e.data);
        };

        state.mediaRecorder.onstop = async () => {
          state.isRecording = false;
          state.isTranscribing = true;
          render();

          const audioBlob = new Blob(state.audioChunks, { type: 'audio/wav' });
          await transcribeAudio(audioBlob);

          state.isTranscribing = false;
          render();
        };

        state.mediaRecorder.start(1000);
        state.timer = setInterval(() => {
          state.duration += 1;
          const el = container.querySelector('.font-mono');
          if (el) el.textContent = formatTime(state.duration);
        }, 1000);

        render();
      } catch (err) {
        console.error('Microphone access denied:', err);
        alert('Microphone access is required for voice recording.');
      }
    };

    const stopRecording = () => {
      if (state.mediaRecorder && state.isRecording) {
        state.mediaRecorder.stop();
        state.mediaRecorder.stream.getTracks().forEach(t => t.stop());
      }
      if (state.timer) clearInterval(state.timer);
    };

    const transcribeAudio = async (blob) => {
      // Simulate transcription (replace with real API call)
      await new Promise(r => setTimeout(r, 1500));
      const mockTranscripts = [
        "Hello, can you help me with my account?",
        "I'd like to upload a file for review.",
        "What's the current rate limit on my plan?",
        "Can you initiate a live call to support?",
        "Link my Amazon account please.",
      ];
      state.transcript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
      render();
    };

    render();
    return { state, render };
  };

  window.ArgonVoice = VoiceInterface;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const c = document.getElementById('voice-container');
      if (c) window.ArgonVoice('voice-container');
    });
  } else {
    const c = document.getElementById('voice-container');
    if (c) window.ArgonVoice('voice-container');
  }

})();
