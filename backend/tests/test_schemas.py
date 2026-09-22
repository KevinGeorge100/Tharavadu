from datetime import date

import pytest
from app.schemas import (
    Confirm,
    Credentials,
    Edge,
    Entity,
    Extraction,
    FamilyCreate,
    Graph,
    MemoryCreate,
    Person,
    PersonEdit,
    TextInput,
)
from pydantic import ValidationError

# =========================================================================
# Strict Config & Extra Field Forbidding
# =========================================================================


def test_strict_rejects_extra_fields():
    with pytest.raises(ValidationError):
        Person(id="p1", name="Alice", unexpected_field="extra")

    with pytest.raises(ValidationError):
        Edge(source="p1", target="p2", type="PARENT_OF", note="extra")

    with pytest.raises(ValidationError):
        Graph(people=[], edges=[], invalid="yes")

    with pytest.raises(ValidationError):
        Entity(ref="r1", name="Alice", gender="female", existing_id=None, score=0.9)

    with pytest.raises(ValidationError):
        TextInput(text="Hello", extra="bad")


def test_strict_strips_whitespace():
    p = Person(id="  id-1  ", name="  Alice Bob  ", notes="  some notes  ")
    assert p.id == "id-1"
    assert p.name == "Alice Bob"
    assert p.notes == "some notes"


# =========================================================================
# Person Schema Tests
# =========================================================================


def test_person_valid_dates():
    # birth < death
    p1 = Person(id="p1", name="Alice", birth_date=date(1920, 1, 1), death_date=date(1995, 5, 10))
    assert p1.birth_date == date(1920, 1, 1)
    assert p1.death_date == date(1995, 5, 10)

    # birth == death (infant mortality)
    p2 = Person(id="p2", name="Infant", birth_date=date(1950, 1, 1), death_date=date(1950, 1, 1))
    assert p2.birth_date == p2.death_date

    # birth only
    p3 = Person(id="p3", name="Living", birth_date=date(1990, 1, 1))
    assert p3.death_date is None

    # death only
    p4 = Person(id="p4", name="Ancestor", death_date=date(1800, 1, 1))
    assert p4.birth_date is None


def test_person_invalid_dates_death_before_birth():
    with pytest.raises(ValidationError, match="Birth date must precede death date"):
        Person(id="p1", name="Time Traveler", birth_date=date(2000, 1, 1), death_date=date(1990, 1, 1))


def test_person_name_length_bounds():
    # Empty name fails min_length=1
    with pytest.raises(ValidationError):
        Person(id="p1", name="")

    # Name > 120 chars fails max_length
    with pytest.raises(ValidationError):
        Person(id="p1", name="A" * 121)

    # Valid bounds
    p = Person(id="p1", name="A" * 120)
    assert len(p.name) == 120


def test_person_gender_literal():
    p_male = Person(id="p1", name="Bob", gender="male")
    assert p_male.gender == "male"

    p_female = Person(id="p2", name="Alice", gender="female")
    assert p_female.gender == "female"

    p_unspecified = Person(id="p3", name="Sam", gender="unspecified")
    assert p_unspecified.gender == "unspecified"

    with pytest.raises(ValidationError):
        Person(id="p4", name="Invalid", gender="other")


# =========================================================================
# Edge Schema Tests
# =========================================================================


def test_edge_valid_types():
    for valid_type in ("PARENT_OF", "SPOUSE_OF", "SIBLING_OF"):
        e = Edge(source="p1", target="p2", type=valid_type)
        assert e.type == valid_type

    with pytest.raises(ValidationError):
        Edge(source="p1", target="p2", type="COUSIN_OF")


def test_edge_source_target_bounds():
    with pytest.raises(ValidationError):
        Edge(source="", target="p2", type="PARENT_OF")

    with pytest.raises(ValidationError):
        Edge(source="p1", target="", type="PARENT_OF")


# =========================================================================
# Credentials Schema Tests
# =========================================================================


def test_credentials_email_validation():
    valid = Credentials(email="user@example.com", password="securePassword123")
    assert valid.email == "user@example.com"

    # Invalid email formats
    for invalid_email in ("not-an-email", "@no-local.com", "no-domain@", "spaces in@email.com"):
        with pytest.raises(ValidationError):
            Credentials(email=invalid_email, password="securePassword123")


def test_credentials_password_length():
    # < 10 characters fails
    with pytest.raises(ValidationError):
        Credentials(email="user@example.com", password="short")

    # >= 10 characters passes
    cred = Credentials(email="user@example.com", password="1234567890")
    assert len(cred.password) == 10

    # > 128 characters fails
    with pytest.raises(ValidationError):
        Credentials(email="user@example.com", password="A" * 129)


# =========================================================================
# Proposal & Memory Schemas
# =========================================================================


def test_extraction_and_confirm_schemas():
    extraction = Extraction(
        entities=[Entity(ref="e1", name="Dad", gender="male", existing_id=None)],
        relationships=[Edge(source="e1", target="self", type="PARENT_OF")],
        warnings=["Test warning"],
    )
    confirm = Confirm(extraction=extraction, resolutions={"e1": "p-123"})
    assert confirm.resolutions["e1"] == "p-123"
    assert len(confirm.extraction.entities) == 1


def test_family_create_schema():
    fc = FamilyCreate(name="Smith Family", person_name="John", demo=True)
    assert fc.demo is True
    assert fc.name == "Smith Family"

    with pytest.raises(ValidationError):
        FamilyCreate(name="", person_name="John")


def test_memory_create_schema():
    mem = MemoryCreate(text="A lovely summer picnic in 1985.", people=["p1", "p2"])
    assert len(mem.people) == 2
    assert "picnic" in mem.text

    with pytest.raises(ValidationError):
        MemoryCreate(text="")


def test_person_edit_schema():
    edit = PersonEdit(name="New Name", notes="Updated notes", gender="female", birth_date=date(1970, 5, 20))
    assert edit.name == "New Name"
    assert edit.gender == "female"
