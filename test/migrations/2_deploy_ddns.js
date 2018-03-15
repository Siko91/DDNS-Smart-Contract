var ddns = artifacts.require("./contracts/ddns.sol");

module.exports = function(deployer) {
  deployer.deploy(ddns);
};
