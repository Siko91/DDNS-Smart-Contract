const ddns = artifacts.require("DDNS");

contract('DDNS test', async (accounts) => {

  /** PARSING FUNCTION */
  function hexToBytes(hex) {
    if(hex.substr(0,2) == "0x")
        hex = hex.substr(2);
    for (var bytes = [], c = 0; c < hex.length; c += 2) {
        bytes.push(parseInt(hex.substr(c, 2), 16));
    }
    return bytes;
  }
  /** PARSING FUNCTION */
  function bytesToString(bytes) {
    var result = "";
    for (var i = 0; i < bytes.length; i++) {
        result += String.fromCharCode(bytes[i]);
    }
    return result;
  }



  const ether = 1000000000000000000;
  const domain =  "this is my test domain";
  const ipfsAddr = "QmRk3s2ozQPKXLKeqRL7fDQqtNazJ2pM9tVw19CU9p7WDQ";

  var noPayTxOpts = {from: accounts[1], gas: 3000000};

  /** DOMAIN REGISTRY */
  it("Register domain and get it", async () => {
    var regTxOpts = {from: accounts[1], gas: 3000000, value: 1 * ether};
    var instance = await ddns.deployed();
    var domainRegisteredReply = await instance.register(domain, ipfsAddr, regTxOpts);
    
    var registeredAddressRaw = await instance.getIP.call(domain);
    var registeredAddress = bytesToString(hexToBytes(registeredAddressRaw));
    expect(registeredAddress).to.equal(ipfsAddr);
  })

  it("Register domain, edit it and get it", async () => {
    var regTxOpts = {from: accounts[1], gas: 3000000, value: 1 * ether};
    var instance = await ddns.deployed();
    var domainRegisteredReply = await instance.register(domain, ipfsAddr, regTxOpts);
    
    var domainRegisteredReply = await instance.edit(domain, "edited", noPayTxOpts);
    var registeredAddressRaw = await instance.getIP.call(domain);
    var registeredAddress = bytesToString(hexToBytes(registeredAddressRaw));
    expect(registeredAddress).to.equal("edited");
  })

  it("Register domain, transfer it and check the owner", async () => {
    var regTxOpts = {from: accounts[1], gas: 3000000, value: 1 * ether};
    var instance = await ddns.deployed();
    var domainRegisteredReply = await instance.register(domain, ipfsAddr, regTxOpts);
    
    var domainRegisteredReply = await instance.transferDomain(domain, accounts[2], noPayTxOpts);
    var owner = await instance.getOwnerOf.call(domain);
    expect(owner).to.equal(accounts[2]);
  })

  it("Register domain and pay to extend for one more year", async () => {
    var year = 31557600; // in seconds
    var day = 86400; // in seconds
    var now = new Date()-0; // '-0' converts it to number

    var regTxOpts = {from: accounts[1], gas: 3000000, value: 1 * ether};
    var instance = await ddns.deployed();

    var domainRegisteredReply = await instance.register(domain, ipfsAddr, regTxOpts);
    var expires1 = await instance.getExpirationDate.call(domain);

    assert(now + year - (2*day) < expires1 < now + year + (2*day),
      "The initial period was not ~1 year");

    var domainRegisteredReply = await instance.register(domain, ipfsAddr, regTxOpts);
    var expires2 = await instance.getExpirationDate.call(domain);
    
    assert(now + (2*year) - (2*day) < expires2 < now + (2*year) + (2*day),
      "The extended period was not ~2 year");
  })

  it("Register domain for multiple years", async () => {
    var year = 31557600; // in seconds
    var day = 86400; // in seconds
    var now = new Date()-0; // '-0' converts it to number

    var regTxOpts = {from: accounts[1], gas: 3000000, value: 1 * ether};
    var instance = await ddns.deployed();

    regTxOpts.value = regTxOpts.value * 3; // for 3 years
    var domainRegisteredReply = await instance.register(domain + "_3y", ipfsAddr, regTxOpts);
    var expires = await instance.getExpirationDate.call(domain + "_3y");
    
    assert(now + (3*year) - (2*day) < expires < now + (3*year) + (2*day),
      "The prepaid period was not ~3 year");
  })

  it("Register expensive domain for multiple years", async () => {
    var regTxOpts = {from: accounts[1], gas: 3000000, value: 2 * ether}; // double price for 8 chars
    var instance = await ddns.deployed();

    regTxOpts.value = regTxOpts.value * 3; // for 3 years
    var domainRegisteredReply = await instance.register("12345678", ipfsAddr, regTxOpts);
    var expires = await instance.getExpirationDate.call("12345678");
    
    assert(now + (3*year) - (2*day) < expires < now + (3*year) + (2*day),
      "The prepaid expensive period was not ~3 year");
  })
  
  it("Register domain 4 times and verify the Receits are correct", async () => {
    var regTxOpts = {from: accounts[1], gas: 3000000, value: 1 * ether};
    var instance = await ddns.deployed();
    var domainRegisteredReply = await instance.register(domain, ipfsAddr, regTxOpts);
    
    
    assert(false, "TEST NOT IMPLEMENTED");
  })

  /** ACCESS CONTROL */
  it("Try to edit without registering", async () => {
    
    assert(false, "TEST NOT IMPLEMENTED");
  })

  it("Try to transfer without registering", async () => {
    
    assert(false, "TEST NOT IMPLEMENTED");
  })

  it("Try to get address without registering", async () => {
    
    assert(false, "TEST NOT IMPLEMENTED");
  })

  it("Try to get Receits of unknown user", async () => {
    
    assert(false, "TEST NOT IMPLEMENTED");
  })

  it("Register domain and try to register with different user", async () => {
    
    assert(false, "TEST NOT IMPLEMENTED");
  })
  
  it("Register domain and try to edit with different user", async () => {
    
    assert(false, "TEST NOT IMPLEMENTED");
  })

  it("Register domain and try to transfer with different user", async () => {
    
    assert(false, "TEST NOT IMPLEMENTED");
  })



  /** PRICE FUNCTION */
  it("Check prices of different domain lengths", async () => {
    
    assert(false, "TEST NOT IMPLEMENTED");
  })

  it("Register domain with 4 character and verify price is 100", async () => {
    
    assert(false, "TEST NOT IMPLEMENTED");
  })

  it("Register domain with 5 character and verify price is 50", async () => {
    
    assert(false, "TEST NOT IMPLEMENTED");
  })

  it("Register domain with 6 character and verify price is 10", async () => {
    
    assert(false, "TEST NOT IMPLEMENTED");
  })

  it("Register domain with 7 character and verify price is 5", async () => {
    
    assert(false, "TEST NOT IMPLEMENTED");
  })

  it("Register domain with 8 character and verify price is 2", async () => {
    
    assert(false, "TEST NOT IMPLEMENTED");
  })

  /** OWNER */
  it("Test withdrawing", async () => {
    
    assert(false, "TEST NOT IMPLEMENTED");
  })


  /** HARDCORE */
  it("Try to send money for no reason (low gas)", async () => {
    
    assert(false, "TEST NOT IMPLEMENTED");
  })

  it("Register domain and 'wait' 1 year to verify it expired", async () => {
    
    assert(false, "TEST NOT IMPLEMENTED");
  })


  // it("should put 10000 MetaCoin in the first account", async () => {
  //   let var instance = await MetaCoin.deployed();
  //   let balance = await instance.getBalance.call(accounts[0]);
  //   assert.equal(balance.valueOf(), 10000);
  // })

  // it("should put 10000 MetaCoin in the first account", async () => {
  //   let var instance = await MetaCoin.deployed();
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
  //   let var instance = await MetaCoin.deployed();
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