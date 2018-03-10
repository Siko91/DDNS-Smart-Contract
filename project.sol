pragma solidity ^0.4.16;
pragma experimental ABIEncoderV2;

contract ContractWithCommonModifiers {
    modifier isMsgFrom(address expected){ 
        require(msg.sender == expected);
        _;
    }
    
    modifier timePassedSince(uint minSeconds, uint since){ 
        require(block.timestamp - since >= minSeconds);
        _;
    }
    
    modifier paidAtLeast(uint minWei){ 
        require(msg.value >= minWei);
        _;
    }
    
    modifier contractHasAtLeast(uint minWei){ 
        require(this.balance >= minWei);
        _;
    }
    
    modifier numberIsAtMost(uint num, uint max){ 
        require(num >= max);
        _;
    }
    
    modifier numberIsAtLeast(uint num, uint max){ 
        require(num <= max);
        _;
    }
    
    modifier isTrue(bool condition){ 
        require(condition);
        _;
    }
    
    modifier isShorterThanOrEqual(bytes input, uint maxLen){ 
        require(input.length <= maxLen);
        _;
    }
}

contract Owned is ContractWithCommonModifiers {
    address public owner;

    function Owned() public {
        owner = msg.sender;
    }

    // Returns IP or IPFS address
    function withdraw(uint amount) public isMsgFrom(owner) contractHasAtLeast(amount) {
        owner.transfer(amount);
    }
}

contract DDNS is Owned {
    struct Receipt {
        uint amountPaidWei;
        uint timestamp;
        uint expires;
    }

    struct Domain {
        uint expires;
        bytes ipfsAddress;
        address owner;
    }

    uint[10] public pricesForShortDomains = [
        5000 ether,         // 1 char
        1000 ether,         // 2 chars
        500 ether,          // 3 char
        100 ether,          // 4 chars
        50 ether,           // 5 char
        10 ether,           // 6 chars
        5 ether,            // 7 chars
        2 ether,            // 8 chars
        1.5 ether,          // 9 chars
        1.1 ether           // 10 chars
    ];
    
    uint public reserveDuration = 1 years;
    uint public price = 1 ether;

    mapping (bytes => Domain) domains;
    mapping (address => Receipt[]) receipts;

    event domainRegisteredEvent (address actor, bytes domain, uint weiPaid, uint expires);
    event domainExtendedEvent (address actor, bytes domain, uint weiPaid, uint expires);
    event domainEditedEvent (address actor, bytes domain, bytes oldIP, bytes newIP);
    event domainTransferedEvent (address actor, bytes domain, address newOwner);

    //the domain is bytes, because string is UTF-8 encoded and we cannot get its length
    //the IP is bytes because it is more efficient in storing the sequence
    function register(bytes domain, bytes ipfsAddress) public payable 
        isShorterThanOrEqual(ipfsAddress, 100)
        isShorterThanOrEqual(domain, 100)
        paidAtLeast(getPrice(domain))
    {
        uint paidDurations = msg.value / getPrice(domain);
        bool isUnused = isDomainFree(domain);
        address owner = getOwnerOf(domain);

        require(isUnused || owner == msg.sender);

        uint expires;

        if (isUnused) {
            expires = now + (paidDurations * reserveDuration);
            receipts[msg.sender].push(Receipt(msg.value, block.timestamp, expires));
            domains[domain] = Domain(expires, ipfsAddress, msg.sender);
            emit domainRegisteredEvent(msg.sender, domain, msg.value, expires);
        } else if (owner == msg.sender) {
            expires = domains[domain].expires + (paidDurations * reserveDuration);
            receipts[msg.sender].push(Receipt(msg.value, block.timestamp, expires));
            domains[domain].expires = expires;
            emit domainRegisteredEvent(msg.sender, domain, msg.value, expires);
        }
    }
    
    function edit(bytes domain, bytes newIpfsAddress) public
        isShorterThanOrEqual(newIpfsAddress, 100)
    {
        require(getOwnerOf(domain) == msg.sender);
        emit domainEditedEvent(msg.sender, domain, domains[domain].ipfsAddress, newIpfsAddress);
        domains[domain].ipfsAddress = newIpfsAddress;
    }

    function transferDomain(bytes domain, address newOwner) public {
        require(getOwnerOf(domain) == msg.sender);
        emit domainTransferedEvent(msg.sender, domain, newOwner);
        domains[domain].owner = newOwner;
    }
    
    ///// [ VIEWS ] /////

    function getIP(bytes domain) public view returns (bytes) {
        require(!isDomainFree(domain));
        return domains[domain].ipfsAddress;
    }

    function getPrice(bytes domain) public view returns (uint) {
        if (domain.length > pricesForShortDomains.length) {
            return price;
        } else {
            return pricesForShortDomains[domain.length - 1];
        }
    }
    
    function getReceipts(address account) public view returns (Receipt[]) {
        return receipts[account];
    }

    function isDomainFree(bytes domain) public view returns (bool) {
        return domains[domain].expires < block.timestamp;
    }

    function getOwnerOf(bytes domain) public view returns (address) {
        return isDomainFree(domain) ? 0 : domains[domain].owner;
    }

    function getExpirationDate(bytes domain) public view returns (uint) {
        return domains[domain].expires;
    }
}