/**
 * FlowDiode API Integration & Demo Traffic Generator
 */

const API_BASE = '/api';

// The 35 forward-direction features the unidirectional model expects
const FEATURES = [
  'Protocol',
  'Flow Duration',
  'Total Fwd Packet',
  'Total Length of Fwd Packet',
  'Fwd Packet Length Max',
  'Fwd Packet Length Min',
  'Fwd Packet Length Mean',
  'Fwd Packet Length Std',
  'Fwd IAT Total',
  'Fwd IAT Mean',
  'Fwd IAT Std',
  'Fwd IAT Max',
  'Fwd IAT Min',
  'Flow IAT Mean',
  'Flow IAT Std',
  'Flow IAT Max',
  'Flow IAT Min',
  'Fwd PSH Flags',
  'Fwd URG Flags',
  'Fwd Header Length',
  'Fwd Packets/s',
  'Fwd Bytes/Bulk Avg',
  'Fwd Packet/Bulk Avg',
  'Fwd Bulk Rate Avg',
  'Subflow Fwd Packets',
  'Subflow Fwd Bytes',
  'FWD Init Win Bytes',
  'Fwd Act Data Pkts',
  'Fwd Seg Size Min',
  'Active Mean',
  'Active Std',
  'Active Max',
  'Active Min',
  'Idle Mean',
  'Idle Std',
  'Idle Max',
  'Idle Min',
];

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function randInt(min, max) {
  return Math.floor(rand(min, max + 1));
}

/**
 * Generate a realistic benign-like flow (normal traffic patterns)
 */
export function generateBenignFlow() {
  const duration = rand(10000, 5000000);
  const fwdPackets = randInt(1, 50);
  const pktLenMax = rand(40, 1500);
  const pktLenMin = rand(20, Math.min(200, pktLenMax));
  const pktLenMean = (pktLenMax + pktLenMin) / 2;
  const pktLenStd = (pktLenMax - pktLenMin) / 4;

  return {
    'Protocol': randInt(6, 17), // TCP=6, UDP=17
    'Flow Duration': duration,
    'Total Fwd Packet': fwdPackets,
    'Total Length of Fwd Packet': fwdPackets * pktLenMean,
    'Fwd Packet Length Max': pktLenMax,
    'Fwd Packet Length Min': pktLenMin,
    'Fwd Packet Length Mean': pktLenMean,
    'Fwd Packet Length Std': pktLenStd,
    'Fwd IAT Total': duration * 0.9,
    'Fwd IAT Mean': duration / Math.max(fwdPackets, 1),
    'Fwd IAT Std': rand(0, duration / 4),
    'Fwd IAT Max': rand(duration / 2, duration),
    'Fwd IAT Min': rand(0, 1000),
    'Flow IAT Mean': duration / Math.max(fwdPackets, 1),
    'Flow IAT Std': rand(0, duration / 3),
    'Flow IAT Max': rand(duration / 2, duration),
    'Flow IAT Min': rand(0, 500),
    'Fwd PSH Flags': randInt(0, 1),
    'Fwd URG Flags': 0,
    'Fwd Header Length': fwdPackets * 20,
    'Fwd Packets/s': fwdPackets / (duration / 1e6),
    'Fwd Bytes/Bulk Avg': 0,
    'Fwd Packet/Bulk Avg': 0,
    'Fwd Bulk Rate Avg': 0,
    'Subflow Fwd Packets': fwdPackets,
    'Subflow Fwd Bytes': fwdPackets * pktLenMean,
    'FWD Init Win Bytes': randInt(8192, 65535),
    'Fwd Act Data Pkts': randInt(0, fwdPackets),
    'Fwd Seg Size Min': randInt(20, 40),
    'Active Mean': rand(0, 100000),
    'Active Std': rand(0, 50000),
    'Active Max': rand(0, 200000),
    'Active Min': rand(0, 50000),
    'Idle Mean': rand(0, 1000000),
    'Idle Std': rand(0, 500000),
    'Idle Max': rand(0, 2000000),
    'Idle Min': rand(0, 500000),
  };
}

/**
 * Generate a suspicious/malicious-like flow (attack patterns)
 */
export function generateMaliciousFlow() {
  const duration = rand(0, 50000); // Very short or very long
  const fwdPackets = randInt(50, 5000); // Burst of packets
  const pktLenMax = rand(40, 100); // Small uniform packets (scan/flood)
  const pktLenMin = rand(20, 40);
  const pktLenMean = (pktLenMax + pktLenMin) / 2;

  return {
    'Protocol': 6, // TCP
    'Flow Duration': duration,
    'Total Fwd Packet': fwdPackets,
    'Total Length of Fwd Packet': fwdPackets * pktLenMean,
    'Fwd Packet Length Max': pktLenMax,
    'Fwd Packet Length Min': pktLenMin,
    'Fwd Packet Length Mean': pktLenMean,
    'Fwd Packet Length Std': rand(0, 5), // Very low std — uniform packets
    'Fwd IAT Total': duration * 0.95,
    'Fwd IAT Mean': duration / Math.max(fwdPackets, 1), // Very low — rapid fire
    'Fwd IAT Std': rand(0, 10),
    'Fwd IAT Max': rand(0, 100),
    'Fwd IAT Min': 0,
    'Flow IAT Mean': duration / Math.max(fwdPackets, 1),
    'Flow IAT Std': rand(0, 10),
    'Flow IAT Max': rand(0, 100),
    'Flow IAT Min': 0,
    'Fwd PSH Flags': 0,
    'Fwd URG Flags': randInt(0, 1),
    'Fwd Header Length': fwdPackets * 20,
    'Fwd Packets/s': fwdPackets / Math.max(duration / 1e6, 0.001),
    'Fwd Bytes/Bulk Avg': 0,
    'Fwd Packet/Bulk Avg': 0,
    'Fwd Bulk Rate Avg': 0,
    'Subflow Fwd Packets': fwdPackets,
    'Subflow Fwd Bytes': fwdPackets * pktLenMean,
    'FWD Init Win Bytes': randInt(0, 1024), // Low or zero window
    'Fwd Act Data Pkts': randInt(0, 2),
    'Fwd Seg Size Min': randInt(0, 8),
    'Active Mean': rand(0, 1000),
    'Active Std': 0,
    'Active Max': rand(0, 1000),
    'Active Min': 0,
    'Idle Mean': 0,
    'Idle Std': 0,
    'Idle Max': 0,
    'Idle Min': 0,
  };
}

/**
 * Generate a random demo flow — 80% benign, 20% malicious-like
 */
export function generateDemoFlow() {
  if (Math.random() < 0.8) {
    return generateBenignFlow();
  }
  return generateMaliciousFlow();
}

/**
 * Send flow data to the backend /predict endpoint
 */
export async function predictFlow(flowData) {
  try {
    const resp = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(flowData),
    });

    if (!resp.ok) {
      console.warn(`[UniGuard] API error: ${resp.status}`);
      return null;
    }

    return await resp.json();
  } catch (err) {
    console.warn('[UniGuard] API unreachable:', err.message);
    return null;
  }
}

/**
 * Check if the backend is online
 */
export async function checkBackend() {
  try {
    const resp = await fetch(`${API_BASE}/`, { method: 'GET' });
    if (resp.ok) {
      const data = await resp.json();
      return { online: true, ...data };
    }
    return { online: false };
  } catch {
    return { online: false };
  }
}

export { FEATURES };
