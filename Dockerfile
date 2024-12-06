FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --shamefully-hoist
RUN pnpm run -r build
RUN pnpm deploy --filter=contracts /prod/contracts
RUN pnpm deploy --filter=relayer --prod /prod/relayer
RUN pnpm deploy --filter=web --prod /prod/web

FROM base AS relayer-production-stage
COPY --from=build /prod/relayer /prod/relayer
WORKDIR /prod/relayer
EXPOSE 3000
CMD [ "pnpm", "start" ]

FROM base AS hardhat-production-stage
COPY --from=build /usr/src/app /usr/src/app
WORKDIR /usr/src/app/apps/contracts
CMD [ "pnpm", "dev"]
# COPY --from=build /prod/contracts /prod/contracts
# WORKDIR /prod/contracts
# EXPOSE 8545
# CMD [ "pnpm", "dev" ]

FROM nginx:stable-alpine AS web-production-stage
# Copy the build application from the previous stage to the Nginx container
COPY --from=build /prod/web/dist/spa /usr/share/nginx/html
# Copy the nginx configuration file
COPY ./apps/web/nginx/default.conf /etc/nginx/conf.d/default.conf
# Expose the port 80
# TODO: port from env
EXPOSE 80
# Start Nginx to serve the application
CMD ["nginx", "-g", "daemon off;"]
