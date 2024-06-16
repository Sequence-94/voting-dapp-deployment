const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Load the compiled contract JSON
const compiledContract = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'Election.json'), 'utf8'));

const deploy = async () => {
    // Initialize the Web3 provider with Alchemy
    const provider = new ethers.providers.JsonRpcProvider(`https://eth-holesky.g.alchemy.com/v2/${process.env.YOUR_HOLESKY_PROJECT_ID}`);

    // Specify the sender's wallet private key
    const senderPrivateKey = process.env.YOUR_SENDER_PRIVATE_KEY;
    const senderWallet = new ethers.Wallet(senderPrivateKey, provider);

    // Deploy the contract
    const factory = new ethers.ContractFactory(compiledContract.abi, compiledContract.bytecode, senderWallet);
    const contract = await factory.deploy();

    // Wait for the contract to be deployed
    await contract.deployed();

    return contract.address;
};

exports.handler = async (event) => {
    console.log('Event:', event);
    try {
        const contractAddress = await deploy();
        console.log('Contract deployed at address:', contractAddress);
        return {
            statusCode: 200,
            body: JSON.stringify({ contractAddress }),
        };
    } catch (error) {
        console.error('Error deploying contract:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
