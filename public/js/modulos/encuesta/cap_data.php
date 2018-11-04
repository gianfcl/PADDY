<?php
  $menu_padre = (isset($mostrar['menu_padre']) && strlen(trim($mostrar['menu_padre']))>0) ? ($mostrar['menu_padre']) : ("");
  $nombre_modulo = (isset($mostrar['menu']) && strlen(trim($mostrar['menu']))>0) ? ($mostrar['menu']) : ("");
  $icon_modulo = (isset($mostrar['icon']) && strlen(trim($mostrar['icon']))>0) ? ($mostrar['icon']) : ("");
  $url_modulo = (isset($mostrar['url']) && strlen(trim($mostrar['url']))>0) ? ( ($mostrar['url']=="index") ? ("") :($mostrar['url']) ) : ("");  
  $mod_title = (isset($mod_title) && strlen(trim($mod_title))>0) ? ($mod_title) : ("");
?>
<!-- page content -->
<div class="right_col" role="main">
  <div class="">
    <div class="page-title">
      <div class="title_left">
        <h3></h3>
      </div>
    </div>

    <div class="clearfix"></div>

    <div class="row">
      <div class="col-md-12 col-sm-12 col-xs-12">
        <div class="x_panel">
          <div class="x_title">
            <h3><i class="fa <?php echo $icon_modulo; ?>"></i> <?php if(!empty($datos_cabecera['titulo'])){ echo $datos_cabecera['titulo']; } ?></h3>
            <ul class="nav navbar-right panel_toolbox">
              <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
              </li>
              <li class="dropdown">
                <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i class="fa fa-wrench"></i></a>                      
              </li>
              <li><a class="close-link"><i class="fa fa-close"></i></a>
              </li>
            </ul>
          </div>

          <div class="clearfix"></div>

          <div class="form-group">
            <div class="col-md-12 col-sm-12 col-xs-12">
              <center><h3></h3></center>
            </div>
          </div>
                          
          <div class="clearfix"></div>

          <div class="form-group">
            <div class="col-md-12 col-sm-12 col-xs-12">
              <center><h4><?php if(!empty($datos_cabecera['descripcion'])){ echo $datos_cabecera['descripcion']; } ?></h4></center>
            </div>
          </div>

          <div class="clearfix"></div>

          <input type="hidden" id="despedida" value="<?php echo $datos_cabecera['m_despedida'];?>">
          <form class="form-horizontal" id="form_save_encuesta_data">
          <input type="hidden" name="id_eplantilla" value="<?php echo $datos_cabecera['id_eplantilla'];?>" />
          <?php if(isset($rta)){echo $rta;}?>

          <div class="clearfix"></div>
            <div class="btn-toolbar">
              <div class="btn-group pull-right">
                <button type="submit" class="btn btn-success btn-submit">&nbsp;<i class="fa fa-save"></i><span class="hide-on-phones"></span>&nbsp;Guardar</button>
              </div>
              <div class="btn-group pull-right">
                <a class="btn btn-warning salir_pag">
                  <span class="fa fa-eraser"></span>
                  <span class="hide-on-phones">Cancelar</span>
                </a>
              </div>
            </div>
          </form>
    </div>
  </div>
</div>
