
var urlBase = 'http://teamsixstar.online/ContactManager';
var extension = "php";

var userId = 0;
var contactID = 0;

function doLogin()
{
	userId = 0;


	var login = document.getElementById("loginUsername").value;
	var password = document.getElementById("loginPassword").value;

	var hashed = CryptoJS.MD5(password);

	document.getElementById("loginResult").innerHTML = "";

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

		document.getElementById("loginUsername").value = "";
		document.getElementById("loginPassword").value = "";

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

	// Reset search results to blank upon logout
	var searchResultTable = document.getElementById("searchResultTable");
	while(searchResultTable.firstChild)
	{
		searchResultTable.removeChild(searchResultTable.firstChild);
	}
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

function openRegister()
{
	hideOrShow("registerDiv", true);
	hideOrShow("loginDiv", false);
}

function doRegister()
{
	userId = 0;


	var login = document.getElementById("registerUsername").value;
	var password = document.getElementById("registerPassword").value;
	var verification = document.getElementById("registerPasswordConfirm").value;

	document.getElementById("registerResult").innerHTML = "";

	if (password != verification)
	{
		document.getElementById("registerResult").innerHTML = "Passwords do not match<br>";
		return;
	}

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

		document.getElementById("registerUsername").value = "";
		document.getElementById("registerPassword").value = "";
		document.getElementById("registerPasswordConfirm").value = "";
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

	// Clear existing search result list (TO BE DELETED)
	var contactList = document.getElementById("contactList");
	contactList.innerHTML = "";

	// Clear existing search result table
	var searchResultTable = document.getElementById("searchResultTable");
	while(searchResultTable.firstChild)
	{
		searchResultTable.removeChild(searchResultTable.firstChild);
	}

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
				hideOrShow( "contactList", true );

				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );

				var i;

				var tableHeader = document.createElement("tr");
				var nameHeader = document.createElement("th");
				nameHeader.innerHTML = "Contact Name";
				tableHeader.appendChild(nameHeader);
				searchResultTable.appendChild(tableHeader);

				for( i=0; i<jsonObject.results.length; i++ )
				{
					var opt = document.createElement("option");
					opt.text = jsonObject.results[i];
					opt.value = "";
					contactList.options.add(opt);

					// Iterative creation of search result entries in table

					var results = jsonObject.results[i].split(" ");

					var resultRow = document.createElement("tr");

					var deleteBut = document.createElement("button");
					deleteBut.type = "button";
					deleteBut.id = results[2] + " " + (i+1);
					deleteBut.class = "button";
					deleteBut.setAttribute("onclick", "deleteContact(this.id);");
					deleteBut.innerHTML = "Delete";

					var editBut = document.createElement("button");
					editBut.type = "button";
					editBut.id = results[2] + " " + ((i+1)*2);
					editBut.class = "button";
					editBut.setAttribute("onclick", "editContact(this.id);");
					editBut.innerHTML = "Edit";

					var details = document.createElement("button");
					details.type = "button";
					details.id = results[2] + " " + ((i+1)*3);
					details.class = "button";
					details.setAttribute("onclick", "fetchContact(this.id);");
					details.innerHTML = "Details";

					var resultCell = document.createElement("td");
					//resultCell.onclick = "document.location.href='#child;";

					//var clickableResult = document.createElement("a");
					//clickableResult.href = "#contactInfoDiv";

					//var resultText = document.createTextNode(results[0] + " " + results[1]); // This will receive the parsed payload

					//clickableResult.appendChild(resultText);
					//resultCell.appendChild(resultText);
					resultCell.innerHTML = results[0] + " " + results[1];
					resultRow.appendChild(resultCell);
					resultRow.appendChild(details);
					resultRow.appendChild(editBut);
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
	// Extracting conactID from input string
	var idArray = idString.split(" ");

	var row = idArray[1] - 1;

	contactID = idArray[0];
	console.log("debug contactID  = " + contactID + ", row = " + row);

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
				document.getElementById("contactAddResult").innerHTML = "Contact deleted successfully";
				document.getElementById("searchResultTable").deleteRow(row);
			}
		}
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}

	hideOrShow("contactInfoDiv", false);
	setTimeout(delayHide, 3000);
}

function delayHide()
{
	document.getElementById("contactAddResult").innerHTML = "";
}

function editContact(idString)
{
	// TODO

	// Extracting conactID from input string
	var idArray = idString.split(" ");

	contactID = idArray[0];
}

function fetchContact(idString)
{
	// Extracting conactID from input string
	var idArray = idString.split(" ");
}
