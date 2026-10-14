FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DATABASE_URL=sqlite:////data/tharavadu.db \
    GRAPH_BACKEND=local \
    AI_PROVIDER=offline \
    APP_ORIGIN=http://localhost:3000 \
    COOKIE_SECURE=false

WORKDIR /app
COPY backend/requirements.txt /app/backend/requirements.txt
RUN python -m pip install --no-cache-dir -r /app/backend/requirements.txt \
    && useradd --system --uid 10001 --create-home tharavadu \
    && mkdir -p /data \
    && chown tharavadu:tharavadu /data
COPY backend /app/backend

USER tharavadu
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/api/health', timeout=2)" || exit 1
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1", "--no-access-log"]
