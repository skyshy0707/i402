const { ethers } = require('ethers')

const config = require('../config')

const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)'
]

//const RECIPIENT_ADDRESS = config.PHANTOM_RECEPIENT_ADDRESS 
const RECIPIENT_ADDRESS = "0xF82e96De55D686Ef3854Ac8c278f894f33f78cCD"
const USCD_CONTRACT_ADDRESS = "0x3600000000000000000000000000000000000000"
//const USCD_CONTRACT_ADDRESS = "0x754704Bc059F8C67012fEd69BC8A327a5aafb603"
const provider = new ethers.JsonRpcProvider("https://rpc.testnet.arc.network")

/*console.log(`Provider url: ${config.PHANTOM_RPC_URL}`)
console.log(`Recepient address: ${config.PHANTOM_RECEPIENT_ADDRESS}`)*/
async function send(privateKey, amount){
    try {
        if (!amount){
            throw new Error('Amount isn\'t specified')
        }



        const amountQuantity = parseFloat(amount)

        //for testing check if amountQuantity lesser than zero (0):
        if (isNaN(amountQuantity) || amountQuantity < 0){
            throw new Error(`Invalid amount: ${amount}`)
        }

        

        const wallet = new ethers.Wallet(privateKey, provider)
        const contract = new ethers.Contract(USCD_CONTRACT_ADDRESS, ERC20_ABI, wallet)

        /*const network = await provider.getNetwork()
        console.log('🌐 Connected to Network:', network.name || 'unknown');
        console.log('⛓️  Chain ID:', network.chainId.toString());*/

        /*try {
            await contract.approve(RECIPIENT_ADDRESS, ethers.Constants.MaxUint256)
        }
        catch (error) {
            throw new Error(`Fail to get transaction permission: ${error}`)
        }*/

        const [decimals, symbol] = await Promise.all([
            contract.decimals(),
            contract.symbol()
        ])

        const amountUnits = ethers.parseUnits(amount.toString(), decimals)

        const balance = await contract.balanceOf(wallet.address)
        const balanceFormatted = ethers.formatUnits(balance, decimals)

        if (balance < amountUnits){
            throw new Error(`Insufficient balance: ${balanceFormatted}${symbol}`)
        }

        const ts = await contract.transfer(RECIPIENT_ADDRESS, amountUnits)
        const receipt = await ts.wait()

        if (receipt.status === 1){
            console.log("Transaction confirmed")
        }
        else console.log("Transaction failed")

    }
    catch (error) {
        console.error('Transfer failed', error.message)
        throw new Error(`Transfer failed ${error.message}`)
        //process.exit(1)
    }
}

module.exports = send