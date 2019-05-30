<?php
	//JSON FORMATS
	//  RECIEVED JSON
	// 	{
	//		"contactID" 	: "(contactID of contact to be edited)"
	//		"newFName" 		: "(new first Name)",
	//		"newLName" 		: "(new last Name)",
	//		"newPhoneNum" 	: "(new phone number)",
	//		"newEmail"		: "(new email)""
	//		"newAddress" 	: "(new Address)",
	//		"newPowerlvl"	: "(new Powerlevel)"
	//	}
	//  SENT JSON
	// 	{
	//		"contactID"		: ""
	//	}	

	// Getting info from incomming JSON
	$inData = getRequestInfo();

	// Getting contactID of requested contact from parsed JSON
	$contactID = $inData["contactID"];

	// Getting new info for requested contact
	$newFName = $inData["newFName"];
	$newLName = $inData["newLName"];
	$newPhoneNum = $inData["newPhoneNum"];
	$newEmail = $inData["newEmail"];
	$newAddress = $inData["newAddress"];
	$newPowerlvl = $inData["newPowerlvl"];

	// Connecting to database
	$conn = new mysqli("localhost", "raph", "password", "Contact Manager");

	// Checking if connection is valid
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$sql = "UPDATE Contacts SET firstName = '" . $newFName ."',
				 lastName = '" . $newLName . "',
				  address = '" . $newAddress . "',
				  phoneNumber = '" . $newPhoneNum . "',
				   email = '" . $newEmail . "',
				    powerLevel = '" . $newPowerlvl . "' WHERE id = '" . $contactID ."'";			
		if( $result = $conn->query($sql) != TRUE )								
		{
			returnWithError( $conn->error );									
		}
		$conn->close();															
	}

	returnWithInfo($contactID);													
	}

	// The following function decodes the incoming JSON
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	// The following function sends a given object as a JSON
	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	// The following function creates a string in JSON format to send. Used for ERROR
	function returnWithError( $err )
	{
		$retValue = '{
						"contactID":0,
						"error":"' . $err . '"
					}';
		sendResultInfoAsJson( $retValue );
	}

	// The following function creates a string in JSON format to send. Used to return contact info
	function returnWithInfo($contactID)
	{
		$retValue = '{
						"contactID":"' . $contactID . '",
						"error":""
					}';
		sendResultInfoAsJson( $retValue );
	}

?>

