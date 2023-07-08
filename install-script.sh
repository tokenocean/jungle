#!/bin/bash

# Install Hasura CLI
curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash

# Install pnpm globally
npm i -g pnpm

# Install project dependencies
pnpm install

# Navigate to the "hasura" directory
cd hasura

# Copy the .env.sample file to .env
cp .env.sample .env

# Install project dependencies within a Docker container
docker run -it -v $PWD/app:/app --entrypoint pnpm asoltys/lnft-server install

# Create a Docker network
docker network create net

# Start Docker containers
docker-compose up -d

# Wait for Docker containers to be running
echo "Waiting for Docker containers to be running..."
until docker-compose ps | grep -q "Up (healthy)"; do
    sleep 20
done

# Apply Hasura migrations
echo "Applying Hasura migrations..."
hasura migrate apply

# Apply Hasura metadata
echo "Applying Hasura metadata..."
hasura metadata apply

# Apply Hasura seeds
echo "Applying Hasura seeds..."
hasura seeds apply

# Reload Hasura metadata
hasura metadata reload

# Configure IPFS gateway
docker exec -it ipfs ipfs config --json Gateway.PublicGateways '{ "ipfs": { "Paths": ["/ipfs", "/ipns"], "UseSubdomains": false } }'
docker exec -it ipfs ipfs config Addresses.Gateway "/ip4/0.0.0.0/tcp/8080"

# Copy the user.png file to the storage directory
sudo cp ../static/user.png storage/QmcbyjMMT5fFtoiWRJiwV8xoiRWJpSRwC6qCFMqp7EXD4Z.webp

# Add the file to IPFS
docker exec -it ipfs ipfs add /export/QmcbyjMMT5fFtoiWRJiwV8xoiRWJpSRwC6qCFMqp7EXD4Z.webp

# Create a Liquid wallet
docker exec -it liquid elements-cli createwallet coinos

# Rescan the blockchain
docker exec -it liquid elements-cli rescanblockchain

# Restart the "lapp" service
docker restart lapp

# Navigate back to the previous directory
cd ..

# Start the development server
pnpm dev
