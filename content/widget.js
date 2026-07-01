// ============================================================
// titan-vip :: floating widget UI (iOS Glassmorphism Edition)
// ============================================================

(function () {
    const T = window.TitanState;
    const B = window.TitanBoard;
    const D = window.TitanDraw;
    const Eng = window.TitanEngine;

    let currentEloIndex = 0;

    function applyTheme(theme) {
        const widget = document.getElementById('titan-widget');
        if (widget) widget.setAttribute('data-theme', theme || 'dark');
    }

    function createFloatingWidget() {
        if (document.getElementById('titan-widget')) return;

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = chrome.runtime.getURL('content/widget.css');
        document.head.appendChild(link);

        const widget = document.createElement('div');
        widget.id = 'titan-widget';
        
        // Memperbarui struktur HTML untuk membuka fitur VIP dan menyesuaikan UI
        widget.innerHTML = `
            <div class="widget-status connected" id="widget-status-dot"></div>
            <div class="widget-header">
                <div class="widget-title">NVModz VIP</div>
                <button class="widget-minimize" title="Minimize">−</button>
            </div>
            <div class="widget-body">
                <div class="widget-tabs">
                    <button class="widget-tab active" data-tab="engine">Engine</button>
                    <button class="widget-tab" data-tab="info">Info</button>
                    <button class="widget-tab" data-tab="style">Style</button>
                    <button class="widget-tab" data-tab="arrow">Arrow</button>
                    <button class="widget-tab" data-tab="eval">Eval</button>
                </div>
                <div class="widget-icons">
                    <div class="widget-icon active" data-icon="engine" title="Engine">⚙️</div>
                    <div class="widget-icon" data-icon="info" title="Info">ℹ️</div>
                    <div class="widget-icon" data-icon="style" title="Style">🎨</div>
                    <div class="widget-icon" data-icon="arrow" title="Arrow">➜</div>
                    <div class="widget-icon" data-icon="eval" title="Eval">📊</div>
                </div>
                <div class="tab-content-container">
                    
                    <!-- ENGINE tab -->
                    <div class="tab-content active" data-content="engine">
                        <div class="widget-modes">
                            <button class="mode-btn threat">THREAT</button>
                            <button class="mode-btn account active">ACCOUNT</button>
                            <button class="mode-btn combat">COMBAT</button>
                        </div>
                        <div class="widget-elo">
                            <div class="elo-slider">
                                <button class="elo-arrow" data-action="first">«</button>
                                <button class="elo-arrow" data-action="prev">‹</button>
                                <div class="elo-display">
                                    <div class="elo-value" id="elo-value">1000</div>
                                    <div class="elo-label" id="elo-label" style="font-size:10px; opacity:0.7;">BRONZE</div>
                                </div>
                                <button class="elo-arrow" data-action="next">›</button>
                                <button class="elo-arrow" data-action="last">»</button>
                            </div>
                            <div class="elo-advanced" style="margin-top:8px; text-align:center;">
                                <button class="action-btn" id="advanced-btn" style="width:100%;">ADVANCED SETTINGS</button>
                            </div>
                        </div>
                        <div class="widget-actions">
                            <button class="action-btn hide" id="hide-btn">HIDE</button>
                            <button class="action-btn auto active" id="auto-btn">AUTO</button>
                            <button class="action-btn queue" id="queue-btn">QUEUE</button>
                        </div>
                    </div>

                    <!-- INFO tab -->
                    <div class="tab-content" data-content="info" style="display:none">
                        <div class="info-container">
                            <div class="info-section">
                                <div class="info-section-header">
                                    <div class="info-section-title">Engine Information</div>
                                </div>
                                <div class="info-section-body">
                                    <div class="info-row"><div class="info-label">ENGINE</div><div class="info-value highlight">STOCKFISH VIP</div></div>
                                    <div class="info-row"><div class="info-label">STATUS</div><div class="info-value" id="info-status"><span class="status-dot connected"></span><span class="status-text">Connected</span></div></div>
                                    <div class="info-row"><div class="info-label">CURRENT ELO</div><div class="info-value highlight" id="info-elo">1000</div></div>
                                </div>
                            </div>
                            <div class="info-section">
                                <div class="info-section-header">
                                    <div class="info-section-title">VIP Features</div>
                                </div>
                                <div class="info-section-body">
                                    <div class="info-row"><div class="info-label">ARROW MODE</div><div class="info-value" id="info-arrow-mode">Arrow</div></div>
                                    <div class="info-row"><div class="info-label">ARROW COLOR</div><div class="info-value" id="info-arrow-color"><span class="color-indicator" style="background:#00f2ff;"></span><span>Cyan</span></div></div>
                                    <div class="info-row"><div class="info-label">EVAL BAR</div><div class="info-value" id="info-eval-status">UNLOCKED</div></div>
                                    <div class="info-row"><div class="info-label">VERSION</div><div class="info-value">VIP v2.0</div></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- STYLE tab (VIP UNLOCKED) -->
                    <div class="tab-content" data-content="style" style="display:none">
                        <div class="arrow-section" style="padding: 12px;">
                            <div class="section-label" style="font-size: 11px; margin-bottom: 8px; color: var(--text-muted);">PLAY STYLE</div>
                            <div class="style-grid" style="display: grid; gap: 8px;">
                                <button class="action-btn style-btn active" data-style="balanced">BALANCED</button>
                                <button class="action-btn style-btn" data-style="aggressive">AGGRESSIVE</button>
                                <button class="action-btn style-btn" data-style="defensive">DEFENSIVE</button>
                            </div>
                            <div style="font-size: 10px; color: var(--text-muted); margin-top: 12px; text-align: center;">
                                Engine will prioritize moves based on selected play style.
                            </div>
                        </div>
                    </div>

                    <!-- ARROW tab -->
                    <div class="tab-content" data-content="arrow" style="display:none">
                        <div class="arrow-section" style="padding: 12px; border-bottom: 1px solid var(--border-subtle);">
                            <div class="section-label" style="font-size: 11px; margin-bottom: 8px; color: var(--text-muted);">ARROW MODE</div>
                            <div class="arrow-mode-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                                <button class="action-btn arrow-mode-card" data-mode="highlight">HIGHLIGHT</button>
                                <button class="action-btn arrow-mode-card active" data-mode="arrow">ARROW</button>
                            </div>
                        </div>
                        <div class="arrow-section" style="padding: 12px;">
                            <div class="section-label" style="font-size: 11px; margin-bottom: 8px; color: var(--text-muted);">ARROW COLOR</div>
                            <div class="arrow-color-grid" style="display: flex; justify-content: space-between;">
                                <div class="arrow-color-card selected" data-color="#00f2ff" style="width:24px; height:24px; border-radius:50%; background:#00f2ff; cursor:pointer;"></div>
                                <div class="arrow-color-card" data-color="#00ff88" style="width:24px; height:24px; border-radius:50%; background:#00ff88; cursor:pointer;"></div>
                                <div class="arrow-color-card" data-color="#ff00ff" style="width:24px; height:24px; border-radius:50%; background:#ff00ff; cursor:pointer;"></div>
                                <div class="arrow-color-card" data-color="#ffff00" style="width:24px; height:24px; border-radius:50%; background:#ffff00; cursor:pointer;"></div>
                                <div class="arrow-color-card" data-color="#ff8800" style="width:24px; height:24px; border-radius:50%; background:#ff8800; cursor:pointer;"></div>
                            </div>
                        </div>
                    </div>

                    <!-- EVAL tab (VIP UNLOCKED) -->
                    <div class="tab-content" data-content="eval" style="display:none">
                        <div class="eval-section" style="padding: 12px; border-bottom: 1px solid var(--border-subtle);">
                            <div class="section-label" style="font-size: 11px; margin-bottom: 8px; color: var(--text-muted);">EVALUATION BAR</div>
                            <div class="eval-toggle-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                                <button class="action-btn eval-toggle-card active" data-eval="false">OFF</button>
                                <button class="action-btn eval-toggle-card" data-eval="true">ON</button>
                            </div>
                        </div>
                        <div class="eval-section" style="padding: 12px;">
                            <div class="section-label" style="font-size: 11px; margin-bottom: 8px; color: var(--text-muted);">THEME</div>
                            <div class="theme-grid-compact" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                                <button class="action-btn theme-card active" data-theme="dark">DARK</button>
                                <button class="action-btn theme-card" data-theme="light">LIGHT</button>
                                <button class="action-btn theme-card" data-theme="purple">PURPLE</button>
                                <button class="action-btn theme-card" data-theme="green">GREEN</button>
                                <button class="action-btn theme-card" data-theme="orange">ORANGE</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bottom Toolbar -->
                <div class="widget-toolbar" style="display: flex; justify-content: space-around; padding: 10px; background: var(--bg-input);">
                    <div class="tool-icon" data-tool="highlight" title="Highlight Mode" style="cursor:pointer;">🔆</div>
                    <div class="tool-icon active" data-tool="arrow" title="Arrow Mode" style="cursor:pointer;">➜</div>
                    <div class="tool-icon" data-tool="color" title="Arrow Color" style="cursor:pointer;">🎨</div>
                    <div class="tool-icon" data-tool="eval" title="Eval Bar Toggle" style="cursor:pointer;">📊</div>
                    <div class="tool-icon" data-tool="settings" title="Settings" style="cursor:pointer;">⚙️</div>
                </div>
            </div>
            
            <!-- Advanced Settings Overlay -->
            <div class="widget-advanced" id="widget-advanced" style="display: none; position: absolute; top:0; left:0; width:100%; height:100%; background: var(--bg-primary); backdrop-filter: blur(25px); z-index: 10;">
                <div class="advanced-header" style="display:flex; justify-content:space-between; padding: 14px;">
                    <div class="advanced-title" style="font-weight: bold;">ADVANCED SETTINGS</div>
                    <button class="advanced-close" style="background:transparent; border:none; color:var(--text-primary); cursor:pointer; font-size:18px;">×</button>
                </div>
                <div class="advanced-body" style="padding: 14px;">
                    <p style="font-size:12px; color:var(--text-muted);">VIP Features fully unlocked.</p>
                </div>
            </div>
        `;
        document.body.appendChild(widget);
        makeWidgetDraggable();
        setupWidgetEvents();
        loadWidgetSettings();
    }

    function makeWidgetDraggable() {
        const widget = document.getElementById('titan-widget');
        const header = widget.querySelector('.widget-header');
        let isDragging = false, startX, startY, startLeft, startTop;

        function onStart(x, y) {
            isDragging = true;
            widget.classList.add('dragging');
            const rect = widget.getBoundingClientRect();
            startX = x; startY = y;
            startLeft = rect.left; startTop = rect.top;
        }

        function onMove(x, y) {
            if (!isDragging) return;
            widget.style.left = (startLeft + x - startX) + 'px';
            widget.style.top = (startTop + y - startY) + 'px';
            widget.style.right = 'auto';
        }

        function onEnd() {
            if (isDragging) { isDragging = false; widget.classList.remove('dragging'); }
        }

        header.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('widget-minimize')) return;
            onStart(e.clientX, e.clientY);
            e.preventDefault();
        });
        document.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
        document.addEventListener('mouseup', onEnd);

        header.addEventListener('touchstart', (e) => {
            if (e.target.classList.contains('widget-minimize')) return;
            const touch = e.touches[0];
            onStart(touch.clientX, touch.clientY);
            e.preventDefault();
        }, { passive: false });
        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const touch = e.touches[0];
            onMove(touch.clientX, touch.clientY);
            e.preventDefault();
        }, { passive: false });
        document.addEventListener('touchend', onEnd);
    }

    function setupWidgetEvents() {
        const widget = document.getElementById('titan-widget');

        function updateEloDisplay() {
            const eloValue = widget.querySelector('#elo-value');
            const eloLabel = widget.querySelector('#elo-label');
            if (eloValue) eloValue.textContent = Eng.ELO_LEVELS[currentEloIndex];
            if (eloLabel) eloLabel.textContent = Eng.ELO_LABELS[currentEloIndex];
            Eng.setElo(String(Eng.ELO_LEVELS[currentEloIndex]));
            chrome.storage.local.set({ elo: String(Eng.ELO_LEVELS[currentEloIndex]) });
            D.clearArrows();
            T.currentFen = '';
            updateInfoDisplay();
        }

        widget.querySelectorAll('.elo-arrow').forEach(arrow => {
            arrow.addEventListener('click', function () {
                const action = this.dataset.action;
                if (action === 'first') currentEloIndex = 0;
                else if (action === 'prev') currentEloIndex = Math.max(0, currentEloIndex - 1);
                else if (action === 'next') currentEloIndex = Math.min(Eng.ELO_LEVELS.length - 1, currentEloIndex + 1);
                else if (action === 'last') currentEloIndex = Eng.ELO_LEVELS.length - 1;
                updateEloDisplay();
            });
        });

        widget.querySelector('.widget-minimize').addEventListener('click', () => widget.classList.toggle('minimized'));

        const hideBtn = widget.querySelector('#hide-btn');
        if (hideBtn) hideBtn.addEventListener('click', () => widget.classList.add('hidden'));

        const autoBtn = widget.querySelector('#auto-btn');
        if (autoBtn) autoBtn.addEventListener('click', function () {
            this.classList.toggle('active');
            showStatusNotification(this.classList.contains('active') ? 'AUTO: ON' : 'AUTO: OFF');
        });

        widget.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const mode = this.classList.contains('combat') ? 'combat' :
                             this.classList.contains('threat') ? 'threat' : 'account';
                widget.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                T.currentMode = mode;
                T.combatMode = (mode === 'combat');
                if (T.combatMode) {
                    Eng.applyCombatConfig();
                    showStatusNotification('COMBAT MODE: ON');
                } else if (mode === 'threat') {
                    showStatusNotification('THREAT MODE');
                } else {
                    Eng.setElo(T.currentElo);
                    showStatusNotification('ACCOUNT MODE');
                }
                D.clearArrows();
                T.currentFen = '';
                chrome.storage.local.set({ engineMode: mode });
            });
        });

        const queueBtn = widget.querySelector('#queue-btn');
        if (queueBtn) queueBtn.addEventListener('click', function () {
            T.queueMode = !T.queueMode;
            this.classList.toggle('active', T.queueMode);
            T.moveQueue = [];
            updateQueueDisplay();
            showStatusNotification(T.queueMode ? 'QUEUE: ON' : 'QUEUE: OFF');
            chrome.storage.local.set({ queueMode: T.queueMode });
        });

        widget.querySelectorAll('.widget-tab').forEach(tab => {
            tab.addEventListener('click', function () {
                const tabName = this.dataset.tab;
                widget.querySelectorAll('.widget-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                widget.querySelectorAll('.widget-icon').forEach(i => { i.classList.remove('active'); if (i.dataset.icon === tabName) i.classList.add('active'); });
                widget.querySelectorAll('.tab-content').forEach(c => { c.classList.remove('active'); c.style.display = 'none'; if (c.dataset.content === tabName) { c.classList.add('active'); c.style.display = 'block'; } });
            });
        });

        widget.querySelectorAll('.widget-icon[data-icon]').forEach(icon => {
            icon.addEventListener('click', function () {
                const iconName = this.dataset.icon;
                widget.querySelectorAll('.widget-icon').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                widget.querySelectorAll('.widget-tab').forEach(t => { t.classList.remove('active'); if (t.dataset.tab === iconName) t.classList.add('active'); });
                widget.querySelectorAll('.tab-content').forEach(c => { c.classList.remove('active'); c.style.display = 'none'; if (c.dataset.content === iconName) { c.classList.add('active'); c.style.display = 'block'; } });
            });
        });

        // VIP FEATURE: Style Toggle
        widget.querySelectorAll('.style-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                widget.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const style = this.dataset.style;
                // Asumsi ada variabel T.playStyle di engine Anda
                T.playStyle = style; 
                chrome.storage.local.set({ playStyle: style });
                showStatusNotification(`STYLE: ${style.toUpperCase()}`);
            });
        });

        widget.querySelectorAll('.tool-icon[data-tool]').forEach(icon => {
            icon.addEventListener('click', function () {
                const tool = this.dataset.tool;
                if (tool === 'highlight' || tool === 'arrow') {
                    widget.querySelectorAll('.tool-icon[data-tool="highlight"], .tool-icon[data-tool="arrow"]').forEach(i => i.classList.remove('active'));
                    this.classList.add('active');
                    T.arrowMode = tool === 'arrow' ? 'arrow' : 'highlight';
                    chrome.storage.local.set({ arrowMode: T.arrowMode });
                    showStatusNotification(`ARROW MODE: ${T.arrowMode.toUpperCase()}`);
                    if (T.arrows.length) D.draw(true);
                    updateInfoDisplay();
                } else if (tool === 'eval') {
                    // VIP FEATURE UNLOCKED: Toggle Eval Bar dari Toolbar
                    T.showEval = !T.showEval;
                    chrome.storage.local.set({ showEval: T.showEval });
                    showStatusNotification(T.showEval ? 'EVAL BAR: ON' : 'EVAL BAR: OFF');
                    
                    widget.querySelectorAll('.eval-toggle-card').forEach(c => c.classList.remove('active'));
                    const evalCard = widget.querySelector(`.eval-toggle-card[data-eval="${T.showEval}"]`);
                    if (evalCard) evalCard.classList.add('active');
                } else if (tool === 'color') {
                    const colors = ['#00f2ff', '#00ff88', '#ff00ff', '#ffff00', '#ff8800'];
                    const names = ['CYAN', 'GREEN', 'MAGENTA', 'YELLOW', 'ORANGE'];
                    const idx = colors.indexOf(T.arrowColor);
                    const next = (idx + 1) % colors.length;
                    T.arrowColor = colors[next];
                    chrome.storage.local.set({ arrowColor: T.arrowColor });
                    
                    widget.querySelectorAll('.arrow-color-card').forEach(c => c.classList.remove('selected'));
                    const colorCard = widget.querySelector(`.arrow-color-card[data-color="${T.arrowColor}"]`);
                    if (colorCard) colorCard.classList.add('selected');
                    
                    showStatusNotification(`ARROW COLOR: ${names[next]}`);
                    if (T.arrows.length) D.draw(true);
                    updateInfoDisplay();
                } else if (tool === 'theme' || tool === 'settings') {
                    const panel = widget.querySelector('#widget-advanced');
                    if (panel) panel.style.display = 'block';
                }
            });
        });

        const advClose = widget.querySelector('.advanced-close');
        if (advClose) advClose.addEventListener('click', () => widget.querySelector('#widget-advanced').style.display = 'none');
        const advBtn = widget.querySelector('#advanced-btn');
        if (advBtn) advBtn.addEventListener('click', () => widget.querySelector('#widget-advanced').style.display = 'block');

        widget.querySelectorAll('.theme-card').forEach(card => {
            card.addEventListener('click', function () {
                const theme = this.dataset.theme;
                widget.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                chrome.storage.local.set({ theme });
                applyTheme(theme);
                showStatusNotification(`THEME: ${theme.toUpperCase()}`);
            });
        });

        widget.querySelectorAll('.arrow-mode-card').forEach(card => {
            card.addEventListener('click', function () {
                T.arrowMode = this.dataset.mode;
                widget.querySelectorAll('.arrow-mode-card').forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                widget.querySelectorAll('.tool-icon[data-tool="highlight"], .tool-icon[data-tool="arrow"]').forEach(i => i.classList.remove('active'));
                const toolIcon = widget.querySelector(`.tool-icon[data-tool="${T.arrowMode}"]`);
                if (toolIcon) toolIcon.classList.add('active');
                chrome.storage.local.set({ arrowMode: T.arrowMode });
                showStatusNotification(`ARROW MODE: ${T.arrowMode.toUpperCase()}`);
                if (T.arrows.length) D.draw(true);
                updateInfoDisplay();
            });
        });

        widget.querySelectorAll('.arrow-color-card').forEach(card => {
            card.addEventListener('click', function () {
                T.arrowColor = this.dataset.color;
                widget.querySelectorAll('.arrow-color-card').forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');
                chrome.storage.local.set({ arrowColor: T.arrowColor });
                const names = { '#00f2ff': 'CYAN', '#00ff88': 'GREEN', '#ff00ff': 'MAGENTA', '#ffff00': 'YELLOW', '#ff8800': 'ORANGE' };
                showStatusNotification(`ARROW COLOR: ${names[T.arrowColor] || 'CUSTOM'}`);
                if (T.arrows.length) D.draw(true);
                updateInfoDisplay();
            });
        });

        // VIP FEATURE UNLOCKED: Eval toggle cards
        widget.querySelectorAll('.eval-toggle-card').forEach(card => {
            card.addEventListener('click', function() {
                const evalStatus = this.dataset.eval === 'true';
                T.showEval = evalStatus;
                widget.querySelectorAll('.eval-toggle-card').forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                chrome.storage.local.set({ showEval: T.showEval });
                showStatusNotification(T.showEval ? 'EVAL BAR: ON' : 'EVAL BAR: OFF');
            });
        });
    }

    function loadWidgetSettings() {
        chrome.storage.local.get(['elo', 'arrowMode', 'arrowColor', 'theme', 'engineMode', 'queueMode', 'showEval', 'playStyle'], (result) => {
            const widget = document.getElementById('titan-widget');
            if (!widget) return;

            if (result.elo) {
                const idx = Eng.ELO_LEVELS.indexOf(parseInt(result.elo));
                if (idx !== -1) {
                    currentEloIndex = idx;
                    const v = widget.querySelector('#elo-value'), l = widget.querySelector('#elo-label');
                    if (v) v.textContent = Eng.ELO_LEVELS[idx];
                    if (l) l.textContent = Eng.ELO_LABELS[idx];
                }
            }

            if (result.arrowMode) {
                T.arrowMode = result.arrowMode;
                widget.querySelectorAll('.tool-icon[data-tool="highlight"], .tool-icon[data-tool="arrow"]').forEach(i => i.classList.remove('active'));
                const toolIcon = widget.querySelector(`.tool-icon[data-tool="${result.arrowMode}"]`);
                if (toolIcon) toolIcon.classList.add('active');
                const modeCard = widget.querySelector(`.arrow-mode-card[data-mode="${result.arrowMode}"]`);
                if (modeCard) { widget.querySelectorAll('.arrow-mode-card').forEach(c => c.classList.remove('active')); modeCard.classList.add('active'); }
            }

            if (result.arrowColor) {
                T.arrowColor = result.arrowColor;
                const colorCard = widget.querySelector(`.arrow-color-card[data-color="${result.arrowColor}"]`);
                if (colorCard) { widget.querySelectorAll('.arrow-color-card').forEach(c => c.classList.remove('selected')); colorCard.classList.add('selected'); }
            }

            if (result.engineMode) {
                T.currentMode = result.engineMode;
                T.combatMode = (result.engineMode === 'combat');
                widget.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                const modeBtn = widget.querySelector(`.mode-btn.${result.engineMode}`);
                if (modeBtn) modeBtn.classList.add('active');
                if (T.combatMode && T.engineReady) Eng.applyCombatConfig();
            }

            if (result.queueMode) {
                T.queueMode = result.queueMode;
                const qBtn = widget.querySelector('#queue-btn');
                if (qBtn) qBtn.classList.toggle('active', T.queueMode);
                updateQueueDisplay();
            }

            if (result.showEval !== undefined) {
                T.showEval = result.showEval;
                const evalCard = widget.querySelector(`.eval-toggle-card[data-eval="${T.showEval}"]`);
                if (evalCard) {
                    widget.querySelectorAll('.eval-toggle-card').forEach(c => c.classList.remove('active'));
                    evalCard.classList.add('active');
                }
            }

            if (result.playStyle) {
                T.playStyle = result.playStyle;
                const styleBtn = widget.querySelector(`.style-btn[data-style="${result.playStyle}"]`);
                if (styleBtn) {
                    widget.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
                    styleBtn.classList.add('active');
                }
            }

            const theme = result.theme || 'dark';
            applyTheme(theme);
            const themeCard = widget.querySelector(`.theme-card[data-theme="${theme}"]`);
            if (themeCard) { widget.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active')); themeCard.classList.add('active'); }

            updateInfoDisplay();
        });
    }

    function updateStatus(connected) {
        const widget = document.getElementById('titan-widget');
        if (!widget) return;
        const dot = widget.querySelector('#widget-status-dot');
        if (dot) dot.classList.toggle('connected', connected);
        const statusDot = widget.querySelector('#info-status .status-dot');
        const statusText = widget.querySelector('#info-status .status-text');
        if (statusDot) statusDot.classList.toggle('connected', connected);
        if (statusText) statusText.textContent = connected ? 'Connected' : 'Disconnected';
    }

    function showStatusNotification(text) {
        const existing = document.querySelector('.status-notification');
        if (existing) existing.remove();
        const el = document.createElement('div');
        el.className = 'status-notification';
        el.innerHTML = `<div class="status-notification-text">${text}</div>`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2000);
    }

    function updateInfoDisplay() {
        const widget = document.getElementById('titan-widget');
        if (!widget) return;
        const infoElo = widget.querySelector('#info-elo');
        if (infoElo) infoElo.textContent = Eng.ELO_LEVELS[currentEloIndex];
        const infoMode = widget.querySelector('#info-arrow-mode');
        if (infoMode) infoMode.textContent = T.arrowMode === 'arrow' ? 'Arrow' : 'Highlight';
        const infoColor = widget.querySelector('#info-arrow-color');
        if (infoColor) {
            const names = { '#00f2ff': 'Cyan', '#00ff88': 'Green', '#ff00ff': 'Magenta', '#ffff00': 'Yellow', '#ff8800': 'Orange' };
            infoColor.innerHTML = `<span class="color-indicator" style="background:${T.arrowColor};"></span><span>${names[T.arrowColor] || 'Custom'}</span>`;
        }
    }

    function updateQueueDisplay() {
        const widget = document.getElementById('titan-widget');
        if (!widget) return;
        const queueBtn = widget.querySelector('#queue-btn');
        if (queueBtn) queueBtn.textContent = T.queueMode ? `QUEUE (${T.moveQueue.length})` : 'QUEUE';
    }

    window.TitanWidget = {
        createFloatingWidget, updateStatus, showStatusNotification,
        updateInfoDisplay, updateQueueDisplay
    };
})();
