// index.js
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Load the compiled contract JSON
const compiledContract = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'Election.json'), 'utf8'));

// Handler function to cast a vote
exports.handler = async (event) => {
    console.log('Event:', event);

    try {
        // Initialize the Web3 provider with Alchemy
        const provider = new ethers.providers.JsonRpcProvider(`https://eth-holesky.g.alchemy.com/v2/${process.env.YOUR_HOLESKY_PROJECT_ID}`);

        // Specify the sender's wallet private key
        const senderPrivateKey = process.env.YOUR_SENDER_PRIVATE_KEY;
        const senderWallet = new ethers.Wallet(senderPrivateKey, provider);

        // Initialize the contract instance
        const electionContract = new ethers.Contract(process.env.CONTRACT_ADDRESS, compiledContract.abi, senderWallet);

        // Parse the request body to get candidateId and fromAddress
        const { candidateId, fromAddress } = JSON.parse(event.body);

        // Ensure the fromAddress has not already voted
        const hasVoted = await electionContract.voters(fromAddress);
        if (hasVoted) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Address has already voted' }),
            };
        }

        // Cast the vote
        const tx = await electionContract.vote(candidateId, { from: fromAddress });

        // Wait for the transaction to be mined
        const receipt = await tx.wait();

        // Return success response with transaction receipt
        return {
            statusCode: 200,
            body: JSON.stringify({ receipt }),
        };
    } catch (error) {
        console.error('Error casting vote:', error);

        // Return error response
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
