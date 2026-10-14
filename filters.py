def price(c):
    return c["price"]

def select(d, q):
    c = []
    v = q.get("category", q.get("direction", ""))
    e = ""
    s = q.get("search", "").strip().lower()
    b = q.get("budget", "").strip()
    n = None
    if b:
        if b.isdigit() and len(b) <= 9:
            n = int(b)
        else:
            e = "Укажите целый бюджет от 0 до 999 999 999 тенге."
    for x in d:
        t = x["title"] + " " + x["school"] + " " + x["subject"]
        if s and s not in t.lower():
            continue
        if v and x["direction"] != v:
            continue
        if q.get("format") and x["format"] != q.get("format"):
            continue
        if q.get("type") and x["type"] != q.get("type"):
            continue
        if n is not None and x["price"] > n:
            continue
        c.append(x)
    if q.get("sort") == "cheap":
        c.sort(key=price)
    elif q.get("sort") == "expensive":
        c.sort(key=price, reverse=True)
    return c, e
