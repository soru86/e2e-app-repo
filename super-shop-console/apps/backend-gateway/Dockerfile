FROM node:20-alpine
WORKDIR /repo
COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages
ENV NODE_ENV=production
RUN corepack enable && pnpm install
RUN pnpm --filter @super-shop/backend-gateway prisma generate
RUN pnpm --filter @super-shop/backend-gateway build
EXPOSE 4000
CMD ["pnpm", "--filter", "@super-shop/backend-gateway", "start"]

