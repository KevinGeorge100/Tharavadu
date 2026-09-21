import re

from .domain import Conflict, adjacency, relationship


def answer(text, graph, self_id):
    people = {p.id: p for p in graph.people}

    def find(name):
        if name.strip().casefold() in ("me", "myself", "i"):
            return self_id
        matches = [p.id for p in graph.people if p.name.casefold() == name.strip().casefold()]
        if len(matches) != 1:
            raise Conflict("Name is ambiguous or not found. Select people in the relationship explorer.")
        return matches[0]

    question = text.strip().rstrip("?.!")
    m = re.fullmatch(r"Who is (.+) to (.+)", question, re.IGNORECASE)
    if m:
        return relationship(graph, find(m[2]), find(m[1]))
    m = re.fullmatch(r"How are (.+) and (.+) related", question, re.IGNORECASE)
    if m:
        return relationship(graph, find(m[1]), find(m[2]))
    adj = adjacency(graph)
    selected = []
    if re.fullmatch(r"Show my cousins", question, re.IGNORECASE):
        selected = [p.id for p in graph.people if "cousin" in relationship(graph, self_id, p.id)["relationship"]]
    elif re.fullmatch(r"Who are my (father|mother)'s siblings", question, re.IGNORECASE):
        gender = "male" if "father" in question.lower() else "female"
        parents = [p for p, step in adj[self_id] if step == "U" and people[p].gender == gender]
        if len(parents) != 1:
            raise Conflict("A unique parent with that role is not recorded. Select a person to explore.")
        selected = [p for p, step in adj[parents[0]] if step == "S"]
    else:
        m = re.fullmatch(r"Who are (.+)'s descendants", question, re.IGNORECASE)
        if not m:
            return {"relationship": "help", "path": [], "names": [], "steps": [], "explanation": "Ask 'Who is Raj to me?', 'How are Maya and Joseph related?', 'Show my cousins', or 'Who are George's descendants?'. You can also select any two people below the graph."}
        todo, seen = [find(m[1])], set()
        while todo:
            for child, step in adj[todo.pop()]:
                if step == "D" and child not in seen:
                    seen.add(child)
                    todo.append(child)
        selected = sorted(seen)
    names = [people[p].name for p in sorted(set(selected))]
    return {"relationship": "family members", "path": [], "highlight": sorted(set(selected)), "names": names, "steps": [], "explanation": ", ".join(names) if names else "No matching relatives are recorded yet."}
