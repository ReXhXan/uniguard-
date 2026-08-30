/**
 * FlowDiode NOC Dashboard — Panel Controllers
 *
 * Manages the four status panels: System Status, Traffic Monitor,
 * Analysis Result, and Event Log.
 */

// ── State ──
let totalPackets = 0;
let totalThreats = 0;
let totalBenign = 0;
let startTime = Date.now();
let backendOnline = false;

// ── DOM refs (set during init) ──
let els = {};

/**
 * Initialize dashboard panel DOM references
 */
export function initDashboard() {
  els = {
    // System Status
    sysStatus:    document.getElementById('sys-status'),
    sysUptime:    document.getElementById('sys-uptime'),
    sysBackend:   document.getElementById('sys-backend'),

    // Analysis Result
    verdict:      document.querySelector('#analysis-verdict .verdict-label'),
    probBar:      document.getElementById('prob-bar'),
    probValue:    document.getElementById('prob-value'),
    featureList:  document.getElementById('feature-list'),

    // Traffic Monitor
    statPackets:  document.getElementById('stat-packets'),
    statThreats:  document.getElementById('stat-threats'),
    statBenign:   document.getElementById('stat-benign'),
    statRatio:    document.getElementById('stat-ratio'),
    statLastScan: document.getElementById('stat-last-scan'),
    gaugeBar:     document.getElementById('threat-gauge-bar'),
    gaugeLabel:   document.getElementById('threat-gauge-label'),

    // Event Log
    logEntries:   document.getElementById('log-entries'),

    // Header
    clock:        document.getElementById('header-clock'),
    statusDot:    document.getElementById('status-dot'),
    statusLabel:  document.getElementById('status-label'),

    // Panel indicators
    panelSystemInd:   document.getElementById('panel-system-indicator'),
    panelAnalysisInd: document.getElementById('panel-analysis-indicator'),
    panelTrafficInd:  document.getElementById('panel-traffic-indicator'),
    panelLogInd:      document.getElementById('panel-log-indicator'),
  };

  // Start clock
  updateClock();
  setInterval(updateClock, 1000);

  // Start uptime counter
  setInterval(updateUptime, 1000);
}

/**
 * Update the header clock
 */
function updateClock() {
  if (!els.clock) return;
  const now = new Date();
  els.clock.textContent = now.toLocaleTimeString('en-GB', { hour12: false });
}

/**
 * Update the uptime display
 */
function updateUptime() {
  if (!els.sysUptime) return;
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
  const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
  const s = String(elapsed % 60).padStart(2, '0');
  els.sysUptime.textContent = `${h}:${m}:${s}`;
}

/**
 * Format current time for log entries
 */
function timeStamp() {
  return new Date().toLocaleTimeString('en-GB', { hour12: false });
}

/**
 * Set backend online/offline status
 */
export function setBackendStatus(online) {
  backendOnline = online;
  if (!els.sysBackend) return;

  if (online) {
    els.sysBackend.textContent = 'CONNECTED';
    els.sysBackend.className = 'stat-value stat-value--safe';
  } else {
    els.sysBackend.textContent = 'OFFLINE';
    els.sysBackend.className = 'stat-value stat-value--threat';
  }
}

/**
 * Update dashboard with a new analysis result
 */
export function updateAnalysis(result) {
  if (!result) return;

  totalPackets++;
  const isThreat = result.threat_detected;

  if (isThreat) {
    totalThreats++;
  } else {
    totalBenign++;
  }

  const prob = result.malicious_probability;
  const label = result.prediction;

  // ── Update verdict ──
  if (els.verdict) {
    els.verdict.textContent = label;
    els.verdict.className = 'verdict-label ' +
      (isThreat ? 'verdict--malicious' : 'verdict--benign');
  }

  // ── Update probability bar ──
  if (els.probBar) {
    const pct = Math.min(prob * 100, 100);
    els.probBar.style.width = pct + '%';
    els.probBar.className = 'prob-bar' + (prob > 0.5 ? ' prob-bar--danger' : '');
  }

  if (els.probValue) {
    els.probValue.textContent = prob.toFixed(4);
    els.probValue.style.color = isThreat ? '#FF4757' : '#C8D3E0';
  }

  // ── Update scan info ──
  if (els.featureList) {
    els.featureList.innerHTML = `
      <span class="feature-item">SCAN #${String(totalPackets).padStart(4, '0')}</span>
      <span class="feature-item">CONFIDENCE: ${((1 - Math.abs(prob - 0.5) * 2) * 100).toFixed(1)}%</span>
      <span class="feature-item">VERDICT: ${label}</span>
    `;
  }

  // ── Update traffic stats ──
  if (els.statPackets) {
    els.statPackets.textContent = totalPackets.toLocaleString();
  }
  if (els.statThreats) {
    els.statThreats.textContent = totalThreats.toLocaleString();
  }
  if (els.statBenign) {
    els.statBenign.textContent = totalBenign.toLocaleString();
  }
  if (els.statRatio) {
    const ratio = totalPackets > 0 ? (totalThreats / totalPackets * 100) : 0;
    els.statRatio.textContent = ratio.toFixed(2) + '%';
    els.statRatio.style.color = ratio > 20 ? '#FF4757' : ratio > 5 ? '#FFC107' : '#C8D3E0';
  }
  if (els.statLastScan) {
    els.statLastScan.textContent = timeStamp();
  }

  // ── Update threat gauge ──
  const threatRatio = totalPackets > 0 ? totalThreats / totalPackets : 0;
  if (els.gaugeBar) {
    els.gaugeBar.style.width = Math.min(threatRatio * 100 * 3, 100) + '%'; // scaled ×3 for visibility
  }
  if (els.gaugeLabel) {
    let level, levelClass;
    if (threatRatio < 0.05) {
      level = 'NOMINAL';
      levelClass = 'gauge-label gauge-label--low';
    } else if (threatRatio < 0.2) {
      level = 'ELEVATED';
      levelClass = 'gauge-label gauge-label--medium';
    } else {
      level = 'CRITICAL';
      levelClass = 'gauge-label gauge-label--high';
    }
    els.gaugeLabel.textContent = level;
    els.gaugeLabel.className = levelClass;
  }

  // ── Update header status ──
  if (isThreat) {
    setSystemAlert(true);
  }

  // ── Add log entry ──
  addLogEntry(isThreat, totalPackets, label, prob);
}

/**
 * Set system to alert or normal state (header + panel indicators)
 */
let alertTimeout = null;

function setSystemAlert(alert) {
  if (alert) {
    if (els.statusDot) {
      els.statusDot.className = 'status-dot status-dot--alert';
    }
    if (els.statusLabel) {
      els.statusLabel.textContent = 'THREAT DETECTED';
      els.statusLabel.className = 'status-label status-label--alert';
    }
    if (els.sysStatus) {
      els.sysStatus.textContent = 'ALERT';
      els.sysStatus.className = 'stat-value stat-value--threat';
    }

    // Reset after 4 seconds
    clearTimeout(alertTimeout);
    alertTimeout = setTimeout(() => setSystemAlert(false), 4000);
  } else {
    if (els.statusDot) {
      els.statusDot.className = 'status-dot status-dot--online';
    }
    if (els.statusLabel) {
      els.statusLabel.textContent = 'OPERATIONAL';
      els.statusLabel.className = 'status-label';
    }
    if (els.sysStatus) {
      els.sysStatus.textContent = 'ONLINE';
      els.sysStatus.className = 'stat-value stat-value--safe';
    }
  }
}

/**
 * Add a new entry to the event log
 */
const MAX_LOG_ENTRIES = 50;

function addLogEntry(isThreat, scanNum, label, prob) {
  if (!els.logEntries) return;

  const entry = document.createElement('div');
  entry.className = `log-entry ${isThreat ? 'log-entry--threat' : 'log-entry--safe'} animate-in`;

  const scanId = String(scanNum).padStart(4, '0');
  const probStr = prob.toFixed(3);
  const alertStr = isThreat ? '  ⚠ ALERT' : '';

  entry.innerHTML = `
    <span class="log-time">${timeStamp()}</span>
    <span class="log-msg">SCAN #${scanId}  ${label.padEnd(9)}  prob=${probStr}${alertStr}</span>
  `;

  els.logEntries.appendChild(entry);

  // Trim old entries
  while (els.logEntries.children.length > MAX_LOG_ENTRIES) {
    els.logEntries.removeChild(els.logEntries.firstChild);
  }

  // Auto-scroll
  els.logEntries.scrollTop = els.logEntries.scrollHeight;
}

/**
 * Add a system info log entry
 */
export function addSystemLog(message) {
  if (!els.logEntries) return;

  const entry = document.createElement('div');
  entry.className = 'log-entry log-entry--info animate-in';
  entry.innerHTML = `
    <span class="log-time">${timeStamp()}</span>
    <span class="log-msg">${message}</span>
  `;

  els.logEntries.appendChild(entry);
  els.logEntries.scrollTop = els.logEntries.scrollHeight;
}

/**
 * Get current stats (for external use)
 */
export function getStats() {
  return {
    totalPackets,
    totalThreats,
    totalBenign,
    backendOnline,
  };
}
