import json
from pathlib import Path

def read():
    p = Path(__file__).parent / "courses.json"
    with p.open(encoding="utf-8") as f:
        d = json.load(f)
    for c in d:
        if not c.get("url", "").startswith("https://"):
            c["url"] = ""
    return d

def find(d, n):
    for c in d:
        if c["id"] == n:
            return c
    return None
