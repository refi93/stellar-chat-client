require('dotenv').config()
const readline = require('readline')
const StellarSdk = require('stellar-sdk');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
const server = new StellarSdk.Server(process.env.HORIZON_URL, {allowHttp: true})
StellarSdk.Network.use(new StellarSdk.Network(process.env.NETWORK_PASSPHRASE))
const rootAccountKeypair = StellarSdk.Keypair.fromSecret(process.env.STELLAR_ROOT_SECRET)

const checkIfAccountExists = async (publicKey) => {
  try {
    await server.loadAccount(publicKey)
    return true
  } catch (e) {
    if (e.response && e.response.status === 404) {
      return false
    }
    throw e
  }
}

const createAccount = async (publicKey, startingBalance) => {
  const account = await server.loadAccount(rootAccountKeypair.publicKey())
  const transaction = new StellarSdk.TransactionBuilder(account)
    .addOperation(StellarSdk.Operation.createAccount({
      destination: publicKey,
      startingBalance,
    })).build()

  transaction.sign(rootAccountKeypair)

  try {
    await server.submitTransaction(transaction)
  } catch (e) {
    throw e
  }
}

const fundAccount = async (publicKey, amount) => {
  const account = await server.loadAccount(rootAccountKeypair.publicKey())
  const transaction = new StellarSdk.TransactionBuilder(account)
    .addOperation(StellarSdk.Operation.payment({
      destination: publicKey,
      asset: StellarSdk.Asset.native(),
      amount,
    }))
    .build()
  transaction.sign(rootAccountKeypair)
  try {
    return server.submitTransaction(transaction)
  } catch (e) {
    throw e
  }
}

const run = async (publicKey) => {
  try {
    const accountExists = await checkIfAccountExists(publicKey)
    if (!accountExists) {
      await createAccount(publicKey, '1000000')
    } else {
      await fundAccount(publicKey, '1000000')
      console.log('success!')
      process.exit(0)
    }
  } catch (e) {
    console.log(e)
  }
}

rl.question('Insert account public key to fund: ', run)