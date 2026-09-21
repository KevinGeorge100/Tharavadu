from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    database_url: str = "sqlite:///./kin.db"
    graph_backend: str = "local"
    neo4j_uri: str = "bolt://localhost:7687"
    neo4j_user: str = "neo4j"
    neo4j_password: str = ""
    ai_provider: str = "offline"
    openai_api_key: str = ""
    openai_model: str = "gpt-4.1-mini"
    cookie_secure: bool = False
    app_origin: str = "http://localhost:3000"
    session_days: int = 7


settings = Settings()
