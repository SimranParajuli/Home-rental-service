pragma solidity ^0.6.4;

contract escrow{
    address agent;
    mapping(address => uint256) public deposits;
   // address[] payees;
    
    modifier onlyAgent(){
        require(msg.sender == agent);
        _ ;
    }
    
    constructor () public{
        agent= msg.sender;
    }
    
    function deposit(address payee) public payable {
        uint256 amount = msg.value;
        deposits[payee] = deposits[payee] + amount;
    }
    
    function withdraw(address payable payee) public onlyAgent {
        uint256 payment = deposits[payee];
        payee.transfer(payment);
        deposits[payee]=0;
    }
}  
