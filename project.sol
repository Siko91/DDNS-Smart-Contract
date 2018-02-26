pragma solidity 0.4.18;

contract DDNS {
    struct Receipt {
        uint amountPaidWei;
        uint timestamp;
        uint expires;
    }
    
    //the domain is bytes, because string is UTF-8 encoded and we cannot get its length
    //the IP is bytes4 because it is more efficient in storing the sequence
    function register(bytes domain, bytes4 ip) public payable {}
    
    function edit(bytes domain, bytes4 newIp) public {}
    
    function transferDomain(bytes domain, address newOwner) public {}
    
    function getIP(bytes domain) public view returns (bytes4) {}
    
    function getPrice(bytes domain) public view returns (uint) {}
    
    function getReceipts(address account) public view returns (Receipt[]) {}
}