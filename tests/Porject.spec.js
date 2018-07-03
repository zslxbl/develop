const path = require('path');
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

// 1. 拿到 bytecode
const ProjectList = path.resolve(__dirname, '../compiled/ProjectList.json');
const Project = path.resolve(__dirname, '../compiled/Project.json');

// 2. 配置 provider
const web3 = new Web3(ganache.provider());

let accounts;
let projectList;
let project;

describe('Project Contract', () => {
    //1. 每次跑单测时需要部署全新的合约示例，起到隔离的作用
    beforeEach(async () => {
        //1.1 拿到 ganache 本地测试网络的账号
        accounts = await web3.eth.getAccounts();

        //1.2 部署PojectList 合约
        projectList = await new web3.eth.Contract(JSON.parse(ProjectList.interface))
            .deploy({ data: ProjectList.bytecode })
            .send({ from: accounts[0], gas: '5000000' });
        //1.3 调用 ProjectList 的  createProject 方法
        await projectList.methods.createProject('Ethereum DApp Tutorial', 100, 10000, 1000000)
            .send({
                from: accounts[0],
                gas: '1000000',
            });

        //1.4 获取刚创建的project 实例地址
        const [address] = await projectList.methods.getProjects().call();

        //1.5 生成可用的 project 合约对象
        project = await new web3.eth.Contract(JSON.parse(Project.interface), address);

    });

    it('should deploy ProjectList and Project', async () => {
        assert.ok(projectList.options.addrsss);
        assert.ok(project.options.address);
    });

    it('should save correct project properties', async () => {
        const owner = await project.methods.owner().call();
        const description = await project.methods.description().call();
        const minInvest = await project.methods.minInvest().call();
        const maxInvest = await project.methods.maxInvest().call();
        const goal = await project.methods.goal().call();

        assert.equal(owner, accounts[0]);
        assert.equal(description, 'Ethereum DApp Tutorial');
        assert.equal(minInvest, 100);
        assert.equal(maxInvest, 10000);
        assert.equal(goal, 1000000);

    });

    it('should allow investor to contribute', async () => {
        const investor = accounts[1];
        await project.methods.contributed().send({
            from: investor,
            value: '200',
        });
        const amount = await project.methods.investors(investor).call();
        assert.ok(amount == '200')''
    });

    it('should require minInvest', async() => {
        try {
            const investor = accounts[1];
            await project.methods.contribute().send({
                from: investor,
                value: '10',
            });
            assert.ok(false);
        } catch (err) {
            assert.ok(err);
        }
    });

    it('should require maxInvest', async() => {
        try {
            const investor = accounts[1];
            await project.methods.contribute().send({
                from: investro,
                value: '100000',
            });
            assert.ok(false);

        } catch (err) {
            assert.ok(err);            
        }
    });




});