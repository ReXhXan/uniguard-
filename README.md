# FlowDiode — Unidirectional Network Intrusion Detection System (IDS)

FlowDiode is an AI-powered Unidirectional Intrusion Detection System built with an XGBoost machine learning core, Flask REST API backend, and a Network Operations Center (NOC) dashboard visualizing real-time connected network traffic passing through a hardware Data Diode.

## 🚀 Features

- **XGBoost Unidirectional Model**: Trained on forward-direction flow features (35 CICFlowMeter-style parameters) to detect malicious network intrusions.
- **Hardware Data Diode Visualizer**: Central one-way gate ensuring strict unidirectional physical/logical network isolation.
- **Connected Network Topology Dashboard**: Interactive graph rendering ingress subnets (Workstations, Cloud Edge, SCADA IoT Cluster), packet aggregator hub, AI Sentinel IDS node, and high-security egress destinations (Secure Vault DB, SOC Desk).
- **Interactive Operator Controls**:
  - **Inject Attack Vector**: Manually trigger high-severity malicious attack payloads to test real-time AI Sentinel threat detection, quarantine animations, and alert logs.
  - **Demo Mode**: Real-time synthetic traffic simulator.
  - **Node Hover Tooltip**: Live packet rate and status inspection per node.
- **NOC Dark Aesthetic**: Built adhering to dark terminal palette (`#0A0E14` background, `#00D9A3` safe green, `#FF4757` threat red, `#4A9EFF` electric blue AI accent) with monospace typography (`JetBrains Mono`).

---

## 🛠️ Project Structure

```
flowdiode/
├── backend/
│   ├── app/
│   │   └── app.py              # Flask REST API server (/predict)
│   ├── model/                  # Trained XGBoost model binaries (.pkl)
│   └── data/                   # Dataset & sample flows
├── frontend/
│   ├── index.html              # Dashboard HTML structure
│   ├── vite.config.js          # Vite dev server with Flask proxy
│   └── src/
│       ├── style.css           # NOC design system & HUD tokens
│       ├── canvas.js           # HTML5 Canvas multi-node graph renderer
│       ├── icons.js            # Custom SVG line-art network icons
│       ├── dashboard.js        # Panel readouts, syslog & threat gauge
│       ├── api.js              # Backend integration & flow generators
│       └── main.js             # Orchestrator & attack injector
├── train_unidirectional.py     # Model training pipeline script
└── README.md
```

---

## 🚦 Getting Started

### 1. Backend Setup

```bash
cd backend
python -m venv .venv
# Activate environment (Windows: .venv\Scripts\activate, Unix: source .venv/bin/activate)
pip install flask xgboost pandas scikit-learn joblib flask-cors
python app/app.py
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.
