import json
import requests

with open("malicious_samples.json") as f:
    samples = json.load(f)

correct = 0
for i, s in enumerate(samples):
    r = requests.post("http://127.0.0.1:5000/predict", json=s)
    result = r.json()
    is_correct = result.get("prediction") == "MALICIOUS"
    correct += is_correct
    print(f"Sample {i+1}: {result.get('prediction')} (prob={result.get('malicious_probability')}) {'✓' if is_correct else '✗ MISSED'}")

print(f"\n{correct}/{len(samples)} malicious samples correctly detected")