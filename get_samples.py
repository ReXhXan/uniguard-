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

# If your label column isn't literally "Label", change this
label_col = "Label"

chunks = pd.read_csv(path, usecols=features + [label_col], chunksize=200000)

benign_row, malicious_row = None, None
for chunk in chunks:
    if benign_row is None:
        b = chunk[chunk[label_col].astype(str).str.contains("Benign", case=False, na=False)]
        if len(b): benign_row = b.iloc[0]
    if malicious_row is None:
        m = chunk[~chunk[label_col].astype(str).str.contains("Benign", case=False, na=False)]
        if len(m): malicious_row = m.iloc[0]
    if benign_row is not None and malicious_row is not None:
        break

print("BENIGN sample:")
print(json.dumps(benign_row[features].to_dict(), indent=2))
print("\nMALICIOUS sample:")
print(json.dumps(malicious_row[features].to_dict(), indent=2))