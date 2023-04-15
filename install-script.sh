#!/bin/bash

# Downloads and installs the latest version of Hasura GraphQL Engine command-line interface using cURL and Bash.
curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash

# Uses pnpm to install the dependencies for the project.
pnpm install

# Changes the directory to the "hasura" folder in order to execute commands specific to that folder.
cd hasura

# Copies the sample environment variables file to create a new ".env" file which can be edited to include your required details.
cp .env.sample .env

# Runs a Docker image with the specified parameters to install dependencies required for the app using pnpm.
docker run -it -v $PWD/app:/app --entrypoint pnpm asoltys/lnft-server install

# Starts the Docker Compose services defined in the "docker-compose.yaml" configuration file.
docker-compose up -d

# Applies any pending migrations to the database schema.
hasura migrate apply

# Applies any pending metadata changes to the Hasura instance.
hasura metadata apply

# Applies seed data to the database.
hasura seeds apply

# Reloads the Hasura metadata after applying changes.
hasura metadata reload

# Configures IPFS to use the public gateway with the specified settings.
docker exec -it ipfs ipfs config --json Gateway.PublicGateways '{ "ipfs": { "Paths": ["/ipfs", "/ipns"], "UseSubdomains": false } }'

# Configures the IPFS gateway to listen on port 8080.
docker exec -it ipfs ipfs config Addresses.Gateway "/ip4/0.0.0.0/tcp/8080"

# Copies an image file "../static/user.png" to "/storage" folder as "QmcbyjMMT5fFtoiWRJiwV8xoiRWJpSRwC6qCFMqp7EXD4Z.webp".
sudo cp ../static/user.png storage/QmcbyjMMT5fFtoiWRJiwV8xoiRWJpSRwC6qCFMqp7EXD4Z.webp

# Adds the copied image file to IPFS and generates a content-addressed hash for the uploaded file.
docker exec -it ipfs ipfs add /export/QmcbyjMMT5fFtoiWRJiwV8xoiRWJpSRwC6qCFMqp7EXD4Z.webp

# Creates a new cryptocurrency wallet with the name "coinos" using Liquid Elements command-line interface.
docker exec -it liquid elements-cli createwallet coinos

# Rescans the blockchain for any transactions related to the created wallet.
docker exec -it liquid elements-cli rescanblockchain

# Restarts a service named "lapp".
docker restart lapp

# Changes the directory back to the previous folder.
cd ..

# Uses pnpm to start the development server at http://localhost:3000.
pnpm dev
