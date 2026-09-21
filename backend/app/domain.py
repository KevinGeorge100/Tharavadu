"""Pure graph validation, resolution and deterministic kinship reasoning."""
from collections import defaultdict, deque
from uuid import uuid4

from .schemas import Edge, Extraction, Graph, Person


class Conflict(ValueError):
    pass


def key(edge: Edge):
    a, b = edge.source, edge.target
    if edge.type != "PARENT_OF":
        a, b = sorted((a, b))
    return a, b, edge.type


def validate(graph: Graph):
    ids = {p.id for p in graph.people}
    if len(ids) != len(graph.people):
        raise Conflict("Duplicate person identifiers")
    children = defaultdict(set)
    seen = set()
    for e in graph.edges:
        if e.source not in ids or e.target not in ids:
            raise Conflict("A relationship references a missing person")
        if e.source == e.target:
            raise Conflict("A person cannot have a relationship to themselves")
        if key(e) in seen:
            raise Conflict("Duplicate relationship")
        seen.add(key(e))
        if e.type == "PARENT_OF":
            children[e.source].add(e.target)
    visiting, complete = set(), set()

    def visit(person):
        if person in visiting:
            raise Conflict("Circular ancestry: a person cannot become their own ancestor")
        if person in complete:
            return
        visiting.add(person)
        for child in children[person]:
            visit(child)
        visiting.remove(person)
        complete.add(person)

    for person in ids:
        visit(person)
    for e in graph.edges:
        if e.type == "SIBLING_OF":
            for a, b in ((e.source, e.target), (e.target, e.source)):
                queue, reached = [a], set()
                while queue:
                    n = queue.pop()
                    if n == b:
                        raise Conflict("A sibling cannot also be an ancestor")
                    if n not in reached:
                        reached.add(n)
                        queue.extend(children[n])
    return graph


def resolve(extraction: Extraction, graph: Graph, self_id: str, choices=None):
    choices = choices or {}
    refs, candidates, new_people = {"self": self_id}, {}, []
    people = {p.id: p for p in graph.people}
    names = defaultdict(list)
    for p in graph.people:
        names[p.name.casefold()].append(p.id)
    entity_refs = [e.ref for e in extraction.entities]
    if len(entity_refs) != len(set(entity_refs)) or "self" in entity_refs:
        raise Conflict("Entity references must be unique and cannot redefine self")
    for entity in extraction.entities:
        matches = names[entity.name.casefold()]
        selected = choices.get(entity.ref)
        if selected == "new":
            matches = []
        elif selected:
            if selected not in people:
                raise Conflict("Selected identity does not belong to this family")
            matches = [selected]
        elif entity.existing_id:
            if entity.existing_id not in people:
                raise Conflict("Unknown existing identity")
            # Model-suggested identity still requires review; never auto-merge homonyms.
            if len(matches) <= 1:
                matches = [entity.existing_id]
        if len(matches) > 1:
            candidates[entity.ref] = matches
        elif matches:
            refs[entity.ref] = matches[0]
        else:
            person = Person(id=str(uuid4()), name=entity.name, gender=entity.gender)
            new_people.append(person)
            refs[entity.ref] = person.id
    if candidates:
        return None, candidates
    result = graph.model_copy(deep=True)
    result.people.extend(new_people)
    seen = {key(e) for e in result.edges}
    for e in extraction.relationships:
        if e.source not in refs or e.target not in refs:
            raise Conflict("Relationship must reference an extracted entity or self")
        mapped = Edge(source=refs[e.source], target=refs[e.target], type=e.type)
        if key(mapped) not in seen:
            result.edges.append(mapped)
            seen.add(key(mapped))
    return validate(Graph.model_validate(result.model_dump())), {}


def adjacency(graph: Graph):
    adj = defaultdict(set)
    children = defaultdict(set)
    for e in graph.edges:
        if e.type == "PARENT_OF":
            adj[e.source].add((e.target, "D"))
            adj[e.target].add((e.source, "U"))
            children[e.source].add(e.target)
        else:
            label = "S" if e.type == "SIBLING_OF" else "W"
            adj[e.source].add((e.target, label))
            adj[e.target].add((e.source, label))
    for siblings in children.values():
        for a in siblings:
            for b in siblings - {a}:
                adj[a].add((b, "S"))
    return adj


def classify(steps: str, gender: str):
    def sex(male, female, neutral):
        return male if gender == "male" else female if gender == "female" else neutral
    if not steps:
        return "self"
    if steps == "W":
        return "spouse"
    if steps == "S":
        return sex("brother", "sister", "sibling")
    if set(steps) == {"U"}:
        root = sex("father", "mother", "parent") if len(steps) == 1 else sex("grandfather", "grandmother", "grandparent")
        return "great-" * max(0, len(steps) - 2) + root
    if set(steps) == {"D"}:
        root = sex("son", "daughter", "child") if len(steps) == 1 else sex("grandson", "granddaughter", "grandchild")
        return "great-" * max(0, len(steps) - 2) + root
    # Expand a known sibling assertion to its equivalent shared-parent shape.
    canonical = steps.replace("S", "UD")
    up = len(canonical) - len(canonical.lstrip("U"))
    down = len(canonical) - up
    if up and down and canonical == "U" * up + "D" * down:
        if up == down == 1:
            return sex("brother", "sister", "sibling")
        if down == 1:
            return "great-" * (up - 2) + sex("uncle", "aunt", "aunt or uncle")
        if up == 1:
            return "great-" * (down - 2) + sex("nephew", "niece", "niece or nephew")
        degree, removed = min(up, down) - 1, abs(up - down)
        ordinal = {1: "first", 2: "second", 3: "third"}.get(degree, f"{degree}th")
        return f"{ordinal} cousin" + (f", {removed} {'time' if removed == 1 else 'times'} removed" if removed else "")
    if steps.endswith("W") and "W" not in steps[:-1]:
        return f"spouse of {classify(steps[:-1], 'unspecified')}"
    return "connected relative"


def relationship(graph: Graph, source: str, target: str):
    people = {p.id: p for p in graph.people}
    if source not in people or target not in people:
        raise Conflict("Person not found in this family")
    adj = adjacency(graph)
    queue = deque([(source, [source], "")])
    visited = {source}
    while queue:
        current, path, steps = queue.popleft()
        if current == target:
            label = classify(steps, people[target].gender)
            terms = {"U": "parent", "D": "child", "S": "sibling", "W": "spouse"}
            names = [people[p].name for p in path]
            evidence = "; ".join(f"{names[i+1]} is {names[i]}'s {terms[s]}" for i, s in enumerate(steps))
            return {"relationship": label, "path": path, "names": names,
                    "steps": list(steps), "explanation": f"{names[-1]} is {names[0]}'s {label}." + (f" {evidence}." if evidence else "")}
        for nxt, step in sorted(adj[current]):
            if nxt not in visited:
                visited.add(nxt)
                queue.append((nxt, path + [nxt], steps + step))
    return {"relationship": "not connected", "path": [], "names": [], "steps": [],
            "explanation": "No relationship path is recorded yet. Add more family knowledge."}
