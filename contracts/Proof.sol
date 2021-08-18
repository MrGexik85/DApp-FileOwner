pragma solidity ^0.8.0;

contract Proof {
    struct FileDetails {
        uint timestamp;
        string owner;
        string ownerDescription;
    }

    mapping (string=>FileDetails) files;

    event logFileAdded(bool success, uint timestamp, string owner, string description, string fileHash); 

    // Функция сохранения информации о файле
    function set(string memory _owner, string memory _description, string memory _fileHash) public{
        // Если метка времени равно нулю, значит записи о таком файле еще не существует
        if(files[_fileHash].timestamp == 0) {
            // Создаем новую запись для данного хэша файла
            files[_fileHash] = FileDetails(block.timestamp, _owner, _description);

            // Создаем событие для оповещении о сохранении информации о файле
            emit logFileAdded(true, block.timestamp, _owner, _description, _fileHash);
        } else {
            // Создаем событие с false флагом, указывающим, что запись информации о файле
            // не может быть произведена по причине существования файла с таким хэшем в DApp
            emit logFileAdded(false, block.timestamp, _owner, _description, _fileHash);
        }
    }

    // Функция получения информации о файле
    function get(string memory _fileHash) public view returns (uint timestamp, string memory owner, string memory description) {
        return (files[_fileHash].timestamp, files[_fileHash].owner, files[_fileHash].ownerDescription);
    }
}