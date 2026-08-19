### `DeliveryWorkerAtlas`

This is the monorepo for the **DeliveryWorkerAtlas** project.

### Getting started
First, ensure you have [node](https://nodejs.org/), [pnpm](https://pnpm.io/), and [uv](https://github.com/astral-sh/uv) installed. Then clone the repository and install the dependencies:

```bash
git clone https://github.com/dwatlas-org/dwatlas.git
cd dwatlas

cd ui
pnpm install

cd ../api
uv sync
```

**Test** the environment by running `pnpm dev` from the _ui folder_ and `uv run fastapi dev` from the _api folder_.

### Contributing

Simply create a branch (prefer a clear name like `feat/user-auth` or `fix/header-typo`) and submit a pull request.

Join the community on [Zulip](https://dwatlas.zulipchat.com/).
