/* =============================================================================
   Xcode Remote Studio - Dashboard JavaScript
   Handles tab switching, VNC connection, terminal emulation, and build controls
   ============================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // Loading Screen
    // =========================================================================
    const loadingOverlay = document.getElementById('loadingOverlay');
    setTimeout(() => {
        loadingOverlay.classList.add('hidden');
    }, 3000);

    // =========================================================================
    // Tab Navigation
    // =========================================================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;

            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetContent = document.getElementById(
                'content' + targetTab.charAt(0).toUpperCase() + targetTab.slice(1)
            );
            if (targetContent) targetContent.classList.add('active');
        });
    });

    // =========================================================================
    // VNC Connection
    // =========================================================================
    const btnConnect = document.getElementById('btnConnect');
    const btnDisconnect = document.getElementById('btnDisconnect');
    const vncFrame = document.getElementById('vncFrame');
    const vncPlaceholder = document.getElementById('vncPlaceholder');
    const connectionInfo = document.getElementById('connectionInfo');
    const vncStatusDot = document.getElementById('vncStatus');

    btnConnect.addEventListener('click', () => {
        // Connect to noVNC - adjust path based on deployment
        const vncUrl = window.location.origin + '/vnc.html?autoconnect=true&resize=scale';
        vncFrame.src = vncUrl;
        vncFrame.classList.remove('hidden');
        vncPlaceholder.classList.add('hidden');
        connectionInfo.textContent = 'Connected';
        connectionInfo.style.color = '#30D158';
        vncStatusDot.classList.add('connected');
        vncStatusDot.classList.remove('disconnected');
    });

    btnDisconnect.addEventListener('click', () => {
        vncFrame.src = '';
        vncFrame.classList.add('hidden');
        vncPlaceholder.classList.remove('hidden');
        connectionInfo.textContent = 'Disconnected';
        connectionInfo.style.color = '#FF453A';
        vncStatusDot.classList.remove('connected');
        vncStatusDot.classList.add('disconnected');
    });

    // Fullscreen
    document.getElementById('btnFullscreen').addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen();
        }
    });

    // =========================================================================
    // Session Timer
    // =========================================================================
    const timerDisplay = document.getElementById('timerDisplay');
    let sessionStartTime = Date.now();
    // Default 4 hours session
    let sessionDuration = 4 * 60 * 60 * 1000;

    function updateTimer() {
        const elapsed = Date.now() - sessionStartTime;
        const remaining = Math.max(0, sessionDuration - elapsed);
        const hours = Math.floor(remaining / 3600000);
        const mins = Math.floor((remaining % 3600000) / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        timerDisplay.textContent =
            `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

        if (remaining <= 0) {
            timerDisplay.textContent = '00:00:00';
            timerDisplay.style.color = '#FF453A';
        }
    }

    setInterval(updateTimer, 1000);
    updateTimer();

    // =========================================================================
    // Terminal Emulation (Simple)
    // =========================================================================
    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.getElementById('terminalOutput');

    const terminalCommands = {
        'help': 'Available commands: help, clear, xcodebuild, swift, ls, pwd, whoami, uname, date, sysinfo',
        'clear': '__CLEAR__',
        'xcodebuild -version': 'Xcode 16.2\nBuild version 16C5032a',
        'swift --version': 'Apple Swift version 6.0.3 (swiftlang-6.0.3.1.10 clang-1600.0.30.1)',
        'ls': 'Desktop  Documents  Downloads  Library  Movies  Music  Pictures  XcodeProjects',
        'pwd': '/Users/runner',
        'whoami': 'runner',
        'uname -a': 'Darwin Mac-1234567890AB.local 23.6.0 Darwin Kernel Version 23.6.0 root:xnu-10063.141.2~1/RELEASE_ARM64_T6020 arm64',
        'date': new Date().toString(),
        'sysinfo': '🍎 macOS 14.6 (Sonoma)\n🧠 Apple M2 Pro\n💾 16 GB RAM\n📱 Xcode 16.2\n🐍 Python 3.12\n📦 Node 22.x\n🔧 CocoaPods 1.15',
    };

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = terminalInput.value.trim();
            if (!cmd) return;

            // Add command line
            const cmdLine = document.createElement('div');
            cmdLine.className = 'line';
            cmdLine.innerHTML = `<span class="prompt">runner@mac ~ %</span><span class="text">${escapeHtml(cmd)}</span>`;
            terminalOutput.appendChild(cmdLine);

            // Process command
            const response = terminalCommands[cmd];
            if (response === '__CLEAR__') {
                terminalOutput.innerHTML = '';
            } else if (response) {
                response.split('\n').forEach(line => {
                    const outputLine = document.createElement('div');
                    outputLine.className = 'line output';
                    outputLine.textContent = line;
                    terminalOutput.appendChild(outputLine);
                });
            } else {
                const errLine = document.createElement('div');
                errLine.className = 'line output';
                errLine.textContent = `bash: ${cmd.split(' ')[0]}: command simulated — use VNC Desktop for real terminal`;
                terminalOutput.appendChild(errLine);
            }

            terminalInput.value = '';
            terminalOutput.parentElement.scrollTop = terminalOutput.parentElement.scrollHeight;
        }
    });

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // =========================================================================
    // Build Controls
    // =========================================================================
    const btnBuild = document.getElementById('btnBuild');
    const btnClean = document.getElementById('btnClean');
    const btnTest = document.getElementById('btnTest');
    const btnClearLog = document.getElementById('btnClearLog');
    const buildLog = document.getElementById('buildLog');
    const buildStatusEl = document.getElementById('buildStatus');

    function addLogLine(text, type = 'info') {
        const line = document.createElement('div');
        line.className = `log-line ${type}`;
        line.textContent = text;
        buildLog.appendChild(line);
        buildLog.scrollTop = buildLog.scrollHeight;
    }

    function simulateBuild() {
        buildStatusEl.textContent = 'Building';
        buildStatusEl.className = 'build-status building';
        buildLog.innerHTML = '';

        const project = document.getElementById('buildProjectPath').value || 'MyiOSApp.xcodeproj';
        const scheme = document.getElementById('buildScheme').value || 'MyiOSApp';
        const config = document.getElementById('buildConfig').value;
        const platform = document.getElementById('buildPlatform').value;
        const device = document.getElementById('buildDevice').value;

        const steps = [
            { text: `▸ Preparing build for ${scheme} (${config})...`, type: 'info', delay: 0 },
            { text: `▸ Target: ${platform} — ${device}`, type: 'info', delay: 400 },
            { text: '▸ Compiling Swift sources...', type: 'info', delay: 800 },
            { text: '  ✓ ContentView.swift', type: 'success', delay: 1200 },
            { text: `  ✓ ${scheme}App.swift`, type: 'success', delay: 1500 },
            { text: '▸ Linking...', type: 'info', delay: 2000 },
            { text: '▸ Copying resources...', type: 'info', delay: 2500 },
            { text: '▸ Code signing...', type: 'info', delay: 3000 },
            { text: '▸ Building for simulator...', type: 'info', delay: 3500 },
            { text: '', type: 'info', delay: 4000 },
            { text: '✅ BUILD SUCCEEDED', type: 'success', delay: 4200 },
            { text: `   ${scheme}.app built successfully`, type: 'success', delay: 4400 },
            { text: '   Use the VNC Desktop to view the simulator', type: 'info', delay: 4600 },
        ];

        steps.forEach(step => {
            setTimeout(() => {
                addLogLine(step.text, step.type);
                if (step.text === '✅ BUILD SUCCEEDED') {
                    buildStatusEl.textContent = 'Success';
                    buildStatusEl.className = 'build-status success';
                }
            }, step.delay);
        });
    }

    btnBuild.addEventListener('click', simulateBuild);

    btnClean.addEventListener('click', () => {
        buildLog.innerHTML = '';
        addLogLine('🧹 Clean build folder...', 'info');
        setTimeout(() => addLogLine('✅ Build folder cleaned', 'success'), 800);
        buildStatusEl.textContent = 'Idle';
        buildStatusEl.className = 'build-status idle';
    });

    btnTest.addEventListener('click', () => {
        buildLog.innerHTML = '';
        buildStatusEl.textContent = 'Testing';
        buildStatusEl.className = 'build-status building';
        const testSteps = [
            { text: '🧪 Running tests...', type: 'info', delay: 0 },
            { text: '  Test Suite: All Tests', type: 'info', delay: 500 },
            { text: '  ✓ testContentViewExists (0.012s)', type: 'success', delay: 1200 },
            { text: '  ✓ testAppLaunch (0.145s)', type: 'success', delay: 1800 },
            { text: '', type: 'info', delay: 2200 },
            { text: '✅ All tests passed (2/2)', type: 'success', delay: 2400 },
        ];
        testSteps.forEach(step => {
            setTimeout(() => {
                addLogLine(step.text, step.type);
                if (step.text.includes('All tests passed')) {
                    buildStatusEl.textContent = 'Tests Passed';
                    buildStatusEl.className = 'build-status success';
                }
            }, step.delay);
        });
    });

    btnClearLog.addEventListener('click', () => {
        buildLog.innerHTML = '';
        addLogLine('Log cleared.', 'info');
    });

    // =========================================================================
    // Auto-connect VNC on load (optional)
    // =========================================================================
    // Uncomment below to auto-connect:
    // setTimeout(() => btnConnect.click(), 3500);
});
