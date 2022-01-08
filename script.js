var notification
const url_data = new URLSearchParams(window.location.search)
const filename = url_data.get("name")
const loc = "https://"+location.hostname+location.pathname
if (!filename) {
	for (let index = 0;index<localStorage.length;index++){
		if (localStorage.key(index) == "null"){
			continue
		}
		format = ""
		json_data = JSON.parse(localStorage.getItem(localStorage.key(index)))
		for (x in json_data){
			format += (`[${json_data[x][0] ? "x": "&nbsp;&nbsp;"}] ${x} &nbsp;&nbsp;`)
		}
		$("#choosetodo__todos").append(`
			<a href="javascript:void(0)" data-url="?name=${encodeURIComponent(localStorage.key(index))}" style="padding:0;" class="choose_todo_link">
				<div class="choose_todo_todo" data-name="${localStorage.key(index)}">
					<span class="close">&times;</span>${localStorage.key(index)} 
					<span style="display:inline-block;margin-left:20px;color: gray;">${format}</span>
				</div>
			</a>
		`)
	}
	$(".choose_todo_todo span.close").click(e=>{
		let dataname = $($(e.currentTarget).parent()).data("name")
		e.stopPropagation()
		if (confirm("Do you really want to delete todo list \""+dataname+"\"? This action is unreversable")){
			localStorage.removeItem(dataname)
			location.reload()
		}
	})
	$(".choose_todo_link").click(e=>{
		if (e.target != $("span.close")){
			location.href = loc+$(e.currentTarget).data("url")
		}
	})
}else{
	$("#choosetodo").hide()
	$("#todolist").show()
	$("#todolist > header h1").text(filename)
}
$("#choosetodo_input button").click(e=>{
	newlistname = $("#choosetodo_input input").val().trim()
	if (newlistname === ""){
		return
	}
	if (localStorage.getItem(newlistname)){
		if (!confirm("There is already a todo list named \""+newlistname+"\" Do you really want to overwrite it?")){
			return
		}
	}
	localStorage[newlistname] = "{}"
	location.reload()
})


loadinterval = 1000

function daysInMonth(month, year) { // Use 1 for January, 2 for February, etc.
    return new Date(year, month, 0).getDate();
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
    if (localStorage.getItem(filename) === null) {
        localStorage.setItem(filename, "{}")
    }
    data = JSON.parse(localStorage.getItem(filename))
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
const create_time = function() {
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

});
start()
const savedata = () => {
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
    localStorage.setItem(filename, JSON.stringify(data))
    loadme()
}
$("#add").keydown((e) => {
    if (e.key === "Enter") {
        document.getElementById("letsgo").click()
    }
})
//setInterval(savedata(), 1000)
const loadme = () => {
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