import pytest
from app.domain import Conflict
from app.queries import answer
from app.schemas import Edge, Graph, Person


def test_query_who_is_x_to_y(demo_family, self_id):
    res = answer("Who is Raj to me?", demo_family, self_id)
    assert res["relationship"] == "first cousin"
    assert "Raj is Self's first cousin." in res["explanation"]


def test_query_who_is_x_to_myself(demo_family, self_id):
    res = answer("Who is Joseph to myself?", demo_family, self_id)
    assert res["relationship"] == "father"


def test_query_who_is_x_to_i(demo_family, self_id):
    res = answer("Who is Leena to I?", demo_family, self_id)
    assert res["relationship"] == "mother"


def test_query_how_are_x_and_y_related(demo_family, self_id):
    res = answer("How are Maya and Joseph related?", demo_family, self_id)
    # Relationship of m[2] (Joseph) to m[1] (Maya)
    assert res["relationship"] == "uncle"
    assert "Joseph is Maya's uncle." in res["explanation"]


def test_query_show_my_cousins(demo_family, self_id):
    res = answer("Show my cousins", demo_family, self_id)
    assert res["relationship"] == "family members"
    assert sorted(res["names"]) == ["Maya", "Raj"]
    assert "Maya" in res["explanation"] and "Raj" in res["explanation"]


def test_query_fathers_siblings(demo_family, self_id):
    res = answer("Who are my father's siblings?", demo_family, self_id)
    assert res["relationship"] == "family members"
    assert res["names"] == ["Thomas"]


def test_query_mothers_siblings_empty_when_none(demo_family, self_id):
    res = answer("Who are my mother's siblings?", demo_family, self_id)
    assert res["relationship"] == "family members"
    assert res["names"] == []
    assert res["explanation"] == "No matching relatives are recorded yet."


def test_query_descendants(demo_family, self_id):
    res = answer("Who are George's descendants?", demo_family, self_id)
    assert res["relationship"] == "family members"
    # George's descendants: Joseph, Thomas, Self, Raj, Maya
    assert sorted(res["names"]) == sorted(["Joseph", "Thomas", "Self", "Raj", "Maya"])


def test_query_case_insensitivity_and_punctuation(demo_family, self_id):
    res1 = answer("who is raj to me???", demo_family, self_id)
    assert res1["relationship"] == "first cousin"

    res2 = answer("SHOW MY COUSINS!", demo_family, self_id)
    assert res2["relationship"] == "family members"
    assert sorted(res2["names"]) == ["Maya", "Raj"]

    res3 = answer("how are maya and joseph related.", demo_family, self_id)
    assert res3["relationship"] == "uncle"


def test_query_multi_word_names():
    p1 = Person(id="p1", name="Mary Jane", gender="female")
    p2 = Person(id="p2", name="John Doe", gender="male")
    edge = Edge(source="p2", target="p1", type="PARENT_OF")
    graph = Graph(people=[p1, p2], edges=[edge])

    res = answer("Who is Mary Jane to John Doe?", graph, "p1")
    assert res["relationship"] == "daughter"


def test_query_ambiguous_name_raises_conflict(demo_family, self_id):
    # Add another George to the graph
    dup_george = Person(id="george-2", name="George", gender="male")
    demo_family.people.append(dup_george)

    with pytest.raises(Conflict, match="Name is ambiguous or not found"):
        answer("Who is George to me?", demo_family, self_id)


def test_query_unknown_name_raises_conflict(demo_family, self_id):
    with pytest.raises(Conflict, match="Name is ambiguous or not found"):
        answer("Who is Voldemort to me?", demo_family, self_id)


def test_query_father_siblings_without_father_recorded_raises_conflict():
    # Only self, no parents
    graph = Graph(people=[Person(id="p1", name="Me", gender="unspecified")], edges=[])
    with pytest.raises(Conflict, match="A unique parent with that role is not recorded"):
        answer("Who are my father's siblings?", graph, "p1")


def test_query_unsupported_question_syntax_returns_help(demo_family, self_id):
    res = answer("What is the weather in Paris?", demo_family, self_id)
    assert res["relationship"] == "help"
    assert res["path"] == []
    assert res["names"] == []
    assert res["steps"] == []
    assert "Ask 'Who is Raj to me?'" in res["explanation"]
