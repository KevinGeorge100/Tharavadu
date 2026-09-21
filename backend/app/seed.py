from .database import uid
from .schemas import Edge, Graph, Person


def demo_graph(self_id, name):
    records = [("George", "male"), ("Anna", "female"), ("Joseph", "male"), ("Leena", "female"), ("Thomas", "male"), ("Sara", "female"), ("Raj", "unspecified"), ("Maya", "unspecified")]
    people = [Person(id=self_id, name=name)] + [Person(id=uid(), name=n, gender=g) for n, g in records]
    ids = {p.name: p.id for p in people}
    edges = []
    for parent, child in [("George", "Joseph"), ("Anna", "Joseph"), ("George", "Thomas"), ("Anna", "Thomas"), ("Joseph", name), ("Leena", name), ("Thomas", "Raj"), ("Thomas", "Maya"), ("Sara", "Raj"), ("Sara", "Maya")]:
        edges.append(Edge(source=ids[parent], target=ids[child], type="PARENT_OF"))
    for a, b in [("George", "Anna"), ("Joseph", "Leena"), ("Thomas", "Sara")]:
        edges.append(Edge(source=ids[a], target=ids[b], type="SPOUSE_OF"))
    return Graph(people=people, edges=edges)
