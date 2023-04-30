#!/bin/bash

# Downloads and installs the latest version of Hasura GraphQL Engine command-line interface using cURL and Bash.
curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash

# Install dependencies inside docker container
docker run -it \
        -v $PWD/app:/app \
        --entrypoint pnpm \
        asoltys/lnft-server \
        install

# Create a network if it does not exists, otherwise skip
docker network ls | grep net > /dev/null || docker network create net

# Start docker-compose services
docker-compose -f docker-compose.yaml up -d && \
wait_until_all_containers_started=$(docker-compose -f docker-compose.yaml ps -q | xargs docker inspect --format '{{ .State.Status }}' | grep running | wc -l) && \
while [ $wait_until_all_containers_started -ne 8 ]; do echo "Waiting for all containers to start..."; sleep 1 ; done

# Apply migrations, metadata, seeds and reload metadata after applying changes
hasura migrate apply && \
hasura metadata apply && \
sleep 10 && \
hasura seeds apply && \
hasura metadata reload

# Configure IPFS to use the public gateway with the specified settings.
docker exec -it ipfs ipfs config --json Gateway.PublicGateways '{ "ipfs": { "Paths": ["/ipfs", "/ipns"], "UseSubdomains": false } }'

# Configures the IPFS gateway to listen on port 8080.
docker exec -it ipfs ipfs config Addresses.Gateway "/ip4/0.0.0.0/tcp/8080"

# Copies an image file "../static/user.png" to "/storage" folder as "QmcbyjMMT5fFtoiWRJiwV8xoiRWJpSRwC6qCFMqp7EXD4Z.webp".
IMAGE_PATH="../static/user.png"
sudo cp $IMAGE_PATH storage/QmcbyjMMT5fFtoiWRJiwV8xoiRWJpSRwC6qCFMqp7EXD4Z.webp

# Adds the copied image file to IPFS and generates a content-addressed hash for the uploaded file.
docker exec -it ipfs ipfs add /export/QmcbyjMMT5fFtoiWRJiwV8xoiRWJpSRwC6qCFMqp7EXD4Z.webp

# Creates a new cryptocurrency wallet with the name "coinos" using Liquid Elements command-line interface.
docker exec -it liquid elements-cli createwallet coinos

# Rescans the blockchain for any transactions related to the created wallet.
docker exec -it liquid elements-cli rescanblockchain

# Restart a single container named "lapp"
docker restart lapp

# Uses pnpm to start the development server at http://localhost:3000.
pnpm dev
