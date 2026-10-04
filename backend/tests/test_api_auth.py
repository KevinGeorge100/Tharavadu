from pathlib import Path

import pytest
from conftest import TEST_HEADERS, TEST_ORIGIN

pytestmark = pytest.mark.asyncio


async def test_register_session_logout_and_login(client):
    assert (await client.get("/api/me")).status_code == 401
    assert (await client.get("/api/families")).status_code == 401
    registered = await client.post("/api/auth/register", json={"email": "Person@Example.test", "password": "safe-password-123"})
    assert registered.status_code == 200
    assert registered.json()["email"] == "person@example.test"
    assert "HttpOnly" in registered.headers["set-cookie"]
    assert "SameSite=lax" in registered.headers["set-cookie"]
    assert client.cookies.get("tharavadu_session")
    assert (await client.get("/api/me")).json()["id"] == registered.json()["id"]
    assert (await client.post("/api/auth/logout")).status_code == 200
    assert (await client.get("/api/me")).status_code == 401
    invalid = await client.post("/api/auth/login", json={"email": "person@example.test", "password": "wrong-password-123"})
    assert invalid.status_code == 401
    assert not client.cookies.get("tharavadu_session")
    logged_in = await client.post("/api/auth/login", json={"email": "PERSON@example.test", "password": "safe-password-123"})
    assert logged_in.status_code == 200
    assert (await client.get("/api/me")).json()["id"] == registered.json()["id"]


async def test_mutations_require_client_header_and_matching_origin(client):
    body = {"email": "person@example.test", "password": "safe-password-123"}
    missing_header = await client.post("/api/auth/register", json=body, headers={"x-tharavadu-client": ""})
    assert missing_header.status_code == 403
    wrong_origin = await client.post("/api/auth/register", json=body, headers={"Origin": "https://attacker.test"})
    assert wrong_origin.status_code == 403
    assert (await client.post("/api/auth/register", json=body, headers=TEST_HEADERS)).status_code == 200
    assert (await client.get("/api/me", headers={"Origin": TEST_ORIGIN})).status_code == 200


async def test_each_app_uses_only_its_temporary_database(client, tmp_path):
    assert client.test_database.parent == tmp_path
    assert client.test_database.is_file()
    assert Path(client.app_under_test.state.db.engine.url.database).resolve() == client.test_database.resolve()
    assert (await client.get("/api/health")).json() == {"status": "ok", "graph": "local", "ai": "offline"}


async def test_auth_rate_limit_is_enforced_through_http(client):
    body = {"email": "missing@example.test", "password": "wrong-password-123"}
    for _ in range(20):
        assert (await client.post("/api/auth/login", json=body)).status_code == 401
    blocked = await client.post("/api/auth/login", json=body)
    assert blocked.status_code == 429
    assert not client.cookies.get("tharavadu_session")
