// ================================================================
// VARIABLES
// ================================================================
var ALLCURRENTDATA = []
var ALLUNIQUEHEADERS = []
var ACTIVEHEADERS = []
const subjectFilter = ['name','page_id','variant','brand','client_id','image_url','product_url','catalog_id','feed_category','upc']	
const ugcFilter = ['email','locale','rating','headline','bottom_line','started_date','review_source']
const hutchFilter = ['name','page_id','variant','brand','image_url','product_url','feed_category','upc','feed_category']	

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
			$("[item=" + headers[x] + "]").css({"background": "#7eae7b"})
		} else {
			$(".sub-menu-container").append("<span class='sub-menu-item' active='false' item='" + headers[x] + "'>" + headers[x] + "</span>")
			$("[item=" + headers[x] + "]").css({"background": "lightgrey"})
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
	$(".jason-table-container").remove()
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
		filterButton.css({"background": "#7eae7b"})
		$(".table-main").empty().append('<tr class="headers-container"></tr>')
		if (filterButton.attr("data") === 'subjectFilter') {
			$(".ugc-filter-button").attr("active", "false").css({"background": "lightgrey"})
			ACTIVEHEADERS = subjectFilter
		} else if (filterButton.attr("data") === 'ugcFilter') {
			$(".subject-filter-button").attr("active", "false").css({"background": "lightgrey"})
			ACTIVEHEADERS = ugcFilter
		
		} else if (filterButton.attr("data") === 'hutchFilter') {
			$(".subject-filter-button").attr("active", "false").css({"background": "lightgrey"})
			$(".ugc-filter-button").attr("active", "false").css({"background": "lightgrey"})
			ACTIVEHEADERS = hutchFilter
		}		displayContent(ALLCURRENTDATA, ACTIVEHEADERS)
	} else {
		filterButton.attr("active", "false")
		filterButton.css({"background": "lightgrey"})
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
//Export table to CSV
function exportTableToCSV(filename) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");
    
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");
        
        for (var j = 0; j < cols.length; j++) 
            row.push(cols[j].innerText);
        
        csv.push(row.join(","));        
    }

    // Download CSV file
    downloadCSV(csv.join("\n"), filename);
}

function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV file
    csvFile = new Blob([csv], {type: "text/csv"});

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Hide download link
    downloadLink.style.display = "none";

    // Add the link to DOM
    document.body.appendChild(downloadLink);

    // Click download link
    downloadLink.click();
}
