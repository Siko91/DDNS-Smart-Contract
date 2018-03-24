
var contractInstance;
var abi = [{"constant":true,"inputs":[{"name":"domain","type":"bytes"}],"name":"getOwnerOf","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"domain","type":"bytes"}],"name":"getExpirationDate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"reserveDuration","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"domain","type":"bytes"}],"name":"getPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"domain","type":"bytes"}],"name":"isDomainFree","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"pricesForShortDomains","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"domain","type":"bytes"},{"name":"newOwner","type":"address"}],"name":"transferDomain","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"price","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"receipts","outputs":[{"name":"amountPaidWei","type":"uint256"},{"name":"timestamp","type":"uint256"},{"name":"expires","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"domain","type":"bytes"},{"name":"newIpfsAddress","type":"bytes"}],"name":"edit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"domain","type":"bytes"},{"name":"ipfsAddress","type":"bytes"}],"name":"register","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"domain","type":"bytes"}],"name":"getIP","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"actor","type":"address"},{"indexed":false,"name":"domain","type":"bytes"},{"indexed":false,"name":"weiPaid","type":"uint256"},{"indexed":false,"name":"expires","type":"uint256"}],"name":"domainRegisteredEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"actor","type":"address"},{"indexed":false,"name":"domain","type":"bytes"},{"indexed":false,"name":"weiPaid","type":"uint256"},{"indexed":false,"name":"expires","type":"uint256"}],"name":"domainExtendedEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"actor","type":"address"},{"indexed":false,"name":"domain","type":"bytes"},{"indexed":false,"name":"oldIP","type":"bytes"},{"indexed":false,"name":"newIP","type":"bytes"}],"name":"domainEditedEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"actor","type":"address"},{"indexed":false,"name":"domain","type":"bytes"},{"indexed":false,"name":"newOwner","type":"address"}],"name":"domainTransferedEvent","type":"event"}]
var address = "0x080564843E9B9AD70d7EB9c415a2FF8031Cc870F";

if (!web3) {
    //if there is no web3 variable
    alert("Error! Are you sure that you are using metamask?");
} else {
    init();
}

/** returns pretty much the same object, but makes it log when it's methods are called */
function objectWithLoggingMethods(obj, recursive){
    var result = {};
    var properties = [];
    for (var i in obj)
        properties.push(i);
    
    properties.forEach(function(i) {
        if (typeof obj[i] === "function") {
            result[i] = function(){
                var args= Object.keys(arguments).map(k=>arguments[k]);
                console.log("-----------------")
                console.log("Calling function '" + i + "' with ( " + args + " )");
                var outcome = obj[i].apply(this, args);
                console.log("Finished '" + i + "'. Outcome : " + outcome);
                return outcome;
            }
            result[i].call = function(){
                var args= Object.keys(arguments).map(k=>arguments[k]);
                console.log("-----------------")
                console.log("Calling function '" + i + ".call' with ( " + args + " )");
                var outcome = obj[i].call.apply(this, args);
                console.log("Finished '" + i + "'. Outcome : " + outcome);
                return outcome;
            }
        }
        else if(recursive)
            result[i] = objectWithLoggingMethods(obj[i]);
        else
            result[i] = obj[i];
    }, this);

    if(properties.length == 0)
        result = obj;

    return result;
}

/** wraps a standart callback (err, data) to add log statements around it */
function callbackWithLog(callback) {
    var result = function (err, data) {
        if (!err) {
            console.log("Success! result: " + data);
            callback(undefined, data);
        } else {
            console.log("Something went wrong.");
            console.error(err);
            callback(err);
        }
    };
    result.toString = function(){ return "function callbackWithLog(err,data){/**...*/}"; };
    return result;
}

function getWeb3Accounts(callback) {
    web3.eth.getAccounts(callbackWithLog(function (error, accounts) {
        if(error)
            return;
        callback(accounts.map(a => web3.toChecksumAddress(a)));
    }));
}

function init() {
    var Contract = web3.eth.contract(abi);
    contractInstance = Contract.at(address);
    $("#btn-go").on("click", null, onGoBtnPress);
    $("#btn-reg").on("click", null, onRegisterBtnPress);
    $("#btn-edit").on("click", null, onEditBtnPress);
    $("#btn-transfer").on("click", null, onTransferBtnPress);
    console.log("Welcome to our DAPP!");
    console.log(contractInstance);

    contractInstance = objectWithLoggingMethods(contractInstance);
}

function openInNewTab(url) {
    console.log("Opening " + url);
    var win = window.open(url, '_blank');
    win.focus();
}

function onRegisterBtnPress() {
    var domain = $("#domain-reg").val();
    var addr = $("#addr-reg").val();
    var years = parseInt($("#years-reg").val());

    getWeb3Accounts(function (accounts) {
        var op = { from: accounts[0], gas: 3000000 };
        contractInstance.getPrice.call(domain, op, callbackWithLog(function (err, price) {
            if (err) 
                return alert("Something went wrong. See the console for more details.");
        
            var toPay = parseInt(price) * years;
            var op = { from: accounts[0], gas: 3000000, value: toPay };
            contractInstance.register(domain, addr, op, callbackWithLog(function (err2, data2) { 
                if (!err2)
                    alert("Success");
                else
                    alert("Something went wrong. See the console for more details.");
            }));
        }));
    });
}

function onGoBtnPress() {
    var domain = $("#domain-go").val();

    getWeb3Accounts(function (accounts) {
        var op = { from: accounts[0], gas: 3000000 };
        contractInstance.getIP.call(domain, op, callbackWithLog(function (err, data) {
            if (!err) {
                var ipfsAddress = bytesToString(hexToBytes(data));
                var url = "https://ipfs.io/ipfs/"+ipfsAddress;
                openInNewTab(url);
            } else {
                alert("Something went wrong. See the console for more details.");
            }
        }));
    });
}

function hexToBytes(hex) {
    if(hex.substr(0,2) == "0x")
        hex = hex.substr(2);
    for (var bytes = [], c = 0; c < hex.length; c += 2) {
        bytes.push(parseInt(hex.substr(c, 2), 16));
    }
    console.log("Converted to byte array: " + bytes);
    return bytes;
}
function bytesToString(bytes) {
    var result = "";
    for (var i = 0; i < bytes.length; i++) {
        result += String.fromCharCode(bytes[i]);
    }
    console.log("Converted to string: " + result);
    return result;
}

function onEditBtnPress() {
    var domain = $("#domain-edit").val();
    var addr = $("#addr-edit").val();

    getWeb3Accounts(function (accounts) {
        var op = { from: accounts[0], gas: 3000000 };
        contractInstance.edit(domain, addr, op, callbackWithLog(function (err, data) { 
            if (!err)
                alert("Success");
            else
                alert("Something went wrong. See the console for more details.");
        }));
    });
}

function onTransferBtnPress() {
    var domain = $("#domain-transfer").val();
    var owner = $("#owner-transfer").val();

    if (!owner) {
        alert("You must specify a new owner address!");
        return;
    }

    getWeb3Accounts(function (accounts) {
        var op = { from: accounts[0], gas: 3000000 };
        contractInstance.transferDomain(domain, owner, op, callbackWithLog(function (err, data) { 
            if (!err)
                alert("Success");
            else
                alert("Something went wrong. See the console for more details.");
        }));
    });
}