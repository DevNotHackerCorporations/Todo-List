window.onmessage = function(event){ 
	if (event.data.html){
		$("body").append(event.data.html)
	}
	if (event.data.js){
		eval(event.data.js)
	}
	if (event.data.exportdata){
		let orig = (event.data.exportdata)
		exportdata = {}
		for (x in orig){
			if (orig[x][0]){
				exportdata[x] = storage[x]
			}
		}
		exportdata = JSON.stringify(exportdata)
		document.querySelector("iframe").remove()
		$.post("https://todolist-api.andrewchen51.repl.co/add", { data: exportdata }, function (result) {
			if (result["error"]) {
				create_alert("<span style='color:red'>" + result["error"] + "</span>")
			} else {
				create_alert("<span>Your todolist code is <pre style='display:inline'>" + result["token"] + "</pre>. This code will expire in <b>five</b> minutes</span>")
			}
		})		
	}
}

var notification
const url_data = new URLSearchParams(window.location.search)
const filename = url_data.get("name")
let storage = localStorage
const loc = "https://" + location.hostname + location.pathname
function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

if (!getCookie("color_scheme")) {
	document.cookie = "color_scheme=dark; expires=Thu, 01 Jan 3000 00:00:00 UTC; path=/;";
}
switch (getCookie("color_scheme")) {
	case "dark":
		$("#color_scheme_toggle").html("☀️")
		$("body").addClass("dark").removeClass("light")
		break

	case "light":
		$("#color_scheme_toggle").html("🌙")
		$("body").addClass("light").removeClass("dark")
		break
}
$("#color_scheme_toggle").click(() => {
	element = $("#color_scheme_toggle")
	switch ($("body").hasClass("light")) {
		case true:
			element.html("☀️")
			document.cookie = "color_scheme=dark; expires=Thu, 01 Jan 3000 00:00:00 UTC; path=/;";
			$("body").addClass("dark").removeClass("light")
			break

		case false:
			element.html("🌙")
			document.cookie = "color_scheme=light; expires=Thu, 01 Jan 3000 00:00:00 UTC; path=/;";
			$("body").addClass("light").removeClass("dark")
			break
	}
})

function create_modal(html) {
	$("body").append(`
		<div class="modal">

			<!-- Modal content -->
			<div class="modal-content" style="color:black">
				<span class="close" onclick="this.parentElement.parentElement.remove()" style="font-size:24px;float:right">&times;</span>
				${html}
			</div>

		</div>
	`)
}
const checkmarks = () => {
	$(".check__edit").click((e) => {
		let element = $(e.currentTarget);
		let label = $($(element.parent()).siblings()[$(element.parent()).siblings().index($("label"))])
		let datael = data[label.text()]
		delete data[label.text()]
		console.log(label)
		label.prop('outerHTML', `<input data-data='${JSON.stringify(datael)}' for="${label.attr("for")}" value="${label.text()}" class="editbox">`)
		$(".editbox").keydown((e) => {
			if (e.key === "Enter") {
				let element = $(e.currentTarget);
				data[element.val()] = element.data("data")
				element.prop("outerHTML", `<label for="${element.attr("for")}">${element.val()}</label>`)
				document.getElementById("letsgo").click()
				savedata()
			}
		})
	})
}

class FakeLocalStorage {
	constructor() {
		this.length = 0
		this.data = {}
	}
	update() {
		this.length = Object.keys(this.data).length
	}
	getItem(name) {
		return this.data[name]
	}
	setItem(key, item) {
		this.data[key] = item
		this.update()
	}
	key(index) {
		return Object.values(this.data)[index]
	}
	clear() {
		this.data = {}
	}
	removeItem(name) {
		delete this.data[name]
	}
}
if (url_data.get("temp")) {
	$("#savingmsg").html("❌ Not saved").attr("title", "Your todolist has not been saved")
	storage = new FakeLocalStorage()
	for (let i = 0; i < localStorage.length; i++) {
		storage.setItem(localStorage.key(i), localStorage.getItem(localStorage.key(i)))
	}
}
if (!filename) {
	for (let index = 0; index < storage.length; index++) {
		if (storage.key(index) == "null") {
			continue
		}
		format = ""
		try{
			json_data = JSON.parse(storage.getItem(storage.key(index)))
		}catch{
			json_data = {}
		}
		for (x in json_data) {
			format += (`[${json_data[x][0] ? "x" : "&nbsp;&nbsp;"}] ${x} &nbsp;&nbsp;`)
		}
		$("#choosetodo__todos").append(`
			<a href="javascript:void(0)" data-url="?name=${encodeURIComponent(storage.key(index))}" style="padding:0;" class="choose_todo_link">
				<div class="choose_todo_todo" data-name="${storage.key(index)}">
					<span class="close">&times;</span>${storage.key(index)} 
					<span style="display:inline-block;margin-left:20px;color: gray;">${format}</span>
				</div>
			</a>
		`)
	}
	$(".choose_todo_todo span.close").click(e => {
		let dataname = $($(e.currentTarget).parent()).data("name")
		e.stopPropagation()
		if (confirm("Do you really want to delete todo list \"" + dataname + "\"? This action is unreversable")) {
			storage.removeItem(dataname)
			location.reload()
		}
	})
	$(".choose_todo_link").click(e => {
		if (e.target != $("span.close")) {
			location.href = loc + $(e.currentTarget).data("url")
		}
	})
} else {
	$("title").text(filename)
	$("#choosetodo").hide()
	$("#todolist").show()
	$("#todolist > header h1").text(filename)
	start()
}
function defexport(){
	$("#exportdata").click(() => {
		data = {}
		for (let x = 0; x < storage.length; x++) {
			if (storage.key(x) !== "null"){
				data[storage.key(x)] = [true, "3000-01-01T12:00"]
			}
		}
		let frame = document.createElement("IFRAME")
		frame.setAttribute("src", loc + "?name=Which%20todos%20would%20you%20like%20to%20include&temp=true")
		frame.classList.add("bigiframe")
		document.body.appendChild(frame)
		window.frames[0].onload = function(){
			window.frames[0].postMessage({
				"html":`
<style>
#input, #nav, .check_tools{
	display: none !important;
}
</style>
<button id="letsgo" style="width:60%;margin-left:20%;margin-top:40px;font-size:18px;" onclick='window.parent.postMessage({"exportdata":data}, "*")';>Done!</button>
				`,
				"js":`
storage.data = ${JSON.stringify(data)}
data = storage.data
refresh()
				`
			}, "*")
		}
		/*
		$.post("https://todolist-api.andrewchen51.repl.co/add", { data: data }, function (result) {
			if (result["error"]) {
				create_modal("<span style='color:red'>" + result["error"] + "</span>")
			} else {
				create_modal("<span style='font-size: 24px'>Your todolist code is <pre style='display:inline'>" + result["token"] + "</pre>. This code will expire in <b>five</b> minutes</span>")
			}
		});*/
	})
}

function defimport(){
	$("#importdata").click(() => {
		data = {}
		for (let x = 0; x < storage.length; x++) {
			data[storage.key(x)] = storage.getItem(storage.key(x))
		}
		$.post("https://todolist-api.andrewchen51.repl.co/get", { name: prompt("What's the code?").toUpperCase() }, function (result) {
			if (result["error"]) {
				create_alert("<span style='color:red;'>ERROR: " + result["error"] + "</span>")
			} else {
				d = data
				for (k in result["result"]) {
					if (!data[k]) {
						d[k] = result["result"][k]
					}
				}
				for (key in d) {
					storage.setItem(key, d[key])
				}
				location.reload()
			}
		});
	})
}

function defcopy(){
	$("#copytododata").click(() => {
		data = {}
		for (let x = 0; x < storage.length; x++) {
			if (storage.key(x) != "null"){
				data[storage.key(x)] = storage.getItem(storage.key(x))
			}
		}
		navigator.clipboard.writeText(JSON.stringify(data))
		create_alert('Copied todo data to clipboard')
		defcopy()
	})
}
defcopy()
defexport()
$("#choosetodo_input button").click(e => {
	newlistname = $("#choosetodo_input input").val().trim()
	if (newlistname === "") {
		return
	}
	if (storage.getItem(newlistname)) {
		if (!confirm("There is already a todo list named \"" + newlistname + "\" Do you really want to overwrite it?")) {
			return
		}
	}
	storage[newlistname] = "{}"
	location.reload()
})


loadinterval = 1000

function daysInMonth(month, year) { // Use 1 for January, 2 for February, etc.
	return new Date(year, month, 0).getDate();
}

function checkNotificationPromise() {
	try {
		Notification.requestPermission().then();
	} catch (e) {
		return false;
	}
	return true;
}

function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}

function askNotificationPermission() {
	// function to actually ask the permissions

	// Let's check if the browser supports notifications
	if (!('Notification' in window)) {
		console.log("This browser does not support notifications.");
	} else {
		if (checkNotificationPromise()) {
			Notification.requestPermission();
		} else {
			Notification.requestPermission();
		}
	}
}
askNotificationPermission()

function absolutev(x) {
	if (x < 0) {
		x = -x
	}
	return (x)
}

function start() {
	if (!storage.getItem(filename)) {
		storage.setItem(filename, "{}")
	}
	data = JSON.parse(storage.getItem(filename))
	refresh()
}
setInterval(function () {
	for (x in data) {
		if (!data[x][0]) {
			//a day away
			let posttime = new Date(data[x][1]);
			let realtime = new Date()
			if ((posttime.getFullYear() === realtime.getFullYear()) && (posttime.getMonth() === realtime.getMonth()) && ((posttime.getDay() === (realtime.getDay() + 1)) && (posttime.getHours() === realtime.getHours()) && (posttime.getMinutes() === realtime.getMinutes()) && (posttime.getSeconds - realtime.getSeconds()) < 10)) {
				var notification = new Notification(`${x} should be finished in less than 1 day.`)
			}
			//an hour away
			if (posttime.getFullYear() === realtime.getFullYear() && posttime.getMonth() === realtime.getMonth() && ((posttime.getDay() === realtime.getDay()) && (posttime.getHours() === (realtime.getHours() + 1)) && (posttime.getMinutes() === realtime.getMinutes()) && ((posttime.getSeconds - realtime.getSeconds()) < 10))) {
				var notification = new Notification(`${x} should be finished in less than 1 hour.`)
			}
			//10 minutes away
			if (posttime.getFullYear() === realtime.getFullYear() && posttime.getMonth() === realtime.getMonth() && ((posttime.getDay() === realtime.getDay()) && (posttime.getHours() == realtime.getHours()) && (posttime.getMinutes() === (realtime.getMinutes() + 10)) && ((posttime.getSeconds - realtime.getSeconds()) < 10))) {
				var notification = new Notification(`${x} should be finished in less than 10 minutes.`)
			}
			//10 seconds away let notification = new Notification(`${x} should be finished right now`) check ur discord andrew bye ANDREW
			if ((posttime.getDate() === realtime.getDate()) && (posttime.getHours() == realtime.getHours()) && (posttime.getMinutes() === realtime.getMinutes()) && ((posttime.getSeconds - realtime.getSeconds()) < 10)) {
				var notification = new Notification(`${x} should be finished by now.`)
			}
		}
	}
}, 9000)
let timestring;
let getdate;
const create_time = function () {
	posttime = new Date()
	//posttime = new Date(data[x][1]);
	getdate = (posttime.getDate() + 1) % daysInMonth(posttime.getMonth() + 1, posttime.getFullYear())
	timestring = posttime.getFullYear() + "-" + (posttime.getMonth() + 1 < 10 ? "0" : "") + (posttime.getMonth() + 1) + "-" + (getdate < 10 ? "0" : "") + getdate + "T" + (posttime.getHours() < 10 ? "0" : "") + posttime.getHours() + ":" + (posttime.getMinutes() < 10 ? "0" : "") + posttime.getMinutes()
	$("#addDatetime").val(timestring)
}
create_time()
setInterval(create_time, 60000) //weird
function refresh() {
	$("#container").html("");
	counter = -1;
	for (x in data) {
		counter += 1;
		let posttime = new Date(data[x][1])
		let timestring2 = (posttime.getMonth() + 1) + "/" + posttime.getDate() + "/" + posttime.getFullYear() + " " + (posttime.getHours() % 12 === 0 ? 12 : posttime.getHours() % 12) + ":" + (posttime.getMinutes() < 10 ? "0" : "") + posttime.getMinutes() + (posttime.getHours() % 12 === posttime.getHours ? "AM" : "PM")
		$("#container").append(`<div class="check ${data[x][0] ? "checked" : "unchecked"}" data-key="${x}" data-due="${data[x][1]}">
		<input type="checkbox" id="checkbox__${counter}" ${
			data[x][0] ? "checked" : ""
			}>
		<label for="checkbox__${counter}">${x}</label>
		<div class='check_tools'>
			<span class="close">&times;</span> 
			<span class='check__edit'>&#9999;️</span>
		</div>
		<span class="duedata"> ${timestring2}</span>
		</div>`);
	}
	$("#todolist span.close").click((e) => {
		let element = $(e.currentTarget);
		delete data[$(element.parent().parent()).data("key")];
		element.parent().parent().remove();
		savedata()
	});
	$("input[type='checkbox']").click((e) => {
		let element = $(e.currentTarget);
		let sib = $(element.parent()).data("key");
		data[sib][0] = !data[sib][0];
		element.parent().toggleClass("unchecked")
		element.parent().toggleClass("checked")
		savedata()
	});
	checkmarks()
}
$("#letsgo").click(() => {
	let textdata = $("#add").val();
	if (textdata.length === 0) {
		return;
	}
	if (Object.keys(data).includes(textdata)) {
		return;
	}
	if ($("#addDatetime").val() === "") {
		return;
	}
	$("#add").val("");
	data[textdata] = [false, $("#addDatetime").val()];
	savedata();
	posttime = new Date($("#addDatetime").val())
	let timestring2 = (posttime.getMonth() + 1) + "/" + posttime.getDate() + "/" + posttime.getFullYear() + " " + (posttime.getHours() % 12 === 0 ? 12 : posttime.getHours() % 12) + ":" + (posttime.getMinutes() < 10 ? "0" : "") + posttime.getMinutes() + (posttime.getHours() % 12 === posttime.getHours ? "AM" : "PM")
	counter += 1
	try {
		$("#container").append(`<div class="check unchecked" data-key="${textdata}" data-due="${data[textdata][1]}">
			<input type="checkbox" id="checkbox__${counter}" ${
			data[x][0] ? "checked" : ""
			}>
			<label for="checkbox__${counter}">${textdata}</label>
			<div class='check_tools'>
				<span class="close">&times;</span> 
				<span class='check__edit'>&#9999;️</span>
			</div>
			<span class="duedata"> ${timestring2}</span>
			</div>`);

		checkmarks()
	}
	catch (err) {
		location.reload()
	}

});
start()
const savedata = () => {
	storage.setItem(filename, JSON.stringify(data))
	loadme()
}
$("#add").keydown((e) => {
	if (e.key === "Enter") {
		document.getElementById("letsgo").click()
	}
})
//setInterval(savedata(), 1000)
const loadme = () => {
	if (url_data.get("temp")) {
		return
	}
	$("#savingmsg").attr("title", "Your todolist is being saved")
	let load_time = 500
	$("#savingmsg").html("Saving ⏳")
	clearInterval(loadinterval)
	loadinterval = setTimeout(() => {
		$("#savingmsg").html("Saving. ⏳")
		setTimeout(() => {
			$("#savingmsg").html("Saving.. ⏳")
			setTimeout(() => {
				$("#savingmsg").html("Saving... ⏳")
				setTimeout(() => {
					$("#savingmsg").html("Saved ✅")
					$("#savingmsg").attr("title", "Your todolist has been saved")
				}, load_time)
			}, load_time)
		}, load_time)
	}, load_time)
}

function deletecomplete() {
	if (confirm("Are you sure you want to delete all completed items? This is unreversable. ")) {
		for (e of $('.checked')) {
			delete data[$(e).data("key")]
			e.remove()
		}
		savedata()
	}
}

keylogger = {}
window.onkeydown = function (e) {
	if (keylogger[e.key] === undefined) {
		keylogger[e.key] = false
	}
	keylogger[e.key] = !keylogger[e.key]
	if ((keylogger["Control"] || keylogger["Meta"]) && keylogger["s"] && keylogger["Shift"]) {
		savedata()
	}
}
window.onkeyup = function (e) {
	if (keylogger[e.key] === undefined) {
		keylogger[e.key] = false
	}
	keylogger[e.key] = !keylogger[e.key]
	if ((keylogger["Control"] || keylogger["Meta"]) && keylogger["s"] && keylogger["Shift"]) {
		savedata()
	}
}
// Too lazy to figure it out myself so I just copy pasted off of stackoverflow
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
alertCount = 0
function create_alert(text, whattodo=null){
	alertCount += 1
	if (!whattodo){
		whattodo = "jQuery('#todoalert"+alertCount+"').remove()"
	}
  	document.body.innerHTML += `<div class="mserror" id="todoalert${alertCount}" style="color:black;">Todolist alert<button onclick=\"${whattodo}\">&times;</button><div class="errcontent"><button class="erricon">&times;</button><span class="mserrortotheright">${text}<br><button class="errokay" onclick=\"${whattodo}\">Okay</button></span></div></div>`
  	document.querySelectorAll(".mserror").forEach((el)=>{dragElement(el)})
	defcopy()
	defexport()
	defimport()
}
defimport()

