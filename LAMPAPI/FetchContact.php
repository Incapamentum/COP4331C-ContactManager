<?php
	//JSON FORMATS
	//  RECIEVED JSON
	// 	{
	//		"contactID" : "(contactID of contact to be fetched)""
	//	}
	//  SENT JSON
	// 	{
	//		"fName" 	: "(first Name)",
	//		"lName" 	: "(last Name)",
	//		"phoneNum" 	: "(phone number)",
	//		"email"		: "(email)""
	//		"address" 	: "(Address)",
	//		"powerlvl"	: "(Powerlevel)"
	//		"contactID" : "(contactID")
	//	}
	
	// Getting info from incomming JSON
	$inData = getRequestInfo();

	// Getting contactID of requested contact from parsed JSON
	$contactID = $inData["contactID"];

	// Connecting to database
	$conn = new mysqli("localhost", "raph", "password", "Contact Manager");

	// Checking if connection was successful
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		// Selecting contacts from table that match with the given contactID
		$sql = "SELECT * FROM Contacts WHERE ID = '" . $contactID ."'";

		// Running SQL query
		$result = $conn->query($sql);

		// If a contact is found then store all the fields into variables
		if ($result->num_rows > 0)
		{
			$row = $result->fetch_assoc();
			$firstName = $row["firstName"];
			$lastName = $row["lastName"];
			$phoneNumber = $row["phoneNumber"];
			$address = $row["address"];
			$email = $row["email"];
			$powerLevel = $row["powerLevel"];

			// Send all these fields back
			returnWithInfo($firstName, $lastName, $phoneNumber, $email, $address, $powerLevel, $contactID);
		}
		else
		{
			returnWithError("No Contact Matching ID found");
		}
		// Closing connection to server
		$conn->close();
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
						"fName":"",
						"lName":"",
						"phoneNum":0,
						"email":"",
						"address":"",
						"powerlvl":0,
						"contactID":0,
						"error":"' . $err . '"
					}';
		sendResultInfoAsJson( $retValue );
	}

	// The following function creates a string in JSON format to send. Used to return contact info
	function returnWithInfo($fName, $lName, $phoneNum, $email, $address, $powerlvl, $contactID)
	{
		$retValue = '{
						"fName":"' . $fName . '",
						"lName":"' . $lName . '",
						"phoneNum":"' . $phoneNum . '",
						"email":"' . $email . '",
						"address":"' . $address . '",
						"powerlvl":"' . $powerlvl . '",
						"contactID":"' . $contactID . '",
						"error":"' . $err . '"
					}';
		sendResultInfoAsJson( $retValue );
	}

?>

