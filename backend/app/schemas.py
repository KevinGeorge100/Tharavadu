from datetime import date
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator


class Strict(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class Person(Strict):
    id: str = Field(min_length=1, max_length=100)
    name: str = Field(min_length=1, max_length=120)
    gender: Literal["male", "female", "unspecified"] = "unspecified"
    birth_date: date | None = None
    death_date: date | None = None
    notes: str = Field(default="", max_length=5000)

    @model_validator(mode="after")
    def dates(self):
        if self.birth_date and self.death_date and self.birth_date > self.death_date:
            raise ValueError("Birth date must precede death date")
        return self


class Edge(Strict):
    source: str = Field(min_length=1, max_length=100)
    target: str = Field(min_length=1, max_length=100)
    type: Literal["PARENT_OF", "SPOUSE_OF", "SIBLING_OF"]


class Graph(Strict):
    people: list[Person] = Field(default_factory=list, max_length=500)
    edges: list[Edge] = Field(default_factory=list, max_length=2000)
    revision: int = 0
    applied: list[str] = Field(default_factory=list)


class Entity(Strict):
    ref: str = Field(min_length=1, max_length=100)
    name: str = Field(min_length=1, max_length=120)
    gender: Literal["male", "female", "unspecified"]
    existing_id: str | None


class Extraction(Strict):
    entities: list[Entity] = Field(max_length=50)
    relationships: list[Edge] = Field(max_length=100)
    warnings: list[str] = Field(max_length=20)


class Credentials(Strict):
    email: str = Field(min_length=5, max_length=254, pattern=r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
    password: str = Field(min_length=10, max_length=128)


class FamilyCreate(Strict):
    name: str = Field(min_length=1, max_length=100)
    person_name: str = Field(min_length=1, max_length=120)
    demo: bool = False


class TextInput(Strict):
    text: str = Field(min_length=1, max_length=6000)


class Confirm(Strict):
    extraction: Extraction
    resolutions: dict[str, str] = Field(default_factory=dict)


class MemoryCreate(Strict):
    text: str = Field(min_length=1, max_length=10000)
    people: list[str] = Field(default_factory=list, max_length=50)


class PersonEdit(Strict):
    name: str = Field(min_length=1, max_length=120)
    notes: str = Field(max_length=5000)
    gender: Literal["male", "female", "unspecified"]
    birth_date: date | None = None
    death_date: date | None = None
