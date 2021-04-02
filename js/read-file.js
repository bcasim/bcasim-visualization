const matrix_filename = "./output-file/adjacencyMatrix.csv";
const blockchain_filename = "./output-file/block.json";
const event_filename = "./output-file/event.json";
    
    
/*ファイルデータを保存*/
var blockchain_data;
var event_data;
var matrix_data;


function input_data() {
    $(function() {
        $.getJSON(event_filename, function(data) {
            event_data = data;
        })
    });
    $(function() {
        $.getJSON(blockchain_filename, function(data) {
            blockchain_data = data;
        })
    });
    getCSVFile();
}


/*csvファイルの読み込み処理*/
function getCSVFile() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        createArray(xhr.responseText);
    };
    xhr.open("get", matrix_filename , true);
    xhr.send(null);
}



function createArray(csvData) {
    var tempArray = csvData.split("\n");
    var csvArray = new Array();
    for(var i = 0; i<tempArray.length;i++){
        csvArray[i] = tempArray[i].split(",");
    }
    matrix_data = csvArray;

}
