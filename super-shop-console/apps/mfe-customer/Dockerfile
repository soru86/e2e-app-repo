FROM node:20-alpine
WORKDIR /repo
COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages
RUN corepack enable && pnpm install
RUN pnpm --filter @super-shop/mfe-customer build
EXPOSE 4174
CMD ["pnpm", "--filter", "@super-shop/mfe-customer", "preview", "--", "--host", "0.0.0.0", "--port", "4174"]

