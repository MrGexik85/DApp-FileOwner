var proofContractABI = [
    { 
        "anonymous": false, 
        "inputs": [ 
            { 
                "indexed": false, 
                "internalType": "bool", 
                "name": "success", 
                "type": "bool" 
            }, 
            { 
                "indexed": false, 
                "internalType": "uint256", 
                "name": "timestamp", 
                "type": "uint256" 
            }, 
            { 
                "indexed": false, 
                "internalType": "string", 
                "name": "owner", 
                "type": "string" 
            }, 
            { 
                "indexed": false, 
                "internalType": "string", 
                "name": "description", 
                "type": "string" 
            },
            { 
                "indexed": false, 
                "internalType": "string", 
                "name": "fileHash", 
                "type": "string" 
            } 
        ], 
        "name": "logFileAdded", 
        "type": "event" 
    }, 
    { 
        "inputs": [ 
            { 
                "internalType": "string", 
                "name": "_owner", 
                "type": "string" 
            }, 
            { 
                "internalType": "string", 
                "name": "_description", 
                "type": "string" 
            }, 
            { 
                "internalType": "string", 
                "name": "_fileHash", 
                "type": "string" 
            } 
        ], 
        "name": "set", 
        "outputs": [], 
        "stateMutability": "nonpayable", 
        "type": "function" 
    }, 
    { 
        "inputs": [ 
            { 
                "internalType": "string", 
                "name": "_fileHash", 
                "type": "string" 
            } 
        ], 
        "name": "get", 
        "outputs": 
        [ 
            { 
                "internalType": "uint256", 
                "name": "timestamp", 
                "type": "uint256" 
            }, 
            { 
                "internalType": "string", 
                "name": "owner", 
                "type": "string" 
            }, 
            { 
                "internalType": "string", 
                "name": "description", 
                "type": "string" 
            } 
        ], 
        "stateMutability": "view", 
        "type": "function" 
    } 
];

var proofContractAddress = "0x2cfb5344Ca42d1aac9Ca89A6eFe3bc90b9425B60";