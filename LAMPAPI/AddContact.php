<?php
	//JSON FORMATS
	//  RECIEVED JSON
	// 	{
	//		"firstName" : "login of new user"
	//		"lastName" : "hashed password of new user"
	//		"phoneNumber" : "login of new user"
	//		"address" : "hashed password of new user"
	//		"email" : "login of new user"
	//		"powerLevel" : "hashed password of new user"
	//		"userId" : "login of new user"
	//	}
	//  SENT JSON
	// 	{
	//		NONE
	//	}
	$inData = getRequestInfo();

	$fName = $inData["firstName"];
	$lName = $inData["lastName"];
	$pNum = $inData["phoneNumber"];
	$addr = $inData["address"];
	$email = $inData["email"];
	$plevel = $inData["powerLevel"];
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "raph", "password", "Contact Manager");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$sql = "INSERT INTO Contacts (ID, firstName, lastName, phoneNumber, address, email, powerLevel, userId) VALUES ('". NULL ."', '". $fName ."', '". $lName ."', '". $pNum ."', '". $addr ."', '". $email ."', '". $plevel ."', '". $userId ."')";

		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError( $conn->error );
		}
		$conn->close();
	}

	returnWithError("");

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>

