"""Disposable local API for Playwright; never reads a developer's .env or database."""
import os
import sys
import tempfile
from pathlib import Path

import uvicorn

repo = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(repo))

with tempfile.TemporaryDirectory(prefix="tharavadu-e2e-") as directory:
    db_url = f"sqlite:///{(Path(directory) / 'test.db').as_posix()}"
    os.chdir(directory)
    os.environ.update({
        "DATABASE_URL": db_url,
        "GRAPH_BACKEND": "local",
        "AI_PROVIDER": "offline",
        "OPENAI_API_KEY": "",
        "COOKIE_SECURE": "false",
        "APP_ORIGIN": "http://127.0.0.1:3010",
    })
    # Import only after leaving the repository so the module-level default
    # settings cannot load a developer's .env file.
    from backend.app.config import Settings
    from backend.app.main import create_app

    settings = Settings(
        _env_file=None,
        database_url=db_url,
        graph_backend="local", ai_provider="offline", openai_api_key="",
        cookie_secure=False, app_origin="http://127.0.0.1:3010", session_days=7,
    )
    app = create_app(settings)
    try:
        uvicorn.run(app, host="127.0.0.1", port=8010, log_level="warning")
    finally:
        app.state.db.engine.dispose()
        os.chdir(repo)
