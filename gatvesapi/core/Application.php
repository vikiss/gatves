<?php
require 'Config.php';

class Application
{
    private $controller;
	private $parameters = array();
	private $controller_name;
    private $action_name;

    public function __construct()
    {
		
		$this->splitUrl();
	    $this->createControllerAndActionNames();
		
		    if (file_exists(Config::get('VIEWSPATH') . $this->controller_name . '.php')) {
            require Config::get('VIEWSPATH') . $this->controller_name . '.php';
            $this->controller = new $this->controller_name();
			
			if (method_exists($this->controller, $this->action_name)) {
                if (!empty($this->parameters)) {
                    // call the method and pass arguments to it
                    call_user_func_array(array($this->controller, $this->action_name), $this->parameters);
                } else {
                    // if no parameters are given, just call the method without parameters, like $this->index->index();
                    $this->controller->{$this->action_name}();
                }
            } else {
                // load 404 error page

            require Config::get('VIEWSPATH') . 'error_controller.php';
            $this->controller = new ErrorController;
            $this->controller->error404();
            }
        } else {

            // load homepage




            require Config::get('VIEWSPATH') . 'homepage_controller.php';
            $this->controller = new homepage_controller;
            $this->controller->homepage();
        }
    }

        private function splitUrl()
    {
        if (Request::get('url')) {

            $url = trim(Request::get('url'), '/');
            $url = filter_var($url, FILTER_SANITIZE_URL);
            $url = explode('/', $url);

            $this->controller_name = isset($url[0]) ? $url[0] : null;
            $this->action_name = isset($url[1]) ? $url[1] : null;

            unset($url[0], $url[1]);

            $this->parameters = array_values($url);
        }
    }


	private function createControllerAndActionNames()
	{
		if (!$this->controller_name) {
			$this->controller_name = 'index';
		}

		if (!$this->action_name OR (strlen($this->action_name) == 0)) {
			$this->action_name = 'index';
		}

		$this->controller_name = $this->controller_name . '_controller';
	}

}



class Request
{
    public static function post($key, $clean = false)
    {
        if (isset($_POST[$key])) {
           return ($clean) ? trim(strip_tags($_POST[$key])) : $_POST[$key];
        }
    }


    public static function get($key)
    {
        if (isset($_GET[$key])) {
            return $_GET[$key];
        }
    }


}


class Config
{
	public static $config;

    public static function get($key)
    {
        if (!self::$config) {

	        $config_file = 'gatvesapi/core/Config.php';

			if (!file_exists($config_file)) {
				return false;
			}

	        self::$config = require $config_file;
        }

        return self::$config[$key];
    }
}

class Controller
{
     public $View;
	
    
    function __construct()
    {
        $this->View = new View();
    }
}

class View
{
    
    public function render($filename, $data = null)
    {
        if ($data) {
            foreach ($data as $key => $value) {
                $this->{$key} = $value;
            }
        }

        require Config::get('VIEWSPATH') . $filename . '_view.php';
    }

    
    public function renderJSON($data)
    {
        header("Content-Type: application/json");
        echo json_encode($data);
    }

    
}

class DatabaseFactory
{
	private static $factory;
	private $database;

	public static function getFactory()
	{
		if (!self::$factory) {
			self::$factory = new DatabaseFactory();
		}
		return self::$factory;
	}

	public function getConnection() {
		if (!$this->database) {
			$options = array(PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ, PDO::ATTR_ERRMODE => PDO::ERRMODE_WARNING);
			$this->database = new PDO(
				Config::get('DB_TYPE') . ':host=' . Config::get('DB_HOST') . ';dbname=' .
				Config::get('DB_NAME') . ';port=' . Config::get('DB_PORT') . ';charset=' . Config::get('DB_CHARSET'),
				Config::get('DB_USER'), Config::get('DB_PASS'), $options
			);
		}
		return $this->database;
	}
}

class Filter
{
    public static function XSSFilter(&$value)
    {
        if (is_string($value)) {
            $value = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
        }

        return $value;
    }
}


