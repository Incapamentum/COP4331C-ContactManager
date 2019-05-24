var urlBase = 'http://teamsixstar.online/ContactManager/';
var extension = "php";

var userID = 0;
var firstName = "";
var lastName = "";

function doLogin()
{

}

function displayRegisterUser()
{
	hideOrShow("registerDiv", true);
}

function doRegisterUser()
{
	var newUsername = getElementById("registerUsername").value;
	var newPassword = getElementById("registerPassword").value;
	var newPasswordConfirm = getElementById("registerPasswordConfirm").value;
	var newEmail = getElementById("registerEmail").value;
	var newPhone = getElementById("registerPhoneNumber").value;
}

function hideRegisterUser()
{
	hideOrShow("registerDiv", false);


}

function doLogout()
{

}

function showAddContact()
{
	hideOrShow("addContactDiv", true);
}

function addContact()
{

}

function cancelAddContact()
{

}

function searchContacts()
{

}

function deleteContact()
{
	// before deleting, display a popup asking for confirmation
}

function showEditContact()
{
	hideOrShow("editContactDiv", true);
}

function editContact()
{
	
}

function cancelEditContact()
{

}

function hideOrShow( elementId, showState )
{
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
