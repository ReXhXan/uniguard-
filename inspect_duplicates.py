import pandas as pd

FILE = r"backend\data\data.csv\data.csv"

usecols = [
    "Flow ID",
    "Src IP",
    "Dst IP",
    "Src Port",
    "Dst Port",
    "Protocol",
    "Timestamp",
    "Flow Duration",
    "Total Fwd Packet",
    "Total Bwd packets",
    "Label"
]

print("Reading flow information...\n")

df = pd.read_csv(FILE, usecols=usecols)

print("Total rows:", len(df))
print("Unique Flow IDs:", df["Flow ID"].nunique())

print("\n========== MOST FREQUENT FLOW IDs ==========")

counts = df["Flow ID"].value_counts()

print(counts.head(20))

print("\n========== ONE FLOW IN DETAIL ==========")

flow_id = counts.index[0]

print("Selected Flow ID:")
print(flow_id)

flow = df[df["Flow ID"] == flow_id]

print("\nOccurrences:", len(flow))
print(flow.to_string(index=False))

print("\n========== LABEL CONSISTENCY ==========")

label_counts = (
    df.groupby("Flow ID")["Label"]
    .nunique()
)

print("Flow IDs with multiple labels:", (label_counts > 1).sum())

print("\n========== EXACT DUPLICATE ROWS ==========")

print(
    "Exact duplicate rows:",
    df.duplicated().sum()
)