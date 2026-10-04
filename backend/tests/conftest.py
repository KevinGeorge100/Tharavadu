import sys
from pathlib import Path

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

# Ensure backend root is in sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.config import Settings
from app.main import create_app
from app.schemas import Edge, Graph, Person
from app.seed import demo_graph

TEST_ORIGIN = "http://tharavadu.test"
TEST_HEADERS = {"x-tharavadu-client": "web", "Origin": TEST_ORIGIN}


@pytest_asyncio.fixture
async def client(tmp_path):
    """Real ASGI stack with its own on-disk SQLite database and local graph."""
    config = Settings(
        _env_file=None,
        database_url=f"sqlite:///{(tmp_path / 'api-test.db').as_posix()}",
        graph_backend="local",
        ai_provider="offline",
        openai_api_key="",
        cookie_secure=False,
        app_origin=TEST_ORIGIN,
    )
    app = create_app(config)
    async with app.router.lifespan_context(app), AsyncClient(
        transport=ASGITransport(app=app), base_url=TEST_ORIGIN, headers=TEST_HEADERS
    ) as http:
        http.app_under_test = app
        http.test_database = tmp_path / "api-test.db"
        yield http


@pytest_asyncio.fixture
async def authenticated_client(client):
    response = await client.post("/api/auth/register", json={"email": "owner@example.test", "password": "safe-password-123"})
    assert response.status_code == 200, response.text
    return client


@pytest_asyncio.fixture
async def second_user_client(client):
    async with AsyncClient(transport=ASGITransport(app=client.app_under_test), base_url=TEST_ORIGIN, headers=TEST_HEADERS) as second:
        response = await second.post("/api/auth/register", json={"email": "other@example.test", "password": "another-password-123"})
        assert response.status_code == 200, response.text
        yield second


@pytest_asyncio.fixture
async def family(authenticated_client):
    response = await authenticated_client.post("/api/families", json={"name": "Our Family", "person_name": "Kevin"})
    assert response.status_code == 201, response.text
    return response.json()


async def proposal(client, family_id, story):
    response = await client.post(f"/api/families/{family_id}/proposals", json={"text": story})
    assert response.status_code == 200, response.text
    return response.json()


async def confirm(client, family_id, staged, resolutions=None):
    return await client.post(
        f"/api/families/{family_id}/proposals/{staged['id']}/confirm",
        json={"extraction": staged["extraction"], "resolutions": resolutions or {}},
    )


async def graph(client, family_id):
    response = await client.get(f"/api/families/{family_id}/graph")
    assert response.status_code == 200, response.text
    return response.json()


def person_id(graph_data, name):
    matches = [person["id"] for person in graph_data["people"] if person["name"] == name]
    assert len(matches) == 1, f"Expected one {name}; found {len(matches)}"
    return matches[0]


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
