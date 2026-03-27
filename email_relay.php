<?php
$SECRET_KEY = 'PAN_EMAIL_RELAY_2026_SECRET';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-API-Key');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$api_key = $_SERVER['HTTP_X_API_KEY'] ?? '';
if ($api_key !== $SECRET_KEY) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['to']) || !isset($data['subject'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$to = $data['to'];
$subject = $data['subject'];
$from_name = $data['from_name'] ?? 'Polish Association of Newcastle';
$from_email = $data['from_email'] ?? 'webadmin@polishassociationnewcastle.org.au';

// Build HTML from booking fields if present
if (isset($data['booking_name'])) {
    $html_body = "<h2>New Hall Hire Enquiry</h2>";
    $html_body .= "<p><b>Name:</b> " . htmlspecialchars($data['booking_name']) . "</p>";
    $html_body .= "<p><b>Email:</b> " . htmlspecialchars($data['booking_email'] ?? '') . "</p>";
    $html_body .= "<p><b>Phone:</b> " . htmlspecialchars($data['booking_phone'] ?? '') . "</p>";
    $html_body .= "<p><b>Event Type:</b> " . htmlspecialchars($data['booking_event_type'] ?? '') . "</p>";
    $html_body .= "<p><b>Date:</b> " . htmlspecialchars($data['booking_date'] ?? 'Not specified') . "</p>";
    $html_body .= "<p><b>Guests:</b> " . htmlspecialchars($data['booking_guests'] ?? '') . "</p>";
    $html_body .= "<p><b>Message:</b> " . htmlspecialchars($data['booking_message'] ?? '') . "</p>";
} else {
    $html_body = $data['html_body'] ?? '';
}

$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: {$from_name} <{$from_email}>\r\n";
$headers .= "Reply-To: {$from_email}\r\n";

$success = mail($to, $subject, $html_body, $headers);

if ($success) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Email sent']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send email']);
}
?>
