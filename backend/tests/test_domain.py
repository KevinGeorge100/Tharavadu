import pytest
from app.domain import Conflict, resolve, validate
from app.schemas import Edge, Entity, Extraction, Graph, Person


def test_validate_empty_graph():
    graph = Graph(people=[], edges=[])
    result = validate(graph)
    assert result.people == []
    assert result.edges == []


def test_validate_single_person_graph():
    p = Person(id="p1", name="Alice", gender="female")
    graph = Graph(people=[p], edges=[])
    result = validate(graph)
    assert len(result.people) == 1
    assert len(result.edges) == 0


def test_validate_normal_family_tree():
    p1 = Person(id="p1", name="Grandpa", gender="male")
    p2 = Person(id="p2", name="Dad", gender="male")
    p3 = Person(id="p3", name="Mom", gender="female")
    p4 = Person(id="p4", name="Child", gender="unspecified")
    edges = [
        Edge(source="p1", target="p2", type="PARENT_OF"),
        Edge(source="p2", target="p3", type="SPOUSE_OF"),
        Edge(source="p2", target="p4", type="PARENT_OF"),
        Edge(source="p3", target="p4", type="PARENT_OF"),
    ]
    graph = Graph(people=[p1, p2, p3, p4], edges=edges)
    result = validate(graph)
    assert len(result.people) == 4
    assert len(result.edges) == 4


def test_validate_disconnected_components():
    p1 = Person(id="p1", name="Alice", gender="female")
    p2 = Person(id="p2", name="Bob", gender="male")
    p3 = Person(id="p3", name="Carol", gender="female")
    p4 = Person(id="p4", name="Dave", gender="male")
    edges = [
        Edge(source="p1", target="p2", type="SPOUSE_OF"),
        Edge(source="p3", target="p4", type="SPOUSE_OF"),
    ]
    graph = Graph(people=[p1, p2, p3, p4], edges=edges)
    result = validate(graph)
    assert len(result.people) == 4


def test_validate_duplicate_person_identifiers():
    p1 = Person(id="dup-1", name="Alice", gender="female")
    p2 = Person(id="dup-1", name="Bob", gender="male")
    graph = Graph(people=[p1, p2], edges=[])
    with pytest.raises(Conflict, match="Duplicate person identifiers"):
        validate(graph)


def test_validate_edge_references_missing_source():
    p1 = Person(id="p1", name="Alice", gender="female")
    graph = Graph(people=[p1], edges=[Edge(source="missing-id", target="p1", type="PARENT_OF")])
    with pytest.raises(Conflict, match="A relationship references a missing person"):
        validate(graph)


def test_validate_edge_references_missing_target():
    p1 = Person(id="p1", name="Alice", gender="female")
    graph = Graph(people=[p1], edges=[Edge(source="p1", target="missing-id", type="PARENT_OF")])
    with pytest.raises(Conflict, match="A relationship references a missing person"):
        validate(graph)


def test_validate_self_relationship_rejected():
    p1 = Person(id="p1", name="Alice", gender="female")
    for edge_type in ("PARENT_OF", "SPOUSE_OF", "SIBLING_OF"):
        graph = Graph(people=[p1], edges=[Edge(source="p1", target="p1", type=edge_type)])
        with pytest.raises(Conflict, match="A person cannot have a relationship to themselves"):
            validate(graph)


def test_validate_duplicate_parent_relationship():
    p1 = Person(id="p1", name="Parent", gender="female")
    p2 = Person(id="p2", name="Child", gender="male")
    graph = Graph(
        people=[p1, p2],
        edges=[
            Edge(source="p1", target="p2", type="PARENT_OF"),
            Edge(source="p1", target="p2", type="PARENT_OF"),
        ],
    )
    with pytest.raises(Conflict, match="Duplicate relationship"):
        validate(graph)


def test_validate_duplicate_symmetric_spouse_relationship():
    p1 = Person(id="p1", name="Alice", gender="female")
    p2 = Person(id="p2", name="Bob", gender="male")
    graph = Graph(
        people=[p1, p2],
        edges=[
            Edge(source="p1", target="p2", type="SPOUSE_OF"),
            Edge(source="p2", target="p1", type="SPOUSE_OF"),
        ],
    )
    with pytest.raises(Conflict, match="Duplicate relationship"):
        validate(graph)


def test_validate_duplicate_symmetric_sibling_relationship():
    p1 = Person(id="p1", name="Alice", gender="female")
    p2 = Person(id="p2", name="Bob", gender="male")
    graph = Graph(
        people=[p1, p2],
        edges=[
            Edge(source="p1", target="p2", type="SIBLING_OF"),
            Edge(source="p2", target="p1", type="SIBLING_OF"),
        ],
    )
    with pytest.raises(Conflict, match="Duplicate relationship"):
        validate(graph)


def test_validate_direct_ancestry_cycle():
    p1 = Person(id="p1", name="Alice", gender="female")
    p2 = Person(id="p2", name="Bob", gender="male")
    graph = Graph(
        people=[p1, p2],
        edges=[
            Edge(source="p1", target="p2", type="PARENT_OF"),
            Edge(source="p2", target="p1", type="PARENT_OF"),
        ],
    )
    with pytest.raises(Conflict, match="Circular ancestry: a person cannot become their own ancestor"):
        validate(graph)


def test_validate_indirect_ancestry_cycle():
    p1 = Person(id="p1", name="A", gender="female")
    p2 = Person(id="p2", name="B", gender="female")
    p3 = Person(id="p3", name="C", gender="female")
    graph = Graph(
        people=[p1, p2, p3],
        edges=[
            Edge(source="p1", target="p2", type="PARENT_OF"),
            Edge(source="p2", target="p3", type="PARENT_OF"),
            Edge(source="p3", target="p1", type="PARENT_OF"),
        ],
    )
    with pytest.raises(Conflict, match="Circular ancestry: a person cannot become their own ancestor"):
        validate(graph)


def test_validate_deep_ancestry_cycle():
    people = [Person(id=f"p{i}", name=f"Name {i}", gender="male") for i in range(1, 6)]
    edges = [Edge(source=f"p{i}", target=f"p{i+1}", type="PARENT_OF") for i in range(1, 5)]
    edges.append(Edge(source="p5", target="p1", type="PARENT_OF"))
    graph = Graph(people=people, edges=edges)
    with pytest.raises(Conflict, match="Circular ancestry: a person cannot become their own ancestor"):
        validate(graph)


def test_validate_sibling_cannot_be_direct_ancestor():
    p1 = Person(id="p1", name="Alice", gender="female")
    p2 = Person(id="p2", name="Bob", gender="male")
    graph = Graph(
        people=[p1, p2],
        edges=[
            Edge(source="p1", target="p2", type="SIBLING_OF"),
            Edge(source="p1", target="p2", type="PARENT_OF"),
        ],
    )
    with pytest.raises(Conflict, match="A sibling cannot also be an ancestor"):
        validate(graph)


def test_validate_sibling_cannot_be_direct_ancestor_reverse():
    p1 = Person(id="p1", name="Alice", gender="female")
    p2 = Person(id="p2", name="Bob", gender="male")
    graph = Graph(
        people=[p1, p2],
        edges=[
            Edge(source="p1", target="p2", type="SIBLING_OF"),
            Edge(source="p2", target="p1", type="PARENT_OF"),
        ],
    )
    with pytest.raises(Conflict, match="A sibling cannot also be an ancestor"):
        validate(graph)


def test_validate_sibling_cannot_be_indirect_ancestor():
    p1 = Person(id="p1", name="Alice", gender="female")
    p2 = Person(id="p2", name="Bob", gender="male")
    p3 = Person(id="p3", name="Carol", gender="female")
    graph = Graph(
        people=[p1, p2, p3],
        edges=[
            Edge(source="p1", target="p2", type="SIBLING_OF"),
            Edge(source="p1", target="p3", type="PARENT_OF"),
            Edge(source="p3", target="p2", type="PARENT_OF"),
        ],
    )
    with pytest.raises(Conflict, match="A sibling cannot also be an ancestor"):
        validate(graph)


# =========================================================================
# Identity Resolution Tests (resolve)
# =========================================================================


def test_resolve_unique_new_person():
    self_person = Person(id="self-id", name="Me", gender="unspecified")
    graph = Graph(people=[self_person], edges=[])
    extraction = Extraction(
        entities=[Entity(ref="dad", name="Arthur", gender="male", existing_id=None)],
        relationships=[Edge(source="dad", target="self", type="PARENT_OF")],
        warnings=[],
    )
    updated, candidates = resolve(extraction, graph, "self-id")
    assert candidates == {}
    assert updated is not None
    assert len(updated.people) == 2
    new_person = next(p for p in updated.people if p.id != "self-id")
    assert new_person.name == "Arthur"
    assert new_person.gender == "male"
    assert len(updated.edges) == 1
    assert updated.edges[0].source == new_person.id
    assert updated.edges[0].target == "self-id"
    assert updated.edges[0].type == "PARENT_OF"


def test_resolve_maps_to_unique_existing_person():
    self_person = Person(id="self-id", name="Me", gender="unspecified")
    dad = Person(id="dad-id", name="Arthur", gender="male")
    graph = Graph(people=[self_person, dad], edges=[])
    extraction = Extraction(
        entities=[Entity(ref="art", name="arthur", gender="male", existing_id=None)],
        relationships=[Edge(source="art", target="self", type="PARENT_OF")],
        warnings=[],
    )
    updated, candidates = resolve(extraction, graph, "self-id")
    assert candidates == {}
    assert updated is not None
    assert len(updated.people) == 2  # Did not duplicate Arthur
    assert len(updated.edges) == 1
    assert updated.edges[0].source == "dad-id"
    assert updated.edges[0].target == "self-id"


def test_resolve_homonym_surfaces_candidates_and_does_not_mutate():
    self_person = Person(id="self-id", name="Me", gender="unspecified")
    g1 = Person(id="george-1", name="George", gender="male")
    g2 = Person(id="george-2", name="George", gender="male")
    graph = Graph(people=[self_person, g1, g2], edges=[])
    extraction = Extraction(
        entities=[Entity(ref="g_ref", name="George", gender="male", existing_id=None)],
        relationships=[Edge(source="g_ref", target="self", type="PARENT_OF")],
        warnings=[],
    )
    updated, candidates = resolve(extraction, graph, "self-id")
    assert updated is None
    assert "g_ref" in candidates
    assert sorted(candidates["g_ref"]) == ["george-1", "george-2"]


def test_resolve_homonym_with_suggested_id_still_requires_human_review():
    self_person = Person(id="self-id", name="Me", gender="unspecified")
    g1 = Person(id="george-1", name="George", gender="male")
    g2 = Person(id="george-2", name="George", gender="male")
    graph = Graph(people=[self_person, g1, g2], edges=[])
    # Even if model suggests existing_id="george-1", multiple homonyms prevent auto-merge
    extraction = Extraction(
        entities=[Entity(ref="g_ref", name="George", gender="male", existing_id="george-1")],
        relationships=[Edge(source="g_ref", target="self", type="PARENT_OF")],
        warnings=[],
    )
    updated, candidates = resolve(extraction, graph, "self-id")
    assert updated is None
    assert "g_ref" in candidates
    assert set(candidates["g_ref"]) == {"george-1", "george-2"}


def test_resolve_with_explicit_choice_for_homonym():
    self_person = Person(id="self-id", name="Me", gender="unspecified")
    g1 = Person(id="george-1", name="George", gender="male")
    g2 = Person(id="george-2", name="George", gender="male")
    graph = Graph(people=[self_person, g1, g2], edges=[])
    extraction = Extraction(
        entities=[Entity(ref="g_ref", name="George", gender="male", existing_id=None)],
        relationships=[Edge(source="g_ref", target="self", type="PARENT_OF")],
        warnings=[],
    )
    updated, candidates = resolve(extraction, graph, "self-id", choices={"g_ref": "george-2"})
    assert candidates == {}
    assert updated is not None
    assert len(updated.people) == 3
    assert len(updated.edges) == 1
    assert updated.edges[0].source == "george-2"


def test_resolve_with_explicit_choice_new_for_homonym():
    self_person = Person(id="self-id", name="Me", gender="unspecified")
    g1 = Person(id="george-1", name="George", gender="male")
    graph = Graph(people=[self_person, g1], edges=[])
    extraction = Extraction(
        entities=[Entity(ref="g_ref", name="George", gender="male", existing_id=None)],
        relationships=[Edge(source="g_ref", target="self", type="SIBLING_OF")],
        warnings=[],
    )
    updated, candidates = resolve(extraction, graph, "self-id", choices={"g_ref": "new"})
    assert candidates == {}
    assert updated is not None
    assert len(updated.people) == 3
    created = [p for p in updated.people if p.id not in ("self-id", "george-1")]
    assert len(created) == 1
    assert created[0].name == "George"


def test_resolve_choice_unknown_person_raises_conflict():
    self_person = Person(id="self-id", name="Me", gender="unspecified")
    graph = Graph(people=[self_person], edges=[])
    extraction = Extraction(
        entities=[Entity(ref="person_ref", name="Arthur", gender="male", existing_id=None)],
        relationships=[Edge(source="person_ref", target="self", type="PARENT_OF")],
        warnings=[],
    )
    with pytest.raises(Conflict, match="Selected identity does not belong to this family"):
        resolve(extraction, graph, "self-id", choices={"person_ref": "nonexistent-id"})


def test_resolve_model_suggested_unknown_id_raises_conflict():
    self_person = Person(id="self-id", name="Me", gender="unspecified")
    graph = Graph(people=[self_person], edges=[])
    extraction = Extraction(
        entities=[Entity(ref="person_ref", name="Arthur", gender="male", existing_id="ghost-id")],
        relationships=[Edge(source="person_ref", target="self", type="PARENT_OF")],
        warnings=[],
    )
    with pytest.raises(Conflict, match="Unknown existing identity"):
        resolve(extraction, graph, "self-id")


def test_resolve_duplicate_entity_refs_rejected():
    self_person = Person(id="self-id", name="Me", gender="unspecified")
    graph = Graph(people=[self_person], edges=[])
    extraction = Extraction(
        entities=[
            Entity(ref="ref1", name="Arthur", gender="male", existing_id=None),
            Entity(ref="ref1", name="Bob", gender="male", existing_id=None),
        ],
        relationships=[],
        warnings=[],
    )
    with pytest.raises(Conflict, match="Entity references must be unique and cannot redefine self"):
        resolve(extraction, graph, "self-id")


def test_resolve_entity_ref_self_rejected():
    self_person = Person(id="self-id", name="Me", gender="unspecified")
    graph = Graph(people=[self_person], edges=[])
    extraction = Extraction(
        entities=[Entity(ref="self", name="Me", gender="unspecified", existing_id=None)],
        relationships=[],
        warnings=[],
    )
    with pytest.raises(Conflict, match="Entity references must be unique and cannot redefine self"):
        resolve(extraction, graph, "self-id")


def test_resolve_relationship_references_unknown_ref():
    self_person = Person(id="self-id", name="Me", gender="unspecified")
    graph = Graph(people=[self_person], edges=[])
    extraction = Extraction(
        entities=[Entity(ref="p1", name="Arthur", gender="male", existing_id=None)],
        relationships=[Edge(source="p1", target="unknown_ref", type="PARENT_OF")],
        warnings=[],
    )
    with pytest.raises(Conflict, match="Relationship must reference an extracted entity or self"):
        resolve(extraction, graph, "self-id")


def test_resolve_deduplicates_existing_edges():
    self_person = Person(id="self-id", name="Me", gender="unspecified")
    dad = Person(id="dad-id", name="Arthur", gender="male")
    existing_edge = Edge(source="dad-id", target="self-id", type="PARENT_OF")
    graph = Graph(people=[self_person, dad], edges=[existing_edge])
    extraction = Extraction(
        entities=[Entity(ref="dad", name="Arthur", gender="male", existing_id="dad-id")],
        relationships=[Edge(source="dad", target="self", type="PARENT_OF")],
        warnings=[],
    )
    updated, candidates = resolve(extraction, graph, "self-id")
    assert candidates == {}
    assert updated is not None
    assert len(updated.edges) == 1


def test_resolve_validates_resulting_graph_cycle():
    self_person = Person(id="self-id", name="Me", gender="unspecified")
    dad = Person(id="dad-id", name="Arthur", gender="male")
    existing_edge = Edge(source="dad-id", target="self-id", type="PARENT_OF")
    graph = Graph(people=[self_person, dad], edges=[existing_edge])
    # Propose that Self is parent of Dad (creates cycle)
    extraction = Extraction(
        entities=[Entity(ref="dad", name="Arthur", gender="male", existing_id="dad-id")],
        relationships=[Edge(source="self", target="dad", type="PARENT_OF")],
        warnings=[],
    )
    with pytest.raises(Conflict, match="Circular ancestry: a person cannot become their own ancestor"):
        resolve(extraction, graph, "self-id")
