import pandas as pd
import joblib

from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

CSV_PATH = "backend/data/data.csv/data.csv"
MODEL_PATH = "backend/model/uniguard_unidirectional.pkl"

# ---------------------------------------------------------
# FEATURES AVAILABLE FROM THE FORWARD / OBSERVED DIRECTION
# ---------------------------------------------------------
FEATURES = [
    "Protocol",

    "Flow Duration",

    "Total Fwd Packet",
    "Total Length of Fwd Packet",

    "Fwd Packet Length Max",
    "Fwd Packet Length Min",
    "Fwd Packet Length Mean",
    "Fwd Packet Length Std",

    "Flow IAT Mean",
    "Flow IAT Std",
    "Flow IAT Max",
    "Flow IAT Min",

    "Fwd IAT Total",
    "Fwd IAT Mean",
    "Fwd IAT Std",
    "Fwd IAT Max",
    "Fwd IAT Min",

    "Fwd PSH Flags",
    "Fwd URG Flags",

    "Fwd Header Length",

    "Fwd Packets/s",

    "Fwd Bytes/Bulk Avg",
    "Fwd Packet/Bulk Avg",
    "Fwd Bulk Rate Avg",

    "Subflow Fwd Packets",
    "Subflow Fwd Bytes",

    "FWD Init Win Bytes",

    "Fwd Act Data Pkts",
    "Fwd Seg Size Min",

    "Active Mean",
    "Active Std",
    "Active Max",
    "Active Min",

    "Idle Mean",
    "Idle Std",
    "Idle Max",
    "Idle Min",

    "Label"
]

print("Loading required columns...")

df = pd.read_csv(
    CSV_PATH,
    usecols=FEATURES
)

print("Original shape:", df.shape)

# Remove exact duplicate rows
df = df.drop_duplicates()

print("After duplicate removal:", df.shape)

# ---------------------------------------------------------
# BALANCE DATASET
# ---------------------------------------------------------

benign = df[df["Label"] == "Benign"]
malicious = df[df["Label"] == "Malicious"]

print("\nBenign available:", len(benign))
print("Malicious available:", len(malicious))

# Use equal number of malicious and benign samples
malicious = malicious.sample(
    n=len(benign),
    random_state=42
)

data = pd.concat(
    [benign, malicious],
    ignore_index=True
)

# Shuffle
data = data.sample(
    frac=1,
    random_state=42
).reset_index(drop=True)

print("Final balanced dataset:", data.shape)

# ---------------------------------------------------------
# FEATURES / LABEL
# ---------------------------------------------------------

X = data.drop(columns=["Label"])
y = (data["Label"] == "Malicious").astype(int)

print("Number of features:", X.shape[1])

# ---------------------------------------------------------
# TRAIN / TEST SPLIT
# ---------------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("Training rows:", len(X_train))
print("Testing rows:", len(X_test))

# ---------------------------------------------------------
# XGBOOST
# ---------------------------------------------------------

print("\nTraining UniGuard unidirectional model...")

model = XGBClassifier(
    n_estimators=150,
    max_depth=6,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
    eval_metric="logloss",
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

# ---------------------------------------------------------
# RESULTS
# ---------------------------------------------------------

pred = model.predict(X_test)

print("\n========== UNIDIRECTIONAL RESULTS ==========")

print(
    classification_report(
        y_test,
        pred,
        target_names=["Benign", "Malicious"],
        digits=4
    )
)

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, pred))

# ---------------------------------------------------------
# SAVE MODEL
# ---------------------------------------------------------

joblib.dump(
    {
        "model": model,
        "features": list(X.columns)
    },
    MODEL_PATH
)

print("\nModel saved:")
print(MODEL_PATH)