<?php
include('config.php');

// Get the callback function name from the query string (default is 'callback')
$callback = isset($_GET['callback']) ? $_GET['callback'] : false;

// Set the correct content type for JSONP
header('Content-Type: application/javascript; charset=utf-8');

// Enable error reporting for better debugging (disable in production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    // Fetch the count of likes for each project
    $query = "SELECT likes_id, COUNT(user_id) as like_count FROM likes GROUP BY likes_id";
    $stmt = $conn->prepare($query);
    $stmt->execute();

    // Fetch all results as an associative array
    $likes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Check if callback is provided, wrap the JSON in a callback function
    if ($callback) {
        echo $callback . '(' . json_encode($likes) . ')'; // JSONP response
    } else {
        echo json_encode($likes); // Fallback to normal JSON
    }
} catch (PDOException $e) {
    // Return error message if something goes wrong
    $error = ['error' => $e->getMessage()];
    if ($callback) {
        echo $callback . '(' . json_encode($error) . ')'; // JSONP error response
    } else {
        echo json_encode($error); // Fallback to normal JSON
    }
}
?>
