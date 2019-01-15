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
  // TODO
}

const createAccount = async (publicKey, startingBalance) => {
  // TODO
}

const fundAccount = async (publicKey, amount) => {
  // TODO
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