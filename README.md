> [!Warning]
> This project is in its early stages and may undergo major architectural changes, refactorings, and occasional instability.


### `DeliveryWorkerAtlas`

This is the monorepo for the **DeliveryWorkerAtlas** project.

### Getting started
First, ensure you have [node](https://nodejs.org/), [pnpm](https://pnpm.io/), and [uv](https://github.com/astral-sh/uv) installed.

Then clone the repository and install the dependencies:

```bash
git clone git@github.com:dwatlas-org/dwatlas.git
pnpm --dir dwatlas/web install
uv sync --directory dwatlas/server
```

Test the environment by running `pnpm dev` from the _web folder_ and `uv run fastapi dev` from the _server folder_.

### Docker

Build the image and run the dev stage.

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
  dwatlas:dev
```

Build the testing stage to run the full check suite inside the build.

```bash
docker build --target testing -t dwatlas:testing .
```

Drop into a shell in any built stage with `--entrypoint`.

```bash
docker run --rm -it --entrypoint sh dwatlas:dev
```


### Contributing

Simply create a branch (prefer a clear name like `feat/user-auth` or `fix/header-typo`) and submit a PR.

Join the [community](https://dwatlas.zulipchat.com/) on Zulip.
