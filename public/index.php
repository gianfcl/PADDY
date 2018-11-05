<?php
require "conexion.php";
conectar();
?>
<!DOCTYPE html>
<html>
<head>
	<title>PADDY</title>
	<script href="https://code.jquery.com/jquery-3.3.1.min.js" type="text/javascript"></script>
	<script src="javascripts/jquery-3.3.1.js" type="text/javascript"></script>
	<script src="javascripts/funciones_entrar.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
	<link rel="stylesheet" href="css/bootstrap.css">
	<link rel="stylesheet" href="stylesheets/style.css">
	<link rel="stylesheet" href="css/custom.css">
	<link rel="stylesheet" href="css/bootstrap.min.css">
	<link rel="stylesheet" href="css/datatables/css/jquery.datatables.css">
	<!--link rel="stylesheet" href="css/login/style.css"-->
	<!--link rel="stylesheet" href="css/login/form-elements.css"-->
	<link rel="stylesheet" href="css/editable/bootstrap-editable.css">
	<link rel="stylesheet" href="fonts/css/font-awesome.css">
	<link rel="stylesheet" href="css/datatables/buttons.bootstrap.min.css">
	<link rel="stylesheet" href="css/datatables/fixedHeader.bootstrap.min.css">
	<link rel="stylesheet" href="css/datatables/jquery.dataTables.min.css">
	<link rel="stylesheet" href="css/datatables/responsive.bootstrap.min.css">
	<link rel="stylesheet" href="css/datatables/scroller.bootstrap.min.css">
	<link rel="stylesheet" href="css/tagsinput/bootstrap-tagsinput.css">
	<link rel="stylesheet" href="css/sweetalert/sweetalert-30-05-2017.css">
	<script src="js/textarea/autosize.min.js"></script>
	<script src="js/tags/jquery.tagsinput.min.js"></script>
	<script src="js/jquery.min.js"></script>
	<script src="js/jquery-2.1.3.js"></script>
	<script src="js/moment/moment.min.js"></script>
	<script src="js/sweetalert/sweetalert_30-05-2017.js"></script>
	<script src="js/bootstrap.min.js"></script>
	<!--script src="js/login/jquery-1.11.1.min.js"></script-->
	<script src="js/sweetalert/sweetalert.min.js"></script>
	<script src="javascripts/main.js"></script>
	<style>
		.piedePagina{
			background:#14E7EA;
			margin-bottom:0px;
		}
		.cuerpo{
			position: relative;
			background-image: url('images/paddy.png');
			color: #151313;
			height:100%;
		}
		.h1_index{
			background:#14E7EA;
			text-align: center;
			font-family: "Comic Sans MS", cursive, sans-serif;
			margin-top:0px;
		}
		li{
			font-size:30px;
			font-family: "Comic Sans MS", cursive, sans-serif;
		}
		.tit_h3{
			font-size:30px;
			font-family: "Comic Sans MS", cursive, sans-serif;
		}
	</style>
<h1 class="h1_index"><img style="margin-bottom:65px;" src="images/paddy_logo.png" alt="Logo">ADDY</h1>
</head>
<body>
<div class="cuerpo">
 <div class="collapse navbar-collapse navbar-ex1-collapse">
		<ul class="nav nav-tabs">
		  <li class="active"><a data-toggle="tab" href="#home">Home</a></li>
		  <li><a target="_blank" href="./entrar_usuario.php">Ingresar</a></li>
		  <li><a data-toggle="tab" href="#menu2">Nosotros</a></li>
		</ul>
		<div class="tab-content">
		  <div id="home" class="tab-pane fade in active">
		    <h3 class="tit_h3">HOME</h3>
		    <div></div>
		  </div>
		  <div id="menu2" class="tab-pane fade">
		    <h3 class="tit_h3">BIENVENIDO A PADDY</h3>
		    <div class="row">
		    	<div class="col-sm-4">
			    	<label class="control-label">MISION</label>
			    	<div></div>
		    	</div>
		    </div>
		    <div class="row">
		    	<div class="col-sm-4">
			    	<label class="control-label">VISION</label>
			    	<div></div>
		    	</div>
		    </div>
		  </div>
		</div>
 </div>
</div>
</body>

<footer class="section fixed-bottom piedePagina">
	<button class="fa fa-3x fa-facebook-square" target="_blank" onClick="location.href='https://www.facebook.com/PaddyPeru/'"></button>
</footer>
</html>

<?php require "registro.php"; ?>