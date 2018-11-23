<?php
function conectar(){
	//$cnx=mysqli_connect("127.0.0.1:33065","root","","paddybd");
	$con=new mysqli("localhost","root2","1234","paddy") or die ("Error en la conexion".mysqli_connect_error());
	return $con;
}
?>