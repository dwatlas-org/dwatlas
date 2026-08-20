### `DeliveryWorkerAtlas`

This is the monorepo for the **DeliveryWorkerAtlas** project.

### Getting started
First, ensure you have [node](https://nodejs.org/), [pnpm](https://pnpm.io/), and [uv](https://github.com/astral-sh/uv) installed.

Then clone the repository and install the dependencies:

```bash
# clone repo
git clone git@github.com:dwatlas-org/dwatlas.git
# install frontend deps
(cd dwatlas/web && pnpm install)
# install backend deps
(cd dwatlas/server && uv sync)
```

Test the environment by running `pnpm dev` from the _web folder_ and `uv run fastapi dev` from the _server folder_.

### Contributing

Simply create a branch (prefer a clear name like `feat/user-auth` or `fix/header-typo`) and submit a pull request.

Join the community on [Zulip](https://dwatlas.zulipchat.com/).
