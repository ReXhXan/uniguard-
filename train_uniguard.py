import pandas as pd
import joblib
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

CSV = "backend/data/data.csv/data.csv"
MODEL = "backend/model/uniguard_model.pkl"

print("Reading dataset in chunks...")

DROP = [
    "Flow ID",
    "Src IP",
    "Dst IP",
    "Timestamp",
    "Traffic Type",
    "Traffic Subtype",
]

chunks = []

for chunk in pd.read_csv(CSV, chunksize=100_000):

    benign = chunk[chunk["Label"] == "Benign"]
    malicious = chunk[chunk["Label"] == "Malicious"]

    if len(benign) > 0:
        chunks.append(benign)

    # Collect roughly enough malicious examples
    if sum(len(x) for x in chunks) >= 1301:
        break

# Get all benign data
data = pd.concat(chunks, ignore_index=True)

# If first chunks don't contain all benign rows, read specifically for them
if (data["Label"] == "Benign").sum() < 1301:
    print("Collecting remaining benign rows...")

    benign_parts = []

    for chunk in pd.read_csv(
        CSV,
        chunksize=100_000,
        usecols=None
    ):
        b = chunk[chunk["Label"] == "Benign"]

        if len(b):
            benign_parts.append(b)

    benign = pd.concat(benign_parts, ignore_index=True).drop_duplicates()

else:
    benign = data[data["Label"] == "Benign"].drop_duplicates()

# Randomly select malicious rows from chunks
malicious_parts = []

for chunk in pd.read_csv(CSV, chunksize=100_000):

    m = chunk[chunk["Label"] == "Malicious"]

    if len(m):
        malicious_parts.append(m)

    if sum(len(x) for x in malicious_parts) >= 100_000:
        break

malicious_pool = pd.concat(malicious_parts, ignore_index=True)

malicious = malicious_pool.sample(
    n=len(benign),
    random_state=42
)

data = pd.concat(
    [benign, malicious],
    ignore_index=True
).drop_duplicates()

data = data.sample(
    frac=1,
    random_state=42
).reset_index(drop=True)

print("Training dataset:", data.shape)

X = data.drop(columns=DROP + ["Label"], errors="ignore")
X = X.select_dtypes(include="number")

y = (data["Label"] == "Malicious").astype(int)

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("Training XGBoost...")

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

pred = model.predict(X_test)

print("\n===== RESULTS =====")
print(classification_report(
    y_test,
    pred,
    target_names=["Benign", "Malicious"],
    digits=4
))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, pred))

joblib.dump(
    {
        "model": model,
        "features": list(X.columns)
    },
    MODEL
)

print("\nSaved:", MODEL)