import pandas as pd

FILE = r"backend\data\data.csv\data.csv"

print("Reading Label, Traffic Type and Traffic Subtype...\n")

df = pd.read_csv(
    FILE,
    usecols=["Label", "Traffic Type", "Traffic Subtype"]
)

print("Rows:", len(df))

print("\n========== LABEL ==========")
print(df["Label"].value_counts(dropna=False))

print("\n========== TRAFFIC TYPE ==========")
print(df["Traffic Type"].value_counts(dropna=False))

print("\n========== TRAFFIC SUBTYPE ==========")
print(df["Traffic Subtype"].value_counts(dropna=False))