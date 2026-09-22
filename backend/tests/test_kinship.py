import pytest
from app.domain import Conflict, classify, relationship
from app.schemas import Edge, Graph, Person

# =========================================================================
# Unit Tests for classify(steps, gender)
# =========================================================================


def test_classify_self():
    assert classify("", "male") == "self"
    assert classify("", "female") == "self"
    assert classify("", "unspecified") == "self"


def test_classify_spouse():
    assert classify("W", "male") == "spouse"
    assert classify("W", "female") == "spouse"
    assert classify("W", "unspecified") == "spouse"


def test_classify_direct_sibling():
    assert classify("S", "male") == "brother"
    assert classify("S", "female") == "sister"
    assert classify("S", "unspecified") == "sibling"


def test_classify_direct_parent():
    assert classify("U", "male") == "father"
    assert classify("U", "female") == "mother"
    assert classify("U", "unspecified") == "parent"


def test_classify_direct_child():
    assert classify("D", "male") == "son"
    assert classify("D", "female") == "daughter"
    assert classify("D", "unspecified") == "child"


def test_classify_grandparent():
    assert classify("UU", "male") == "grandfather"
    assert classify("UU", "female") == "grandmother"
    assert classify("UU", "unspecified") == "grandparent"


def test_classify_great_grandparent():
    assert classify("UUU", "male") == "great-grandfather"
    assert classify("UUU", "female") == "great-grandmother"
    assert classify("UUU", "unspecified") == "great-grandparent"


def test_classify_great_great_grandparent():
    assert classify("UUUU", "male") == "great-great-grandfather"
    assert classify("UUUU", "female") == "great-great-grandmother"


def test_classify_grandchild():
    assert classify("DD", "male") == "grandson"
    assert classify("DD", "female") == "granddaughter"
    assert classify("DD", "unspecified") == "grandchild"


def test_classify_great_grandchild():
    assert classify("DDD", "male") == "great-grandson"
    assert classify("DDD", "female") == "great-granddaughter"
    assert classify("DDD", "unspecified") == "great-grandchild"


def test_classify_great_great_grandchild():
    assert classify("DDDD", "male") == "great-great-grandson"
    assert classify("DDDD", "female") == "great-great-granddaughter"


def test_classify_shared_parent_sibling():
    # Sibling through shared parent: U + D
    assert classify("UD", "male") == "brother"
    assert classify("UD", "female") == "sister"
    assert classify("UD", "unspecified") == "sibling"


def test_classify_uncle_aunt():
    # Parent's sibling: UUD or US
    assert classify("UUD", "male") == "uncle"
    assert classify("UUD", "female") == "aunt"
    assert classify("UUD", "unspecified") == "aunt or uncle"

    assert classify("US", "male") == "uncle"
    assert classify("US", "female") == "aunt"


def test_classify_great_uncle_aunt():
    # Grandparent's sibling: UUUD
    assert classify("UUUD", "male") == "great-uncle"
    assert classify("UUUD", "female") == "great-aunt"
    assert classify("UUUD", "unspecified") == "great-aunt or uncle"


def test_classify_great_great_uncle():
    assert classify("UUUUD", "male") == "great-great-uncle"


def test_classify_nephew_niece():
    # Sibling's child: UDD or SD
    assert classify("UDD", "male") == "nephew"
    assert classify("UDD", "female") == "niece"
    assert classify("UDD", "unspecified") == "niece or nephew"

    assert classify("SD", "male") == "nephew"
    assert classify("SD", "female") == "niece"


def test_classify_great_nephew_niece():
    # Sibling's grandchild: UDDD
    assert classify("UDDD", "male") == "great-nephew"
    assert classify("UDDD", "female") == "great-niece"
    assert classify("UDDD", "unspecified") == "great-niece or nephew"


def test_classify_great_great_nephew():
    assert classify("UDDDD", "male") == "great-great-nephew"


def test_classify_first_cousin():
    # Grandparent's grandchild (through parent's sibling): UUDD
    assert classify("UUDD", "male") == "first cousin"
    assert classify("UUDD", "female") == "first cousin"
    assert classify("UUDD", "unspecified") == "first cousin"


def test_classify_second_cousin():
    # Great-grandparent's great-grandchild: UUUDDD
    assert classify("UUUDDD", "unspecified") == "second cousin"


def test_classify_third_cousin():
    # Great-great-grandparent's: UUUUDDDD
    assert classify("UUUUDDDD", "unspecified") == "third cousin"


def test_classify_fourth_cousin():
    assert classify("UUUUUDDDDD", "unspecified") == "4th cousin"


def test_classify_cousins_removed():
    # First cousin once removed (down): UUDDD
    assert classify("UUDDD", "unspecified") == "first cousin, 1 time removed"
    # First cousin once removed (up): UUUDD
    assert classify("UUUDD", "unspecified") == "first cousin, 1 time removed"
    # First cousin twice removed: UUDDDD
    assert classify("UUDDDD", "unspecified") == "first cousin, 2 times removed"
    # Second cousin twice removed: UUUDDDDD
    assert classify("UUUDDDDD", "unspecified") == "second cousin, 2 times removed"


def test_classify_in_laws_and_spouses_of_relatives():
    # Spouse of parent
    assert classify("UW", "unspecified") == "spouse of parent"
    # Spouse of uncle/aunt (UUD + W)
    assert classify("UUDW", "unspecified") == "spouse of aunt or uncle"
    # Spouse of first cousin (UUDD + W)
    assert classify("UUDDW", "unspecified") == "spouse of first cousin"
    # Spouse of sibling (S + W)
    assert classify("SW", "unspecified") == "spouse of sibling"


def test_classify_connected_relative():
    # Complex non-standard path
    assert classify("WUW", "unspecified") == "connected relative"
    assert classify("UUDUD", "unspecified") == "connected relative"


# =========================================================================
# Integration Tests for relationship(graph, source, target)
# =========================================================================


def test_relationship_on_demo_family(demo_family, self_id):
    # Find people in demo family by name
    people_by_name = {p.name: p.id for p in demo_family.people}

    # Self to Self
    res = relationship(demo_family, self_id, self_id)
    assert res["relationship"] == "self"
    assert res["path"] == [self_id]
    assert res["steps"] == []
    assert "Self is Self's self." in res["explanation"]

    # Self to Joseph (Father)
    res = relationship(demo_family, self_id, people_by_name["Joseph"])
    assert res["relationship"] == "father"
    assert res["steps"] == ["U"]
    assert res["names"] == ["Self", "Joseph"]
    assert "Joseph is Self's parent." in res["explanation"]

    # Self to Leena (Mother)
    res = relationship(demo_family, self_id, people_by_name["Leena"])
    assert res["relationship"] == "mother"
    assert res["steps"] == ["U"]

    # Self to George (Grandfather)
    res = relationship(demo_family, self_id, people_by_name["George"])
    assert res["relationship"] == "grandfather"
    assert res["steps"] == ["U", "U"]
    assert "George is Joseph's parent" in res["explanation"]

    # Self to Anna (Grandmother)
    res = relationship(demo_family, self_id, people_by_name["Anna"])
    assert res["relationship"] == "grandmother"
    assert res["steps"] == ["U", "U"]

    # Self to Thomas (Uncle)
    res = relationship(demo_family, self_id, people_by_name["Thomas"])
    assert res["relationship"] == "uncle"

    # Self to Sara (Uncle's wife)
    res = relationship(demo_family, self_id, people_by_name["Sara"])
    assert res["relationship"] == "spouse of aunt or uncle"

    # Self to Raj (Cousin)
    res = relationship(demo_family, self_id, people_by_name["Raj"])
    assert res["relationship"] == "first cousin"

    # Self to Maya (Cousin)
    res = relationship(demo_family, self_id, people_by_name["Maya"])
    assert res["relationship"] == "first cousin"

    # Raj to Self (Reverse cousin)
    res = relationship(demo_family, people_by_name["Raj"], self_id)
    assert res["relationship"] == "first cousin"


def test_relationship_missing_source_raises_conflict(demo_family, self_id):
    with pytest.raises(Conflict, match="Person not found in this family"):
        relationship(demo_family, "unknown-source", self_id)


def test_relationship_missing_target_raises_conflict(demo_family, self_id):
    with pytest.raises(Conflict, match="Person not found in this family"):
        relationship(demo_family, self_id, "unknown-target")


def test_relationship_disconnected_persons():
    p1 = Person(id="p1", name="Alice", gender="female")
    p2 = Person(id="p2", name="Bob", gender="male")
    graph = Graph(people=[p1, p2], edges=[])
    res = relationship(graph, "p1", "p2")
    assert res["relationship"] == "not connected"
    assert res["path"] == []
    assert res["names"] == []
    assert res["steps"] == []
    assert "No relationship path is recorded yet" in res["explanation"]


def test_relationship_deep_ancestry():
    # Chain of 4 generations: Great-great-grandfather -> Great-grandfather -> Grandfather -> Father -> Me
    p_me = Person(id="p0", name="Me", gender="unspecified")
    p_dad = Person(id="p1", name="Dad", gender="male")
    p_gp = Person(id="p2", name="Grandpa", gender="male")
    p_ggp = Person(id="p3", name="GreatGrandpa", gender="male")
    p_gggp = Person(id="p4", name="GreatGreatGrandpa", gender="male")
    edges = [
        Edge(source="p1", target="p0", type="PARENT_OF"),
        Edge(source="p2", target="p1", type="PARENT_OF"),
        Edge(source="p3", target="p2", type="PARENT_OF"),
        Edge(source="p4", target="p3", type="PARENT_OF"),
    ]
    graph = Graph(people=[p_me, p_dad, p_gp, p_ggp, p_gggp], edges=edges)

    res = relationship(graph, "p0", "p4")
    assert res["relationship"] == "great-great-grandfather"
    assert res["steps"] == ["U", "U", "U", "U"]
    assert res["names"] == ["Me", "Dad", "Grandpa", "GreatGrandpa", "GreatGreatGrandpa"]

    # Reverse: Great-great-grandfather to Me
    res_rev = relationship(graph, "p4", "p0")
    assert res_rev["relationship"] == "great-great-grandchild"
    assert res_rev["steps"] == ["D", "D", "D", "D"]
