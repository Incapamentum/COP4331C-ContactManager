<?php
	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "raph", "password", "Contact Manager");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$sql = "INSERT INTO Users (ID, Login, Password) VALUES ('". NULL ."', '". $inData["login"] ."', '". $inData["password"] ."')";

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

<<<<<<< HEAD
?>
=======
?>
>>>>>>> d38d3b4874dbc68432b502ac47deee3371c9b0b4
