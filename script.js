function start(){
	if (localStorage.getItem("data") === null){
		localStorage.setItem("data", "{}")
	}
	data = JSON.parse(localStorage.getItem("data"))
	refresh()
}
const posttime = new Date()
let getdate = posttime.getDate()+1
let timestring = posttime.getFullYear()+"-"+(posttime.getMonth()+1)+"-"+(getdate < 10 ? "0":"")+getdate+"T"+(posttime.getHours() < 10 ? "0":"")+posttime.getHours()+":"+(posttime.getMinutes() < 10 ? "0":"")+posttime.getMinutes()
$("#addDatetime").val(timestring)
function refresh() {
	$("#container").html("");
	counter = -1;
	for (x in data) {
		counter += 1;
		let posttime = new Date(data[x][1])
		let timestring2 = (posttime.getMonth()+1)+"/"+posttime.getDate()+"/"+posttime.getFullYear()+" "+(posttime.getHours()%12)+":"+(posttime.getMinutes() < 10 ? "0":"")+posttime.getMinutes()+(posttime.getHours()%12 === posttime.getHours ? "AM":"PM")
		$("#container").append(`<div class="check" data-key="${x}" data-due="${data[x][1]}">
		<input type="checkbox" id="checkbox__${counter}" ${
			data[x][0] ? "checked" : ""
		}>
		<label for="checkbox__${counter}">${x}</label>
		<span class="close">&times;</span>
		<span class="duedata">(${timestring2})</span>
		</div>`);
	}
	$("span.close").click((e) => {
		let element = $(e.currentTarget);
		delete data[$(element.parent()).data("key")];
		element.parent().remove();
		savedata()
	});
	$("input[type='checkbox']").click((e) => {
		let element = $(e.currentTarget);
		let sib = $(element.parent()).data("key");
		data[sib][0] = !data[sib][0];
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
	let timestring2 = (posttime.getMonth()+1)+"/"+posttime.getDate()+"/"+posttime.getFullYear()+" "+(posttime.getHours()%12)+":"+(posttime.getMinutes() < 10 ? "0":"")+posttime.getMinutes()+(posttime.getHours()%12 === posttime.getHours ? "AM":"PM")
	counter += 1
	$("#container").append(`<div class="check" data-key="${x}" data-due="${data[textdata][1]}">
		<input type="checkbox" id="checkbox__${counter}" ${
			data[textdata][0] ? "checked" : ""
		}>
		<label for="checkbox__${counter}">${textdata}</label>
		<span class="close">&times;</span>
		<span class="duedata">(${timestring2})</span>
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
}
$("#add").keydown((e)=>{
	if (e.key === "Enter"){
		document.getElementById("letsgo").click()
	}
})