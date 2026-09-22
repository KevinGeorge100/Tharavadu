import sys
from pathlib import Path

import pytest

# Ensure backend root is in sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.schemas import Edge, Graph, Person
from app.seed import demo_graph


@pytest.fixture
def self_id() -> str:
    return "person-self"


@pytest.fixture
def demo_family(self_id: str) -> Graph:
    """Returns the standard 8-person demo family graph."""
    return demo_graph(self_id, "Self")


@pytest.fixture
def person_factory():
    def _create(
        id: str,
        name: str,
        gender: str = "unspecified",
        birth_date=None,
        death_date=None,
        notes: str = "",
    ) -> Person:
        return Person(
            id=id,
            name=name,
            gender=gender,
            birth_date=birth_date,
            death_date=death_date,
            notes=notes,
        )

    return _create


@pytest.fixture
def edge_factory():
    def _create(source: str, type: str, target: str) -> Edge:
        return Edge(source=source, type=type, target=target)

    return _create
