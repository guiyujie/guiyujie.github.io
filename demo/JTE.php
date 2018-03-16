<?php
//构建虚拟数据
$datalist = array();
for ($i=1; $i<=10; $i++){
    $datalist[] = array('id'=>$i.'','title'=>'这是第'.$i.'条数据');
}

//返回JSON数据
$response = array();
$response['status'] ='success';
$response['message'] = '';
$response['data'] = $datalist;

echo json_encode($response);
flush();
?>