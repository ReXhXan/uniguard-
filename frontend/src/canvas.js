/**
 * UniGuard NOC Canvas — Connected Network Topology Visualization
 *
 * Renders an interconnected multi-node cybersecurity graph:
 * [Subnet Alpha / Edge Cloud / IoT] ──→ [Ingress Hub] ──→ [One-Way Gate] ──→ [AI Sentinel] ──→ [Secure Vault / SOC Console]
 */

import {
  iconServer,
  iconDiode,
  iconRadar,
  iconTerminal,
  iconCloud,
  iconChip,
  iconDatabase,
} from './icons.js';

// ── Colors ──
const C = {
  bg: '#0A0E14',
  grid: '#1A2332',
  safe: '#00D9A3',
  threat: '#FF4757',
  text: '#C8D3E0',
  textDim: '#6B7B8D',
  accent: '#4A9EFF',
};

// ── State ──
let canvas, ctx;
let W = 0,
  H = 0;
let dpr = 1;

let nodes = {}; // Map of id -> node object
let edges = []; // List of { from, to, pathPoints }
let packets = []; // List of active packet objects

const MAX_PACKETS = 10;
const PACKET_SIZE = 6;

// Pre-rendered icon bitmaps
const iconImages = {};
let iconsReady = false;

// Hover state
let hoveredNode = null;

/**
 * Initialize the canvas
 */
export function initCanvas(canvasEl) {
  canvas = canvasEl;
  ctx = canvas.getContext('2d');
  dpr = window.devicePixelRatio || 1;

  resize();
  preloadIcons();

  window.addEventListener('resize', resize);
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseleave', () => {
    hoveredNode = null;
  });

  requestAnimationFrame(loop);
}

/**
 * Handle resize
 */
function resize() {
  const container = canvas.parentElement;
  W = container.clientWidth;
  H = container.clientHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  computeTopology();
}

/**
 * Compute topology node positions & multi-branch edge paths
 */
function computeTopology() {
  const padX = Math.max(60, W * 0.08);
  const col1 = padX;
  const col2 = padX + (W - padX * 2) * 0.22;
  const col3 = W / 2; // Dead Center: Data Diode Gate
  const col4 = padX + (W - padX * 2) * 0.78;
  const col5 = W - padX;

  const topY = H * 0.22;
  const midY = H * 0.5;
  const botY = H * 0.78;

  nodes = {
    // Ingress Sources
    lan: {
      id: 'lan',
      x: col1,
      y: topY,
      type: 'terminal',
      label: 'SUBNET ALPHA',
      sublabel: 'Workstations (10.0.1.0/24)',
      color: C.text,
      tier: 'ingress',
      packetsSent: 0,
    },
    cloud: {
      id: 'cloud',
      x: col1,
      y: midY,
      type: 'cloud',
      label: 'EDGE GATEWAY',
      sublabel: 'API Ingress (AWS US-East)',
      color: C.accent,
      tier: 'ingress',
      packetsSent: 0,
    },
    iot: {
      id: 'iot',
      x: col1,
      y: botY,
      type: 'chip',
      label: 'IOT CLUSTER',
      sublabel: 'SCADA Sensors (Modbus)',
      color: C.text,
      tier: 'ingress',
      packetsSent: 0,
    },

    // Ingress Aggregator
    hub: {
      id: 'hub',
      x: col2,
      y: midY,
      type: 'server',
      label: 'INGRESS SWITCH',
      sublabel: 'Packet Aggregator',
      color: C.textDim,
      tier: 'aggregator',
    },

    // Unidirectional Data Diode Gate (Signature core)
    diode: {
      id: 'diode',
      x: col3,
      y: midY,
      type: 'diode',
      label: 'ONE-WAY GATE',
      sublabel: 'Hardware Data Diode Barrier',
      color: C.safe,
      tier: 'gate',
    },

    // AI Sentinel IDS
    sentinel: {
      id: 'sentinel',
      x: col4,
      y: midY,
      type: 'radar',
      label: 'AI SENTINEL',
      sublabel: 'XGBoost Real-time IDS',
      color: C.accent,
      tier: 'sentinel',
    },

    // Egress Destinations
    vault: {
      id: 'vault',
      x: col5,
      y: topY + 20,
      type: 'database',
      label: 'SECURE VAULT',
      sublabel: 'Encrypted DB Storage',
      color: C.safe,
      tier: 'egress',
    },
    soc: {
      id: 'soc',
      x: col5,
      y: botY - 20,
      type: 'server',
      label: 'NOC MONITOR',
      sublabel: 'SOC Operations Desk',
      color: C.safe,
      tier: 'egress',
    },
  };

  // Define connection graph edges
  edges = [
    // Ingress → Hub
    { from: 'lan', to: 'hub' },
    { from: 'cloud', to: 'hub' },
    { from: 'iot', to: 'hub' },

    // Hub → Data Diode Gate
    { from: 'hub', to: 'diode' },

    // Data Diode Gate → Sentinel
    { from: 'diode', to: 'sentinel' },

    // Sentinel → Egress Destinations
    { from: 'sentinel', to: 'vault' },
    { from: 'sentinel', to: 'soc' },
  ];
}

/**
 * Pre-render SVG icons into image bitmaps
 */
async function preloadIcons() {
  const types = [
    { key: 'server', svg: iconServer(56) },
    { key: 'diode', svg: iconDiode(64) },
    { key: 'radar', svg: iconRadar(64) },
    { key: 'terminal', svg: iconTerminal(56) },
    { key: 'cloud', svg: iconCloud(56) },
    { key: 'chip', svg: iconChip(56) },
    { key: 'database', svg: iconDatabase(56) },
  ];

  for (const { key, svg } of types) {
    const img = new Image();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    await new Promise((resolve) => {
      img.onload = () => {
        iconImages[key] = img;
        URL.revokeObjectURL(url);
        resolve();
      };
      img.onerror = resolve;
      img.src = url;
    });
  }

  iconsReady = true;
}

/**
 * Handle mouse movement for node hover details
 */
function handleMouseMove(e) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  let found = null;
  for (const key in nodes) {
    const n = nodes[key];
    const dist = Math.hypot(n.x - mouseX, n.y - mouseY);
    if (dist < 32) {
      found = n;
      break;
    }
  }

  hoveredNode = found;
  canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
}

/**
 * Spawn a packet traversing the network from an ingress node to sentinel/egress
 */
export function spawnPacket(isThreat = false) {
  if (packets.length >= MAX_PACKETS) return;

  const ingressKeys = ['lan', 'cloud', 'iot'];
  const startKey = ingressKeys[Math.floor(Math.random() * ingressKeys.length)];

  if (nodes[startKey]) {
    nodes[startKey].packetsSent = (nodes[startKey].packetsSent || 0) + 1;
  }

  // Choose end destination (vault or soc)
  const egressKeys = ['vault', 'soc'];
  const endKey = egressKeys[Math.floor(Math.random() * egressKeys.length)];

  // Route path: [startKey, 'hub', 'diode', 'sentinel', endKey]
  const pathKeys = [startKey, 'hub', 'diode', 'sentinel', endKey];

  packets.push({
    pathKeys,
    currentSegIndex: 0,
    segProgress: 0,
    speed: 0.012 + Math.random() * 0.006, // segment speed
    isThreat,
    opacity: 1,
    quarantined: false,
    gated: false,
    id: Math.random().toString(36).substring(2, 7),
  });
}

// Visual triggers
let gatePulseTimer = 0;
let sentinelAlertTimer = 0;
let threatShockwaves = []; // Shockwave ripples on threat detection

export function pulseGate() {
  gatePulseTimer = 45;
}

export function triggerSentinelAlert() {
  sentinelAlertTimer = 75;
  const s = nodes.sentinel;
  if (s) {
    threatShockwaves.push({
      x: s.x,
      y: s.y,
      r: 10,
      maxR: 90,
      opacity: 1,
    });
  }
}

// ── Rendering Loop ──
let frameCount = 0;

function loop() {
  frameCount++;
  update();
  draw();
  requestAnimationFrame(loop);
}

function update() {
  // Update packets along network graph
  for (let i = packets.length - 1; i >= 0; i--) {
    const p = packets[i];

    if (p.quarantined) {
      p.opacity -= 0.04;
      if (p.opacity <= 0) packets.splice(i, 1);
      continue;
    }

    p.segProgress += p.speed;

    if (p.segProgress >= 1) {
      p.segProgress = 0;
      p.currentSegIndex++;

      const currentNodeKey = p.pathKeys[p.currentSegIndex];

      // Diode traversal pulse
      if (currentNodeKey === 'diode' && !p.gated) {
        p.gated = true;
        pulseGate();
      }

      // Sentinel inspection point
      if (currentNodeKey === 'sentinel') {
        if (p.isThreat) {
          // Quarantine threat at sentinel! Cannot pass to vault/soc
          p.quarantined = true;
          triggerSentinelAlert();
        }
      }

      // End of route reached
      if (p.currentSegIndex >= p.pathKeys.length - 1) {
        packets.splice(i, 1);
      }
    }
  }

  // Update timers & shockwaves
  if (gatePulseTimer > 0) gatePulseTimer--;
  if (sentinelAlertTimer > 0) sentinelAlertTimer--;

  for (let i = threatShockwaves.length - 1; i >= 0; i--) {
    const sw = threatShockwaves[i];
    sw.r += 2.5;
    sw.opacity -= 0.02;
    if (sw.opacity <= 0 || sw.r >= sw.maxR) {
      threatShockwaves.splice(i, 1);
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  drawBackgroundMesh();
  drawConnectedGraphEdges();
  drawDiodeBarrierZone();
  drawShockwaves();
  drawPackets();
  drawNodes();
  drawNodeHoverTooltip();
}

/**
 * Ambient static background grid & decorative NOC target reticles
 */
function drawBackgroundMesh() {
  ctx.save();
  ctx.strokeStyle = C.grid;
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 0.14;

  const step = 44;
  for (let x = 0; x < W; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y < H; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draw connected network edges with signal pulse arrows
 */
function drawConnectedGraphEdges() {
  ctx.save();

  for (const edge of edges) {
    const n1 = nodes[edge.from];
    const n2 = nodes[edge.to];
    if (!n1 || !n2) continue;

    // Glowing connection line
    const isDiodeEdge = edge.from === 'diode' || edge.to === 'diode';

    ctx.strokeStyle = isDiodeEdge ? 'rgba(0, 217, 163, 0.4)' : C.grid;
    ctx.lineWidth = isDiodeEdge ? 2 : 1.5;
    ctx.setLineDash(isDiodeEdge ? [8, 4] : [5, 5]);

    ctx.beginPath();
    ctx.moveTo(n1.x, n1.y);
    ctx.lineTo(n2.x, n2.y);
    ctx.stroke();

    // Directional signal pulse marker along line
    ctx.setLineDash([]);
    const progress = ((frameCount * 0.015) % 1);
    const pulseX = n1.x + (n2.x - n1.x) * progress;
    const pulseY = n1.y + (n2.y - n1.y) * progress;

    ctx.fillStyle = isDiodeEdge ? C.safe : C.textDim;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

/**
 * Draw visual Data Diode unidirectional boundary line across the canvas
 */
function drawDiodeBarrierZone() {
  if (!nodes.diode) return;
  const dX = nodes.diode.x;

  ctx.save();
  ctx.strokeStyle = C.safe;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 6]);
  ctx.globalAlpha = 0.18 + Math.sin(frameCount * 0.05) * 0.06;

  // Vertical security boundary line
  ctx.beginPath();
  ctx.moveTo(dX, 20);
  ctx.lineTo(dX, H - 20);
  ctx.stroke();

  // Boundary label top & bottom
  ctx.font = '500 9px "JetBrains Mono", monospace';
  ctx.fillStyle = C.safe;
  ctx.textAlign = 'center';
  ctx.fillText('◄ UNIDIRECTIONAL DIODE BARRIER (NO RETURN FLOW) ►', dX, 14);

  ctx.restore();
}

/**
 * Draw threat shockwave ripples when threat is detected
 */
function drawShockwaves() {
  ctx.save();
  for (const sw of threatShockwaves) {
    ctx.strokeStyle = C.threat;
    ctx.lineWidth = 2;
    ctx.globalAlpha = sw.opacity;
    ctx.beginPath();
    ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Draw packets traveling across graph nodes
 */
function drawPackets() {
  ctx.save();

  for (const p of packets) {
    const fromKey = p.pathKeys[p.currentSegIndex];
    const toKey = p.pathKeys[p.currentSegIndex + 1];
    const n1 = nodes[fromKey];
    const n2 = nodes[toKey];
    if (!n1 || !n2) continue;

    const px = n1.x + (n2.x - n1.x) * p.segProgress;
    const py = n1.y + (n2.y - n1.y) * p.segProgress;

    const color = p.isThreat ? C.threat : C.safe;

    ctx.globalAlpha = p.opacity;
    ctx.shadowColor = color;
    ctx.shadowBlur = p.isThreat ? 14 : 8;

    // Draw Hexagon packet
    ctx.fillStyle = color;
    ctx.beginPath();
    drawHexagon(px, py, PACKET_SIZE);
    ctx.fill();

    // Inner detail
    ctx.fillStyle = C.bg;
    ctx.beginPath();
    drawHexagon(px, py, PACKET_SIZE * 0.4);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Draw hexagon geometry
 */
function drawHexagon(cx, cy, r) {
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

/**
 * Draw all topology nodes
 */
function drawNodes() {
  for (const key in nodes) {
    drawSingleNode(nodes[key]);
  }
}

function drawSingleNode(node) {
  const isDiode = node.type === 'diode';
  const isSentinel = node.type === 'radar';
  const isHovered = hoveredNode === node;

  const boxW = isDiode || isSentinel ? 64 : 52;
  const boxH = boxW;
  const halfW = boxW / 2;

  ctx.save();

  // Glow calculation
  let glowColor = node.color;
  let glowBlur = isHovered ? 16 : 6;

  if (isDiode && gatePulseTimer > 0) {
    glowBlur = 18 + Math.sin(frameCount * 0.2) * 6;
  }
  if (isSentinel && sentinelAlertTimer > 0) {
    glowColor = C.threat;
    glowBlur = 24 + Math.sin(frameCount * 0.3) * 10;
  }

  // Node Outer Ring / Hex Bracket
  ctx.fillStyle = C.bg;
  ctx.strokeStyle = isSentinel && sentinelAlertTimer > 0 ? C.threat : node.color;
  ctx.lineWidth = isHovered ? 2 : 1.5;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = glowBlur;

  // Render Box
  roundRect(node.x - halfW, node.y - halfW, boxW, boxH, 6);
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 0;

  // Radar Scan Sweep effect for AI Sentinel node
  if (isSentinel) {
    ctx.save();
    ctx.translate(node.x, node.y);
    ctx.rotate(frameCount * 0.04);
    ctx.strokeStyle = sentinelAlertTimer > 0 ? C.threat : C.accent;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(24, 0);
    ctx.stroke();
    ctx.restore();
  }

  // Render SVG Icon inside node
  if (iconsReady && iconImages[node.type]) {
    const iconSize = boxW * 0.65;
    ctx.drawImage(
      iconImages[node.type],
      node.x - iconSize / 2,
      node.y - iconSize / 2,
      iconSize,
      iconSize
    );
  }

  // Title Label (Space Grotesk)
  ctx.font = '600 10px "Space Grotesk", sans-serif';
  ctx.fillStyle = isHovered ? '#FFFFFF' : C.text;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(node.label, node.x, node.y + halfW + 8);

  // Sublabel (JetBrains Mono)
  ctx.font = '400 9px "JetBrains Mono", monospace';
  ctx.fillStyle = C.textDim;
  ctx.fillText(node.sublabel, node.x, node.y + halfW + 22);

  // Status Dot
  const dotColor = isSentinel && sentinelAlertTimer > 0 ? C.threat : C.safe;
  ctx.beginPath();
  ctx.arc(node.x + halfW - 4, node.y - halfW + 4, 3, 0, Math.PI * 2);
  ctx.fillStyle = dotColor;
  ctx.shadowColor = dotColor;
  ctx.shadowBlur = 4;
  ctx.fill();

  ctx.restore();
}

/**
 * Draw tooltip when hovering over a node
 */
function drawNodeHoverTooltip() {
  if (!hoveredNode) return;

  const n = hoveredNode;
  const tipW = 180;
  const tipH = 58;
  let tipX = n.x + 40;
  let tipY = n.y - 30;

  if (tipX + tipW > W) tipX = n.x - tipW - 40;

  ctx.save();
  ctx.fillStyle = 'rgba(13, 17, 23, 0.95)';
  ctx.strokeStyle = C.accent;
  ctx.lineWidth = 1;
  ctx.shadowColor = C.accent;
  ctx.shadowBlur = 8;

  roundRect(tipX, tipY, tipW, tipH, 4);
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.font = '600 10px "Space Grotesk", sans-serif';
  ctx.fillStyle = C.text;
  ctx.textAlign = 'left';
  ctx.fillText(`NODE: ${n.label}`, tipX + 8, tipY + 8);

  ctx.font = '400 9px "JetBrains Mono", monospace';
  ctx.fillStyle = C.textDim;
  ctx.fillText(`STATUS: ACTIVE (ONLINE)`, tipX + 8, tipY + 24);
  ctx.fillText(`TRAFFIC: ${n.packetsSent || Math.floor(Math.random() * 40 + 10)} PKTS/S`, tipX + 8, tipY + 38);

  ctx.restore();
}

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function getPacketCount() {
  return packets.length;
}
