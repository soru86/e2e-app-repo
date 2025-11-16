FROM node:20-alpine
WORKDIR /repo
COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages
RUN corepack enable && pnpm install
RUN pnpm --filter @super-shop/frontend-shell build
EXPOSE 4173
CMD ["pnpm", "--filter", "@super-shop/frontend-shell", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]

