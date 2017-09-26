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
	
		public function jsondump($from = 0, $count = 10, $where = '', $order = '', $encode = '')
    {
         $this->View->renderJSON(array(
            'data' => self::getTable(array(
				'from' => intval($from),
				'count' => intval($count),
        'where' => $where,
				'order' => $order,
        'encode' => $encode,
			)),
        ));
    }
    
    public function jsonpost()
    {
      $this->View->renderJSON(array(
         'data' => self::getTable(array(
    				'from' => intval(Request::post('from')),
    				'count' => intval(Request::post('count')),
            'where' => Request::post('where'),
    				'order' => Request::post('order'),
			   )),
      ));
    }
    
    public function insertrecords()
    {
      $this->View->renderJSON(array(
         'data' => self::insertRows(base64_decode(Request::post('contents'))),
      ));
    }
    
  
    public function downloadCSV($params)
    {
    $params = json_decode(base64_decode($params));
    if ($params !== null) {
       $this->View->renderCSV(
            self::prepareCSV(
              self::getTable(array(
        				'from' => intval($params->from),
        				'count' => intval($params->count),
                'where' => $params->where,
        				'order' => $params->order,
              ))
            )
       );
    }}
    

    public function import($filename)
    {
        if (file_exists('data_import/' . $filename . '.csv')) {
            $filename  = 'data_import/' . $filename . '.csv';
         $this->View->render('tabledump', array(
            'filename' => $filename,
            'result' => self::importCsv($filename)
        ));
        }
    }
	
	public function streets($fragment = '')
    {
         $this->View->render('streets', array(
            'streets' => self::getStreets($fragment),
        ));
    
    }
    
    	public function allstreets()
    {
         $this->View->render('streets', array(
            'streets' => self::getStreetList(),
        ));
    
    }
    
    	public function streetdump($fragment = '')
    {
         $this->View->renderJSON(array(
            'streets' => self::getStreets($fragment),
        ));
    }
    
    	public function allstreetdump()
    {
         $this->View->renderJSON(array(
            'streets' => self::getStreetList(),
        ));
    }
    
        public function streetpost()
    {
         $this->View->renderJSON(array(
            'streets' => self::getStreets(Request::post('fragment')),
        ));
    }
    
        public function removerecords()
    {
         $this->View->renderJSON(array(
        'response' => self::recordRemoval(array(
				'records' => Request::post('records'),
        'action' => Request::post('action'),
			)),
        ));
    }
    
 
    	private function recordRemoval($params)
    {
    if ($params['action'] == 'delete') {
    $records = json_decode($params['records']);
    $sql = 'DELETE FROM residents WHERE id = '.implode(' OR id = ', $records).' LIMIT '.count($records);
 		$database = DatabaseFactory::getFactory()->getConnection();
        $query    = $database->prepare($sql);
        $query->execute();
    return array(  'results' => implode(',', $records), 'count' => $query->rowCount() );
  	}
  return array(  'results' => 'No records deleted.', 'count' => 0 );
  }
    
	
	
	
	private function getStreets($fragment)
    {
		$whereclause = '';
		Filter::XSSFilter($fragment);
		if (strlen($fragment) > 2) {
			$whereclause = 'WHERE street LIKE "%'.$fragment.'%"';
		
		$database = DatabaseFactory::getFactory()->getConnection();
        $query    = $database->prepare("SELECT DISTINCT street FROM residents $whereclause LIMIT 15;");
        $query->execute();
		if ($streets = $query->fetchAll()) {
			return $streets;
		}};
		return array('');
	}
  
  	private function getStreetList()
    {
		$database = DatabaseFactory::getFactory()->getConnection();
        $query    = $database->prepare("SELECT DISTINCT street FROM residents;");
        $query->execute();
		if ($streets = $query->fetchAll()) {
			return $streets;
		};
		return array('');
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
          $decoded = $whereclausebit[1];
          if ((isset($params['encode'])) && ($params['encode'] == 'base64')) {
           $decoded =  base64_decode($whereclausebit[1]); }; 
           $alt_signs = array('!g', '!l', '!!');
           $sign = '=';
           if (in_array(substr($decoded, 0, 2), $alt_signs)) {
           switch (substr($decoded, 0, 2)) {
            case '!g': $sign = '>'; break;
            case '!l': $sign = '<'; break;
            case '!!': $sign = '<>'; break;
           }
           $decoded = substr($decoded, 2);
           }
					$wherepieces[] = $whereclausebit[0] . ' '.$sign.' "' . $decoded . '"';
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
            return array(  'results' => array(), 'count' => 0 );
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
    
    private function prepareCSV($data) {
      $buffer = '';
        foreach ($data['results'] as $row) {
          $buffer.=$row->year.','.$row->country.','.$row->gender.','.$row->family.','.$row->children.',"'.$row->eldership.'","'.$row->street.'"'."\r\n";
        }
      return $buffer;
    }
    
    private function insertRows($data)
    {
        $inserted = 0; $duplicate = 0;
        $rows = preg_split("/\r\n|\n|\r/", $data); 
          $temp=array();
        foreach ($rows as $row) {
          if (substr_count ( $row , ',' ) == 6) {
              (self::insertRow($row)) ? $inserted++ : $duplicate++ ;          
          } 
        }
        return array(  'inserted' => $inserted, 'duplicate' => $duplicate );
    }
    
    private function insertRow($row)
    {
           $linevalues=explode(',', $row);
           $rowdata = array(
                ':year' => intval($linevalues[0]),
		            ':country' => trim($linevalues[1]),
		            ':gender' => trim($linevalues[2]),
							  ':family' => trim($linevalues[3]),
							  ':children' => trim($linevalues[4]),
                ':eldership' => trim(trim($linevalues[5]),'"'),
                ':street' => trim(trim($linevalues[6]),'"'),
					 ); 
           
           $sql = "SELECT * FROM residents WHERE year = :year AND country = :country AND gender = :gender AND family = :family AND children = :children AND eldership = :eldership AND street = :street;";
           $database = DatabaseFactory::getFactory()->getConnection();
           $query = $database->prepare($sql);
           $query->execute($rowdata);
           $result = $query->fetchAll();

           if (count($result) == 0) {
                $sql = "INSERT INTO residents (year, country,gender,family,children,eldership,street) VALUES	(:year, :country, :gender, :family, :children, :eldership, :street);";
                $query = $database->prepare($sql);
                if ($query->execute($rowdata)) {
                  return true;
                }
           }

           return false;

    }
}