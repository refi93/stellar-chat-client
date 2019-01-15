const StellarSdk = require('stellar-sdk');

const StellarChatDriver = (
  networkPassphrase,
  horizonUrl,
  clientSecret,
) => {
  const server = new StellarSdk.Server(horizonUrl, {allowHttp: true})
  StellarSdk.Network.use(new StellarSdk.Network(networkPassphrase))
  clientPublic = secretToPublic(clientSecret)

  const emit = async ({type, content, to}) => {
    // TODO
  }

  const onEvent = (handler, lastCursor) => {
    server.transactions()
      .cursor(lastCursor)
      .stream({
        onmessage: (tx) => {
          if (tx.memo_type === 'text') {
            // parse the tx to event and pass it to the handler 
            
            handler(event)
          }
        },
      })
  }
  
  async function buildTx(sourceSecret, destPublic, amount, memo) {
    // TODO
  }

  return {
    onEvent,
    emit
  }
}

const secretToPublic = (secret) => {
  return StellarSdk.Keypair.fromSecret(secret).publicKey()
}

module.exports = StellarChatDriver