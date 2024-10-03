<?php
include('config.php');

// Assuming the user_id and item_id are passed via POST
$likes_id = $_POST['likes_id'];
$user_id = $_POST['user_id'];

// Check if the user has already liked the item
$query = "SELECT * FROM likes WHERE user_id = :user_id AND likes_id = :likes_id";
$check = $conn->query($query);

if ($check == 0) {
    // User has not liked the likes yet, insert the like
    $insert = "INSERT INTO likes (user_id, likes_id) VALUES (:user_id, :likes_id)";
    $conn->query($insert);

    // Return a JSON response indicating the like was successful
    echo json_encode(['liked' => true]);
} else {
    // User has already liked the item
    echo json_encode(['liked' => false]);
}
?>
