
var urlBase = 'http://teamsixstar.online/ContactManager';
var extension = "php";

var userId = 0;
var contactID = 0;
var cellID = -1;
var boolean = false;

function doLogin()
{
	userId = 0;
	// retrieving and hashing user password
	var login = document.getElementById("loginUsername").value;
	var password = document.getElementById("loginPassword").value;
	var hashed = CryptoJS.MD5(password);

	document.getElementById("loginResult").innerHTML = "";

	// Setting up the data to be sent to the server
	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hashed + '"}';
	var url = urlBase + '/LAMPAPI/Login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

		var jsonObject = JSON.parse( xhr.responseText);


		userId = jsonObject.id;

		if( userId < 1 )
		{
			document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			return;
		}

		// Clearing login fields and loading contacts
		document.getElementById("loginUsername").value = "";
		document.getElementById("loginPassword").value = "";
		document.getElementById("contactSearch").value = "";
		searchContact();

		hideOrShow( "contactControlDiv", true);
		hideOrShow( "loginDiv", false);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function doLogout()
{
	userId = 0;
	hideOrShow( "contactControlDiv", false);
	hideOrShow( "loginDiv", true);
	hideOrShow("addContactDiv", false);

	// Reset search results to blank upon logout
	var searchResultTable = document.getElementById("searchResultTable");
	while(searchResultTable.firstChild)
	{
		searchResultTable.removeChild(searchResultTable.firstChild);
	}
	// Clearing message to user field
	document.getElementById("contactSearchResult").innerHTML = "";
}
// Function to hide or show divs
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

function openRegister()
{
	hideOrShow("registerDiv", true);
	hideOrShow("loginDiv", false);
}

function doRegister()
{
	userId = 0;
	// Retrieving user info
	var login = document.getElementById("registerUsername").value;
	var password = document.getElementById("registerPassword").value;
	var verification = document.getElementById("registerPasswordConfirm").value;

	document.getElementById("registerResult").innerHTML = "";
	// Checking if passwords are the same
	if (password != verification)
	{
		document.getElementById("registerResult").innerHTML = "Passwords do not match<br>";
		return;
	}
	// Chcking that password doesn't contain spaces or tabs
	if (password.length < 5 || password.indexOf(' ') >= 0 || password.indexOf('\t') >= 0)
	{
		document.getElementById("registerResult").innerHTML = "Password must be at least 5 characters without spaces<br>";
		return;
	}
	// Checking that username is at least 2 chatacters and have no spaces or tabs
	if (login.length < 2 || login.indexOf(' ') >= 0 || login.indexOf('\t') >= 0)
	{
		document.getElementById("registerResult").innerHTML = "User name cannot have spaces<br>";
		return;
	}
	// Hashing and setting up data to be sent to the server
	var hashed = CryptoJS.MD5(password);
	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hashed + '"}';
	var url = urlBase + '/LAMPAPI/Register.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("registerResult").innerHTML = "User added.";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}

	var url = urlBase + '/LAMPAPI/Login.' + extension;

	xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

		var jsonObject = JSON.parse(xhr.responseText);

		userId = jsonObject.id;
		// Clearing register fields and hiding register div
		document.getElementById("registerUsername").value = "";
		document.getElementById("registerPassword").value = "";
		document.getElementById("registerPasswordConfirm").value = "";
		document.getElementById("registerResult").innerHTML = "";
		document.getElementById("registerPhoneNumber").value = "";
		hideRegister();

	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}

}

function searchContact()
{
	var srch = document.getElementById("contactSearch").value;
	document.getElementById("contactSearchResult").innerHTML = "";

	// Clear existing search result table
	var searchResultTable = document.getElementById("searchResultTable");
	while(searchResultTable.firstChild)
	{
		searchResultTable.removeChild(searchResultTable.firstChild);
	}
	// Setting up data to be sent to the server
	var jsonPayload = '{"search" : "' + srch + '", "userId" : "' + userId + '"}';
	var url = urlBase + '/LAMPAPI/SearchContacts.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );
				var i;

				// Contsrcting a table for results
				var tableHeader = document.createElement("tr");
				var nameHeader = document.createElement("th");
				nameHeader.innerHTML = "Contact Name";
				tableHeader.appendChild(nameHeader);
				searchResultTable.appendChild(tableHeader);

				for( i=0; i<jsonObject.results.length; i++ )
				{
					// Iterative creation of search result entries in table
					var results = jsonObject.results[i].split(" ");
					var n = results.length - 3
					var firstName = results[0];
					while(n > 0)
					{
						firstName = firstName + " " + results[n];
						n--;
					}

					// Extracting incomming data
					var lastName = results[results.length-2];
					var id = results[results.length-1];

					var resultRow = document.createElement("tr");
					// Contsructing delete button
					var deleteBut = document.createElement("button");
					deleteBut.type = "button";
					deleteBut.id = id + " " + (i+1); // Embedding contact ID and row number info in button ID
					deleteBut.class = "button";
					deleteBut.setAttribute("onclick", "deleteContact(this.id);");
					deleteBut.innerHTML = "Delete";
					// Contsructing details button
					var details = document.createElement("button");
					details.type = "button";
					details.id = id + " " + ((i+1)*2); // Embedding contact ID row number info in button ID
					details.class = "button";
					details.setAttribute("onclick", "fetchContact(this.id);");
					details.innerHTML = "Details";

					var resultCell = document.createElement("td");
					// Embedding contact ID info in result cell ID
					resultCell.id = id + " " + ((i+1)*2) + "b";

					resultCell.innerHTML = firstName + " " + lastName;
					// Adding components to the row in the table
					resultRow.appendChild(resultCell);
					resultRow.appendChild(details);
					resultRow.appendChild(deleteBut);
					searchResultTable.appendChild(resultRow);
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}

}

// The following function displays the register div
function displayRegister()
{
	hideOrShow("loginDiv", false);
	hideOrShow("registerDiv", true);
}

// The following function hides the register div
function hideRegister()
{
	document.getElementById("registerUsername").value = "";
	document.getElementById("registerPassword").value = "";
	document.getElementById("registerEmail").value = "";
	document.getElementById("registerPhoneNumber").value = "";
	hideOrShow("registerDiv", false);
	hideOrShow("loginDiv", true);
}

function addContact()
{
	var fName = document.getElementById("newFirstName").value;
	var lName = document.getElementById("newLastName").value;
	var phoneNum = document.getElementById("newPhoneNumber").value;
	var address = document.getElementById("newAddress").value;
	var email = document.getElementById("newEmail").value;
	var plevel = document.getElementById("newPowerLevel").value;
	document.getElementById("contactAddResult").innerHTML = "";

	var jsonPayload = '{"firstName" : "' + fName + '", "lastName" : "' + lName + '", "phoneNumber" : "' + phoneNum + '", "address" : "' + address + '", "email" : "' + email + '", "powerLevel" : "' + plevel +  '", "userId" : ' + userId + '}';
	var url = urlBase + '/LAMPAPI/AddContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
				document.getElementById("contactSearch").value = "";
				searchContact();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}

	// Clearing fields and hiding div
	document.getElementById("newFirstName").value = "";
	document.getElementById("newLastName").value = "";
	document.getElementById("newPhoneNumber").value = "";
	document.getElementById("newAddress").value = "";
	document.getElementById("newEmail").value = "";
	document.getElementById("newPowerLevel").value = "";

	hideOrShow("addContactDiv", false);

	setTimeout(hideAddContact, 1500);
}

// The following function empties out all the fields in the add contact div
// and hides it.
function cancelAddContact()
{
	// Clearing fields and hiding div
	document.getElementById("newFirstName").value = "";
	document.getElementById("newLastName").value = "";
	document.getElementById("newPhoneNumber").value = "";
	document.getElementById("newAddress").value = "";
	document.getElementById("newEmail").value = "";
	document.getElementById("newPowerLevel").value = "";
	hideAddContact();
}

// The following function displays the add contact div
function displayAddContact()
{
	hideOrShow("addContactDiv", true);
}

// The following function hides the add contact div
function hideAddContact()
{
	document.getElementById("contactAddResult").innerHTML = "";
	hideOrShow("addContactDiv", false);
}

function deleteContact(idString)
{
	// Extracting conactID and row number from cell ID
	var idArray = idString.split(" ");
	var row = idArray[1];
	contactID = idArray[0];

	// Setting up the data to be sent to the server
	var jsonPayload = '{"contactID" : "' + contactID + '"}';
	var url = urlBase + '/LAMPAPI/DeleteContact.' + extension;
	var xhr = new XMLHttpRequest();

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				// Displaying success message and clearing form
				document.getElementById("contactAddResult").innerHTML = "Contact deleted successfully";
				document.getElementById("searchResultTable").deleteRow(row);
				document.getElementById("editedFirstName").value = "";
				document.getElementById("editedLastName").value = "";
				document.getElementById("editedPhoneNumber").value = "";
				document.getElementById("editedEmail").value = "";
				document.getElementById("address").value = "";
				document.getElementById("editedPowerLevel").value = "";
				hideOrShow("editContactDiv", false);
			}
		}
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	// Hiding contact info div and setting up a timer for success message
	hideOrShow("contactInfoDiv", false);
	setTimeout(delayHide, 3000);
}

function delayHide()
{
	document.getElementById("contactAddResult").innerHTML = "";
}

function submitContact()
{
	if (boolean == false)
		return;
	var fName = document.getElementById("editedFirstName").value;
	var lName = document.getElementById("editedLastName").value;
	var phoneNum = document.getElementById("editedPhoneNumber").value;
	var newEmail = document.getElementById("editedEmail").value;
	var newAddress = document.getElementById("address").value;
	var newPowerlvl = document.getElementById("editedPowerLevel").value;

	var jsonPayload = '{"contactID" : "' + contactID + '", "newFName" : "' + fName + '", "newLName" : "' + lName + '", "newPhoneNum" : "' + phoneNum + '", "newEmail" : "' + newEmail + '", "newAddress" : "' + newAddress + '", "newPowerlvl" : ' + newPowerlvl + '}';

	var url = urlBase + '/LAMPAPI/EditContact.' + extension;
	var xhr = new XMLHttpRequest();

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactAddResult").innerHTML = "Contact edited successfully";
				document.getElementById(cellID).innerHTML = fName + " " + lName;
				boolean = false;
				hideOrShow("editContactDiv", false);
			}
		}
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("submitError").innerHTML = err.message;
	}
}

function editContact()
{
	boolean = true;
	document.getElementById("editedFirstName").value = document.getElementById("editedFirstName").placeholder;
	document.getElementById("editedLastName").value = document.getElementById("editedLastName").placeholder;
	document.getElementById("editedPhoneNumber").value = document.getElementById("editedPhoneNumber").placeholder;
	document.getElementById("editedEmail").value = document.getElementById("editedEmail").placeholder;
	document.getElementById("address").value = document.getElementById("address").placeholder;
	document.getElementById("editedPowerLevel").value = document.getElementById("editedPowerLevel").placeholder;

	document.getElementById("editedFirstName").readOnly = false;
	document.getElementById("editedLastName").readOnly = false;
	document.getElementById("editedPhoneNumber").readOnly = false;
	document.getElementById("editedEmail").readOnly = false;
	document.getElementById("address").readOnly = false;
	document.getElementById("editedPowerLevel").readOnly = false;
}

function fetchContact(idString)
{
	// Extracting conactID from input string

	cellID = idString + "b";

	var idArray = idString.split(" ");
	contactID = idArray[0];
	var row = (idArray[1] / 3) - 1;

	var jsonPayload = '{"contactID" : "' + contactID + '"}';
	var url = urlBase + '/LAMPAPI/FetchContact.' + extension;
	var xhr = new XMLHttpRequest();

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("editedFirstName").value = "";
				document.getElementById("editedLastName").value = "";
				document.getElementById("editedPhoneNumber").value = "";
				document.getElementById("editedEmail").value = "";
				document.getElementById("address").value = "";
				document.getElementById("editedPowerLevel").value = "";
				//document.getElementById("contactAddResult").innerHTML = "Contact edited successfully";
				var jsonObject = JSON.parse( xhr.responseText );
				document.getElementById("editedFirstName").placeholder = jsonObject.fName;
				document.getElementById("editedFirstName").readOnly = true;
				document.getElementById("editedLastName").placeholder = jsonObject.lName;
				document.getElementById("editedLastName").readOnly = true;
				document.getElementById("editedPhoneNumber").placeholder = jsonObject.phoneNum;
				document.getElementById("editedPhoneNumber").readOnly = true;
				document.getElementById("editedEmail").placeholder = jsonObject.email;
				document.getElementById("editedEmail").readOnly = true;
				document.getElementById("address").placeholder = jsonObject.address;
				document.getElementById("address").readOnly = true;
				document.getElementById("editedPowerLevel").placeholder = jsonObject.powerlvl;
				document.getElementById("editedPowerLevel").readOnly = true;
				hideOrShow("contactID", false);
				hideOrShow("editContactDiv", true);
			}
		}
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
}

function cancelEditContact()
{
	boolean = false;
	document.getElementById("editedFirstName").value = "";
	document.getElementById("editedLastName").value = "";
	document.getElementById("editedPhoneNumber").value = "";
	document.getElementById("editedEmail").value = "";
	document.getElementById("address").value = "";
	document.getElementById("editedPowerLevel").value = "";
	hideOrShow("editContactDiv", false);
}
