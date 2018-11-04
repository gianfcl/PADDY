<?php
require "conexion.php";
conectar();
?>
<!DOCTYPE html>
<html>
<head class="head_index">
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
	<link rel="stylesheet" href="css/login/style.css">
	<link rel="stylesheet" href="css/login/form-elements.css">
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
	<script src="js/login/jquery-1.11.1.min.js"></script>
	<script src="js/sweetalert/sweetalert.min.js"></script>
	<script src="javascripts/main.js"></script>
	<style>
		.head_index{
			background: black;
		}
		.body_index{
			background-image: url('images/paddy.png');
			color: #fdf8f8;
		}
		.footer_index{
			background: #02fff5e8;
			color: black;
		}
		.h1_index{
			color: #f5f2f2;
		}
		.footin{
			background: #02fff5e8;
		}
	</style>
</head>
<body class="body_index">
<br><br>
<div class="top-content forminicio">
	<div class="col-sm-4 col-sm-offset-3 form-box">
		<div class="inner-bg">
		<div class="row">
			<div class="form-top">
				<h1 class="h1_index">BIENVENIDO</h1>
			</div>
			<div class="form-bottom">
				<form role="form" class="login-form" method="POST" action="" id="login-form">
					<div class="form-group">
						<div class="input-group">
							<label>NOMBRE: </label>
							<input type="text" class="form-control" name="nombre_usuario" id="nombre_usuario" placeholder="Nombre">
						</div>
					</div>
					<div class="form-group">
						<div class="input-group">
							<label>Clave: </label>
							<input type="password" class="form-control" name="clave_usuario" id="clave_usuario" placeholder="Clave">
						</div>
					</div>
				</form>
				<div class="btn-toolbar">
					<div class="btn-group pull-right">
						<button type="submit" id="id_entrar" class="btn btn-info"><i>Entrar</i></button>
					</div>
					<div class="btn-group pull-right">
						<button type="button" data-toggle="modal" data-target="#hacer_registro" id="id_registrar" class="btn btn-info"><i>Registrar</i></button>
					</div>
				</div>
			</div>
		</div>
		</div>
	</div>
</div><div class="clearfix"></div>


</body>
<footer class="footer_index">
	<div class="row pull-left" style="margin-left: 2%;">
		<button class="fa fa-3x fa-facebook-square" onClick="location.href='https://www.facebook.com/PaddyPeru/'"></button>
	</div>
</footer>
</html>

<?php require "registro.php"; ?>