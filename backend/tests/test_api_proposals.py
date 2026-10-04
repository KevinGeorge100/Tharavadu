import pytest
from conftest import confirm, graph, person_id, proposal

pytestmark = pytest.mark.asyncio


async def test_story_stages_then_confirms_persisted_graph(authenticated_client, family):
    fid = family["id"]
    before = await graph(authenticated_client, fid)
    staged = await proposal(authenticated_client, fid, "My father Joseph has an elder brother named Thomas. Thomas has two children named Raj and Maya.")
    assert staged["status"] == "pending"
    assert staged["revision"] == before["revision"]
    assert staged["candidates"] == {}
    assert {e["name"] for e in staged["extraction"]["entities"]} == {"Joseph", "Thomas", "Raj", "Maya"}
    assert await graph(authenticated_client, fid) == before
    saved = await confirm(authenticated_client, fid, staged)
    assert saved.status_code == 200, saved.text
    assert saved.json()["revision"] == before["revision"] + 1
    reloaded = await graph(authenticated_client, fid)
    assert reloaded == saved.json()
    assert len(reloaded["people"]) == 5
    assert len(reloaded["edges"]) == 4
    answer = await authenticated_client.get(f"/api/families/{fid}/relationship", params={"source": family["self_id"], "target": person_id(reloaded, "Raj")})
    assert answer.status_code == 200
    assert answer.json()["relationship"] == "first cousin"
    assert answer.json()["names"] == ["Kevin", "Joseph", "Thomas", "Raj"]
    assert answer.json()["steps"] == ["U", "S", "D"]


async def test_homonyms_require_explicit_resolution(authenticated_client, family):
    fid = family["id"]
    first = await proposal(authenticated_client, fid, "George is father of Raj.")
    assert (await confirm(authenticated_client, fid, first)).status_code == 200
    second = await proposal(authenticated_client, fid, "George is father of Maya.")
    assert (await confirm(authenticated_client, fid, second, {"george": "new"})).status_code == 200
    duplicate_graph = await graph(authenticated_client, fid)
    georges = [p["id"] for p in duplicate_graph["people"] if p["name"] == "George"]
    assert len(georges) == 2
    staged = await proposal(authenticated_client, fid, "George is father of Leo.")
    assert set(staged["candidates"]["george"]) == set(georges)
    unresolved = await confirm(authenticated_client, fid, staged)
    assert unresolved.status_code == 409
    assert await graph(authenticated_client, fid) == duplicate_graph
    chosen = georges[0]
    saved = await confirm(authenticated_client, fid, staged, {"george": chosen})
    assert saved.status_code == 200, saved.text
    result = await graph(authenticated_client, fid)
    leo = person_id(result, "Leo")
    assert any(e == {"source": chosen, "target": leo, "type": "PARENT_OF"} for e in result["edges"])
    assert not any(e["source"] == (set(georges) - {chosen}).pop() and e["target"] == leo for e in result["edges"])


async def test_cycle_rejected_without_graph_mutation(authenticated_client, family):
    fid = family["id"]
    parent = await proposal(authenticated_client, fid, "My father is Joseph.")
    assert (await confirm(authenticated_client, fid, parent)).status_code == 200
    before = await graph(authenticated_client, fid)
    # The unedited story is valid at staging; review may edit the structured proposal.
    staged = await proposal(authenticated_client, fid, "My mother is Anna.")
    staged["extraction"] = {
        "entities": [{"ref": "joseph", "name": "Joseph", "gender": "male", "existing_id": None}],
        "relationships": [{"source": "self", "target": "joseph", "type": "PARENT_OF"}],
        "warnings": [],
    }
    rejected = await confirm(authenticated_client, fid, staged)
    assert rejected.status_code == 409
    assert "Circular ancestry" in rejected.json()["detail"]
    assert await graph(authenticated_client, fid) == before

    # A cycle in the original story is rejected even before a proposal is stored.
    rejected_stage = await authenticated_client.post(f"/api/families/{fid}/proposals", json={"text": "I is father of Joseph."})
    assert rejected_stage.status_code == 409
    assert await graph(authenticated_client, fid) == before


async def test_stale_proposal_does_not_overwrite_newer_graph(authenticated_client, family):
    fid = family["id"]
    stale = await proposal(authenticated_client, fid, "My father is Joseph.")
    current = await proposal(authenticated_client, fid, "My mother is Anna.")
    assert stale["revision"] == current["revision"]
    assert (await confirm(authenticated_client, fid, current)).status_code == 200
    before = await graph(authenticated_client, fid)
    response = await confirm(authenticated_client, fid, stale)
    assert response.status_code == 409
    assert await graph(authenticated_client, fid) == before
    assert {p["name"] for p in before["people"]} == {"Kevin", "Anna"}


async def test_rejected_proposal_cannot_mutate_graph(authenticated_client, family):
    fid = family["id"]
    staged = await proposal(authenticated_client, fid, "My father is Joseph.")
    before = await graph(authenticated_client, fid)
    response = await authenticated_client.delete(f"/api/families/{fid}/proposals/{staged['id']}")
    assert response.status_code == 200
    assert (await confirm(authenticated_client, fid, staged)).status_code == 409
    assert await graph(authenticated_client, fid) == before
