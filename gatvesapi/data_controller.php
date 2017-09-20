<?php

class data_controller extends Controller
{
    
    public function __construct()
    {
        parent::__construct();
    }

    
    public function index()
    {
         $this->View->render('tabledump', array(
            'data' => self::getTable(array(
				'from' => 20,
				'count' => 50,
			)),
        ));
    }
	
	public function dump($from = 0, $count = 10, $where = '', $order = '')
    {
         $this->View->render('tabledump', array(
            'data' => self::getTable(array(
				'from' => intval($from),
				'count' => intval($count),
				'where' => $where,
				'order' => $order,
			)),
        ));
    }
	
		public function jsondump($from = 0, $count = 10)
    {
         $this->View->renderJSON(array(
            'data' => self::getTable(array(
				'from' => intval($from),
				'count' => intval($count),
			)),
        ));
    }
	

    
     public function import($filename)
    {
        if (file_exists('data_import/' . $filename . '.csv')) {
            $filename  = 'data_import/' . $filename . '.csv';
         $this->View->render('tabledump', array(
            'filename' => $filename,
            'result' => self::importCsv($filename)
        ));
        } else {print 'ne'; }
          
         
    }
	
	public function streets($fragment = '')
    {
         $this->View->render('streets', array(
            'streets' => self::getStreets($fragment),
        ));
        
          
         
    }
	
	
	private function getStreets($fragment)
    {
		$whereclause = '';
		Filter::XSSFilter($fragment);
		if (strlen($fragment) > 2) {
			$whereclause = 'WHERE street LIKE "'.$fragment.'%"';
		}
		$database = DatabaseFactory::getFactory()->getConnection();
        $query    = $database->prepare("SELECT DISTINCT street FROM residents $whereclause;");
        $query->execute();
		if ($streets = $query->fetchAll()) {
			return $streets;
		};
		return false;
	}
    
     	
    
    private function getTable($params = null)
    {
		if (is_array($params)) array_walk_recursive($params, 'Filter::XSSFilter');

		$from = (isset($params['from'])) ? intval($params['from']) : 0;
		$count = (isset($params['count'])) ? intval($params['count']) : 10;
		$wherepieces = array();
		
		$where = '';
		if ((isset($params['where'])) && (strpos($params['where'], ':') !== false)) {
			$whereclauses = explode(',', $params['where']);
				foreach($whereclauses as $whereclause) {
					$whereclausebit = explode(':', $whereclause);
					$wherepieces[] = $whereclausebit[0] . ' = "' . base64_decode($whereclausebit[1]). '"';
				}
			$where = 'WHERE ' . implode(' AND ', $wherepieces);
		}
		
		$order = '';
		if ((isset($params['order'])) && (strpos($params['order'], ':') !== false)) {
			$orderclause = explode(':', $params['order']);
			if (($orderclause[1] == 'ASC') or ($orderclause[1] == 'DESC')) {
				$order = 'ORDER BY '.$orderclause[0].' '.$orderclause[1];
			}
		}
        $database = DatabaseFactory::getFactory()->getConnection();
        $query    = $database->prepare("SELECT SQL_CALC_FOUND_ROWS * FROM residents $where $order LIMIT $from, $count;");
        $query->execute();
        if ($data = $query->fetchAll()) {
			$totalcount = $database->prepare('SELECT FOUND_ROWS() as total;');
			$totalcount->execute();
			$total = $totalcount->fetch();
		    return array( 'results' => $data, 'count' => $total->total );
            }
            return false;
    }
    
    private function importCsv($file)
    {
        $handle = fopen($file, "r");
        if ($handle) {
        $database = DatabaseFactory::getFactory()->getConnection();
    
            while (($line = fgets($handle)) !== false)
            {
                if (is_numeric(substr($line, 0, 4))) {
                    $linevalues=explode(',', $line);
                    
                    $sql = "INSERT INTO residents (year, country,gender,family,children,eldership,street)
                    VALUES	(:year, :country, :gender, :family, :children, :eldership, :street);";
                    $query = $database->prepare($sql);
                    $query->execute(array(
                              ':year' => intval($linevalues[0]),
		                      ':country' => trim($linevalues[1]),
		                      ':gender' => trim($linevalues[2]),
							  ':family' => trim($linevalues[3]),
							  ':children' => trim($linevalues[4]),
                              ':eldership' => trim(trim($linevalues[5]),'"'),
                              ':street' => trim(trim($linevalues[6]),'"'),
						  ));
                    
                }

            }

    fclose($handle);
        } 
        
    }
}