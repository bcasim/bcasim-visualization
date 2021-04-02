/**
 * ブロックチェーンのデータ構造に関連する処理
 */
var nodes_block = new vis.DataSet([]);
var edges_block = new vis.DataSet([]);
var container_block = document.getElementById('blockchain_panel');

var block_list_id = [];
var block_list_hash = [];
var block_index = 0;

var data_block = {
    nodes: nodes_block,
    edges: edges_block
};

var options_block = {
    nodes: {
        shape: "box",
        size: 26,
    },
    layout: {
        hierarchical: {
            //direction: "LR",
            sortMethod: "directed",
        }
    }
};

var b_color = [];

var blockchian = new vis.Network(container_block, data_block, options_block);

/*チェーンに次のブロックを追加して表示する*/
function next_block(){
    if(block_index==0){
        nodes_block.add({id: 0, label: 0+"\ngenesis",group:0});
        block_list_hash.push(blockchain_data[0].hash);
        block_index++;
        return;
    }

    for(i=0;i<block_list_hash.length;i++){
        if(blockchain_data[block_index].previousHash==block_list_hash[i]){
            block_list_hash.push(blockchain_data[block_index].hash);
            _miner = blockchain_data[block_index].miner;
            _height = blockchain_data[block_index].height;
            
            if(document.getElementById("node").node.value == "1"){
                nodes_block.add({id: block_index, label: _height+"\nnode"+_miner, group: block_index+1});
            }else if(document.getElementById("node").node.value == "2"){
                nodes_block.add({id: block_index, label: _height+"\nnode"+_miner, group: _miner});
            }

            edges_block.add({from: i, to: block_index, arrows: "to",width: 3});
            block_index++;
            break;
        }
    }
}
