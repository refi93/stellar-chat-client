var StellarSdk = require('stellar-sdk');
var server = new StellarSdk.Server('http://localhost:8000', {allowHttp: true})
StellarSdk.Network.use(new StellarSdk.Network('Standalone Network ; February 2017'))

const onTx = (txHandler, lastCursor) => {
  server.transactions()
    .cursor(lastCursor)
    .stream({
      onmessage: txHandler,
    })
}

const emit = async ({msgType, msgContent}) => {
  if (!msgContent) {
    return
  }
  const tx = await buildTx(
    process.env.STELLAR_SECRET || '',
    1,
    msgType + msgContent,
  )
  try {
    await server.submitTransaction(tx)
  } catch (e) {
    console.log(e.response.data)
  }
}

async function buildTx(sourceSecret, amount, memo) {
  const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecret)
  const sourceAccount = await server.loadAccount(sourceKeypair.publicKey())

  const txBuilder = new StellarSdk.TransactionBuilder(sourceAccount)
  txBuilder.addOperation(StellarSdk.Operation.payment({
    destination: sourceKeypair.publicKey(),
    asset: StellarSdk.Asset.native(),
    amount: amount.toString(),
  }))
  memo && txBuilder.addMemo(StellarSdk.Memo.text(memo))

  const tx = txBuilder.build()
  tx.sign(sourceKeypair)

  return tx
}

module.exports = {
  onTx,
  emit,
}