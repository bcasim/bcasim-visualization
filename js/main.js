
/*時計,処理の進行*/
var time = 0;
function showClock() {
    
    if (blockchain_data === undefined || event_data == undefined) {
        return;
    }
    /*if(time%60==0){
        remove_traffic();
    }*/
    remove_traffic();

    time = time + Number(document.getElementById("speed").value);
    while(true){
        if(time < Number(blockchain_data[block_index].receiveTime)){
            break;
        }
        next_block();   
    }  

    while(true){
        if(time < Number(event_data[event_id].time)){
            break;
        }
        block_event();    
    }
    
    document.getElementById("timestamp_area").innerHTML = "Simulation Time : " + time;
}



/*リピート関数*/
function sleep(msec) {
    return new Promise(function(resolve) {
        setTimeout(function() {resolve()}, msec);
    })
}

async function start() {
    await sleep(500);

    //停止条件
    if(blockchain_data.length <= block_index || event_data <= event_id){
        return
    }            
    
    start();
    showClock();
}

async function start_traffic() {
    await sleep(100);
    play_traffic();
    start_traffic()
}

function main(){
    add_node();
    init_network();
    add_edge(); 
    init_traffic_list();
    start();
    start_traffic();
}
input_data();


function start_simulation(){
    time = Number(document.getElementById("start_point").value);
    //var speed_value = document.getElementById("speed").value;
    //var start_point_value = document.getElementById("start_point").value;
    //var node_value = document.getElementById("node").node.value;
    //var network_value = document.getElementById("network").network.value;
    main();
}