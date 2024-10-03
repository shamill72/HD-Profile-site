<?php

$db_user = "root";
$db_pass = "";
$db_name = "hamilldesigns";
$db_host = "localhost";

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
try {
    $conn = new mysqli ($db_host, $db_user, $db_pass, $db_name);
    $conn->set_charset("utf8mb4");
} catch(Exception $e) {
    error_log($e->getMessage());
    exit('Error connecting to database');
}