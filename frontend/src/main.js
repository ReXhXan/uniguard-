/**
 * UniGuard NOC — Main Entry Point
 *
 * Initializes all modules, manages the demo loop,
 * and orchestrates the flow between API → Canvas → Dashboard.
 */

import './style.css';
import { iconLogo } from './icons.js';
import { initCanvas, spawnPacket, triggerSentinelAlert, getPacketCount } from './canvas.js';
import { initDashboard, updateAnalysis, setBackendStatus, addSystemLog } from './dashboard.js';
import { generateDemoFlow, generateMaliciousFlow, predictFlow, checkBackend } from './api.js';

// ── State ──
let demoActive = false;
let demoInterval = null;
let scanCount = 0;

/**
 * Boot the application
 */
function init() {
  // Set header logo
  const logoEl = document.getElementById('header-logo');
  if (logoEl) logoEl.innerHTML = iconLogo(28);

  // Initialize canvas
  const canvasEl = document.getElementById('noc-canvas');
  if (canvasEl) initCanvas(canvasEl);

  // Initialize dashboard panels
  initDashboard();

  // Setup buttons
  const btnDemo = document.getElementById('btn-demo-toggle');
  if (btnDemo) {
    btnDemo.addEventListener('click', toggleDemo);
  }

  const btnAttack = document.getElementById('btn-attack-inject');
  if (btnAttack) {
    btnAttack.addEventListener('click', injectAttack);
  }

  // Check backend status
  checkBackendStatus();
  setInterval(checkBackendStatus, 15000);

  addSystemLog('UniGuard NOC Dashboard initialized');
  addSystemLog('Connected Network Topology: ACTIVE');
  addSystemLog('Checking backend connection…');

  // Auto-start demo mode
  setTimeout(() => {
    if (!demoActive) {
      toggleDemo();
      addSystemLog('Demo mode auto-started');
    }
  }, 1500);
}

/**
 * Check backend connectivity
 */
async function checkBackendStatus() {
  const result = await checkBackend();
  setBackendStatus(result.online);

  if (result.online) {
    addSystemLog(`Backend connected: ${result.model || 'UniGuard IDS'} (${result.features || '?'} features)`);
  }
}

/**
 * Toggle demo mode on/off
 */
function toggleDemo() {
  demoActive = !demoActive;

  const btnDemo = document.getElementById('btn-demo-toggle');
  if (btnDemo) {
    btnDemo.classList.toggle('btn-demo--active', demoActive);
  }

  if (demoActive) {
    addSystemLog('Demo mode: ACTIVE — generating synthetic network traffic');
    scheduleDemoScan();
  } else {
    addSystemLog('Demo mode: STOPPED');
    clearTimeout(demoInterval);
    demoInterval = null;
  }
}

/**
 * Schedule next demo scan
 */
function scheduleDemoScan() {
  if (!demoActive) return;

  const delay = 2000 + Math.random() * 2000;

  demoInterval = setTimeout(async () => {
    await runScan();
    scheduleDemoScan();
  }, delay);
}

/**
 * Run a scan flow
 */
async function runScan(forcedFlow = null) {
  scanCount++;

  const flowData = forcedFlow || generateDemoFlow();

  if (getPacketCount() >= 10) return;

  const result = await predictFlow(flowData);

  if (result) {
    setBackendStatus(true);
    spawnPacket(result.threat_detected);

    if (result.threat_detected) {
      triggerSentinelAlert();
    }

    updateAnalysis(result);
  } else {
    setBackendStatus(false);

    // Fallback logic if backend offline
    const isFakeThreat = forcedFlow ? true : (Math.random() < 0.2);
    const fakeProb = isFakeThreat
      ? 0.82 + Math.random() * 0.17
      : Math.random() * 0.25;

    spawnPacket(isFakeThreat);

    if (isFakeThreat) {
      triggerSentinelAlert();
    }

    updateAnalysis({
      prediction: isFakeThreat ? 'MALICIOUS' : 'BENIGN',
      malicious_probability: fakeProb,
      threat_detected: isFakeThreat,
    });
  }
}

/**
 * Manually inject a high-severity malicious attack flow
 */
async function injectAttack() {
  addSystemLog('⚡ MANUAL ATTACK INJECTION TRIGGERED BY OPERATOR');
  const attackPayload = generateMaliciousFlow();
  await runScan(attackPayload);
}

// ── Boot ──
document.addEventListener('DOMContentLoaded', init);
