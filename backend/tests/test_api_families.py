import pytest
from conftest import graph

pytestmark = pytest.mark.asyncio


async def test_family_creation_graph_and_owner(authenticated_client, family):
    families = (await authenticated_client.get("/api/families")).json()
    assert len(families) == 1
    assert families[0] == family
    assert family["owner"] == (await authenticated_client.get("/api/me")).json()["id"]
    saved = await graph(authenticated_client, family["id"])
    assert saved["revision"] == 0
    assert saved["people"] == [{"id": family["self_id"], "name": "Kevin", "gender": "unspecified", "birth_date": None, "death_date": None, "notes": ""}]
    assert saved["edges"] == []


async def test_other_user_cannot_access_family_or_graph(authenticated_client, second_user_client, family):
    fid = family["id"]
    assert (await second_user_client.get("/api/families")).json() == []
    assert (await second_user_client.get(f"/api/families/{fid}/graph")).status_code == 404
    assert (await second_user_client.post(f"/api/families/{fid}/proposals", json={"text": "My father is Joseph."})).status_code == 404
    assert (await second_user_client.post(f"/api/families/{fid}/query", json={"text": "Who is Joseph to me?"})).status_code == 404
    assert (await second_user_client.delete(f"/api/families/{fid}")).status_code == 404
    assert len((await authenticated_client.get("/api/families")).json()) == 1
