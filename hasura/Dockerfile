# Use Hasura GraphQL engine as base image
FROM hasura/graphql-engine:v2.29.1.cli-migrations-v3

# Copy migrations from host to /hasura-migrations in Docker image
COPY migrations /hasura-migrations

# Copy metadata from host to /hasura-metadata in Docker image
COPY metadata /hasura-metadata
