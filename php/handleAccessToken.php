<?php

class HandleAccessToken
{

    private $CLIENT_SECRET = "tAyIprn4BNd31NjIfhWN7V3guwDoLZH3WI3AprdCdtqXRGSecquTuTmASAipWCw4";
    private $CLIENT_ID = "atcc";
    private $REDIRECT_URI = "https://atcc-qa.beaconing.eu/";

    function __construct() {
        //$this->REDIRECT_URI = 'https://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
    }

    public function removeCodeFromURL() {
        $parsedURL = parse_url('https://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI']);
        // Getting query params
        parse_str($parsedURL["query"], $parsedQuery);
        // Unsetting code param
        if (isset($parsedQuery["code"])) {
            unset($parsedQuery["code"]);
        }

        // Contructing complete URL without code param
        if (strlen($parsedQuery) > 0) {
            return 'https://'.$_SERVER['HTTP_HOST'].$parsedURL["path"]."?".http_build_query($parsedQuery);
        } else {
            return 'https://'.$_SERVER['HTTP_HOST'].$parsedURL["path"];
        }
    }


    public function islogged() {
        return isset($_COOKIE['access_token']);
    }


    public function currentUser() {
        /*$ch = curl_init();

        // Establece la URL y otras opciones apropiadas
        curl_setopt($ch, CURLOPT_URL, "https://core.beaconing.eu/api/currentuser");
        //return the transfer as a string 
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        // Captura la URL y la envía al navegador
        $response = curl_exec($ch);
        curl_close($ch);

        var_dump($response);
        return $response;*/

        $curl = curl_init("https://core.beaconing.eu/api/currentuser");

        curl_setopt($curl, CURLOPT_HTTPHEADER, array("Authorization: Bearer ". $_COOKIE['access_token']));

        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HEADER, false);

        $json_response = curl_exec($curl);

        curl_close($curl);

        $response = json_decode($json_response, true);
        return $response;
    }


    public function login(){
        header('Location: https://core.beaconing.eu/auth/auth?response_type=code&client_id='. 
            $this->CLIENT_ID . '&redirect_uri=' . $this->REDIRECT_URI);
    }


    public function auth($code) {

        $ch = curl_init( "https://core.beaconing.eu/auth/token" );
        
        curl_setopt( $ch, CURLOPT_POST, 1);
        curl_setopt( $ch, CURLOPT_HTTPHEADER, array("Content-type: application/json"));
        $fields = array(
            "grant_type" => "authorization_code",
            "code" => $code,
            "client_id" => $this->CLIENT_ID,
            "client_secret" => $this->CLIENT_SECRET,
            "redirect_uri" => $this->REDIRECT_URI
        );

        curl_setopt( $ch, CURLOPT_POSTFIELDS, json_encode($fields));
        curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt( $ch, CURLOPT_HEADER, 0);

        $response = curl_exec( $ch );
        $response = json_decode($response);
        curl_close($ch);

        if (isset($response->error) && $response->error != "") {
            return false;
        }

        setcookie("token_expires_at", time()+$response->expires_in);
        setcookie("access_token", $response->access_token);
        setcookie("refresh_token", $response->refresh_token);
        setcookie("token_type", $response->token_type);

        return true;
    }


    public function refreshtoken() {

        $ch = curl_init( "https://core.beaconing.eu/auth/token" );
        curl_setopt( $ch, CURLOPT_POST, true);
        curl_setopt( $ch, CURLOPT_HTTPHEADER, array("Content-type: application/json"));
        $fields = array(
            "grant_type" => "refresh_token",
            "client_id" => $this->CLIENT_ID,
            "client_secret" => $this->CLIENT_SECRET,
            "refresh_token" => $_COOKIE['refresh_token']
        );
        $fields = json_encode($fields);
        curl_setopt( $ch, CURLOPT_POSTFIELDS, $fields);
        curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec( $ch );
        $response = json_decode($response);
        curl_close( $ch);

        setcookie("token_expires_at", time()+$response->expires_in);
        setcookie("access_token", $response->access_token);
        setcookie("token_type", $response->token_type);
    }
}

$auth = new HandleAccessToken();
if ( !$auth->islogged() ) {
    if (isset($_REQUEST["code"])) {
        //FOTRE A LA SESSIÓ
        $_SESSION["auth_code"] = $_REQUEST["code"];
    //    echo("hem rebut el codi i anem a demanar el token");
        $success = $auth->auth( $_REQUEST["code"] );
        if (!$success) {
            $auth->login();
        }
        header('Location:' . $auth->removeCodeFromURL());
    }
    else {
        $auth->login(); 
    }
} else if( isset($_COOKIE['token_expires_at']) ) {
  //  echo("Tenim settejat el token");
    if( intval($_COOKIE['token_expires_at']) < time() ) {// IF current time is greater than expiration date
//        echo("token renovat");
        $auth->refreshtoken();
    }
}

