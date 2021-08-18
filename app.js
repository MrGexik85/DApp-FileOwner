var express = require("express");
const { runInNewContext } = require("vm");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var Web3 = require("web3");

var privateKey = '1b2d22bb5435377eebf98ac139921852997c53499dd6fb528da3a286dfe867f9';
var publicAddress = "0xD2Af84003cB8BF44E712747bb38526Afa74CE075";
var contractAddress = "0x2cfb5344Ca42d1aac9Ca89A6eFe3bc90b9425B60";

web3 = new Web3(new Web3.providers.WebsocketProvider("wss://ropsten.infura.io/ws/v3/0293d3aaf35b451a934cf9cfe0a62ee3"));
var proof = new web3.eth.Contract([
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
], contractAddress);

server.listen(8080);

app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/public/html/index.html");
});

app.get("/submit", function(req, res) {
    var fileHash = req.query.hash;
    var owner = req.query.owner;
    var description = req.query.description;
    console.log(fileHash, owner, description);

    var encodeData = proof.methods.set(owner, description, fileHash).encodeABI();
    // var gasPrice = 0;
    // web3.eth.getGasPrice(function (value) {
    //     gasPrice = Number(value) * 1.2;
    // });
    var Tx = {
        from: publicAddress,
        to: contractAddress,
        gas: 2000000,
        // gasPrice: String(gasPrice),
        data: encodeData
    }

    web3.eth.accounts.signTransaction(Tx, privateKey).then(signed => {
        var tran = web3.eth.sendSignedTransaction(signed.rawTransaction);
        tran.on('transactionHash', hash => {
            console.log('hash');
            console.log(hash);
            res.send(hash);
        });
        // tran.on('receipt', receipt => {
        //   console.log('reciept');
        //   console.log(receipt);
        //   res.send(receipt);
        // });
        tran.on('error', error => {
            console.log(error);
            res.send(error);
        });
      });
});

app.get("/getInfo", function(req, res) {
    var fileHash = req.query.hash;
    proof.methods.get(fileHash).call({from: publicAddress}, function(error, result) {
        if(!error) {
            res.send(result);
        } else {
            res.send(error);
        }
    });
});




// Прослушивание события контракта и отправка его по сокету всем подписанным пользователям
proof.events.logFileAdded({fromBlock: "latest"}, function(error, event){
    if(!error) {
        console.log(event);
        io.send(event);
    } else {
        console.log("logFileAdded subscribe error: ", error);
    }
});
// web3.eth.subscribe("logFileAdded", {address : contractAddress}, (error, result) => {
//     if(!error) {
//         console.log(result);
//         console.log("Success subscribed on logFileAdded");
//     }
// }).on("data", (data) => {
//     console.log(data);
// });
// web3.eth.subscribe("logs", {address : contractAddress}, (error, result) => {
//     if(!error) {
//         //console.log(result);
//         //console.log("Success subscribe to contract events");
//     } else {
//         console.log(error);
//     }
// }).on("data", (data) => {
//     console.log(data);
// });