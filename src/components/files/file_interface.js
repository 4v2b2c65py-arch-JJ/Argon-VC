/* Argon File Upload / Download component */
(function() {
  'use strict';

  const FileInterface = (containerId, opts = {}) => {
    const container = document.getElementById(containerId);
    if (!container) return null;

    const state = {
      files: opts.initialFiles || [
        { name: 'document.pdf', size: 245760, type: 'application/pdf', status: 'uploaded', url: '#' },
        { name: 'image.png', size: 512000, type: 'image/png', status: 'uploaded', url: '#' },
        { name: 'data.csv', size: 102400, type: 'text/csv', status: 'uploaded', url: '#' },
      ],
      uploadProgress: 0,
      isUploading: false,
    };

    const formatSize = (bytes) => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const render = () => {
      container.innerHTML = `
        <div class="glass-panel p-6 rounded-2xl">
          <div class="flex items-center justify-between mb-6 border-b border-white/30 pb-3">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">📁</div>
              <div>
                <div class="text-sm font-semibold text-slate-800">File Uploads & Downloads</div>
                <div class="text-xs text-slate-500">Attach files to chat & model requests</div>
              </div>
            </div>
            <div class="text-xs text-slate-500">${state.files.length} files</div>
          </div>

          <!-- Upload zone -->
          <div id="upload-zone" class="border-2 border-dashed border-white/40 rounded-2xl p-8 text-center hover:bg-white/20 hover:border-emerald-400/50 transition-all cursor-pointer relative group">
            <input id="file-input" type="file" multiple class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
            <div class="flex flex-col items-center gap-3">
              <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                <span class="text-2xl">📤</span>
              </div>
              <p class="text-sm font-medium text-slate-700 group-hover:text-emerald-600">Click to upload files</p>
              <p class="text-xs text-slate-500">PDF, PNG, JPG, CSV up to 50MB (Pro)</p>
            </div>
          </div>

          ${state.isUploading ? `
            <div class="mt-4">
              <div class="flex justify-between text-xs text-slate-500 mb-1">
                <span>Uploading...</span>
                <span>${state.uploadProgress}%</span>
              </div>
              <div class="w-full bg-slate-200 rounded-full h-2">
                <div class="bg-emerald-600 h-2 rounded-full transition-all duration-300" style="width: ${state.uploadProgress}%"></div>
              </div>
            </div>
          ` : ''}

          <!-- File list -->
          <div class="mt-6">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-bold text-slate-700">Your Files</h4>
            </div>
            <div class="space-y-2">
              ${state.files.map(f => `
                <div class="flex items-center justify-between px-4 py-3 rounded-xl glass-depth-1 border border-white/40">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center ${f.type.startsWith('image') ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'}">
                      ${f.type.startsWith('image') ? '🖼' : '📄'}
                    </div>
                    <div>
                      <div class="text-sm font-medium text-slate-800 truncate" title="${f.name}">${f.name}</div>
                      <div class="text-xs text-slate-500">${f.type} · ${formatSize(f.size)}</div>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button class="px-3 py-1.5 text-xs text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" onclick="downloadFile('${f.name}')">Download</button>
                    <button class="px-3 py-1.5 text-xs text-slate-500 hover:bg-white/40 rounded-lg transition-colors">⋮</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      const input = container.querySelector('#file-input');
      input.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        state.isUploading = true;
        state.uploadProgress = 0;
        render();

        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += 13;
          state.uploadProgress = Math.min(progress, 100);
          render();
          if (progress >= 100) {
            clearInterval(interval);
            state.isUploading = false;
            files.forEach(file => {
              state.files.unshift({
                name: file.name,
                size: file.size,
                type: file.type,
                status: 'uploaded',
                url: '#',
              });
            });
            render();
          }
        }, 150);
      });
    };

    render();
    return { state, render, addFile: (f) => { state.files.unshift(f); render(); } };
  };

  // Expose download globally
  window.downloadFile = (name) => {
    // Create a download link
    const a = document.createElement('a');
    a.href = '#';
    a.download = name;
    a.click();
    console.log('Downloading:', name);
  };

  window.ArgonFiles = FileInterface;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const c = document.getElementById('files-container');
      if (c) window.ArgonFiles('files-container');
    });
  } else {
    const c = document.getElementById('files-container');
    if (c) window.ArgonFiles('files-container');
  }

})();
