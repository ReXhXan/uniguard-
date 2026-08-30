import pandas as pd
import json

path = "backend/data/data.csv/data.csv"
features = ['Protocol', 'Flow Duration', 'Total Fwd Packet', 'Total Length of Fwd Packet',
    'Fwd Packet Length Max', 'Fwd Packet Length Min', 'Fwd Packet Length Mean',
    'Fwd Packet Length Std', 'Flow IAT Mean', 'Flow IAT Std', 'Flow IAT Max', 'Flow IAT Min',
    'Fwd IAT Total', 'Fwd IAT Mean', 'Fwd IAT Std', 'Fwd IAT Max', 'Fwd IAT Min',
    'Fwd PSH Flags', 'Fwd URG Flags', 'Fwd Header Length', 'Fwd Packets/s',
    'Fwd Bytes/Bulk Avg', 'Fwd Packet/Bulk Avg', 'Fwd Bulk Rate Avg', 'Subflow Fwd Packets',
    'Subflow Fwd Bytes', 'FWD Init Win Bytes', 'Fwd Act Data Pkts', 'Fwd Seg Size Min',
    'Active Mean', 'Active Std', 'Active Max', 'Active Min', 'Idle Mean', 'Idle Std',
    'Idle Max', 'Idle Min']

label_col = "Label"

chunks = pd.read_csv(path, usecols=features + [label_col], chunksize=200000)

malicious_rows = []
for chunk in chunks:
    m = chunk[~chunk[label_col].astype(str).str.contains("Benign", case=False, na=False)]
    if len(m):
        malicious_rows.append(m.iloc[0])
        malicious_rows.append(m.iloc[len(m)//2])
    if len(malicious_rows) >= 10:
        break

rows = malicious_rows[:10]
payloads = [row[features].to_dict() for row in rows]

with open("malicious_samples.json", "w") as f:
    json.dump(payloads, f, indent=2)

print(f"Saved {len(payloads)} malicious samples to malicious_samples.json")