I've created an AWS Lambda function that can deploy Ethereum smart contracts using Alchemy as the provider.
This setup allows you to deploy contracts quickly and efficiently without needing to maintain a dedicated server or infrastructure.

## ERRORS
1.  index.js not found
   
![Screen Shot 2024-06-16 at 16 57](https://github.com/Sequence-94/voting-dapp-deployment/assets/53806574/709a3add-6898-48d8-b611-b0352d752d5a)

Cause: aws could not find the index.js that I had mentioned in my package.json so I had to rename it from ContractDeployment.js to index.js
Like this:

![Screen Shot 2024-06-16 at 16 58](https://github.com/Sequence-94/voting-dapp-deployment/assets/53806574/a3a2be3d-bf5c-4f3d-a901-fa89f1890f1b)


2.  Must be authenticated!
   
![Screen Shot 2024-06-16 at 17 25](https://github.com/Sequence-94/voting-dapp-deployment/assets/53806574/bde049ca-5846-4043-863a-515eb72a946e)


Cause: the hhtps endpoint was incorrectly put as "https://eth-holesky.g.alchemy.com/v2/YOUR_HOLESKY_PROJECT_ID" and aws does not know how to render my envirnment variable in this manner.
First I tried to change it like this 
```
 [YOUR_HOLESKY_PROJECT_ID is not defined](https://eth-holesky.g.alchemy.com/v2/${YOUR_HOLESKY_PROJECT_ID)}
```
But that was incorrect as I got an back this error:
```
2024-06-16T11:52:42.827Z	924bd9c6-de8c-44db-a4eb-185787521f78	ERROR	Error deploying contract: ReferenceError: YOUR_HOLESKY_PROJECT_ID is not defined
    at deploy (/var/task/index.js:10:94)
    at exports.handler (/var/task/index.js:27:39)
    at Runtime.handleOnceNonStreaming (file:///var/runtime/index.mjs:1173:29)
```
Final Resolution:

![Screen Shot 2024-06-16 at 17 29](https://github.com/Sequence-94/voting-dapp-deployment/assets/53806574/afc58899-444a-4960-8573-d202ad433659)

3.  Cannot read properties of undefined (reading 'JsonRpcProvider')

```
2024-06-16T13:56:43.413Z	b9cf6534-c2ae-4475-ab50-555672937686	ERROR	Error deploying contract: TypeError: Cannot read properties of undefined (reading 'JsonRpcProvider')
    at deploy (/var/task/index.js:10:43)
    at exports.handler (/var/task/index.js:29:39)
    at Runtime.handleOnceNonStreaming (file:///var/runtime/index.mjs:1173:29)
```
Cause: EthersJS has an issue Listening to evens with nodejs

Final Resoultion:
I downgraded my "ethers" to version 5.7.2 in the package.json then I removed node_modules folder and ran

![Screen Shot 2024-06-16 at 17 48](https://github.com/Sequence-94/voting-dapp-deployment/assets/53806574/e8f3bd29-b259-48d3-8dc9-a48733357329)

```
npm install 
```

