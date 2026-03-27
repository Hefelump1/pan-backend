<?php
// Email relay endpoint for Railway backend
// Place this file in your public_html directory on Vodien

// Security: Only accept requests with the correct secret key
$SECRET_KEY = 'PAN_EMAIL_RELAY_2026_SECRET';

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-API-Key');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Check API key
$api_key = $_SERVER['HTTP_X_API_KEY'] ?? '';
if ($api_key !== $SECRET_KEY) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['to']) || !isset($data['subject']) || !isset($data['html_body'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields: to, subject, html_body']);
    exit;
}

$to = $data['to'];
$subject = $data['subject'];
$html_body = $data['html_body'];
$from_name = $data['from_name'] ?? 'Polish Association of Newcastle';
$from_email = $data['from_email'] ?? 'webadmin@polishassociationnewcastle.org.au';

// Build email headers
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: {$from_name} <{$from_email}>\r\n";
$headers .= "Reply-To: {$from_email}\r\n";

// Send email
$success = mail($to, $subject, $html_body, $headers);

if ($success) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Email sent']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send email']);
}
?>
