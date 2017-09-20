<?php

class homepage_controller extends Controller
{
    
    public function __construct()
    {
        parent::__construct();
    }

    
    public function homepage()
    {
         $this->View->render('homepage');
    }
}