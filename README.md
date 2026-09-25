## `DeliveryWorkerAtlas`

> [!Warning]
> This project is under active development and may undergo major architectural changes and occasional instability.

This is the monorepo for the [DeliveryWorkerAtlas](https://www.prototypefund.de/en/projects/delivery-worker-atlas) project, a free, open-source data visualization software built on top of a Vite, React and FastAPI stack.

### Getting started

First, ensure you have [node](https://nodejs.org/), [pnpm](https://pnpm.io/), and [uv](https://github.com/astral-sh/uv) installed.

> [!Important]
> Copy `server/.env.testing` as `server/.env.local` and update it with your environment config.

Then clone the repository and install the dependencies.

```bash
git clone git@github.com:dwatlas-org/dwatlas.git
pnpm --dir dwatlas/web install
uv sync --directory dwatlas/server

```

Test the environment.

```
pnpm --dir dwatlas/web/ dev
uv --directory dwatlas/server run fastapi dev

```

#### Docker setup

Build the image and run the dev container.

```bash
docker build --target dev -t dwatlas:dev .

```

```bash
docker run --rm -p 5173:5173 -p 8000:8000 \
  -v "$PWD/server:/app/server" \
  -v "$PWD/web:/app/web" \
  -v /app/web/node_modules \
  -v /app/server/.venv \
  --env-file server/.env.local \
  -e UV_LINK_MODE=copy \
  -e CI=true \
  dwatlas:dev

```

Build the testing stage to run the full check suite inside the build.

```bash
docker build --target testing -t dwatlas:testing .

```

Drop into a shell in any built stage with `--entrypoint`.

```bash
docker run --rm -it --entrypoint bash dwatlas:dev

```

### Contributing

Simply create a branch (prefer a clear name like `feat/user-auth` or `fix/header-typo`) and submit a PR.

Join the [community](https://dwatlas.zulipchat.com/) on Zulip.
