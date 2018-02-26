pragma solidity 0.4.18;

contract DDNS {
    struct Receipt {
        uint amountPaidWei;
        uint timestamp;
        uint expires;
    }
    
    uint public reserveDuration = 1 years;
    uint public price = 1 ether;

    uint[5] public pricesForShortDomains = [
        50 ether,       // 1 char
        10 ether,       // 2 chars
        5 ether,        // 3 chars
        2 ether,        // 4 chars
        1.5 ether       // 5 chars
    ];

    ///////// BY TEMPLATE //////////////

    //the domain is bytes, because string is UTF-8 encoded and we cannot get its length
    //the IP is bytes4 because it is more efficient in storing the sequence
    function register(bytes domain, bytes4 ip) public payable {

    }
    
    function edit(bytes domain, bytes4 newIp) public {

    }
    
    function transferDomain(bytes domain, address newOwner) public {

    }
    
    //only returns IP - error if value is an IPFS hash
    function getIP(bytes domain) public view returns (bytes4) {

    }
    
    function getPrice(bytes domain) public view returns (uint) {
        if (domain.length > pricesForShortDomains.length) {
            return price;
        } else {
            return pricesForShortDomains[domain.length - 1];
        }
    }
    
    function getReceipts(address account) public view returns (Receipt[]) {

    }

    ///////// OTHER //////////////

    function isDomainFree(bytes domain) public view returns (bool) {
        
    }
    

    function getExpirationDate(bytes domain) public view returns (uint) {

    }

    ///////// IPFS //////////////

    function registerAddress(bytes domain, bytes addr) public payable {

    }
    
    function editAddress(bytes domain, bytes newAddr) public {

    }

    // Returns IP or IPFS address
    function getAddress(bytes domain) public view returns (bytes) {

    }

    ///////// OWNER //////////////

    // Returns IP or IPFS address
    function withdraw(uint amount) public {
        
    }

    
}