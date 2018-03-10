# DDNS-Smart-Contract
A final project for my solidity course

# Web UI for DDNS

Preview from RawGit: https://rawgit.com/Siko91/DDNS-Smart-Contract/master/webUI/index.html

##  [ DDNS ]
    Mandatory Tasks

 - (20%) (lecture 6) Public method to register a domain, giving the domain name and an ip address it should point to. 
    A registered domain cannot be bought and is owned by the caller of the method. The domain registration should cost 1 ETH 
    and the domain should be registered for 1 year. After 1 year, anyone is allowed to buy the domain again. 
    The domain registration can be extended by 1 year if the domain owner calls the register method and pays 1 ETH. 
    The domain can be any string with length more than 5 symbols.

 - (10%) (lecture 6) Public method to edit a domain. Editing a domain is changing the ip address it points to. 
    The operation is free. Only the owner of the domain can edit the domain.

 - (10%) (lecture 6) Public method to transfer the domain ownership to another user. The operation is free.

 - (10%) (lecture 6) Public method to receive an IP based on a given domain.

 - (10%) (lecture 6) Public method that returns a list of all receipts by a certain account. 
    A receipt is a domain purchase/extension and contains the price, timestamp of purchase and expiration date of the domain.

 -----------------------------------

## [ Common Tasks ]

### Mandatory Tasks:

 - (40%) (lecture 10) Unit tests for all the methods in your contract (including all aforementioned). 
    The tests should handle all constraints around the contract. Example with DDNS: 
    A test can be one that tries to register an already registered domain. 
    The test is passed if the operation fails (expected behavior).

### Optional Tasks:

 - (5%) (lecture 5) Use contract events to signify that an activity has taken place in your contract. 
    Events can be for domain registration / transfer (DDNS) or item purchase / stock update (Marketplace), for example.

 - (20%) (lecture 8) Create a basic website with MetaMask that connects to a contract (published in a test net or local blockchain).
              The application should allow at least one operation with the contract (Domain registration or Store purchase are examples).

 - (5%) (lecture 6) Dynamic pricing. For DDNS, the base price can increase if a short domain name is bought. 
    For Marketplace, price can increase as the stock of an item lowers.

 - (5%) (lecture 6) Public method to withdraw the funds from the contract. 
    This should be called only from the contract owner (the address which initially created the contract).

 -----------------------------------

## Submission

 Submission deadline: 29.03.2018 23:59
 Projects should be submitted as archive files on the course’ page under the “Final Project - Live Defense” heading.
 A button for uploading files will become visible two weeks before the submission deadline.

 -----------------------------------

### Contract Template:

```
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
```
