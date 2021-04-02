/**
 * ネットワークの状態に関連する処理
*/

//ネットワーク
nodes = new vis.DataSet([]);
edges = new vis.DataSet([]);
var traffic_count = true;
var traffic_edge = [];
var traffic_arrow = [];
var block_id = [];

var edge_id = 0;
var event_id = 0;


/*********ノードに関する操作*********/

/*csvの隣接行列を使用*/
function add_node(){
    var nc = 1;
    for (var i=0; i<matrix_data[0].length; i++){
        if(document.getElementById("node").node.value == "1"){
            nodes.add([{id:i, label:"node"+i, group: 1}]);
            continue;
        }
        nodes.add([{id:i, label:"node"+i, group: nc}]);
        nc++;
    }
}


/*エッジに関連する操作*/
/*csvの隣接行列を使用*/
function add_edge(){
    for(var i=0;i<matrix_data[0].length;i++){
        for(var j=i;j<matrix_data[0].length;j++){
            if(matrix_data[i][j]==1){
                network.body.data.edges.update([{id:i*matrix_data.length-1+j,from:i, to:j,color :"#848484"}]);
                edge_id++;
            }
        }
    }
}


//------------------ノードの色変更部分----------------------
//ブロックに関連する情報
var hash_lists = [];//ハッシュのリスト
var color_lists = [];//ブロック番号
//ノードに関連する情報
var node_index = [];//ブロック高（ノード）

//----ブロック発見時の処理----
function update_node_found(node_id,index,hash){
    
    //----初期化処理----
    if(node_index.length==0){
        for(i=0;i<matrix_data[0].length;i++){
            node_index.push(0);
        }
    }
    
    //----新規ブロックの追加（初期IDは1）
    hash_lists.push(hash)
    color_lists.push(color_lists.length+2);
     
    //ブロック高が最大の場合は追加する
    if(node_index[node_id]<index){
        node_index[node_id] = index;
        if(document.getElementById("node").node.value == "1"){
            nodes.update({id:node_id, group: color_lists.length+1});
        }
    } 
}
 

//----ブロック受信時の処理----
function update_node_receive(node_id,index,hash){
    //リストからハッシュの探索
    _color = 0;
    for(i=0;i<hash_lists.length;i++){
        if(hash == hash_lists[i]){
            _color = color_lists[i];
            break;
        }
    }

    //ノードの色を更新
    if(node_index[node_id]<index){
        node_index[node_id] = index;
        if(document.getElementById("node").node.value == "1"){
            nodes.update({id:node_id, group: _color});
        }
    } 
}



/***********トラフィックの再生************/
function play_traffic(){
    if (traffic_count){
        traffic_count = false;
        for (var i=0; i<traffic_edge.length;i++){
            for(var j=i;j<traffic_edge.length;j++){
                if(traffic_edge[i][j]==1){
                    if(traffic_arrow[i][j]==0){
                        network.body.data.edges.update([{id:i*matrix_data.length-1+j,from:i, to:j,color :"red",width: 3, arrows: "to"}]);
                    }else{
                        network.body.data.edges.update([{id:i*matrix_data.length-1+j,from:i, to:j,color :"red",width: 3, arrows: "from"}]);
                    }
                }
            }
        }
    }else{
        traffic_count = true;
        for (var i=0; i<traffic_edge.length;i++){
            for(var j=i;j<traffic_edge.length;j++){
                if(traffic_edge[i][j]==1){      
                    network.body.data.edges.update([{id:i*matrix_data.length-1+j,from:i, to:j,color :"#848484"}]);
                }
            }
        }
    }
}

 

/***********トラフィック関連操作************/
function init_traffic_list(){
    for(var i=0;i<matrix_data.length;i++){
        var _list = [];
        var _arrow = [];
        for(var j=0;j<matrix_data.length;j++){
            _list.push(0);
            _arrow.push(0);
        }
        traffic_edge.push(_list);
        traffic_arrow.push(_arrow);
    }
}


/*トラフィックを追加*/
function add_traffic_list(from, to){
    if(from <= to){
        traffic_edge[from-1][to-1] = 1;
        //0 → to (arrow)
        traffic_arrow[from-1][to-1] = 0;
    }else{
        traffic_edge[to-1][from-1] = 1;
        //1 → from(arrow)
        traffic_arrow[to-1][from-1] = 1; 
    }
}

/*トラフィックを削除する*/
function remove_traffic(){
    var len = edges.length;
    for (var i=0; i<traffic_edge.length;i++){
        for(var j=i;j<traffic_edge.length;j++){
            if(traffic_edge[i][j]==1){
                traffic_edge[i][j] = 0;
                network.body.data.edges.update([{id:i*matrix_data.length-1+j,color :"#848484",width: 2,arrows:{to:{ enabled: false}}}]);
                network.body.data.edges.update([{id:i*matrix_data.length-1+j,color :"#848484",width: 2,arrows:{from:{ enabled: false}}}]);
            }
        }
    }
}


/*************ネットワークグラフを生成************/

function init_network(){
    var container = document.getElementById("network_panel");
    var data = {
        nodes: nodes,
        edges: edges,
   };
   
   var options = {
       nodes: {
           shape: "dot",
           size: 15,
       },
       edges:{
           smooth: false,/*falseにすると直線になる*/
           /*color: {
               highlight:"#848484",
           },*/  
       },
       //---レイアウト
       /*layout: {
           hierarchical: {
               direction: "LR", 
               sortMethod: "directed"
            }
       },*/
       //レイアウト
       physics: {
           forceAtlas2Based: {
               gravitationalConstant: -26,
               centralGravity: 0.005,
               springLength: 230,
               springConstant: 0.18,
           },
           maxVelocity: 146,
           solver: "forceAtlas2Based",
           timestep: 0.35,
       },
   };
   network = new vis.Network(container, data, options);
}


/**次のイベント処理する**/
function block_event(){
    
    if(event_data[event_id].type == "InitNode"){
        console.log(event_data[event_id].type);
    
    }else if(event_data[event_id].type == "FoundBlock"){ 
        
        update_node_found(Number(event_data[event_id].node),Number(event_data[event_id].height),event_data[event_id].hash);
        console.log(event_data[event_id].type);
    
    }else if(event_data[event_id].type == "ReceiveBlock"){

        node_to = Number(event_data[event_id].node);
        node_from = Number(event_data[event_id].from);
        add_traffic_list(node_from+1,node_to+1);
        
        update_node_receive(Number(event_data[event_id].node),Number(event_data[event_id].height),event_data[event_id].hash);
        console.log(event_data[event_id].type);
    
    }else if(event_data[event_id].type == "ReceiveTransaction"){
        console.log(event_data[event_id].type);
    
    }
    event_id++;
}