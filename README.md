# stellar-chat-client
A proof-of-concept chat client over the Stellar blockchain

# useful commands

```
// run stellar non-persistent mode
sudo docker run --rm -it -p "8000:8000" --name stellar stellar/quickstart --testnet

// run stellar persistent mode
sudo docker run --rm -it -p "8000:8000" -v "/home/docker_data/stellar:/opt/stellar" --name stellar stellar/quickstart --standalone

// command line access to stellar container
sudo docker exec -it stellar /bin/bash

// access stellar db via adminer
sudo docker run --link stellar:db -p 8080:8080 adminer

// standalone node network passphrase (can find in stellar config)
"Standalone Network ; February 2017"

// standalone node root account keys (can find at the beginning of logs)
public: GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI
seed: SC5O7VZUXDJ6JBDSZ74DSERXL7W3Y5LTOAMRF7RQRL3TAGAPS7LUVG3L
```
