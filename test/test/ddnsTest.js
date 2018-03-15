const ddns = artifacts.require("ddns");

contract('DDNS test', async (accounts) => {

  /** DOMAIN REGISTRY */
  it("Register domain and get it", async () => {
    let instance = await ddns.deployed();
    assert(false, "TEST NOT IMPLEMENTED");
  })
  it("Register domain, edit it and get it", async () => {
    let instance = await ddns.deployed();
    assert(false, "TEST NOT IMPLEMENTED");
  })
  it("Register domain, transfer it and check the owner", async () => {
    let instance = await ddns.deployed();
    assert(false, "TEST NOT IMPLEMENTED");
  })
  it("Register domain and pay to extend for one more year", async () => {
    let instance = await ddns.deployed();
    assert(false, "TEST NOT IMPLEMENTED");
  })
  it("Register domain for multiple years", async () => {
    let instance = await ddns.deployed();
    assert(false, "TEST NOT IMPLEMENTED");
  })
  it("Register expensive domain for multiple years", async () => {
    let instance = await ddns.deployed();
    assert(false, "TEST NOT IMPLEMENTED");
  })
  it("Register domain 4 times and verify the Receits are correct", async () => {
    let instance = await ddns.deployed();
    assert(false, "TEST NOT IMPLEMENTED");
  })

  /** ACCESS CONTROL */
  it("Try to edit without registering", async () => {
    let instance = await ddns.deployed();
    assert(false, "TEST NOT IMPLEMENTED");
  })
  it("Try to transfer without registering", async () => {
    let instance = await ddns.deployed();
    assert(false, "TEST NOT IMPLEMENTED");
  })
  it("Try to get address without registering", async () => {
    let instance = await ddns.deployed();
    assert(false, "TEST NOT IMPLEMENTED");
  })
  it("Try to get Receits of unknown user", async () => {
    let instance = await ddns.deployed();
    assert(false, "TEST NOT IMPLEMENTED");
  })
  it("Register domain and try to register with different user", async () => {
    let instance = await ddns.deployed();
    assert(false, "TEST NOT IMPLEMENTED");
  })
  it("Register domain and try to edit with different user", async () => {
    let instance = await ddns.deployed();
    assert(false, "TEST NOT IMPLEMENTED");
  })
  it("Register domain and try to transfer with different user", async () => {
    let instance = await ddns.deployed();
    assert(false, "TEST NOT IMPLEMENTED");
  })



  /** PRICE FUNCTION */
  it("Check prices of different domain lengths", async () => {
    let instance = await ddns.deployed();
    assert(false, "TEST NOT IMPLEMENTED");
  })
  it("Register domain with 4 character and verify price is 100", async () => {
    let instance = await ddns.deployed();
    assert(false, "TEST NOT IMPLEMENTED");
  })
  it("Register domain with 5 character and verify price is 50", async () => {
    let instance = await ddns.deployed();
    assert(false, "TEST NOT IMPLEMENTED");
  })
  it("Register domain with 6 character and verify price is 10", async () => {
    let instance = await ddns.deployed();
    assert(false, "TEST NOT IMPLEMENTED");
  })
  it("Register domain with 7 character and verify price is 5", async () => {
    let instance = await ddns.deployed();
    assert(false, "TEST NOT IMPLEMENTED");
  })
  it("Register domain with 8 character and verify price is 2", async () => {
    let instance = await ddns.deployed();
    assert(false, "TEST NOT IMPLEMENTED");
  })

  /** OWNER */
  it("Test withdrawing", async () => {
    let instance = await ddns.deployed();
    assert(false, "TEST NOT IMPLEMENTED");
  })


  /** HARDCORE */
  it("Try to send money for no reason (low gas)", async () => {
    let instance = await ddns.deployed();
    assert(false, "TEST NOT IMPLEMENTED");
  })
  it("Register domain and 'wait' 1 year to verify it expired", async () => {
    let instance = await ddns.deployed();
    assert(false, "TEST NOT IMPLEMENTED");
  })


  // it("should put 10000 MetaCoin in the first account", async () => {
  //   let instance = await MetaCoin.deployed();
  //   let balance = await instance.getBalance.call(accounts[0]);
  //   assert.equal(balance.valueOf(), 10000);
  // })

  // it("should put 10000 MetaCoin in the first account", async () => {
  //   let instance = await MetaCoin.deployed();
  //   let balance = await instance.getBalance.call(accounts[0]);
  //   assert.equal(balance.valueOf(), 10000);
  // })

  // it("should call a function that depends on a linked library", async () => {
  //   let meta = await MetaCoin.deployed();
  //   let outCoinBalance = await meta.getBalance.call(accounts[0]);
  //   let metaCoinBalance = outCoinBalance.toNumber();
  //   let outCoinBalanceEth = await meta.getBalanceInEth.call(accounts[0]);
  //   let metaCoinEthBalance = outCoinBalanceEth.toNumber();
  //   assert.equal(metaCoinEthBalance, 2 * metaCoinBalance);
  // });

  // it("should send coin correctly", async () => {
  //   // Get initial balances of first and second account.
  //   let account_one = accounts[0];
  //   let account_two = accounts[1];
  //   let amount = 10;
  //   let instance = await MetaCoin.deployed();
  //   let meta = instance;
  //   let balance = await meta.getBalance.call(account_one);
  //   let account_one_starting_balance = balance.toNumber();
  //   balance = await meta.getBalance.call(account_two);
  //   let account_two_starting_balance = balance.toNumber();
  //   await meta.sendCoin(account_two, amount, { from: account_one });
  //   balance = await meta.getBalance.call(account_one);
  //   let account_one_ending_balance = balance.toNumber();
  //   balance = await meta.getBalance.call(account_two);
  //   let account_two_ending_balance = balance.toNumber();
  //   assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
  //   assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
  // });

})