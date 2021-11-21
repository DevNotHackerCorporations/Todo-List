var notification
loadinterval = 1000
function checkNotificationPromise() {
  try {
    Notification.requestPermission().then();
  } catch(e) {
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
    if(checkNotificationPromise()) {
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
function start(){
	if (localStorage.getItem("data") === null){
		localStorage.setItem("data", "{}")
	}
	data = JSON.parse(localStorage.getItem("data"))
	refresh()
}
setInterval(function() {
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
      if (posttime.getFullYear() === realtime.getFullYear() && posttime.getMonth() === realtime.getMonth() && ((posttime.getDay() === realtime.getDay()) && (posttime.getHours() == realtime.getHours()) && (posttime.getMinutes() === (realtime.getMinutes() + 10))  && ((posttime.getSeconds - realtime.getSeconds()) < 10))) {
        var notification = new Notification(`${x} should be finished in less than 10 minutes.`)
      }
      //10 seconds away let notification = new Notification(`${x} should be finished right now`) check ur discord andrew bye ANDREW
      if ((posttime.getDate() === realtime.getDate()) && (posttime.getHours() == realtime.getHours()) && (posttime.getMinutes() === realtime.getMinutes())  && ((posttime.getSeconds - realtime.getSeconds()) < 10)) {
        var notification = new Notification(`${x} should be finished by now.`)
      }
    }
  }
}, 9000)
let timestring;
let getdate;
const create_time = function() {
	posttime = new Date()
	//posttime = new Date(data[x][1]);
	getdate = posttime.getDate()+1
	timestring = posttime.getFullYear()+"-"+(posttime.getMonth()+1)+"-"+(getdate < 10 ? "0":"")+getdate+"T"+(posttime.getHours() < 10 ? "0":"")+posttime.getHours()+":"+(posttime.getMinutes() < 10 ? "0":"")+posttime.getMinutes()
	$("#addDatetime").val(timestring)
}
create_time()
setInterval(create_time, 60000)//weird
function refresh() {
	$("#container").html("");
	counter = -1;
	for (x in data) {
		counter += 1;
		let posttime = new Date(data[x][1])
		let timestring2 = (posttime.getMonth()+1)+"/"+posttime.getDate()+"/"+posttime.getFullYear()+" "+(posttime.getHours()%12 === 0 ? 12 : posttime.getHours()%12)+":"+(posttime.getMinutes() < 10 ? "0":"")+posttime.getMinutes()+(posttime.getHours()%12 === posttime.getHours ? "AM":"PM")
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
	$("span.close").click((e) => {
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
}
$("#letsgo").click(() => {
	let textdata = $("#add").val();
	if (textdata.length === 0) {
		return;
	}
	if (Object.keys(data).includes(textdata)) {
		return;
	}
	if ($("#addDatetime").val() === ""){
		return;
	}
	$("#add").val("");
	data[textdata] = [false, $("#addDatetime").val()];
	savedata();
	posttime = new Date($("#addDatetime").val())
	let timestring2 = (posttime.getMonth()+1)+"/"+posttime.getDate()+"/"+posttime.getFullYear()+" "+(posttime.getHours()%12 === 0 ? 12 : posttime.getHours()%12)+":"+(posttime.getMinutes() < 10 ? "0":"")+posttime.getMinutes()+(posttime.getHours()%12 === posttime.getHours ? "AM":"PM")
	counter += 1
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
});
start()
const savedata = ()=>{
	/*diff = []
	for (j in data){
		if (Object.keys(origdata).includes(j) === false){
			diff.push(`+|${j}|${data[j][0]}|${data[j][1]}`)
		}
		else if (data[j][0] !== origdata[j][0]){
			diff.push(`!|${j}|${data[j][0]}`)
		}
		delete origdata[j]
	}
	for (k in origdata){
		diff.push(`-|${k}`)
	}
	diff = diff.join("||")
	diff = encodeURIComponent(diff)
	fetch("/update?q="+diff).then(x=>x.text()).then(x=>location.reload())*/
	localStorage.setItem("data", JSON.stringify(data))
	loadme()
}
$("#add").keydown((e)=>{
	if (e.key === "Enter"){
		document.getElementById("letsgo").click()
	}
})
//setInterval(savedata(), 1000)
const loadme = () =>{
	let load_time = 500
	$("#savingmsg").html("Saving ⏳")
	clearInterval(loadinterval)
	loadinterval = setTimeout(()=>{
		$("#savingmsg").html("Saving. ⏳")
		setTimeout(()=>{
			$("#savingmsg").html("Saving.. ⏳")
			setTimeout(()=>{
				$("#savingmsg").html("Saving... ⏳")
				setTimeout(()=>{
					$("#savingmsg").html("Saved ✅")
				}, load_time)
			}, load_time)
		}, load_time)
	}, load_time)
}
function deletecomplete(){
	if (confirm("Are you sure you want to delete all completed items? This is unreversable. ")){
		for (e of $('.checked')){
			delete data[$(e).data("key")]
			e.remove()
		}
		savedata()
	}
}