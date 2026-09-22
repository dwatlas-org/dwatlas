FROM debian:testing-slim AS base

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    git \
    nginx \
    && rm -rf /var/lib/apt/lists/* \
    && rm -f /etc/nginx/sites-enabled/default

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /usr/local/bin/

WORKDIR /app

FROM base AS deps

# TODO: let pnpm handle node (ref: https://pnpm.io/docker#installing-nodejs)
COPY --from=node:26-slim /usr/local/bin/ /usr/local/bin/
RUN npm install -g pnpm

COPY server/pyproject.toml server/uv.lock /app/server/
COPY web/package.json web/pnpm-lock.yaml /app/web/

RUN uv sync --directory /app/server --frozen
RUN pnpm --dir /app/web install --frozen-lockfile

FROM deps AS build
COPY web /app/web
RUN pnpm --dir /app/web build

FROM deps AS source
COPY . /app

FROM source AS dev
ENV PATH="/app/server/.venv/bin:$PATH"
EXPOSE 5173 8000
CMD ["sh", "-c", "uv run --directory /app/server fastapi dev --host 0.0.0.0 & pnpm --dir /app/web dev --host 0.0.0.0 && wait"]

FROM source AS testing
RUN uv run --directory /app/server pytest
RUN pnpm --dir /app/web lint

FROM base AS preview
ENV PATH="/app/server/.venv/bin:$PATH"
COPY --from=deps /app/server/.venv /app/server/.venv
COPY server /app/server
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/web/dist /app/public
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 8080
ENTRYPOINT ["/app/entrypoint.sh"]
