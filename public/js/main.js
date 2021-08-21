var host = "http://localhost:8080";

// Нажатие кнопки "Отправить"
function submit () {
    var file = document.getElementById("file-to-load").files[0];
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
                        $("#rectangle3").text("<p>Произошла ошибка</p>");
                    } else {
                        $("#rectangle3").html("<p>Хэш транзакции: " + data + "</p>");
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
    var file = document.getElementById("file-to-check").files[0];
    if(file) {
        var reader = new FileReader();
        reader.onload = function (event) {
            var hash = sha1(event.target.result);
            $.get("/getInfo?hash=" + hash, function(data) {
                if(data[0] == 0 && data[1] == "") {
                    $("#infasservera").html("<p>Информация не найдена</p>");
                } else {
                    $("#infasservera").html("<p>Информация найдена<br>Метка времени: " + data[0] + "<br>Владелец: " + data[1] + "<br>Описание: " + data[2] + "</p>");
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
        // console.log($("#events-list").text);
        if($("#events-list").text() == "Транзакции не найдены") {
            // console.log(msg.transactionHash, msg.returnValues.owner, msg.returnValues.description, msg.returnValues.fileHash);
            $("#events-list").html("<li>Хэш транзакции: " + msg.transactionHash + "<br><br>Успешна ли запись: " + msg.returnValues.success + "<br><br>Владелец: " + msg.returnValues.owner + "<br><br>Описание: " + msg.returnValues.description + "<br><br>Хэш файла: " + msg.returnValues.fileHash + "</li><br>");
        } else {
            // console.log(msg.transactionHash, msg.returnValues.owner, msg.returnValues.description, msg.returnValues.fileHash);
            $("#events-list").prepend("<li>Хэш транзакции: " + msg.transactionHash + "<br><br>Успешна ли запись: " + msg.returnValues.success + "<br><br>Владелец: " + msg.returnValues.owner + "<br><br>Описание: " + msg.returnValues.description + "<br><br>Хэш файла: " + msg.returnValues.fileHash + "</li><br>");
        }
    });
});