<?php
include('config.php');

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

    // Return results as JSON
    echo json_encode($likes);
} catch (PDOException $e) {
    // Return error message if something goes wrong
    echo json_encode(['error' => $e->getMessage()]);
}
?>
