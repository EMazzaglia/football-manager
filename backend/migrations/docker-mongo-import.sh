
#!/bin/bash
# Simple script to import CSV data into MongoDB

# Connection details
MONGO_HOST="localhost"
MONGO_PORT="27017"
MONGO_USERNAME="admin"
MONGO_PASSWORD="password"
MONGO_DB="myapi"
MONGO_COLLECTION="events"
AUTH_DB="admin"

# File to import
CSV_FILE="events.csv"

# Headers for the CSV file (adjust these to match your CSV columns)
HEADERS="id_odsp,date,country,ht,at,league,price,available_seats"

# Run the mongoimport command
mongoimport --host $MONGO_HOST --port $MONGO_PORT \
  --username $MONGO_USERNAME --password $MONGO_PASSWORD --authenticationDatabase $AUTH_DB \
  --db $MONGO_DB --collection $MONGO_COLLECTION \
  --type csv --headerline --drop \
  --file $CSV_FILE

echo "Import completed!"