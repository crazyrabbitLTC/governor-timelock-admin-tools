pragma solidity ^0.5.16;

contract Mock {
    event Received(string message, uint256 ethAmount);

    string public message;

    function receiveETH(string memory _message) public payable {
        message = _message;
        emit Received(_message, msg.value);
    }
}
