import pytest
from conftest import confirm, graph, person_id, proposal

pytestmark = pytest.mark.asyncio


async def test_memory_create_list_search_delete_and_tenant_isolation(authenticated_client, second_user_client, family):
    fid = family["id"]
    staged = await proposal(authenticated_client, fid, "My father is Joseph.")
    assert (await confirm(authenticated_client, fid, staged)).status_code == 200
    joseph = person_id(await graph(authenticated_client, fid), "Joseph")
    body = {"text": "Joseph moved to Kochi in 1975.", "people": [joseph]}
    created = await authenticated_client.post(f"/api/families/{fid}/memories", json=body)
    assert created.status_code == 201
    memory = created.json()
    assert memory["family_id"] == fid and memory["people"] == [joseph]
    assert memory["author"] == family["owner"]
    listed = (await authenticated_client.get(f"/api/families/{fid}/memories")).json()
    assert listed == [memory]
    assert (await authenticated_client.get(f"/api/families/{fid}/memories", params={"q": "KOCHI"})).json() == [memory]
    assert (await authenticated_client.get(f"/api/families/{fid}/memories", params={"q": "Delhi"})).json() == []
    assert (await second_user_client.get(f"/api/families/{fid}/memories")).status_code == 404
    assert (await second_user_client.post(f"/api/families/{fid}/memories", json=body)).status_code == 404
    assert (await second_user_client.delete(f"/api/families/{fid}/memories/{memory['id']}")).status_code == 404
    assert (await authenticated_client.get(f"/api/families/{fid}/memories")).json() == [memory]
    assert (await authenticated_client.delete(f"/api/families/{fid}/memories/{memory['id']}")).status_code == 200
    assert (await authenticated_client.get(f"/api/families/{fid}/memories")).json() == []


async def test_memory_rejects_person_outside_family(authenticated_client, second_user_client, family):
    other = await second_user_client.post("/api/families", json={"name": "Second", "person_name": "Other"})
    assert other.status_code == 201
    response = await authenticated_client.post(
        f"/api/families/{family['id']}/memories",
        json={"text": "Wrong family reference", "people": [other.json()["self_id"]]},
    )
    assert response.status_code == 409
    assert (await authenticated_client.get(f"/api/families/{family['id']}/memories")).json() == []
