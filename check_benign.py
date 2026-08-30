import pandas as pd

CSV_PATH = "backend/data/data.csv/data.csv"

print("Reading benign-related columns...")

df = pd.read_csv(
    CSV_PATH,
    usecols=[
        "Flow ID",
        "Timestamp",
        "Label",
        "Traffic Type",
        "Traffic Subtype"
    ]
)

benign = df[df["Label"] == "Benign"]

print("\n========== BENIGN SUMMARY ==========")
print("Benign rows:", len(benign))
print("Unique benign Flow IDs:", benign["Flow ID"].nunique())
print("Unique benign timestamps:", benign["Timestamp"].nunique())

print("\n========== MOST REPEATED BENIGN FLOW IDs ==========")
print(benign["Flow ID"].value_counts().head(20))