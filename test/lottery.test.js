import assert from "assert";
import ganache from "ganache-cli";
import Web3 from "web3";

const web3 = new Web3(ganache.provider());
import code from "../compile.js";

const Interface = code.interface;
const bytecode = code.bytecode;

let accounts, lottery;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(JSON.parse(Interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Lottery Contract", () => {
  it("chal rha na", () => {
    assert.ok(lottery.options.address);
  });

  it("account enter hot ria na", async () => {
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("0.001", "ether"),
    });
    const players = await lottery.methods
      .getPlayers()
      .call({ from: accounts[0] });
    assert.equal(players[0], accounts[1]);
    assert.equal(players.length, 1);
  });

  it("multiple account enter hot ria na", async () => {
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("0.001", "ether"),
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei("0.001", "ether"),
    });
    await lottery.methods.enter().send({
      from: accounts[3],
      value: web3.utils.toWei("0.001", "ether"),
    });
    const players = await lottery.methods
      .getPlayers()
      .call({ from: accounts[0] });
    assert.equal(players[0], accounts[1]);
    assert.equal(players[1], accounts[2]);
    assert.equal(players[2], accounts[3]);
    assert.equal(players.length, 3);
  });

  it("paisa chaiye mereko", async () => {
    let rukgya = false;
    try {
      await lottery.methods.enter().send({ from: accounts[0], value: 1000 });
    } catch (e) {
      rukgya = true;
    }
    assert.ok(rukgya);
  });

  it("manager hi bhagwan hai", async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[1], value: web3.utils.toWei("0.001", "ether") });

    try {
      await lottery.methods.pickWinner().send({ from: accounts[1] });
      assert(false);
    } catch (e) {
      assert(e);
    }

    try {
      await lottery.methods.pickWinner().send({ from: accounts[2] });
      assert(false);
    } catch (e) {
      assert(e);
    }
  });

  it("enter ho ke jeet to paye!", async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[1], value: web3.utils.toWei("2", "ether") });
    const initialBalance = await web3.eth.getBalance(accounts[1]);
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    const finalBalance = await web3.eth.getBalance(accounts[1]);
    assert.equal(finalBalance - initialBalance, web3.utils.toWei("2", "ether"));
  });
});
