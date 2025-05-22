#!/bin/bash

# Navigate to the directory where the script is located (optional, but good practice)
# cd "$(dirname "$0")"

# Install http-server if not already installed (globally)
# Alternatively, rely on npx which is generally preferred for one-off executions
# npm install --global http-server # Uncomment if you prefer global install

# Start the http-server on port 9000
# The -o flag opens the default browser to the served page.
# The -c-1 flag disables caching, useful for development.
echo "Starting server on http://localhost:9000"
npx http-server -p 9000 -o -c-1