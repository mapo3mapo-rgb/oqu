from flask import Flask, render_template, request
from data import read, find
from filters import select

a = Flask(__name__)

@a.context_processor
def context():
    d = []
    for c in read():
        d.append(str(c["id"]))
    return {"ids": d}

@a.route("/")
def catalog():
    c, e = select(read(), request.args)
    q = request.args.to_dict()
    if "category" in q:
        q["direction"] = q.pop("category")
    return render_template("catalog.html", c=c, q=q, e=e, saved=False)

@a.route("/saved")
def saved():
    return render_template("catalog.html", c=read(), q={}, e="", saved=True)

@a.route("/course/<int:n>")
def course(n):
    c = find(read(), n)
    if c is None:
        return render_template("error.html"), 404
    return render_template("course.html", c=c)

@a.route("/compare")
def compare():
    c = []
    d = read()
    for s in request.args.get("ids", "").split(","):
        if s.isdigit() and len(s) < 10:
            x = find(d, int(s))
            if x is not None and x not in c and len(c) < 3:
                c.append(x)
    return render_template("compare.html", c=c)

@a.errorhandler(404)
def missing(e):
    return render_template("error.html"), 404

if __name__ == "__main__":
    a.run(debug=False)
