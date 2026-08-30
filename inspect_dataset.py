import pandas as pd
from pathlib import Path

print("Searching for CSV files...\n")

csv_files = [
    f for f in Path("backend/data").rglob("*.csv")
    if f.is_file()
]

if not csv_files:
    print("❌ No CSV files found.")
    exit()

print("CSV files found:")

for i, f in enumerate(csv_files, 1):
    print(f"{i}. {f}")

file = csv_files[0]

print("\n----------------------------------------")
print("Inspecting:", file)
print("----------------------------------------")

# Read only 1000 rows
df = pd.read_csv(file, nrows=1000)

print("\nSample shape:")
print(df.shape)

print("\nNumber of columns:", len(df.columns))

print("\nColumns:")
for i, col in enumerate(df.columns, 1):
    print(f"{i:2}. {col}")

print("\nFirst 5 rows:")
print(df.head())

print("\nData types:")
print(df.dtypes)