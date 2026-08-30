import pandas as pd

FILE = r"backend\data\data.csv\data.csv"

print("Reading important columns...\n")

usecols = [
    "Flow ID",
    "Src IP",
    "Dst IP",
    "Src Port",
    "Dst Port",
    "Protocol",
    "Timestamp",
    "Label",
    "Traffic Type",
    "Traffic Subtype"
]

df = pd.read_csv(FILE, usecols=usecols)

print("Total rows:", len(df))

print("\n========== LABEL ==========")
print(df["Label"].value_counts())

print("\n========== BENIGN DETAILS ==========")
benign = df[df["Label"] == "Benign"]

print("Benign rows:", len(benign))
print("\nBenign traffic types:")
print(benign["Traffic Type"].value_counts())

print("\nBenign traffic subtypes:")
print(benign["Traffic Subtype"].value_counts())

print("\n========== DUPLICATE FLOW IDs ==========")
print("Duplicate Flow IDs:", df["Flow ID"].duplicated().sum())

print("\n========== PROTOCOL ==========")
print(df["Protocol"].value_counts())

print("\n========== BENIGN SAMPLE ==========")
print(benign.head(20).to_string(index=False))