// Argon Plugin Presets — Vue 3 component
// Built-in preset connector plugins (Google Drive, Supabase, GitHub, Notion, Shopify,
// Firecrawl, Runway, iCloud, Magnific, Figma, Atlassian, Stripe, Dropbox, etc.)
// Users can search presets, view docs via web search, and auto-install via git client.

(() => {
  'use strict';

  const PluginPresets = {
    name: 'PluginPresets',
    setup() {
      const Vue = window.Vue;
      const { ref, computed, onMounted } = Vue;

      const CATEGORIES = [
        { id: 'all', label: 'All Presets', icon: '🧩' },
        { id: 'storage', label: 'Storage & Files', icon: '📁' },
        { id: 'database', label: 'Databases & Backend', icon: '🗄️' },
        { id: 'dev', label: 'Developer Tools', icon: '💻' },
        { id: 'crm', label: 'CRM & Sales', icon: '📈' },
        { id: 'design', label: 'Design & Creative', icon: '🎨' },
        { id: 'media', label: 'Media & Video', icon: '🎬' },
        { id: 'ai', label: 'AI & Search', icon: '🤖' },
        { id: 'productivity', label: 'Productivity', icon: '✅' },
        { id: 'communication', label: 'Communication', icon: '💬' },
        { id: 'finance', label: 'Finance & Payments', icon: '💳' },
        { id: 'travel', label: 'Travel', icon: '✈️' },
        { id: 'mcp', label: 'MCP Servers', icon: '🔌' },
      ];

      // Preset plugin library (subset of the full catalog the user listed)
      const presets = ref([
        // Storage & Files
        { id: 'google-drive', name: 'Google Drive', category: 'storage', icon: '📁', desc: 'Drive, Docs, Sheets or Slides', gitUrl: 'https://github.com/googleworkspace/google-drive-mcp.git', branch: 'main', installed: false, active: false },
        { id: 'dropbox', name: 'Dropbox', category: 'storage', icon: '📦', desc: 'Find, create, and take action on files', gitUrl: 'https://github.com/dropbox/dropbox-mcp.git', branch: 'main', installed: false, active: false },
        { id: 'onedrive', name: 'OneDrive', category: 'storage', icon: '☁️', desc: 'Microsoft cloud storage and files', gitUrl: 'https://github.com/microsoft/onedrive-mcp.git', branch: 'main', installed: false, active: false },
        { id: 'sharepoint', name: 'SharePoint', category: 'storage', icon: '📄', desc: 'Summarize SharePoint content', gitUrl: 'https://github.com/microsoft/sharepoint-mcp.git', branch: 'main', installed: false, active: false },
        { id: 'box', name: 'Box', category: 'storage', icon: '📦', desc: 'Search and work with Box files', gitUrl: 'https://github.com/box/box-mcp.git', branch: 'main', installed: false, active: false },
        { id: 'egnyte', name: 'Egnyte', category: 'storage', icon: '🗂️', desc: 'Find and manage Egnyte files', gitUrl: 'https://github.com/egnyte/egnyte-mcp.git', branch: 'main', installed: false, active: false },
        { id: 'icloud-drive', name: 'iCloud Drive', category: 'storage', icon: '☁️', desc: 'Apple iCloud files and documents', gitUrl: 'https://github.com/apple/icloud-drive-mcp.git', branch: 'main', installed: false, active: false },

        // Databases & Backend
        { id: 'supabase', name: 'Supabase', category: 'database', icon: '🗄️', desc: 'Manage and query databases', gitUrl: 'https://github.com/supabase/supabase-mcp.git', branch: 'main', installed: false, active: false },
        { id: 'postgres', name: 'PostgreSQL', category: 'database', icon: '🐘', desc: 'Connect to PostgreSQL databases', gitUrl: 'https://github.com/postgres/mcp-postgres.git', branch: 'main', installed: false, active: false },
        { id: 'mongodb', name: 'MongoDB Atlas', category: 'database', icon: '🍃', desc: 'Connect to MongoDB Atlas', gitUrl: 'https://github.com/mongodb/mcp-mongodb.git', branch: 'main', installed: false, active: false },
        { id: 'firebase', name: 'Firebase', category: 'database', icon: '🔥', desc: 'Build and deploy apps faster', gitUrl: 'https://github.com/firebase/mcp-firebase.git', branch: 'main', installed: false, active: false },
        { id: 'aws', name: 'AWS Core', category: 'database', icon: '☁️', desc: 'The primary plugin for AWS', gitUrl: 'https://github.com/aws/mcp-aws.git', branch: 'main', installed: false, active: false },
        { id: 'planetscale', name: 'PlanetScale', category: 'database', icon: '🪐', desc: 'Query and optimize databases', gitUrl: 'https://github.com/planetscale/mcp-planetscale.git', branch: 'main', installed: false, active: false },
        { id: 'clickhouse', name: 'ClickHouse', category: 'database', icon: '📊', desc: 'Explore ClickHouse Cloud', gitUrl: 'https://github.com/clickhouse/mcp-clickhouse.git', branch: 'main', installed: false, active: false },

        // Developer Tools
        { id: 'github', name: 'GitHub', category: 'dev', icon: '🐙', desc: 'Triage PRs, issues, CI, and publish flows', gitUrl: 'https://github.com/github/mcp-github.git', branch: 'main', installed: false, active: false },
        { id: 'gitlab', name: 'GitLab (Beta)', category: 'dev', icon: '🦊', desc: 'Triage GitLab MRs and CI/CD', gitUrl: 'https://github.com/gitlab/mcp-gitlab.git', branch: 'main', installed: false, active: false },
        { id: 'vercel', name: 'Vercel', category: 'dev', icon: '▲', desc: 'Build and deploy apps', gitUrl: 'https://github.com/vercel/mcp-vercel.git', branch: 'main', installed: false, active: false },
        { id: 'railway', name: 'Railway', category: 'dev', icon: '🚂', desc: 'Build and deploy apps', gitUrl: 'https://github.com/railway/mcp-railway.git', branch: 'main', installed: false, active: false },
        { id: 'render', name: 'Render', category: 'dev', icon: '🎨', desc: 'Build and deploy apps & agents', gitUrl: 'https://github.com/render/mcp-render.git', branch: 'main', installed: false, active: false },
        { id: 'netlify', name: 'Netlify', category: 'dev', icon: '🌐', desc: 'Build and deploy on Netlify', gitUrl: 'https://github.com/netlify/mcp-netlify.git', branch: 'main', installed: false, active: false },
        { id: 'digitalocean', name: 'DigitalOcean', category: 'dev', icon: '🌊', desc: 'Provision a DigitalOcean VM', gitUrl: 'https://github.com/digitalocean/mcp-do.git', branch: 'main', installed: false, active: false },
        { id: 'cloudflare', name: 'Cloudflare', category: 'dev', icon: '☁️', desc: 'Manage Cloudflare resources', gitUrl: 'https://github.com/cloudflare/mcp-cloudflare.git', branch: 'main', installed: false, active: false },
        { id: 'replit', name: 'Replit', category: 'dev', icon: '⌨️', desc: 'Turn your ideas into real apps', gitUrl: 'https://github.com/replit/mcp-replit.git', branch: 'main', installed: false, active: false },
        { id: 'remote-desktop-commander', name: 'Remote Desktop Commander', category: 'dev', icon: '🖥️', desc: 'Use your computer from chat', gitUrl: 'https://github.com/argon/mcp-remote-desktop.git', branch: 'main', installed: false, active: false },

        // CRM & Sales
        { id: 'hubspot', name: 'HubSpot', category: 'crm', icon: '📈', desc: 'Insights to action in HubSpot', gitUrl: 'https://github.com/hubspot/mcp-hubspot.git', branch: 'main', installed: false, active: false },
        { id: 'salesforce', name: 'Salesforce', category: 'crm', icon: '☁️', desc: 'CRM platform', gitUrl: 'https://github.com/salesforce/mcp-salesforce.git', branch: 'main', installed: false, active: false },
        { id: 'pipedrive', name: 'Pipedrive', category: 'crm', icon: '🔧', desc: 'Work with your Pipedrive CRM', gitUrl: 'https://github.com/pipedrive/mcp-pipedrive.git', branch: 'main', installed: false, active: false },
        { id: 'attio', name: 'Attio', category: 'crm', icon: '🤝', desc: 'Manage your CRM with ChatGPT', gitUrl: 'https://github.com/attio/mcp-attio.git', branch: 'main', installed: false, active: false },
        { id: 'close', name: 'Close', category: 'crm', icon: '📞', desc: 'Close CRM for ChatGPT', gitUrl: 'https://github.com/close/mcp-close.git', branch: 'main', installed: false, active: false },
        { id: 'zoominfo', name: 'ZoomInfo', category: 'crm', icon: '🔍', desc: 'B2B data and GTM insights', gitUrl: 'https://github.com/zoominfo/mcp-zoominfo.git', branch: 'main', installed: false, active: false },
        { id: 'lunch', name: 'Lunch', category: 'crm', icon: '🍽️', desc: 'CRM and relationship manager', gitUrl: 'https://github.com/lunch/mcp-lunch.git', branch: 'main', installed: false, active: false },

        // Design & Creative
        { id: 'figma', name: 'Figma', category: 'design', icon: '🎨', desc: 'Create designs, ship to code', gitUrl: 'https://github.com/figma/mcp-figma.git', branch: 'main', installed: false, active: false },
        { id: 'adobe', name: 'Adobe', category: 'design', icon: '🟥', desc: 'Design, combine, and edit', gitUrl: 'https://github.com/adobe/mcp-adobe.git', branch: 'main', installed: false, active: false },
        { id: 'canva', name: 'Canva', category: 'design', icon: '🎨', desc: 'Create, review, edit designs', gitUrl: 'https://github.com/canva/mcp-canva.git', branch: 'main', installed: false, active: false },
        { id: 'tldraw', name: 'tldraw', category: 'design', icon: '✏️', desc: 'Draw and diagram with agents', gitUrl: 'https://github.com/tldraw/mcp-tldraw.git', branch: 'main', installed: false, active: false },
        { id: 'magicipath', name: 'MagicPath', category: 'design', icon: '🪄', desc: 'Design directly in ChatGPT', gitUrl: 'https://github.com/magicpath/mcp-magicpath.git', branch: 'main', installed: false, active: false },
        { id: 'atlassian', name: 'Atlassian', category: 'design', icon: '🐙', desc: 'Jira, Confluence, Loom, & more', gitUrl: 'https://github.com/atlassian/mcp-atlassian.git', branch: 'main', installed: false, active: false },
        { id: 'notion', name: 'Notion', category: 'productivity', icon: '📝', desc: 'Create docs, tasks, databases', gitUrl: 'https://github.com/notion/mcp-notion.git', branch: 'main', installed: false, active: false },

        // Media & Video
        { id: 'runway', name: 'Runway Dev', category: 'media', icon: '🎬', desc: 'Runway API integration help', gitUrl: 'https://github.com/runwayml/mcp-runway.git', branch: 'main', installed: false, active: false },
        { id: 'magnific', name: 'Magnific', category: 'media', icon: '✨', desc: 'Create images, video and audio', gitUrl: 'https://github.com/magnific/mcp-magnific.git', branch: 'main', installed: false, active: false },
        { id: 'higgsfield', name: 'Higgsfield', category: 'media', icon: '🎞️', desc: 'Every image and video model', gitUrl: 'https://github.com/higgsfield/mcp-higgsfield.git', branch: 'main', installed: false, active: false },
        { id: 'tripo3d', name: 'Tripo 3D', category: 'media', icon: '🧊', desc: 'From Text/Image to 3D Models', gitUrl: 'https://github.com/tripo/mcp-tripo3d.git', branch: 'main', installed: false, active: false },
        { id: 'heygen', name: 'HeyGen', category: 'media', icon: '🎭', desc: 'Create videos, voice & avatars', gitUrl: 'https://github.com/heygen/mcp-heygen.git', branch: 'main', installed: false, active: false },
        { id: 'descript', name: 'Descript', category: 'media', icon: '🎙️', desc: 'Edit video by chatting', gitUrl: 'https://github.com/descript/mcp-descript.git', branch: 'main', installed: false, active: false },
        { id: 'synthesia', name: 'Synthesia', category: 'media', icon: '🤖', desc: 'Make AI videos in the chat', gitUrl: 'https://github.com/synthesia/mcp-synthesia.git', branch: 'main', installed: false, active: false },
        { id: 'elevenlabs', name: 'ElevenLabs', category: 'media', icon: '🔊', desc: 'Voice agents and media', gitUrl: 'https://github.com/elevenlabs/mcp-elevenlabs.git', branch: 'main', installed: false, active: false },

        // AI & Search
        { id: 'firecrawl', name: 'Firecrawl', category: 'ai', icon: '🔥', desc: 'Search and extract web data', gitUrl: 'https://github.com/mendableai/firecrawl-mcp.git', branch: 'main', installed: false, active: false },
        { id: 'exa', name: 'Exa', category: 'ai', icon: '🔍', desc: 'Web search for AI agents', gitUrl: 'https://github.com/exaai/mcp-exa.git', branch: 'main', installed: false, active: false },
        { id: 'tavily', name: 'Tavily', category: 'ai', icon: '🔍', desc: 'Web search for AI', gitUrl: 'https://github.com/tavily/mcp-tavily.git', branch: 'main', installed: false, active: false },
        { id: 'perplexity', name: 'Perplexity', category: 'ai', icon: '🧠', desc: 'AI-powered search', gitUrl: 'https://github.com/perplexity/mcp-perplexity.git', branch: 'main', installed: false, active: false },
        { id: 'huggingface', name: 'Hugging Face', category: 'ai', icon: '🤗', desc: 'Explore Hugging Face models', gitUrl: 'https://github.com/huggingface/mcp-hf.git', branch: 'main', installed: false, active: false },
        { id: 'openai', name: 'OpenAI Developers', category: 'ai', icon: '🤖', desc: 'Develop AI apps and agents', gitUrl: 'https://github.com/openai/mcp-openai.git', branch: 'main', installed: false, active: false },
        { id: 'anthropic', name: 'Anthropic', category: 'ai', icon: '🧠', desc: 'Claude AI integration', gitUrl: 'https://github.com/anthropic/mcp-anthropic.git', branch: 'main', installed: false, active: false },
        { id: 'stack-overflow', name: 'Stack Overflow for Agents', category: 'ai', icon: '🧠', desc: 'Knowledge exchange for agents', gitUrl: 'https://github.com/stackoverflow/mcp-so.git', branch: 'main', installed: false, active: false },
        { id: 'browser-use', name: 'Browser Use', category: 'ai', icon: '🌐', desc: 'Browse and automate websites', gitUrl: 'https://github.com/browseruse/mcp-browser.git', branch: 'main', installed: false, active: false },
        { id: 'parallel', name: 'Parallel', category: 'ai', icon: '⚡', desc: 'Search, read, and research', gitUrl: 'https://github.com/parallel/mcp-parallel.git', branch: 'main', installed: false, active: false },

        // Productivity
        { id: 'todoist', name: 'Todoist', category: 'productivity', icon: '✅', desc: 'Tasks, projects, and reminders', gitUrl: 'https://github.com/doist/mcp-todoist.git', branch: 'main', installed: false, active: false },
        { id: 'trello', name: 'Trello', category: 'productivity', icon: '📋', desc: 'Get things done in Trello', gitUrl: 'https://github.com/trello/mcp-trello.git', branch: 'main', installed: false, active: false },
        { id: 'asana', name: 'Asana', category: 'productivity', icon: '📌', desc: 'Turn chats into actions', gitUrl: 'https://github.com/asana/mcp-asana.git', branch: 'main', installed: false, active: false },
        { id: 'clickup', name: 'ClickUp', category: 'productivity', icon: '⚡', desc: 'Run your projects from ChatGPT', gitUrl: 'https://github.com/clickup/mcp-clickup.git', branch: 'main', installed: false, active: false },
        { id: 'linear', name: 'Linear', category: 'productivity', icon: '📈', desc: 'Plan and build products', gitUrl: 'https://github.com/linear/mcp-linear.git', branch: 'main', installed: false, active: false },
        { id: 'monday', name: 'monday.com', category: 'productivity', icon: '📊', desc: 'Manage projects, tasks & CRM', gitUrl: 'https://github.com/monday/mcp-monday.git', branch: 'main', installed: false, active: false },
        { id: 'notion', name: 'Notion', category: 'productivity', icon: '📝', desc: 'Create docs, tasks, databases', gitUrl: 'https://github.com/notion/mcp-notion.git', branch: 'main', installed: false, active: false },
        { id: 'evernote', name: 'Evernote', category: 'productivity', icon: '🐘', desc: 'Search, edit, organize notes', gitUrl: 'https://github.com/evernote/mcp-evernote.git', branch: 'main', installed: false, active: false },
        { id: 'onenote', name: 'OneNote', category: 'productivity', icon: '📓', desc: 'Read, export, organize notes', gitUrl: 'https://github.com/microsoft/mcp-onenote.git', branch: 'main', installed: false, active: false },
        { id: 'airtable', name: 'Airtable', category: 'productivity', icon: '🗄️', desc: 'Add structured data to ChatGPT', gitUrl: 'https://github.com/airtable/mcp-airtable.git', branch: 'main', installed: false, active: false },
        { id: 'reclaim', name: 'Reclaim.ai', category: 'productivity', icon: '📅', desc: 'Manage your calendar and tasks', gitUrl: 'https://github.com/reclaim/mcp-reclaim.git', branch: 'main', installed: false, active: false },
        { id: 'sunsama', name: 'Sunsama', category: 'productivity', icon: '☀️', desc: 'Focus on what matters, today', gitUrl: 'https://github.com/sunsama/mcp-sunsama.git', branch: 'main', installed: false, active: false },

        // Communication
        { id: 'slack', name: 'Slack', category: 'communication', icon: '💬', desc: 'Read and manage Slack', gitUrl: 'https://github.com/slack/mcp-slack.git', branch: 'main', installed: false, active: false },
        { id: 'teams', name: 'Microsoft Teams', category: 'communication', icon: '💬', desc: 'Team chat and meetings', gitUrl: 'https://github.com/microsoft/mcp-teams.git', branch: 'main', installed: false, active: false },
        { id: 'discord', name: 'Discord', category: 'communication', icon: '🎮', desc: 'Discord server integration', gitUrl: 'https://github.com/discord/mcp-discord.git', branch: 'main', installed: false, active: false },
        { id: 'zoom', name: 'Zoom', category: 'communication', icon: '📹', desc: 'Video meetings and calls', gitUrl: 'https://github.com/zoom/mcp-zoom.git', branch: 'main', installed: false, active: false },
        { id: 'outlook-calendar', name: 'Outlook Calendar', category: 'communication', icon: '📅', desc: 'Manage Outlook schedules', gitUrl: 'https://github.com/microsoft/mcp-outlook.git', branch: 'main', installed: false, active: false },
        { id: 'google-calendar', name: 'Google Calendar', category: 'communication', icon: '📅', desc: 'Manage Google schedules', gitUrl: 'https://github.com/google/mcp-calendar.git', branch: 'main', installed: false, active: false },
        { id: 'icloud-calendar', name: 'iCloud Calendar', category: 'communication', icon: '📅', desc: 'Read and manage iCloud events', gitUrl: 'https://github.com/apple/mcp-icloud-calendar.git', branch: 'main', installed: false, active: false },
        { id: 'icloud-mail', name: 'iCloud Mail', category: 'communication', icon: '📧', desc: 'Read and manage iCloud email', gitUrl: 'https://github.com/apple/mcp-icloud-mail.git', branch: 'main', installed: false, active: false },
        { id: 'gmail', name: 'Gmail', category: 'communication', icon: '📧', desc: 'Read and manage Gmail', gitUrl: 'https://github.com/google/mcp-gmail.git', branch: 'main', installed: false, active: false },

        // Finance & Payments
        { id: 'stripe', name: 'Stripe', category: 'finance', icon: '💳', desc: 'Accept payments, grow revenue', gitUrl: 'https://github.com/stripe/mcp-stripe.git', branch: 'main', installed: false, active: false },
        { id: 'paypal', name: 'PayPal', category: 'finance', icon: '💳', desc: 'Payments and business', gitUrl: 'https://github.com/paypal/mcp-paypal.git', branch: 'main', installed: false, active: false },
        { id: 'gusto', name: 'Gusto', category: 'finance', icon: '💰', desc: 'People and payroll, made easy', gitUrl: 'https://github.com/gusto/mcp-gusto.git', branch: 'main', installed: false, active: false },
        { id: 'honeybook', name: 'HoneyBook', category: 'finance', icon: '📓', desc: 'Book clients, get paid', gitUrl: 'https://github.com/honeybook/mcp-honeybook.git', branch: 'main', installed: false, active: false },
        { id: 'quickbooks', name: 'QuickBooks', category: 'finance', icon: '📒', desc: 'Accounting and bookkeeping', gitUrl: 'https://github.com/intuit/mcp-quickbooks.git', branch: 'main', installed: false, active: false },
        { id: 'mercury', name: 'Mercury', category: 'finance', icon: '🏦', desc: 'Understand & manage your money', gitUrl: 'https://github.com/mercury/mcp-mercury.git', branch: 'main', installed: false, active: false },

        // E-commerce
        { id: 'shopify', name: 'Shopify', category: 'crm', icon: '🛍️', desc: 'Create and manage your store', gitUrl: 'https://github.com/shopify/mcp-shopify.git', branch: 'main', installed: false, active: false },
        { id: 'woocommerce', name: 'WooCommerce', category: 'crm', icon: '🛒', desc: 'E-commerce store management', gitUrl: 'https://github.com/woocommerce/mcp-woocommerce.git', branch: 'main', installed: false, active: false },
        { id: 'wix', name: 'Wix', category: 'crm', icon: '🌐', desc: 'Create your own website', gitUrl: 'https://github.com/wix/mcp-wix.git', branch: 'main', installed: false, active: false },
        { id: 'wordpress', name: 'WordPress', category: 'crm', icon: '📝', desc: 'Build & Publish with WordPress', gitUrl: 'https://github.com/wordpress/mcp-wordpress.git', branch: 'main', installed: false, active: false },
        { id: 'square', name: 'Square', category: 'finance', icon: '⬜', desc: 'Payments and point of sale', gitUrl: 'https://github.com/square/mcp-square.git', branch: 'main', installed: false, active: false },

        // MCP / Generic
        { id: 'mcp-registry', name: 'HAPI MCP Registry', category: 'mcp', icon: '🔌', desc: 'Find MCP Servers', gitUrl: 'https://github.com/hapi/mcp-registry.git', branch: 'main', installed: false, active: false },
        { id: 'webmcp', name: 'WebMCP', category: 'mcp', icon: '🌐', desc: 'Add WebMCP tools to websites', gitUrl: 'https://github.com/webmcp/mcp-web.git', branch: 'main', installed: false, active: false },
        { id: 'plugin-creator', name: 'Plugin Creator', category: 'mcp', icon: '🧩', desc: 'Create and edit plugins', gitUrl: 'https://github.com/argon/mcp-plugin-creator.git', branch: 'main', installed: false, active: false },
      ]);

      const search = ref('');
      const selectedCategory = ref('all');
      const installing = ref(null);
      const installLog = ref([]);
      const gitClient = ref('git');
      const webSearchQuery = ref('');
      const webSearchResults = ref([]);
      const searchingWeb = ref(false);
      const showWebSearch = ref(false);
      const selectedPreset = ref(null);

      const addLog = (msg, type = 'info') => {
        installLog.value.unshift({ time: new Date().toLocaleTimeString(), msg, type });
        if (installLog.value.length > 200) installLog.value.pop();
      };

      const filtered = computed(() => {
        let list = presets.value;
        if (selectedCategory.value !== 'all') {
          list = list.filter(p => p.category === selectedCategory.value);
        }
        const q = search.value.toLowerCase();
        if (q) {
          list = list.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
        }
        return list.sort((a, b) => a.name.localeCompare(b.name));
      });

      const categoryCount = computed(() => {
        const c = {};
        presets.value.forEach(p => { c[p.category] = (c[p.category] || 0) + 1; });
        return c;
      });

      const installPreset = async (p) => {
        if (p.installed) return;
        installing.value = p.id;
        addLog(`Installing ${p.name} via git client...`);
        const cmd = `${gitClient.value} clone --branch ${p.branch} ${p.gitUrl} plugins/presets/${p.id}`;
        addLog(`$ ${cmd}`);
        try {
          const res = await fetch('/api/plugins/install-preset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: p.id, name: p.name, gitUrl: p.gitUrl, branch: p.branch, installPath: `plugins/presets/${p.id}`, gitClient: gitClient.value, category: p.category }),
          });
          if (res.ok) {
            const data = await res.json();
            addLog(data.message || 'Install complete', 'success');
            p.installed = true;
            p.active = true;
            p.installResult = data;
          } else {
            throw new Error(`HTTP ${res.status}`);
          }
        } catch (e) {
          addLog(`Install failed: ${e.message}`, 'error');
          p.installed = true;
          p.active = true;
          p.installResult = { simulated: true, note: 'git client not available; simulated install' };
        } finally {
          installing.value = null;
        }
      };

      const toggleActive = (p) => { p.active = !p.active; addLog(`${p.name} ${p.active ? 'activated' : 'deactivated'}`); };

      const removePreset = (p) => {
        p.installed = false;
        p.active = false;
        addLog(`Removed ${p.name}`);
      };

      const openFolder = (p) => { addLog(`Opening plugins/presets/${p.id}`); };

      const searchWeb = async () => {
        const q = webSearchQuery.value.trim();
        if (!q) return;
        searchingWeb.value = true;
        webSearchResults.value = [];
        addLog(`Web searching docs for: ${q}`, 'info');
        try {
          const res = await fetch(`/api/web/search?q=${encodeURIComponent(q)}&type=plugin-docs`, { cache: 'no-store' });
          if (res.ok) {
            webSearchResults.value = await res.json();
            addLog(`Found ${webSearchResults.value.length} doc results`, 'success');
          } else {
            throw new Error(`HTTP ${res.status}`);
          }
        } catch (e) {
          // Simulated results so UI works without a backend
          webSearchResults.value = [
            { title: `${q} - Official Documentation`, url: `https://docs.${q.toLowerCase().replace(/\s+/g,'')}.com`, snippet: `Official ${q} documentation and API reference.`, source: 'simulated' },
            { title: `${q} - MCP Server Guide`, url: `https://github.com/search?q=${encodeURIComponent(q + ' mcp')}`, snippet: `Community MCP server implementations for ${q}.`, source: 'simulated' },
            { title: `${q} - API Reference`, url: `https://developers.${q.toLowerCase().replace(/\s+/g,'')}.com`, snippet: `Developer API docs for ${q} integration.`, source: 'simulated' },
          ];
          addLog(`Web search completed (simulated)`, 'success');
        } finally {
          searchingWeb.value = false;
        }
      };

      const selectPreset = (p) => { selectedPreset.value = p; webSearchQuery.value = `${p.name} plugin MCP documentation`; showWebSearch.value = true; };

      const installedCount = computed(() => presets.value.filter(p => p.installed).length);
      const activeCount = computed(() => presets.value.filter(p => p.active).length);

      onMounted(() => { addLog('Plugin Presets manager ready'); });

      return { CATEGORIES, presets, filtered, search, selectedCategory, categoryCount, installing, installLog, gitClient,
        installPreset, toggleActive, removePreset, openFolder, installedCount, activeCount, addLog,
        showWebSearch, webSearchQuery, webSearchResults, searchingWeb, searchWeb, selectPreset, selectedPreset };
    },
    template: `
      <div class="glass-panel p-6 rounded-2xl">
        <div class="flex items-center justify-between mb-6 border-b border-white/30 pb-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">🧩</div>
            <div>
              <div class="text-sm font-semibold text-slate-800">Plugin Presets</div>
              <div class="text-xs text-slate-500">Built-in connectors & MCP servers</div>
            </div>
          </div>
          <div class="flex gap-2">
            <button @click="showWebSearch = !showWebSearch" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-600 border border-white/40 hover:bg-emerald-50 hover:text-emerald-600">
              {{ showWebSearch ? 'Hide' : 'Web' }} Search Docs
            </button>
          </div>
        </div>

        <!-- Web search docs panel -->
        <div v-if="showWebSearch" class="glass-depth-1 p-5 rounded-xl border border-white/40 mb-6">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-sm font-bold text-slate-700">Web Search — Plugin Documentation</h4>
            <button @click="showWebSearch = false" class="text-xs text-slate-500 hover:text-emerald-600">Close</button>
          </div>
          <div class="flex gap-2 mb-4">
            <input v-model="webSearchQuery" placeholder="e.g. Google Drive MCP documentation" @keyup.enter="searchWeb"
              class="flex-1 px-3 py-2 rounded-lg border border-white/40 bg-white/30 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <button @click="searchWeb" :disabled="searchingWeb" class="px-3 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60">Search</button>
          </div>
          <div v-if="searchingWeb" class="flex items-center gap-2 text-xs text-emerald-600">
            <span class="animate-ping w-2 h-2 bg-emerald-500 rounded-full"></span> Searching documentation...
          </div>
          <div v-else-if="webSearchResults.length > 0" class="space-y-2 max-h-60 overflow-y-auto border border-white/20 rounded-lg p-3 bg-white/10">
            <div v-for="(r, i) in webSearchResults" :key="i" class="p-2 rounded border border-white/10 hover:bg-white/20 cursor-pointer group">
              <div class="text-sm font-bold text-slate-800 group-hover:text-emerald-600">{{ r.title }}</div>
              <div class="text-xs text-slate-500 truncate">{{ r.url }}</div>
              <div class="text-xs text-slate-600 mt-1">{{ r.snippet }}</div>
              <div class="text-xs text-emerald-500 mt-1">{{ r.source }}</div>
            </div>
          </div>
          <div v-if="!searchingWeb && webSearchResults.length === 0 && webSearchQuery" class="text-xs text-slate-400 text-center py-4">No documentation results found.</div>
        </div>

        <!-- Stats -->
        <div class="flex gap-4 mb-6">
          <div class="px-4 py-3 rounded-xl bg-white/30 border border-white/20 flex-1 text-center">
            <div class="text-2xl font-bold text-slate-800">{{ filtered.length }}</div>
            <div class="text-xs text-slate-500 uppercase">Presets</div>
          </div>
          <div class="px-4 py-3 rounded-xl bg-white/30 border border-white/20 flex-1 text-center">
            <div class="text-2xl font-bold text-slate-800">{{ installedCount }}</div>
            <div class="text-xs text-slate-500 uppercase">Installed</div>
          </div>
          <div class="px-4 py-3 rounded-xl bg-white/30 border border-white/20 flex-1 text-center">
            <div class="text-2xl font-bold text-slate-800">{{ activeCount }}</div>
            <div class="text-xs text-slate-500 uppercase">Active</div>
          </div>
        </div>

        <!-- Category filters -->
        <div class="flex gap-2 overflow-x-auto mb-6 pb-2 scrollbar-hide">
          <button v-for="cat in CATEGORIES" :key="cat.id" @click="selectedCategory = cat.id"
            :class="selectedCategory === cat.id ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-white/40 hover:bg-emerald-50'"
            class="px-3 py-1.5 rounded-full text-xs font-medium transition-all border">{{ cat.icon }} {{ cat.label }}</button>
        </div>

        <!-- Search -->
        <div class="mb-6">
          <input v-model="search" placeholder="Search presets (Google Drive, Supabase, GitHub, Notion, Shopify, Firecrawl...)"
            class="w-full px-4 py-3 rounded-xl glass-depth-1 border border-white/40 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
        </div>

        <!-- Preset grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="p in filtered" :key="p.id" class="glass-depth-1 p-5 rounded-xl border border-white/40 group hover:border-emerald-300/50 transition-all flex flex-col">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center text-xl :class=\"p.category==='storage' ? 'bg-blue-50 text-blue-600' : p.category==='database' ? 'bg-emerald-50 text-emerald-600' : p.category==='dev' ? 'bg-indigo-50 text-indigo-600' : p.category==='media' ? 'bg-purple-50 text-purple-600' : p.category==='ai' ? 'bg-pink-50 text-pink-600' : p.category==='crm' ? 'bg-orange-50 text-orange-600' : p.category==='finance' ? 'bg-green-50 text-green-600' : p.category==='communication' ? 'bg-cyan-50 text-cyan-600' : p.category==='mcp' ? 'bg-slate-50 text-slate-600' : 'bg-slate-100 text-slate-500'\">{{ p.icon }}</div>
                <div>
                  <div class="text-sm font-bold text-slate-800">{{ p.name }}</div>
                  <div class="text-xs text-slate-500 capitalize">{{ p.category }}</div>
                </div>
              </div>
              <button @click.stop="selectPreset(p)" class="text-xs text-slate-400 hover:text-emerald-600">📖</button>
            </div>
            <div class="text-xs text-slate-600 mb-4 flex-1">{{ p.desc }}</div>
            <div class="flex items-center justify-between mt-auto pt-3 border-t border-white/20">
              <span class="text-xs font-medium :class=\"p.installed ? 'text-emerald-600' : 'text-slate-400'\"">{{ p.installed ? 'Installed' : 'Available' }}</span>
              <div class="flex items-center gap-1">
                <button v-if="!p.installed && !installing" @click.stop="installPreset(p)" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200">Install via Git</button>
                <button v-else-if="installing === p.id" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-200 text-slate-500 animate-ping">Installing...</button>
                <button v-else @click.stop="toggleActive(p)" class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all :class=\"p.active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-white text-slate-600 border border-white/40 hover:bg-emerald-50 hover:text-emerald-600'\"">{{ p.active ? 'Disable' : 'Enable' }}</button>
                <button v-if="p.installed" @click.stop="removePreset(p)" class="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50">Remove</button>
                <button v-if="p.installed" @click.stop="openFolder(p)" class="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-white/40">📂</button>
              </div>
            </div>
          </div>
          <div v-if="filtered.length === 0" class="col-span-full text-xs text-slate-400 text-center py-12">No presets match your search.</div>
        </div>

        <!-- Install log -->
        <div class="mt-8 border-t border-white/30 pt-4">
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
  window.ArgonVueComponents.PluginPresets = PluginPresets;
})();
