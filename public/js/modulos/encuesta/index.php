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
                  <h3><i class="fa <?php echo $icon_modulo; ?>"></i> <?php echo $nombre_modulo;?> <small><?php echo "Mantenimiento"; ?></small></h3>
                  <ul class="nav navbar-right panel_toolbox">
                    <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
                    </li>
                    <li class="dropdown">
                      <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i class="fa fa-wrench"></i></a>                      
                    </li>
                    <li><a class="close-link"><i class="fa fa-close"></i></a>
                    </li>
                  </ul>
                  <div class="clearfix"></div>
                </div>

                <div class="clearfix"></div>
                <div class="row x_title1">
                  <div class="col-md-6 col-sm-6 col-xs-12"><h2><?php echo $mod_title;?></h2></div>
                  
                </div>

                <div class="row">
                  <div class="x_content">
                    <div class="row">
<?php 
                      if(!empty($all_data)) 
                      {
                        foreach ($all_data as $key => $value) 
                        {
?>
                          <div class="animated flipInY col-lg-3 col-md-3 col-sm-6 col-xs-12" id_plantilla = "<?php echo $value['id_eplantilla']; ?>">
                            <a style="text-decoration: none !important;" href="<?php echo base_url().$url_modulo."/cap_data/".$value['id_eplantilla'];?>" target="_blank">
                            <div class="tile-stats btn-primary">
                              <div class="icon">&nbsp;</div>
                              <div class="count">&nbsp;</div>
                              <h3><?php echo $value['titulo'];?></h3>
                              <p><?php if(!empty($value['descripcion'])) { echo $value['descripcion']; }?></p>
                            </div>
                            </a>
                          </div>
<?php
                        }
                      }
                      else
                      {
?>
                        <div class="animated flipInY col-lg-3 col-md-3 col-sm-6 col-xs-12">
                            <a style="text-decoration: none !important;">
                            <div class="tile-stats btn-primary">
                              <div class="icon">&nbsp;</div>
                              <div class="count">&nbsp;</div>
                              <h3>No Hay Plantillas disponibles</h3>
                              <p></p>
                            </div>
                            </a>
                          </div>
<?php
                      }

?>
                    </div>
                  </div>
                </div>
              </div>
