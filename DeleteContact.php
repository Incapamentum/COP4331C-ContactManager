<?php

	// Calling function to get info needed
	$inData = getRequestInfo();													// Storing all sent data in $inData
	$contactID = $inData["contactID"];											// Getting contactID to identify proper contact

	$conn = new mysqli("localhost", "raph", "password", "Contact Manager");		// Connecting to database

	// Checking if connection is valid
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$sql = "DELETE FROM Contacts WHERE id = $contactID";					// Deleting contact that has an id equal to $contactID
		if( $result = $conn->query($sql) != TRUE )								// Executing query and determining if query was successful
		{
			returnWithError( $conn->error );									// Exiting with an error
		}
		$conn->close();															// Closing connection to database
	}

	returnWithError("");														// Return with no error


	// The following function decodes the incoming json file to get the needed information
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	// The follownig function sends its parameter as a JSON package
	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	// Returns from function. (NOTE: if "" is passed to this function this implies no error)
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>

