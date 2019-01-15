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
    if (!content) {
      return
    }

    const tx = await buildTx(
      clientSecret,
      to ? to : clientPublic,
      1,
      type + content,
    )
    try {
      await server.submitTransaction(tx)
    } catch (e) {
      console.log(e.response.data)
    }
  }

  const onEvent = (handler, lastCursor) => {
    server.transactions()
      .cursor(lastCursor)
      .stream({
        onmessage: (tx) => {
          if (tx.memo_type === 'text') {
            memo = tx.memo
            if (memo.length < 2) {
              return
            }
            const event = {}
            
            switch (tx.memo[0]) {
              case 'n':
                event.type = 'nick'
                event.content = memo.slice(1)
                break
              case 'c':
                event.type = 'chat'
                event.content = memo.slice(1)
                break
              default:
                return
            }
            event.source = tx.source_account
            
            handler(event)
          }
        },
      })
  }
  
  async function buildTx(sourceSecret, destPublic, amount, memo) {
    const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecret)
    let sourceAccount
    try {
      sourceAccount = await server.loadAccount(sourceKeypair.publicKey())
    } catch (e) {
      throw new Error('Account not found')
    }
    
    const txBuilder = new StellarSdk.TransactionBuilder(sourceAccount)
    txBuilder.addOperation(StellarSdk.Operation.payment({
      destination: destPublic,
      asset: StellarSdk.Asset.native(),
      amount: amount.toString(),
    }))
    memo && txBuilder.addMemo(StellarSdk.Memo.text(memo))
  
    const tx = txBuilder.build()
    tx.sign(sourceKeypair)
  
    return tx
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