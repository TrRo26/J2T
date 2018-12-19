const visibleHeaders = ['name','page_id','variant','brand','client_id','image_url','product_url','catalog_id','feed_category','upc']	

// FUNCTIONS
function displayContent(batch) {
	var allRows = getContent(batch)
	for(i=0;i<allRows.length;i++) {
			var row = allRows[i]
			$(".table-main").append("<tr id='cr-" + [i] + "' class='content-row'></tr>")			
			for(x=0;x<row.length;x++) {
				$("#cr-" + [i]).append("<td class='content-item'>" + row[x] + "</td>")	
			}
	}
}

function getContent(batch) {
	const headers = getHeaders(batch)
	const defaultHeaders = []
	for (h=0;h<headers.length;h++) {
		if(visibleHeaders.includes(headers[h])) {
			defaultHeaders.push(headers[h])
		}
	}
	
	console.log('DEFAULT HEADERS')
	console.log(defaultHeaders)
	appendHeaders(defaultHeaders)

	var allContent = []
	for(i=0;i<batch.length;i++) {
		var line = []
		for(z=0;z<defaultHeaders.length;z++) {
			var value = batch[i][defaultHeaders[z]]
			// if (visibleHeaders.includes(defaultHeaders[z])) {
				if(value != null) {
					if (typeof value === 'object') {
						line.push(JSON.stringify(value))					
					} else if (defaultHeaders[z] === 'iovation') {
						line.push("Yes")
					} else {
						line.push(value)
					}
				} else {
					line.push(" ")
				}
			// }
		}
		allContent.push(line)
	}
	console.log("TABLE DATA:" )
	console.log(allContent)
	return(allContent)
}

function getHeaders(batch) {
	var uniqueHeaders = []
	for(i=0;i<batch.length;i++) {
		var currentKeys = Object.keys(batch[i])
		for(z=0;z<currentKeys.length;z++) {
			if(!uniqueHeaders.includes(currentKeys[z])) {
				uniqueHeaders.push(currentKeys[z])
			}
		}
	}
	console.log("HEADERS:" )
	console.log(uniqueHeaders)
	// appendHeaders(uniqueHeaders)
	return uniqueHeaders
}

function appendHeaders(headers) {
	for(x=0;x<headers.length;x++) {
		$(".headers-container").append("<th class='header-item header-item-" + headers[x] + "'>" + headers[x] + "</th>")	
	}
}

// function initalHeaders() {
// 	const visibleHeaders = ['name','page_id','variant','brand','client_id','image_url','product_url','catalog_id','feed_category','upc']	
// 	return visibleHeaders
// }

// BUSINESS LOGIC
$(".submit-button").click(function() {
	var $textAreaInput = $(".text-area")[0].value
	var inputArray = $textAreaInput.split("\n")
	var objectArray = []
	for(s=0;s<inputArray.length;s++) {
		objectArray.push(JSON.parse(inputArray[s]))
	}
	$(".submit-container").css("display", "none")
	displayContent(objectArray)
})

$(".reset-button").click(function() {
	location.reload()
})
