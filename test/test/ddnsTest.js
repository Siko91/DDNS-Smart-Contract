const ddns = artifacts.require("DDNS");

contract('DDNS test: ', async (accounts) => {

  function hexToBytes(hex) {
    if (hex.substr(0, 2) == "0x")
      hex = hex.substr(2);
    for (var bytes = [], c = 0; c < hex.length; c += 2) {
      bytes.push(parseInt(hex.substr(c, 2), 16));
    }
    return bytes;
  }

  function bytesToString(bytes) {
    var result = "";
    for (var i = 0; i < bytes.length; i++) {
      result += String.fromCharCode(bytes[i]);
    }
    return result;
  }

  function increaseTime(increaseBy) {
    web3.eth.getBlock(web3.eth.blockNumber).timestamp
    web3.currentProvider.send({
      jsonrpc: "2.0",
      method: "evm_increaseTime",
      params: [increaseBy],
      id: 0
    })
    web3.currentProvider.send({
      jsonrpc: "2.0",
      method: "evm_mine",
      params: [],
      id: 0
    })
  }

  var chars = 'abcdefghijklmnopqrstuvwxyz_!@#$%^&*()-+=123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  function randomDomainName(len) {
    var result = [];
    for (var i = 0; i < len; i++)
      result.push(chars[Math.random() * chars.length | 0]);
    var domainName = result.join('');
    console.log("\t\t - Selected domain name: " + domainName);
    return domainName;
  }

  const ether = 1000000000000000000;
  const ipfsAddr = "QmRk3s2ozQPKXLKeqRL7fDQqtNazJ2pM9tVw19CU9p7WDQ";

  var year = 31557600; // in seconds
  var day = 86400; // in seconds

  var noPayTxOpts = {
    from: accounts[1],
    gas: 3000000
  };

  ////////////////////////////////////////
  /** DOMAIN REGISTRY */
  it("Register domain and get it", async () => {
    var domain = randomDomainName(20);

    var regTxOpts = {
      from: accounts[1],
      gas: 3000000,
      value: 1 * ether
    };
    var instance = await ddns.deployed();
    await instance.register(domain, ipfsAddr, regTxOpts);

    var registeredAddressRaw = await instance.getIP.call(domain);
    var registeredAddress = bytesToString(hexToBytes(registeredAddressRaw));
    expect(registeredAddress).to.equal(ipfsAddr);
  })

  it("Register domain, edit it and get it", async () => {
    var domain = randomDomainName(20);

    var regTxOpts = {
      from: accounts[1],
      gas: 3000000,
      value: 1 * ether
    };
    var instance = await ddns.deployed();
    await instance.register(domain, ipfsAddr, regTxOpts);

    await instance.edit(domain, "edited", noPayTxOpts);
    var registeredAddressRaw = await instance.getIP.call(domain);
    var registeredAddress = bytesToString(hexToBytes(registeredAddressRaw));
    expect(registeredAddress).to.equal("edited");
  })

  it("Register domain, transfer it and check the owner", async () => {
    var domain = randomDomainName(20);

    var regTxOpts = {
      from: accounts[1],
      gas: 3000000,
      value: 1 * ether
    };
    var instance = await ddns.deployed();
    await instance.register(domain, ipfsAddr, regTxOpts);

    await instance.transferDomain(domain, accounts[2], noPayTxOpts);
    var owner = await instance.getOwnerOf.call(domain);
    expect(owner).to.equal(accounts[2]);
  })

  it("Register domain and pay to extend for one more year", async () => {
    var domain = randomDomainName(20);

    var now = new Date() - 0; // '-0' converts it to number

    var regTxOpts = {
      from: accounts[1],
      gas: 3000000,
      value: 1 * ether
    };
    var instance = await ddns.deployed();

    await instance.register(domain, ipfsAddr, regTxOpts);
    var expires1 = await instance.getExpirationDate.call(domain);

    var after1 = now + year
    assert(after1 - (2 * day) < expires1 < after1 + (2 * day),
      "The initial period was not ~1 year");

    await instance.register(domain, ipfsAddr, regTxOpts);
    var expires2 = await instance.getExpirationDate.call(domain);

    var after2 = now + (2 * year)
    assert(after2 - (2 * day) < expires2 < after2 + (2 * day),
      "The extended period was not ~2 year");
  })

  it("Register domain for multiple years", async () => {
    var domain = randomDomainName(20);

    var now = new Date() - 0; // '-0' converts it to number

    var regTxOpts = {
      from: accounts[1],
      gas: 3000000,
      value: 1 * ether
    };
    var instance = await ddns.deployed();

    regTxOpts.value = regTxOpts.value * 3; // for 3 years
    await instance.register(domain + "_3y", ipfsAddr, regTxOpts);
    var expires = await instance.getExpirationDate.call(domain + "_3y");

    var after3 = now + (3 * year)
    assert(after3 - (2 * day) < expires < after3 + (2 * day),
      "The prepaid period was not ~3 year");
  })

  it("Register expensive domain for multiple years", async () => {
    var domain = randomDomainName(8);
    var now = new Date() - 0; // '-0' converts it to number

    var regTxOpts = {
      from: accounts[1],
      gas: 3000000,
      value: 2.01 * ether
    }; // double price for 8 chars
    var instance = await ddns.deployed();

    regTxOpts.value = regTxOpts.value * 3; // for 3 years
    await instance.register(domain, ipfsAddr, regTxOpts);
    var expires = await instance.getExpirationDate.call(domain);

    var after3 = now + (3 * year)
    assert(after3 - (2 * day) < expires < after3 + (2 * day),
      "The prepaid expensive period was not ~3 year");
  })

  ////////////////////////////////////////
  /** ACCESS CONTROL */
  it("Try to edit without registering", async () => {
    var domain = randomDomainName(20);
    var instance = await ddns.deployed();

    try {
      await instance.edit(domain, "edited", noPayTxOpts);
      assert(false, "expected 'edit' to throw an exception, but it didn't.");
    } catch (error) {
      expect(error.message).to.equal("VM Exception while processing transaction: revert");
    }
  })

  it("Try to transfer without registering", async () => {
    var domain = randomDomainName(20);
    var instance = await ddns.deployed();

    try {
      await instance.transferDomain(domain, accounts[2], noPayTxOpts);
      assert(false, "expected 'edit' to throw an exception, but it didn't.");
    } catch (error) {
      expect(error.message).to.equal("VM Exception while processing transaction: revert");
    }
  })

  it("Try to get address without registering", async () => {
    var domain = randomDomainName(20);
    var instance = await ddns.deployed();

    try {
      await instance.getIP.call(domain, noPayTxOpts);
      assert(false, "expected 'getIP' to throw an exception, but it didn't.");
    } catch (error) {
      expect(error.message).to.equal("VM Exception while processing transaction: revert");
    }
  })

  it("Register domain and try to register with different user", async () => {
    var domain = randomDomainName(20);

    var regTxOpts = {
      from: accounts[1],
      gas: 3000000,
      value: 1 * ether
    };
    var instance = await ddns.deployed();
    await instance.register(domain, ipfsAddr, regTxOpts);
    regTxOpts.from = accounts[2];

    try {
      await instance.register(domain, ipfsAddr, regTxOpts);
      assert(false, "expected 'register' to throw an exception, but it didn't.");
    } catch (error) {
      expect(error.message).to.equal("VM Exception while processing transaction: revert");
    }
  })

  it("Register domain and try to edit with different user", async () => {
    var domain = randomDomainName(20);

    var regTxOpts = {
      from: accounts[1],
      gas: 3000000,
      value: 1 * ether
    };
    var instance = await ddns.deployed();
    await instance.register(domain, ipfsAddr, regTxOpts);

    var diffUserOpts = {
      from: accounts[2],
      gas: 3000000
    };

    try {
      await instance.edit(domain, "edited", diffUserOpts);
      assert(false, "expected 'edit' to throw an exception, but it didn't.");
    } catch (error) {
      expect(error.message).to.equal("VM Exception while processing transaction: revert");
    }
  })

  it("Register domain and try to transfer with different user", async () => {
    var domain = randomDomainName(20);

    var regTxOpts = {
      from: accounts[1],
      gas: 3000000,
      value: 1 * ether
    };
    var instance = await ddns.deployed();
    await instance.register(domain, ipfsAddr, regTxOpts);

    var diffUserOpts = {
      from: accounts[2],
      gas: 3000000
    };

    try {
      await instance.transferDomain(domain, accounts[3], diffUserOpts);
      assert(false, "expected 'transferDomain' to throw an exception, but it didn't.");
    } catch (error) {
      expect(error.message).to.equal("VM Exception while processing transaction: revert");
    }
  })

  ////////////////////////////////////////
  /** PRICE FUNCTION */
  it("Check prices of different domain lengths", async () => {
    var instance = await ddns.deployed();

    // 1 char : 5000 ether/year
    // 2 chars : 1000 ether/year
    // 3 chars : 500 ether/year
    // 4 chars : 100 ether/year
    // 5 chars : 50 ether/year
    // 6 chars : 10 ether/year
    // 7 chars : 5 ether/year
    // 8 chars : 2 ether/year
    // 9 chars : 1.5 ether/year
    // 10 chars : 1.1 ether/year
    // 11 or more chars : 1 ether/year

    var prices = [5000, 1000, 500, 100, 50, 10, 5, 2, 1.5, 1.1, 1]

    for (var i = 0; i < prices.length; i++) {
      var domain = randomDomainName(i + 1);
      var price = await instance.getPrice.call(domain, noPayTxOpts);
      expect(Math.abs(price.toNumber() - (prices[i] * ether)) < 10000,
        "Price wasn't as expected : " + (i + 1) + "ch, '" + domain + "', " + prices[i] + " ether\n\t" +
        "Expected: " + price.toNumber() + "\n" +
        "To Equal: " + prices[i] * ether);
    }
  })

  it("Register domain with 0 characters should fail", async () => {
    var domain = "";
    var instance = await ddns.deployed();

    var regTxOpts = {
      from: accounts[1],
      gas: 3000000,
      value: 2 * ether
    };

    try {
      await instance.register(domain, ipfsAddr, regTxOpts);
      assert(false, "expected 'register' to throw an exception, but it didn't.");
    } catch (error) {
      expect(error.message).to.equal("VM Exception while processing transaction: revert");
    }
  })

  it("Register domain with 5 character and verify price is 50", async () => {
    var domain = randomDomainName(5);
    var now = new Date() - 0; // '-0' converts it to number


    var regTxOpts = {
      from: accounts[1],
      gas: 3000000,
      value: 50 * ether
    };
    var instance = await ddns.deployed();
    await instance.register(domain, ipfsAddr, regTxOpts);

    var registeredAddressRaw = await instance.getIP.call(domain);
    var registeredAddress = bytesToString(hexToBytes(registeredAddressRaw));
    expect(registeredAddress).to.equal(ipfsAddr);

    var expires = await instance.getExpirationDate.call(domain);

    var after1 = now + year
    assert(after1 - (2 * day) < expires < after1 + (2 * day),
      "The expensive domain period was not ~1 year");
  })

  it("Register domain with 6 character and verify price is 10", async () => {
    var domain = randomDomainName(6);
    var now = new Date() - 0; // '-0' converts it to number


    var regTxOpts = {
      from: accounts[1],
      gas: 3000000,
      value: 10 * ether
    };
    var instance = await ddns.deployed();
    await instance.register(domain, ipfsAddr, regTxOpts);

    var registeredAddressRaw = await instance.getIP.call(domain);
    var registeredAddress = bytesToString(hexToBytes(registeredAddressRaw));
    expect(registeredAddress).to.equal(ipfsAddr);

    var expires = await instance.getExpirationDate.call(domain);

    var after1 = now + year
    assert(after1 - (2 * day) < expires < after1 + (2 * day),
      "The expensive domain period was not ~1 year");
  })

  it("Register domain with 7 character and verify price is 5", async () => {
    var domain = randomDomainName(7);
    var now = new Date() - 0; // '-0' converts it to number


    var regTxOpts = {
      from: accounts[1],
      gas: 3000000,
      value: 5 * ether
    };
    var instance = await ddns.deployed();
    await instance.register(domain, ipfsAddr, regTxOpts);

    var registeredAddressRaw = await instance.getIP.call(domain);
    var registeredAddress = bytesToString(hexToBytes(registeredAddressRaw));
    expect(registeredAddress).to.equal(ipfsAddr);

    var expires = await instance.getExpirationDate.call(domain);

    var after1 = now + year
    assert(after1 - (2 * day) < expires < after1 + (2 * day),
      "The expensive domain period was not ~1 year");
  })

  it("Register domain with 8 character and verify price is 2", async () => {
    var domain = randomDomainName(8);
    var now = new Date() - 0; // '-0' converts it to number

    var regTxOpts = {
      from: accounts[1],
      gas: 3000000,
      value: 2 * ether
    };
    var instance = await ddns.deployed();
    await instance.register(domain, ipfsAddr, regTxOpts);

    var registeredAddressRaw = await instance.getIP.call(domain);
    var registeredAddress = bytesToString(hexToBytes(registeredAddressRaw));
    expect(registeredAddress).to.equal(ipfsAddr);

    var expires = await instance.getExpirationDate.call(domain);

    var after1 = now + year
    assert(after1 - (2 * day) < expires < after1 + (2 * day),
      "The expensive domain period was not ~1 year");
  })

  ////////////////////////////////////////
  /** OWNER */
  it("Test withdrawing", async () => {
    var instance = await ddns.deployed();
    var opts = {
      from: accounts[0],
      gas: 3000000
    };
    await instance.withdraw(5 * ether, opts);
  })

  ////////////////////////////////////////
  /** OTHER */
  it("Try to send money for no reason (low gas)", async () => {
    var instance = await ddns.deployed();
    var regTxOpts = {
      from: accounts[1],
      gas: 3000000,
      value: 2 * ether
    };

    try {
      await web3.eth.sendTransaction({
        from: accounts[0],
        to: instance.address,
        value: 5 * ether
      });
      assert(false, "expected 'sendTransaction' to throw an exception, but it didn't.");
    } catch (error) {
      expect(error.message).to.equal("VM Exception while processing transaction: revert");
    }
  })
  it("Get receits of user", async () => {
    var startTime = (new Date() - 0) / 1000 | 0;
    var domain = randomDomainName(20);

    var regTxOpts = {
      from: accounts[3],
      gas: 3000000,
      value: 1 * ether
    };
    var instance = await ddns.deployed();
    await instance.register(domain, ipfsAddr, regTxOpts);
    await instance.register(domain, ipfsAddr, regTxOpts);
    await instance.register(domain, ipfsAddr, regTxOpts);
    await instance.register(domain, ipfsAddr, regTxOpts);

    var receipts = [
      await instance.receipts.call(accounts[3], 0),
      await instance.receipts.call(accounts[3], 1),
      await instance.receipts.call(accounts[3], 2),
      await instance.receipts.call(accounts[3], 3)
    ].map(arr => arr.map(n => n.toNumber()));

    var i_amountPaidWei = 0;
    var i_timestamp = 1;
    var i_expires = 2;

    expect(receipts.length).to.equal(4, "wrong number of receits");
    expect(receipts[2][i_amountPaidWei]).to.equal(ether, "wrong amountPaidWei in receits");

    for (let i = 0; i < 4; i++) {
      var actual = receipts[i][i_expires];
      var shouldBeBiggerThan = startTime + ((i + 1) * year) - 3 * day; // 3 day tolerance
      assert(actual >= shouldBeBiggerThan,
        "Wrong expiration date in receits[" + i + "] - expected " + actual +
        " to be bigger than " + shouldBeBiggerThan);
    }
  })

  it("A domain name can expire", async () => {
    var startTime = (new Date() - 0) / 1000 | 0;
    var domain = randomDomainName(20);

    var regTxOpts = {
      from: accounts[3],
      gas: 3000000,
      value: 1 * ether
    };
    var instance = await ddns.deployed();
    await instance.register(domain, ipfsAddr, regTxOpts);

    increaseTime(1.5 * year);

    var expires = await instance.getExpirationDate.call(domain)
    var shouldBeBiggerThan = startTime + 1.5 * year - 3 * day; // 3 day tolerance
    
    assert(expires <= shouldBeBiggerThan,
      "Wrong expiration date - expected " + expires +
      " to be smaller than " + shouldBeBiggerThan);

    var isFree = await instance.isDomainFree.call(domain);
    expect(isFree).to.equal(false, "expired domain should be free");

    try {
      await instance.getIP.call(domain);
      assert(false, "expired domain should not return an address");
    } catch (error) {
      expect(error.message).to.equal("VM Exception while processing transaction: revert");
    }

    var owner = await instance.getOwnerOf.call(domain);
    expect(owner).to.equal(0, "expired domain should have no owner");

    assert(false, "NOT IMPLEMENTED!");
  })
})