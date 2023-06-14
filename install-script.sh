#!/bin/bash

set -e # Exit script if any command fails

# Downloads and installs the latest version of Hasura GraphQL Engine command-line interface using cURL and Bash.
curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash

# Install pnpm and dependencies
npm i -g pnpm
pnpm install

# Set up Hasura project
cd hasura
cp .env.sample .env

# Install dependencies using pnpm
docker run -it -v $PWD/app:/app --entrypoint pnpm asoltys/lnft-server install

# Create a network if it does not exist, otherwise skip
if ! docker network ls | grep net > /dev/null; then
  echo "Creating docker network..."
  docker network create net
fi

# Start docker-compose services
echo "Starting docker-compose services..."
docker-compose -f docker-compose.yaml up -d

# Wait for all containers to start
echo "Waiting for all containers to start..."
while ! docker-compose -f docker-compose.yaml ps --services --filter "status=running" | grep -q .; do
  sleep 1
done

# Apply migrations, metadata, seeds, and reload metadata after applying changes
echo "Applying migrations and metadata..."
if ! hasura migrate apply && hasura metadata apply && sleep 10 && hasura seeds apply && hasura metadata reload; then
  echo "Error: Failed to apply migrations, metadata, seeds, or reload metadata"
  exit 1
fi

# Configure IPFS
echo "Configuring IPFS..."
if ! docker exec -it ipfs ipfs config --json Gateway.PublicGateways '{ "ipfs": { "Paths": ["/ipfs", "/ipns"], "UseSubdomains": false } }' && \
     docker exec -it ipfs ipfs config Addresses.Gateway "/ip4/0.0.0.0/tcp/8080"; then
  echo "Error: Failed to configure IPFS gateway"
  exit 1
fi

# Copy and upload image file
echo "Copying and uploading image file..."
IMAGE_PATH="../static/user.png"
if ! sudo cp $IMAGE_PATH storage/QmcbyjMMT5fFtoiWRJiwV8xoiRWJpSRwC6qCFMqp7EXD4Z.webp && \
     docker exec -it ipfs ipfs add /export/QmcbyjMMT5fFtoiWRJiwV8xoiRWJpSRwC6qCFMqp7EXD4Z.webp; then
  echo "Error: Failed to copy or upload image file to IPFS"
  exit 1
fi

# Create new wallet and rescan blockchain
echo "Creating new cryptocurrency wallet and rescanning blockchain..."
if ! docker exec -it liquid elements-cli createwallet coinos; then
  echo "Error: Failed to create new wallet"
  exit 1
fi

if ! docker exec -it liquid elements-cli rescanblockchain; then
  echo "Error: Failed to rescan blockchain"
  exit 1
fi

# Restart container
echo "Restarting container..."
if ! docker restart lapp; then
  echo "Error: Failed to restart container"
  exit 1
fi

# Start development server
echo "Starting development server..."
if ! pnpm dev; then
  echo "Error: Failed to start development server"
fi