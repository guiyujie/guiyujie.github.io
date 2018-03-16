<?php
$page = $_REQUEST['page'];
$pagesize = $_REQUEST['pagesize'];
$idStr = $_REQUEST['id'];

//当前页数据
$datalist = array();
for ($i=1; $i<=$pagesize; $i++){
    $index = ($page-1)*$pagesize+$i;
    $datalist[] = array('id'=>$index.'','title'=>'这是第'.$index.'条数据');
}

//已选数据
$selected = array();
if(!empty($idStr)){
    $ids = explode(",",$idStr);
    for ($i=0; $i<count($ids); $i++){
      $selected[] = array('id'=>$ids[$i].'','title'=>'这是第'.$ids[$i].'条数据');
    }
}

//返回JSON数据
$response = array();
$response['status'] ='success';
$response['message'] = '';
$response['data'] =array(
    'datanum' => "100",
	'datalist' => $datalist,
	"selected" => $selected
);

echo json_encode($response);
flush();
?>