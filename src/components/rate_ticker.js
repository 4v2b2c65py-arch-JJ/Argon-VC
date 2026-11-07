// Argon RateTicker — Vue 3 component
// Scrolling ticker that displays rate-limit math from the PlanRateLimiter
// (requests/min, tokens/min, concurrent calls, max file size, plan tier)

(() => {
  'use strict';

  const PLAN_LIMITS = {
    free: {
      name: 'Free',
      rpm: 10, rpd: 100, tpm: 1000, tpd: 10000,
      concurrent_calls: 1, max_file_size_mb: 5,
      features: ['chat', 'voice'],
    },
    pro: {
      name: 'Pro',
      rpm: 60, rpd: 1000, tpm: 10000, tpd: 100000,
      concurrent_calls: 5, max_file_size_mb: 50,
      features: ['chat', 'voice', 'live_call', 'file_upload', 'api_generator'],
    },
    enterprise: {
      name: 'Enterprise',
      rpm: 600, rpd: 10000, tpm: 100000, tpd: 1000000,
      concurrent_calls: 50, max_file_size_mb: 500,
      features: ['chat', 'voice', 'live_call', 'file_upload', 'api_generator', 'shaders', 'account_linking'],
    },
  };

  const RateTicker = {
    name: 'RateTicker',
    props: {
      userId: { type: String, default: 'user-1' },
      planId: { type: String, default: 'pro' },
      intervalMs: { type: Number, default: 1000 },
    },
    emits: ['limit-reached', 'plan-changed'],
    setup(props, { emit }) {
      const Vue = window.Vue;
      const { ref, computed, onMounted, onUnmounted } = Vue;

      const state = ref({
        plan: PLAN_LIMITS[props.planId] || PLAN_LIMITS.pro,
        requestsRemaining: 0,
        tokensRemaining: 0,
        activeCalls: 0,
        retryAfter: 0,
        allowed: true,
        reason: null,
      });

      const scrollOffset = ref(0);
      let timer = null;
      let raf = null;

      const planName = computed(() => state.value.plan.name);
      const requestsPct = computed(() =>
        Math.max(0, Math.min(100, (state.value.requestsRemaining / state.value.plan.rpm) * 100))
      );
      const tokensPct = computed(() =>
        Math.max(0, Math.min(100, (state.value.tokensRemaining / state.value.plan.tpm) * 100))
      );

      const fetchStatus = async () => {
        try {
          // Try live backend rate-limiter status endpoint
          const res = await fetch('/rate/status', { cache: 'no-store' });
          if (res.ok) {
            const data = await res.json();
            const plan = data.plans[props.planId] || PLAN_LIMITS[props.planId];
            state.value = {
              plan,
              requestsRemaining: plan.rpm,
              tokensRemaining: plan.tpm,
              activeCalls: 0,
              retryAfter: 0,
              allowed: true,
              reason: null,
            };
            return;
          }
        } catch (e) {
          // fall back to simulated local math
        }
        // Local rate-limiter math simulation (matches PlanRateLimiter)
        const plan = PLAN_LIMITS[props.planId] || PLAN_LIMITS.pro;
        const usedReq = Math.floor(Math.random() * (plan.rpm - 5));
        const usedTok = Math.floor(Math.random() * (plan.tpm - 500));
        const allowed = usedReq < plan.rpm && usedTok < plan.tpm;
        state.value = {
          plan,
          requestsRemaining: Math.max(0, plan.rpm - usedReq),
          tokensRemaining: Math.max(0, plan.tpm - usedTok),
          activeCalls: Math.floor(Math.random() * (plan.concurrent_calls + 1)),
          retryAfter: allowed ? 0 : 60,
          allowed,
          reason: allowed ? null : 'rate limit exceeded',
        };
        if (!allowed) {
          emit('limit-reached', { plan: plan.name, retryAfter: state.value.retryAfter });
        }
      };

      const tickerItems = computed(() => {
        const p = state.value.plan;
        return [
          { label: 'Plan', value: p.name, color: 'text-emerald-600' },
          { label: 'Req/min', value: `${state.value.requestsRemaining} / ${p.rpm}`, color: 'text-blue-600' },
          { label: 'Tok/min', value: `${state.value.tokensRemaining.toLocaleString()} / ${p.tpm.toLocaleString()}`, color: 'text-purple-600' },
          { label: 'Calls', value: `${state.value.activeCalls} / ${p.concurrent_calls}`, color: 'text-orange-600' },
          { label: 'FileMax', value: `${p.max_file_size_mb} MB`, color: 'text-pink-600' },
          { label: 'Status', value: state.value.allowed ? 'OK' : 'LIMITED', color: state.value.allowed ? 'text-emerald-600' : 'text-red-600' },
        ];
      });

      const tickerWidth = ref(0);
      const contentWidth = ref(0);

      onMounted(() => {
        fetchStatus();
        timer = setInterval(fetchStatus, props.intervalMs);
        // measure content width after next tick for scroll math
        requestAnimationFrame(() => {
          const el = document.querySelector('.argon-rate-ticker-content');
          if (el) contentWidth.value = el.scrollWidth;
          const wrap = document.querySelector('.argon-rate-ticker-wrap');
          if (wrap) tickerWidth.value = wrap.clientWidth;
        });
        raf = requestAnimationFrame(function scroll() {
          scrollOffset.value = (scrollOffset.value + 0.4) % Math.max(contentWidth.value, 1);
          raf = requestAnimationFrame(scroll);
        });
      });

      onUnmounted(() => {
        if (timer) clearInterval(timer);
        if (raf) cancelAnimationFrame(raf);
      });

      return {
        planName,
        requestsPct,
        tokensPct,
        tickerItems,
        scrollOffset,
        tickerWidth,
        contentWidth,
      };
    },
    template: `
      <div class="argon-rate-ticker glass-depth-1 border-l-4 border-emerald-500 mb-6 overflow-hidden" role="region" aria-label="Rate limit ticker">
        <div class="flex items-center gap-3 px-4 py-2">
          <span class="text-xs font-bold text-emerald-600 tracking-wider uppercase">ARGON RATE TICKER</span>
          <div class="flex-1 relative overflow-hidden h-6">
            <div class="absolute whitespace-nowrap" :style="{ transform: \`translateX(-\${scrollOffset}px)\` }">
              <template v-for="(item, i) in tickerItems" :key="i">
                <span class="px-3 py-1.5 text-xs font-medium rounded-full bg-white/40 border border-white/30 mx-2 animate-fade-in">
                  <span :class="item.color">{{ item.label }}</span>
                  <span class="text-slate-600 ml-1">{{ item.value }}</span>
                </span>
              </template>
            </div>
          </div>
          <span class="text-xs text-slate-400">{{ planName }} plan</span>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 px-4 pb-3">
          <div class="px-3 py-2 rounded-xl bg-white/30 border border-white/20">
            <div class="text-xs text-slate-500 uppercase tracking-wider">Requests / min</div>
            <div class="text-sm font-bold text-slate-800">{{ state.requestsRemaining }} / {{ state.plan.rpm }}</div>
            <div class="w-full bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden">
              <div class="bg-emerald-600 h-1.5 rounded-full" :style="{ width: requestsPct + '%' }"></div>
            </div>
          </div>
          <div class="px-3 py-2 rounded-xl bg-white/30 border border-white/20">
            <div class="text-xs text-slate-500 uppercase tracking-wider">Tokens / min</div>
            <div class="text-sm font-bold text-slate-800">{{ state.tokensRemaining.toLocaleString() }} / {{ state.plan.tpm.toLocaleString() }}</div>
            <div class="w-full bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden">
              <div class="bg-blue-600 h-1.5 rounded-full" :style="{ width: tokensPct + '%' }"></div>
            </div>
          </div>
          <div class="px-3 py-2 rounded-xl bg-white/30 border border-white/20">
            <div class="text-xs text-slate-500 uppercase tracking-wider">Active calls</div>
            <div class="text-sm font-bold text-slate-800">{{ state.activeCalls }} / {{ state.plan.concurrent_calls }}</div>
          </div>
          <div class="px-3 py-2 rounded-xl bg-white/30 border border-white/20">
            <div class="text-xs text-slate-500 uppercase tracking-wider">Max file</div>
            <div class="text-sm font-bold text-slate-800">{{ state.plan.max_file_size_mb }} MB</div>
          </div>
        </div>
      </div>
    `,
  };

  window.ArgonRateTicker = RateTicker;
})();
