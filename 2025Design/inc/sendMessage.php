<?php

//Error Reporting
ini_set('display_errors', 'On');
error_reporting(E_ALL);

// Replace with your Discord Webhook URL
$webhookUrl = 'ReplaceHERE';

// Check if form is submitted
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get form fields
    $name = trim(stripslashes($_POST['contactName']));
    $email = trim(stripslashes($_POST['contactEmail']));
    $subject = trim(stripslashes($_POST['contactSubject']));
    $contact_message = trim(stripslashes($_POST['contactMessage']));

     // Check if any of the fields are empty
	 if (empty($name) OR empty($email) OR empty($subject) OR empty($contact_message)) {
        header("Location: index.php?success=-1");
        exit;
    }

    // Create a message array to send to the Webhook
    $message = [
        'content' => "New message from $name ($email):\n\n$subject\n\n$contact_message",
    ];

	if (!$error) {

		// Send the message to the Webhook
		$ch = curl_init($webhookUrl);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $message);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$response = curl_exec($ch);
		curl_close($ch);
  
		if (curl_errorno($ch)) {
			echo 'Error: ' . curl_error($ch);
		} else {
			echo "Message sent successfully.";
		}
		
		else { echo "Something went wrong. Please try again."; }
		  
	  } # end if - no validation error

	else {

		$response = (isset($error['name'])) ? $error['name'] . "<br /> \n" : null;
		$response .= (isset($error['email'])) ? $error['email'] . "<br /> \n" : null;
		$response .= (isset($error['message'])) ? $error['message'] . "<br />" : null;
		
		echo $response;

	} # end if - there was a validation error
}

?>