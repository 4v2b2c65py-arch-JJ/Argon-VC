/* Argon Chat Interface — React-compatible component */
(function() {
  'use strict';

  const ChatInterface = (containerId, opts = {}) => {
    const container = document.getElementById(containerId);
    if (!container) return null;

    const state = {
      messages: opts.initialMessages || [],
      inputValue: '',
      isStreaming: false,
      model: opts.model || 'argon',
      temperature: 0.7,
      maxTokens: 512,
    };

    const escapeHtml = (text) => {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    };

    const renderMessage = (msg) => {
      const isUser = msg.role === 'user';
      return `
        <div class="flex ${isUser ? 'justify-end' : 'justify-start'} mb-4">
          <div class="max-w-[85%] px-4 py-3 rounded-2xl ${isUser 
            ? 'bg-emerald-600 text-white' : 'glass-panel text-slate-800 border border-white/40'} 
            ${isUser ? 'rounded-tr-none' : 'rounded-tl-none'} shadow-md">
            <div class="text-xs font-medium mb-1 ${isUser ? 'text-emerald-100' : 'text-slate-500'}">
              ${isUser ? 'You' : 'Argon'} · ${new Date(msg.timestamp || Date.now()).toLocaleTimeString()}
            </div>
            <div class="whitespace-pre-wrap break-words">${escapeHtml(msg.content)}</div>
            ${msg.tokens ? `<div class="mt-2 text-[10px] opacity-60">${msg.tokens} tokens</div>` : ''}
          </div>
        </div>
      `;
    };

    const render = () => {
      container.innerHTML = `
        <div class="glass-panel p-6 rounded-2xl h-full flex flex-col h-[600px]">
          <div class="flex items-center justify-between mb-6 border-b border-white/30 pb-3">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                A
              </div>
              <div>
                <div class="text-sm font-semibold text-slate-800">Argon Chat</div>
                <div class="text-xs text-slate-500">Model: ${state.model}</div>
              </div>
            </div>
            <div class="flex gap-2">
              <button id="chat-clear" class="px-3 py-1.5 text-xs text-slate-500 hover:bg-white/20 rounded-lg transition-colors">Clear</button>
              <button id="chat-settings" class="px-3 py-1.5 text-xs text-slate-500 hover:bg-white/20 rounded-lg transition-colors">⚙</button>
            </div>
          </div>
          
          <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-4">
            ${state.messages.map(renderMessage).join('')}
            ${state.isStreaming ? `
              <div class="flex justify-start mb-4">
                <div class="px-4 py-3 rounded-2xl glass-panel text-slate-800 border border-white/40 max-w-[85%] rounded-tl-none">
                  <div class="flex gap-1">
                    <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                    <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" style="animation-delay: 0.2s"></span>
                    <span class="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-ping" style="animation-delay: 0.4s"></span>
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
          
          <div class="p-4 border-t border-white/40 bg-white/30 rounded-b-2xl">
            <div class="flex gap-3">
              <input id="chat-input" type="text" placeholder="Message Argon..." 
                class="flex-1 px-4 py-3 rounded-xl glass-depth-1 border border-white/40 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                value="${escapeHtml(state.inputValue)}">
              <button id="chat-send" class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-lg shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                Send
              </button>
            </div>
            <div class="flex items-center justify-between mt-2">
              <div class="flex gap-4 text-xs text-slate-500">
                <span>Model: ${state.model}</span>
                <span>Temp: ${state.temperature}</span>
                <span>Max: ${state.maxTokens} tokens</span>
              </div>
            </div>
          </div>
        </div>
      `;

      // Wire up events
      const input = container.querySelector('#chat-input');
      const sendBtn = container.querySelector('#chat-send');
      const clearBtn = container.querySelector('#chat-clear');

      input.addEventListener('input', (e) => { state.inputValue = e.target.value; });
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && state.inputValue.trim() && !state.isStreaming) {
          e.preventDefault();
          sendMessage(state.inputValue.trim());
        }
      });
      sendBtn.addEventListener('click', () => {
        if (state.inputValue.trim() && !state.isStreaming) sendMessage(state.inputValue.trim());
      });
      clearBtn.addEventListener('click', () => {
        state.messages = [];
        state.inputValue = '';
        render();
      });
    };

    const sendMessage = async (text) => {
      state.messages.push({ role: 'user', content: text, timestamp: Date.now() });
      state.inputValue = '';
      state.isStreaming = true;
      render();

      // Simulate streaming response
      const responseText = await simulateStream(text);
      state.messages.push({ role: 'assistant', content: responseText, timestamp: Date.now(), tokens: Math.ceil(responseText.length / 4) });
      state.isStreaming = false;
      render();
      container.querySelector('#chat-messages').scrollTop = container.querySelector('#chat-messages').scrollHeight;
    };

    const simulateStream = async (text) => {
      const responses = [
        "I understand you said: " + text,
        "That's an interesting question about " + text,
        "Based on your input '" + text + "', here's my analysis:",
        "Argon is processing your message: " + text,
      ];
      const base = responses[Math.floor(Math.random() * responses.length)];
      const words = base.split(' ');
      let result = '';
      for (const word of words) {
        await new Promise(r => setTimeout(r, 30 + Math.random() * 50));
        result += (result ? ' ' : '') + word;
        // Update streaming UI
        const msgs = container.querySelector('#chat-messages');
        if (msgs) {
          const last = msgs.lastElementChild;
          if (last && last.querySelector('.animate-ping')) {
            last.innerHTML = `<div class="px-4 py-3 rounded-2xl glass-panel text-slate-800 border border-white/40 max-w-[85%] rounded-tl-none whitespace-pre-wrap break-words">${escapeHtml(result + '▮')}</div>`;
            msgs.scrollTop = msgs.scrollHeight;
          }
        }
      }
      return base;
    };

    render();
    return { state, render, sendMessage };
  };

  // Expose globally
  window.ArgonChat = ChatInterface;

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const c = document.getElementById('chat-container');
      if (c) window.ArgonChat('chat-container');
    });
  } else {
    const c = document.getElementById('chat-container');
    if (c) window.ArgonChat('chat-container');
  }

})();
