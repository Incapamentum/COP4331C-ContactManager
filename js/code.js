
var urlBase = 'http://teamsixstar.online/ContactManager';
var extension = "php";

var userId = 0;
var contactID = 0;

function doLogin()
{
	userId = 0;


	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;

	var hashed = CryptoJS.MD5(password);

	document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hashed + '"}';
	var url = urlBase + '/Login.' + extension;

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


		document.getElementById("loginName").value = "";
		document.getElementById("loginPassword").value = "";

		hideOrShow( "loggedInDiv", true);
		hideOrShow( "accessUIDiv", true);
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

	hideOrShow( "loggedInDiv", false);
	hideOrShow( "accessUIDiv", false);
	hideOrShow( "loginDiv", true);
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


	var login = document.getElementById("registerName").value;
	var password = document.getElementById("registerPassword").value;
	var verification = document.getElementById("verificationPassword").value;

	document.getElementById("registerResult").innerHTML = "";

	if (password != verification)
	{
		document.getElementById("registerResult").innerHTML = "Passwords do not match<br>";
		return;
	}

	var hashed = CryptoJS.MD5(password);
	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hashed + '"}';
	var url = urlBase + '/Register.' + extension;

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

	var url = urlBase + '/Login.' + extension;

	xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

		var jsonObject = JSON.parse(xhr.responseText);

		userId = jsonObject.id;

		document.getElementById("registerName").value = "";
		document.getElementById("registerPassword").value = "";
		document.getElementById("verificationPassword").value = "";
		hideOrShow( "loggedInDiv", true);
		hideOrShow( "accessUIDiv", true);
		hideOrShow( "registerDiv", false);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}

}

function addContact()
{
	var fName = document.getElementById("fNameText").value;
	var lName = document.getElementById("lNameText").value;
	var phoneNum = document.getElementById("phoneText").value;
	var address = document.getElementById("addressText").value;
	var email = document.getElementById("emailText").value;
	var plevel = document.getElementById("plevelText").value;
	document.getElementById("ContactAddResult").innerHTML = "";

	var jsonPayload = '{"firstName" : "' + fName + '", "lastName" : "' + lName + '", "phoneNumber" : "' + phoneNum + '", "address" : "' + address + '", "email" : "' + email + '", "powerLevel" : "' + plevel +  '", "userId" : ' + userId + '}';
	var url = urlBase + '/AddContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("ContactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("ContactAddResult").innerHTML = err.message;
	}

}

function searchContact()
{
	var srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";

	var contactList = document.getElementById("contactList");
	contactList.innerHTML = "";

	var jsonPayload = '{"search" : "' + srch + '", "userId" : "' + userId + '"}';
	var url = urlBase + '/SearchContacts.' + extension;

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
				for( i=0; i<jsonObject.results.length; i++ )
				{
					var opt = document.createElement("option");
					opt.text = jsonObject.results[i];
					opt.value = "";
					contactList.options.add(opt);
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

function displayRegister()
{
	hideOrShow("loginDiv", false);
	hideOrShow("registerDiv", true);
}

function hideRegister()
{
	hideOrShow("registerDiv", false);
	hideOrShow("loginDiv", true);
}

function deleteContact()
{
	// TODO
}

function editContact()
{
	// TODO
}
