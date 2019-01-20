// ================================================================
// VARIABLES
// ================================================================
var ALLCURRENTDATA = []
var ALLUNIQUEHEADERS = []
var ACTIVEHEADERS = []
const subjectFilter = ['name','page_id','variant','brand','client_id','image_url','product_url','catalog_id','feed_category','upc']	
const ugcFilter = ['eamil','locale','rating','headline','bottom_line','started_date','review_source']

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
	renderFilterButtons(headers)
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
	ALLUNIQUEHEADERS = uniqueHeaders
	console.log("ALL HEADERS: " + uniqueHeaders)
	return uniqueHeaders
}

function renderFilterButtons(headers) {
	$(".sub-menu-container").empty()
	for(x=0;x<headers.length;x++) {
		if (ACTIVEHEADERS.includes(headers[x]) || ACTIVEHEADERS.length == 0) {
			$(".sub-menu-container").append("<span class='sub-menu-item' active='true' item='" + headers[x] + "'>" + headers[x] + "</span>")
			$("[item=" + headers[x] + "]").css({"background": "#7eae7b", "color": "black"})
		} else {
			$(".sub-menu-container").append("<span class='sub-menu-item' active='false' item='" + headers[x] + "'>" + headers[x] + "</span>")
			$("[item=" + headers[x] + "]").css({"background": "lightgrey", "color": "black"})
		}
	}
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
	ACTIVEHEADERS = filteredHeaders
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
	ALLCURRENTDATA = objectArray
	$(".submit-container").css("display", "none")
	$(".preset-filter, .reset-button").css("display", "inline-block")
	displayContent(objectArray)
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

// SUBJECT FILTER BUTTON
$(".main-menu-container").on("click", ".preset-filter", function() {
	var filterButton = $(this)
	console.log(filterButton)
	if (filterButton.attr("active") === "false") {
		filterButton.attr("active", "true")
		filterButton.css({"background": "#7eae7b", "color": "black"})
		$(".table-main").empty().append('<tr class="headers-container"></tr>')
		if (filterButton.attr("data") === 'subjectFilter') {
			$(".ugc-filter-button").attr("active", "false").css({"background": "lightgrey", "color": "black"})
			ACTIVEHEADERS = subjectFilter
		} else if (filterButton.attr("data") === 'ugcFilter') {
			$(".subject-filter-button").attr("active", "false").css({"background": "lightgrey", "color": "black"})
			ACTIVEHEADERS = ugcFilter
		}
		displayContent(ALLCURRENTDATA, ACTIVEHEADERS)
	} else {
		filterButton.attr("active", "false")
		filterButton.css({"background": "lightgrey", "color": "black"})
		$(".table-main").empty().append('<tr class="headers-container"></tr>')
		ACTIVEHEADERS = ALLUNIQUEHEADERS
		displayContent(ALLCURRENTDATA)
	}
})

// ITEM FILTER BUTTONS
$(".sub-menu-container").on("click", ".sub-menu-item", function() {
   	var clicked = $(this)
   	var item = clicked.attr("item")
	if (ACTIVEHEADERS.includes(item)) {
		var index = ACTIVEHEADERS.indexOf(item)
		if (index > -1) {
			ACTIVEHEADERS.splice(index, 1)
		}
		$(".table-main").empty().append('<tr class="headers-container"></tr>')
		displayContent(ALLCURRENTDATA, ACTIVEHEADERS)
	} else {
		if (!ACTIVEHEADERS.includes(item)) {
			ACTIVEHEADERS.unshift(item)
		}
		$(".table-main").empty().append('<tr class="headers-container"></tr>')
		displayContent(ALLCURRENTDATA, ACTIVEHEADERS)
   	}
   	console.log($(this))
})
