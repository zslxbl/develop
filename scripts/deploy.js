const path = require('path');
const Web3 = require('web3');

const HDWalletProvider = require('truffle-hdwallet-provider');

// 1.拿到 bytecode
const contractPath = path.resolve(__dirname, '../compiled/Car.json');
const { interface, bytecode } = require(contractPath);

// 2.配置provider
const provider = new HDWalletProvider(
    'follow patch rose nose sustain payment jelly comfort caught fabric boy ostrich',
    'https://rinkeby.infura.io/pEecYWxArqut0reBiyLx'
);

// 3.初始化web3 势力
const web3 = new Web3(provider);

(async () => {
    // 4.获取钱包里面的账户
    const accounts = await web3.eth.getAccounts();
    console.log('部署合约账户：', accounts[0]);



    // 5.创建合约实例并且部署
    console.time('contract-deploy');
    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ['AUDI'] })
        .send({ from: accounts[0], gas: 1000000 });

    console.timeEnd('contract-deploy');

    console.log('合约部署成功：', result.options.address);

})();

