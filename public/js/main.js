var host = "http://localhost:8080";

// Нажатие кнопки "Отправить"
function submit () {
    var file = document.getElementById("file").files[0];
    if(file) {
        var owner = document.getElementById("owner").value;
        var description = document.getElementById("description").value;
        if(owner == "") {
            alert("Введите имя владельца");
        } else {
            var reader = new FileReader();
            reader.onload = function (event) {
                var hash = sha1(event.target.result);
                $.get("/submit?hash=" + hash + "&owner=" + owner + "&description=" + description, function(data) {
                    if(data == "Error") {
                        $("#message").text("Произошла ошибка");
                    } else {
                        $("#message").html("Хэш транзакции: " + data);
                    }
                });
            };
            reader.readAsArrayBuffer(file);
        }
    } else {
        alert("Выберите файл");
    }
}

// Нажатие кнопки "Получить информацию"
function getInfo() {
    var file = document.getElementById("file").files[0];
    if(file) {
        var reader = new FileReader();
        reader.onload = function (event) {
            var hash = sha1(event.target.result);
            $.get("/getInfo?hash=" + hash, function(data) {
                if(data[0] == 0 && data[1] == "") {
                    $("#message").html("Нет информации о таком файле");
                } else {
                    $("#message").html("Метка времени: " + data[0] + "\nВладелец: " + data[1] + "\nОписание: " + data[2]);
                }
            });
        };
        reader.readAsArrayBuffer(file);
    } else {
        alert("Выберите файл");
    }
}

var socket = io.connect(window.location.hostname + ":8080");
socket.on("connect", () => {
    socket.on("message", (msg) => {
        console.log($("#events-list").text);
        if($("#events-list").text() == "Транзакции не найдены") {
            console.log(msg.transactionHash, msg.returnValues.owner, msg.returnValues.description, msg.returnValues.fileHash);
            $("#events-list").html("<li>Хэш транзакции: " + msg.transactionHash + " Владелец: " + msg.returnValues.owner + " Описание: " + msg.returnValues.description + " Хэш файла: " + msg.returnValues.fileHash + "</li>");
        } else {
            console.log(msg.transactionHash, msg.returnValues.owner, msg.returnValues.description, msg.returnValues.fileHash);
            $("#events-list").prepend("<li>Хэш транзакции: " + msg.transactionHash + " Владелец: " + msg.returnValues.owner + " Описание: " + msg.returnValues.description + " Хэш файла: " + msg.returnValues.fileHash + "</li>");
        }
    });
});