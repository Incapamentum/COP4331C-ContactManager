var urlBase = "";
var extension = "php";

var userID = 0;
var firstName = "";
var lastName = "";

function doLogin(){

}


function doRegister(){

}

function doLogout(){

}

function addContact(){

}

function searchContact(){

}

function deleteContact(){

}

function hideOrShow( elementId, showState ){
	var vis = "visible";
	var dis = "block";
	if( !showState )
	{
		vis = "hidden";
		dis = "none";
	}

	document.getElementById( elementId ).style.visibility = vis;
	document.getElementById( elementId ).style.display = dis;
}
