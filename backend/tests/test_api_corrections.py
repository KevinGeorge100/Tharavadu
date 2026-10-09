import pytest
from conftest import confirm, graph, person_id, proposal

pytestmark = pytest.mark.asyncio


async def test_invalid_person_dates_are_a_validation_error(authenticated_client, family):
    fid = family["id"]
    before = await graph(authenticated_client, fid)
    response = await authenticated_client.put(f"/api/families/{fid}/people/{family['self_id']}", params={"revision": before["revision"]}, json={
        "name": "Kevin", "gender": "unspecified", "notes": "", "birth_date": "2000-01-01", "death_date": "1990-01-01",
    })
    assert response.status_code == 422
    assert await graph(authenticated_client, fid) == before


async def test_edit_and_remove_edge_preserve_people_and_reject_stale_revision(authenticated_client, family):
    fid = family["id"]
    staged = await proposal(authenticated_client, fid, "My father is Joseph.")
    assert (await confirm(authenticated_client, fid, staged)).status_code == 200
    before = await graph(authenticated_client, fid)
    joseph = person_id(before, "Joseph")
    edit = await authenticated_client.put(f"/api/families/{fid}/people/{joseph}", params={"revision": before["revision"]}, json={
        "name": "Joseph George", "gender": "male", "notes": "Corrected", "birth_date": "1950-01-01", "death_date": None,
    })
    assert edit.status_code == 200
    edge = before["edges"][0]
    params = {"source": edge["source"], "target": edge["target"], "kind": edge["type"], "revision": before["revision"]}
    assert (await authenticated_client.delete(f"/api/families/{fid}/edges", params=params)).status_code == 409
    params["revision"] = edit.json()["revision"]
    assert (await authenticated_client.delete(f"/api/families/{fid}/edges", params=params)).status_code == 200
    saved = await graph(authenticated_client, fid)
    assert len(saved["people"]) == 2 and saved["edges"] == []
    assert person_id(saved, "Joseph George") == joseph


async def test_person_removal_preserves_relatives_and_shared_memories(authenticated_client, family):
    fid = family["id"]
    staged = await proposal(authenticated_client, fid, "My father is Joseph. George is father of Joseph.")
    assert (await confirm(authenticated_client, fid, staged)).status_code == 200
    before = await graph(authenticated_client, fid)
    joseph, george = (person_id(before, name) for name in ("Joseph", "George"))
    for people in ([joseph], [joseph, george]):
        assert (await authenticated_client.post(f"/api/families/{fid}/memories", json={"text": "A preserved memory", "people": people})).status_code == 201
    response = await authenticated_client.delete(f"/api/families/{fid}/people/{joseph}", params={"revision": before["revision"]})
    assert response.status_code == 200
    saved = await graph(authenticated_client, fid)
    assert {p["id"] for p in saved["people"]} == {family["self_id"], george}
    assert saved["revision"] == before["revision"] + 1
    assert not any(joseph in (e["source"], e["target"]) for e in saved["edges"])
    kept = (await authenticated_client.get(f"/api/families/{fid}/memories")).json()
    assert len(kept) == 2
    assert sorted(len(m["people"]) for m in kept) == [0, 1]
    assert all(joseph not in m["people"] for m in kept)


async def test_person_removal_stale_anchor_and_owner_guards(authenticated_client, second_user_client, family):
    fid = family["id"]
    staged = await proposal(authenticated_client, fid, "My father is Joseph.")
    assert (await confirm(authenticated_client, fid, staged)).status_code == 200
    before = await graph(authenticated_client, fid)
    joseph = person_id(before, "Joseph")
    assert (await authenticated_client.delete(f"/api/families/{fid}/people/{joseph}", params={"revision": before["revision"] - 1})).status_code == 409
    assert (await authenticated_client.delete(f"/api/families/{fid}/people/{family['self_id']}", params={"revision": before["revision"]})).status_code == 409
    assert (await second_user_client.delete(f"/api/families/{fid}/people/{joseph}", params={"revision": before["revision"]})).status_code == 404
    assert await graph(authenticated_client, fid) == before


async def test_removed_person_cannot_receive_new_memory(authenticated_client, family):
    fid = family["id"]
    staged = await proposal(authenticated_client, fid, "My father is Joseph.")
    assert (await confirm(authenticated_client, fid, staged)).status_code == 200
    before = await graph(authenticated_client, fid)
    joseph = person_id(before, "Joseph")
    assert (await authenticated_client.delete(f"/api/families/{fid}/people/{joseph}", params={"revision": before["revision"]})).status_code == 200
    assert (await authenticated_client.post(f"/api/families/{fid}/memories", json={"text": "Later memory", "people": [joseph]})).status_code == 409
