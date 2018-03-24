
var contractInstance;
var abi = [{"constant":true,"inputs":[{"name":"domain","type":"bytes"}],"name":"getOwnerOf","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"domain","type":"bytes"}],"name":"getExpirationDate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"reserveDuration","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"domain","type":"bytes"}],"name":"getPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"domain","type":"bytes"}],"name":"isDomainFree","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"pricesForShortDomains","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"domain","type":"bytes"},{"name":"newOwner","type":"address"}],"name":"transferDomain","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"price","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"receipts","outputs":[{"name":"amountPaidWei","type":"uint256"},{"name":"timestamp","type":"uint256"},{"name":"expires","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"domain","type":"bytes"},{"name":"newIpfsAddress","type":"bytes"}],"name":"edit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"domain","type":"bytes"},{"name":"ipfsAddress","type":"bytes"}],"name":"register","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"domain","type":"bytes"}],"name":"getIP","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"actor","type":"address"},{"indexed":false,"name":"domain","type":"bytes"},{"indexed":false,"name":"weiPaid","type":"uint256"},{"indexed":false,"name":"expires","type":"uint256"}],"name":"domainRegisteredEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"actor","type":"address"},{"indexed":false,"name":"domain","type":"bytes"},{"indexed":false,"name":"weiPaid","type":"uint256"},{"indexed":false,"name":"expires","type":"uint256"}],"name":"domainExtendedEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"actor","type":"address"},{"indexed":false,"name":"domain","type":"bytes"},{"indexed":false,"name":"oldIP","type":"bytes"},{"indexed":false,"name":"newIP","type":"bytes"}],"name":"domainEditedEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"actor","type":"address"},{"indexed":false,"name":"domain","type":"bytes"},{"indexed":false,"name":"newOwner","type":"address"}],"name":"domainTransferedEvent","type":"event"}]
var address = "0x080564843E9B9AD70d7EB9c415a2FF8031Cc870F";

if (!web3) {
    //if there is no web3 variable
    alert("Error! Are you sure that you are using metamask?");
} else {
    init();
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
}

function openInNewTab(url) {
    console.log("Opening " + url);
    var win = window.open(url, '_blank');
    win.focus();
}

function callContractMethod(methodName, args, value, callback, local) {

    var onResponce = function (err, res) {
        if (!err) {
            console.log("Success! Transaction result: " + res);
            callback(undefined, res);
        } else {
            console.log("Something went wrong.");
            console.error(err);
            callback(err);
        }
    };

    web3.eth.getAccounts(function (error, accounts) {
        var acc = web3.toChecksumAddress(accounts[0]) || "[web3.eth.accounts[0] == false]";
        var options = { from: acc, gas: 3000000 };
        if (value)
            options.value = value;

        console.log("Calling '" + methodName + "(" + args.map(i => JSON.stringify(i)) + ")' with options: " + JSON.stringify(options, null, 2));

        args.push(options);
        args.push(onResponce);

        var funcToCall = local ? contractInstance[methodName] : contractInstance[methodName].call;
        funcToCall.apply(this, args);
    });
}

function onRegisterBtnPress() {
    var domain = $("#domain-reg").val();
    var addr = $("#addr-reg").val();
    var years = parseInt($("#years-reg").val());


    callContractMethod("getPrice", [domain], null, function (err, price) {
        if (!err) {
            callContractMethod("register", [domain, addr], parseInt(price) * years, function (err, outcome) {
                if (!err)
                    alert("Success");
                else
                    alert("Something went wrong. See the console for more details.");
            });
        }
        else {
            alert("Something went wrong. See the console for more details.");
        }
    })
}

function onGoBtnPress() {
    var domain = $("#domain-go").val();
    callContractMethod("getIP", [domain], null, function (err, outcome) {
        if (!err) {
            var ipfsAddress = bytesToString(hexToBytes(outcome));
            var url = "https://ipfs.io/ipfs/"+ipfsAddress;
            openInNewTab(url);
        } else {
            alert("Something went wrong. See the console for more details.");
        }
    })
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

    callContractMethod("edit", [domain, addr], null, function (err, outcome) {
        if (!err)
            alert("Success");
        else
            alert("Something went wrong. See the console for more details.");
    });
}

function onTransferBtnPress() {
    var domain = $("#domain-transfer").val();
    var owner = $("#owner-transfer").val();

    if (!owner) {
        alert("You must specify a new owner address!");
        return;
    }

    callContractMethod("transferDomain", [domain, owner], null, function (err, outcome) {
        if (!err)
            alert("Success");
        else
            alert("Something went wrong. See the console for more details.");
    });
}