pragma solidity ^0.5.8;

contract SocialNetwork {
  struct Profile {
    uint256 id;
    string displayName;
    string avatarUrl;
  }

  mapping (address => Profile) private addressToProfile;
  mapping (uint256 => address) private profileIdToAddress;

  event Message(uint256 senderId, uint256 timestamp, string message);

  function postMessage(string memory message) public {
    emit Message(addressToProfile[msg.sender].id, block.timestamp, message);
  }

  function setProfile(uint256 id, string memory displayName, string memory avatarUrl) public {
    require(profileIdToAddress[id] == address(0));
    profileIdToAddress[id] = msg.sender;
    addressToProfile[msg.sender].id = id;
    addressToProfile[msg.sender].displayName = displayName;
    addressToProfile[msg.sender].avatarUrl = avatarUrl;
  }

  function getProfile(uint256 id) public view returns (string memory displayName, string memory avatarUrl) {
    return (addressToProfile[profileIdToAddress[id]].displayName, addressToProfile[profileIdToAddress[id]].avatarUrl);
  }
}