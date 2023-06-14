FROM asoltys/raretoshi-base

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /app
COPY . .
RUN mv /deps/node_modules /app
RUN sed -i '/cypress/d' package.json
RUN pnpm build
RUN sed -i 's/__dirname\|__filename/""/g' /app/build/server/chunks/auth*

CMD ["node", "--inspect=0.0.0.0:9229", "build"]
