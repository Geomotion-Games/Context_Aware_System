<?php
/* Clase encargada de gestionar las conexiones a la base de datos */
class Db {

   private $servidor;
   private $usuario;
   private $password;
   private $base_datos;
   public $link;
   private $stmt;
   private $cierra;
   private $liberar;
   private $array;

   static $_instance;

   /*La función construct es privada para evitar que el objeto pueda ser creado mediante new*/
   private function __construct() {
      $this->setConexion();
      $this->conectar();
   }

   /*Método para establecer los parámetros de la conexión*/
   private function setConexion(){
      $conf = Conf::getInstance();
      $this->servidor=$conf->getHostDB();
      $this->base_datos=$conf->getDB();
      $this->usuario=$conf->getUserDB();
      $this->password=$conf->getPassDB();
   }

   /*Evitamos el clonaje del objeto. Patrón Singleton*/
   private function __clone(){ }

   /*Función encargada de crear, si es necesario, el objeto. Esta es la función que debemos llamar desde fuera de la clase para instanciar el objeto, y así, poder utilizar sus métodos*/
   public static function getInstance(){
      if (!(self::$_instance instanceof self)){
         self::$_instance=new self();
      }
         return self::$_instance;
   }

   /*Realiza la conexión a la base de datos.*/
   private function conectar(){      

      if (!$this->link=mysqli_connect($this->servidor, $this->usuario, $this->password, $this->base_datos))
      {
         echo "";
      }

      if (!$this->link) {
         echo "Error: No se pudo conectar a MySQL." . PHP_EOL;
         echo "errno de depuración: " . mysqli_connect_errno() . PHP_EOL;
         echo "error de depuración: " . mysqli_connect_error() . PHP_EOL;
         exit;
      }

      mysqli_select_db($this->link, $this->base_datos);
      //@mysql_query("SET NAMES 'utf8'");
   }

   /*Método para ejecutar una sentencia sql*/
   public function ejecutar($sql){
      $this->stmt=@mysqli_query($this->link, $sql);
      return $this->stmt;
   }

  /*Método para Cerrar la DB sql*/
   public function cerrar(){
      $this->cierra=@mysqli_close($this->link);
      return $this->cierra;
   }

       /*Método para Liberar la memoria o a willy la ballena*/
   public function liberarawilly(){
      $this->liberar=@mysqli_free_result($this->stmt);
      return $this->liberar;
   }
   /*numero de lineas*/
 public function num_rows($stmt){ 
  return @mysqli_num_rows($stmt);
  }

   /*Método para obtener una fila de resultados de la sentencia sql*/
   public function obtener_fila($stmt,$fila){
      if ($fila==0){
         $this->array=@mysqli_fetch_array($stmt);
      }else{
         mysqli_data_seek($stmt,$fila);
         $this->array=@mysqli_fetch_array($stmt);
      }
      return $this->array;
   }

   //Devuelve el último id del insert introducido
   public function lastID(){
      return mysqli_insert_id($this->link);
   }
	
	public function rarosr($cad){    
      $cad=str_replace('&gt;','>',str_replace(chr(34),"'",str_replace('&lt;','<', str_replace('&quot;','"',str_replace('&amp;','&',$cad)))));

      return $cad;
   }
}


?> 