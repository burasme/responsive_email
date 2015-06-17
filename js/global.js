var emailData = new Array();

function getMessages() {
    $.getJSON("https://morning-falls-3769.herokuapp.com/api/messages", function(data) {
	index = 0;

	$.each(data, function(id, from, to, cc, subject, body) {
	    emailData[index] = new Array();
	    
	    emailData[index][0] = data[index].id;
	    emailData[index][1] = data[index].from;
	    emailData[index][2] = data[index].to.toString().replace(/,/g , "</a>, <a class='to' href='#'>");
	    emailData[index][3] = data[index].cc.toString().replace(/,/g , "</a>, <a class='cc' href='#'>");
	    emailData[index][4] = data[index].subject;
	    emailData[index][5] = data[index].body;
	    
	    $("<div class='message' id='m" + data[index].id + "'>"
	      + "<strong class='subject_title'>Subject: </strong>"
	      + "<span class='subject'>" + data[index].subject + "</span>"
	      + "<strong class='from_title'>From: </strong>"
	      + "<a class='from' href='#'>" + data[index].from + "</a></div>").appendTo("#messages");
	    
	    index++;
	});
    }).fail(function( jqxhr, textStatus, error ) {
	getMessages();
    });
}

function getPerson(email) {
    var url = "https://morning-falls-3769.herokuapp.com/api/people/" + email;
    
    $.getJSON(url, function(data) {
	if (data.company === null) {
	    companyLine = "";
	} else {
	    companyLine = "<span class='company'><strong>Company: </strong>" + data.company["name"]
	    + " &mdash; " + data.company["description"]
	    + "</span><img class='logo' src='" + data.company["logo"] + "' alt='' title='' />";
	}
	
	$("#person_company").html("<span class='name'>" + data.name + "</span>"
	    + companyLine
	    + "<span class='email'><strong>Email: </strong>" + data.email + "</span>"
	    + "<img class='avatar' alt='' title='' src='" + data.avatar + "' />");
    }).fail(function( jqxhr, textStatus, error ) {
	getPerson(email);
    });
}

$(document).ready(function() {
    getMessages();
    
    $("#search_input").on("click", function() {
	if ($(this).val() === "search") {
	    $(this).val("");
	}
    });
    
    $("#search_input").on("blur", function() {
	if ($(this).val() === "") {
	    $(this).val("search");
	}
    });
    
    $("#messages").on("click", ".message", function() {
	$(".message_body").remove();
	var messageID = parseInt($(this).attr("id").substring(1));
	
	$(".clicked").removeClass("clicked");
	$(this).addClass("clicked");
	
	$(this).after("<div class='message_body'>"
	    + "<span class='to_container'><strong class='to_title'>To: </strong><a class='to' href='#'>" + emailData[messageID][2] + "</a></span>"
	    + "<span class='cc_container'><strong class='cc_title'>CC: </strong><a class='cc' href='#'>" + emailData[messageID][3] + "</a></span>"
	    + "<span class='body'>" + emailData[messageID][5] + "</span>"
	    + "</div>");
	
	getPerson(emailData[messageID][1]);
    });
    
    $("#messages").on("click", ".from", function() {
	var email = $(this).html();	
	getPerson(email);
	$(this).blur();
	return false;
    });
    
    $("#messages").on("click", ".to", function() {
	var email = $(this).html();	
	getPerson(email);
	$(this).blur();
	return false;
    });
    
    $("#messages").on("click", ".cc", function() {
	var email = $(this).html();	
	getPerson(email);
	$(this).blur();
	return false;
    });
});
