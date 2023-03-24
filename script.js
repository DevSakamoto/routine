window.onload = function () {
    $(document).ready(function () {
        $.getJSON("data.json", function (data) {
            consoleAdd(JSON.stringify(data));
            var items = [];
            data["work"].forEach(element => {
                consoleAdd(JSON.stringify(element));
                setUnit(element);
            });
        });
    });
}