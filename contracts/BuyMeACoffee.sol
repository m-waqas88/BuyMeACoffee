// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Deployed to Goerli <BuyMeACoffee deployed to  0xdF36EB526124cDf65710712ee7d2cCCe0A499BBb>

contract BuyMeACoffee {
    
    // Event to emit when a memo is created
    event NewMemo
    (
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    // Memo struct
    struct Memo 
    {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // List of all memos received from friends
    Memo[] memos;

    // Address of contract deployer
    address payable owner;

    // Validate owner
    modifier validateOwner()
    {
        require(msg.sender == owner, "Only owner can withdraw");
        _;
    }

    // Deply logic
    constructor()
    {
        owner = payable(msg.sender);
    }

    /**
     * @dev buy a coffee for contract owner
     * @param _name name of the coffee buyer
     * @param _message a nice message from the coffee buyer
     */

    function buyCoffee(string memory _name, string memory _message) external payable
    {
        require(msg.value > 0, "can't buy coffee with 0 eth");

        // Add memo to the storage
        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        // Emit a log event when a new memo is created!
        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );

    }

    /**
     * @dev send the entire balance stored in this contract to the owner
     */
    function withdrawTips() external validateOwner
    {
        require(owner.send(address(this).balance), "Unable to withdraw");
    }

    /**
     * @dev get all the memos stored on the blockchain
     */
    function getMemos() external view returns (Memo[] memory)
    {
        return memos;
    }






}
