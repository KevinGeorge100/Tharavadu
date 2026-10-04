import pytest
from conftest import confirm, graph, person_id, proposal

pytestmark = pytest.mark.asyncio


async def test_parent_grandparent_and_sibling_evidence_over_http(authenticated_client, family):
    fid = family["id"]
    first = await proposal(authenticated_client, fid, "My father is Joseph. George is father of Joseph.")
    assert (await confirm(authenticated_client, fid, first)).status_code == 200
    second = await proposal(authenticated_client, fid, "George has two children named Joseph and Thomas.")
    assert (await confirm(authenticated_client, fid, second)).status_code == 200
    saved = await graph(authenticated_client, fid)
    joseph, george, thomas = (person_id(saved, name) for name in ("Joseph", "George", "Thomas"))

    parent = (await authenticated_client.get(f"/api/families/{fid}/relationship", params={"source": family["self_id"], "target": joseph})).json()
    assert parent["relationship"] == "father"
    assert parent["names"] == ["Kevin", "Joseph"]
    assert parent["steps"] == ["U"]

    grandparent = (await authenticated_client.get(f"/api/families/{fid}/relationship", params={"source": family["self_id"], "target": george})).json()
    assert grandparent["relationship"] == "grandfather"
    assert grandparent["names"] == ["Kevin", "Joseph", "George"]
    assert grandparent["path"] == [family["self_id"], joseph, george]
    assert "George" in grandparent["explanation"]

    sibling = (await authenticated_client.get(f"/api/families/{fid}/relationship", params={"source": joseph, "target": thomas})).json()
    assert sibling["relationship"] == "sibling"
    assert sibling["names"] == ["Joseph", "Thomas"]
    assert sibling["steps"] == ["S"]


async def test_natural_language_query_uses_persisted_graph(authenticated_client, family):
    fid = family["id"]
    staged = await proposal(authenticated_client, fid, "My father is Joseph.")
    assert (await confirm(authenticated_client, fid, staged)).status_code == 200
    response = await authenticated_client.post(f"/api/families/{fid}/query", json={"text": "Who is Joseph to me?"})
    assert response.status_code == 200
    assert response.json()["relationship"] == "father"
    assert response.json()["names"] == ["Kevin", "Joseph"]
