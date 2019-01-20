// ================================================================
// CONFIG
// ================================================================
const subjectFilter = ['name','page_id','variant','brand','client_id','image_url','product_url','catalog_id','feed_category','upc']	
const ugcFilter = []

var CURRENTDATA = []
// ================================================================
// FUNCTIONS
// ================================================================
function displayContent(batch, filter) {
	var allRows = getContent(batch, filter)
	for(i=0;i<allRows.length;i++) {
		var row = allRows[i]
		$(".table-main").append("<tr id='cr-" + [i] + "' class='content-row'></tr>")			
		for(x=0;x<row.length;x++) {
			$("#cr-" + [i]).append("<td class='content-item'>" + row[x] + "</td>")	
		}
	}
}

function getContent(batch, filter) {
	const headers = getAllHeaders(batch)
	const filteredHeaders = applyFilter(headers, filter)
	appendHeaders(filteredHeaders)

	var allContent = []
	for(i=0;i<batch.length;i++) {
		var line = []
		for(z=0;z<filteredHeaders.length;z++) {
			var value = batch[i][filteredHeaders[z]]
			if(value != null) {
				if (typeof value === 'object') {
					line.push(JSON.stringify(value))					
				} else if (filteredHeaders[z] === 'iovation') {
					line.push("Yes")
				} else {
					line.push(value)
				}
			} else {
				line.push(" ")
			}
		}
		allContent.push(line)
	}
	console.log("TABLE DATA: " + allContent )
	return(allContent)
}

function getAllHeaders(batch) {
	var uniqueHeaders = []
	for(i=0;i<batch.length;i++) {
		var currentKeys = Object.keys(batch[i])
		for(z=0;z<currentKeys.length;z++) {
			if(!uniqueHeaders.includes(currentKeys[z])) {
				uniqueHeaders.push(currentKeys[z])
			}
		}
	}
	console.log("ALL HEADERS: " + uniqueHeaders)
	return uniqueHeaders
}

function appendHeaders(headers) {
	for(x=0;x<headers.length;x++) {
		$(".headers-container").append("<th class='header-item header-item-" + headers[x] + "'>" + headers[x] + "</th>")	
	}
}

function applyFilter(headers, filter) {
	const filteredHeaders = []
	if (filter) {
		for (h=0;h<headers.length;h++) {
			if(filter.includes(headers[h])) {
				filteredHeaders.push(headers[h])
			}
		}
	} else {
		for (h=0;h<headers.length;h++) {
			filteredHeaders.push(headers[h])
		}
	}
	console.log('FILTERED HEADERS: ' + filteredHeaders)
	return filteredHeaders
}

// ================================================================
// BUSINESS LOGIC
// ================================================================

// SUBMITT BUTTON
$(".submit-button").click(function() {
	var $textAreaInput = $(".text-area")[0].value
	var inputArray = $textAreaInput.split("\n")
	var objectArray = []
	for(s=0;s<inputArray.length;s++) {
		try {
			JSON.parse(inputArray[s])
		} catch(err) {
			$(".text-area").val(err)
		}
		objectArray.push(JSON.parse(inputArray[s]))
	}
	CURRENTDATA = objectArray
	$(".submit-container").css("display", "none")
	displayContent(objectArray)
})

// SUBJECT FILTER BUTTON
$(".subject-filter-button").click(function() {
	var subjectFilterButton = $(".subject-filter-button")
	if (subjectFilterButton.attr("active") === "false") {
		subjectFilterButton.attr("active", "true")
		subjectFilterButton.css("background", "#66ff99" )
		$(".table-main").empty().append('<tr class="headers-container"></tr>')
		displayContent(CURRENTDATA, subjectFilter)
	} else {
		subjectFilterButton.attr("active", "false")
		subjectFilterButton.css("background", "lightgrey" )
		$(".table-main").empty().append('<tr class="headers-container"></tr>')
		displayContent(CURRENTDATA)
	}
})

// RESET BUTTON
$(".reset-button").click(function() {
	location.reload(subjectFilter)
})

$(".reset-button").hover(function() {
		$(this).attr('src', './reset_icon_red.png')
		$(this).css('background', 'grey')
	}, function() {
		$(this).attr('src', './reset_icon_black.jpg')
	}
)
