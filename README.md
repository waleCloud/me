# Walecloud.me

The source for [walecloud.me](https://walecloud.me), Wale Ayandiran's personal
publishing site. Articles live in `content/blog` and are built into a static site
with Gatsby.

## Local development

Use the Node version in `.nvmrc` and Yarn Classic:

```sh
nvm use
corepack enable
yarn install --frozen-lockfile
yarn dev
```

Run the complete production verification with:

```sh
yarn verify
```
