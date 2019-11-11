function init() {
	fetch('/api/students').then(function(response) {
		if(response.ok) {
			return response.json();
		}
		throw new Error(response.statusText);
	}).then(function(responseJSON) {
		for (let i = 0; i < responseJSON.length; i++) {
			$("#studentList").append(`<li>${responseJSON[i].firstName} ${responseJSON[i].lastName}</li>`)
		}
	}).catch(function(error) {
		console.log(error);
	});
}

$(init);