var readline = require("readline");
var fs = require("fs");

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

var pathDir = "";
var arrFilesDev1 = [];
var arrFilesDev2 = [];

var isDone = [false, false, false];

var arrMenu = [
	"1. Input path []",
	"2. Save first status []",
	"3. Save second status []",
	"4. Show difference",
	"5. Clear",
	"0. Exit"
];

function GetMenuString() {
	var menuString = "";
	for (var i = 0; i < arrMenu.length; i++) {
		menuString += arrMenu[i] + "\n";
	}
	menuString += "> ";
	return menuString;
}

function MainStart() {
	rl.question(GetMenuString(), OnAnswer);
	return;
}

function OnAnswer(text) {
	switch(text) {
		case "1":
			CheckCorrectPath();
			break;
		case "2":
			SaveArrFilesInDir(parseInt(text));
			break;
		case "3":
			SaveArrFilesInDir(parseInt(text));
			break;
		case "4":
			ShowDiff();
			break;
		case "5":
			Clear();
			break;
		case "0":
			process.exit();
			break;
		default:
			console.log("BAD SELECTION\n");
			MainStart();
	}
}

function CheckCorrectPath() {
	rl.question("# Input correct path (-c to cancel) : ", function(path) {
		if (path == "-c") {
			console.log("Canceled");
			MainStart();
			return;
		}
		fs.stat(path, function(err, stat){
			if (err) {
				console.log("Incorrect path");
				CheckCorrectPath();
				return;
			}
			if (stat.isDirectory()) {
				pathDir = path;
				OkStep(1);
				MainStart();
			} else {
				console.log("It's not path");
			}
		});
	});
}

function SaveArrFilesInDir(step) {
	if (isDone[0]) {
		fs.readdir(pathDir, function(err, files){
			if (err) {
				console.log("Error readdir");
				MainStart();
				return;
			} 
			console.log("step: ", step);
			if (step == 2) {
				arrFilesDev1 = files;
				OkStep(2);
			} else if (step == 3) {
				arrFilesDev2 = files;
				OkStep(3);
			}
		});
	} else {
		console.log("You have not complete the previous step");
		MainStart();
	}
}

function Clear() {
	pathDir = "";
	arrFilesDev1 = [];
	arrFilesDev2 = [];
	isDone1 = isDone2 = isDone3 = false;
	console.log("Clear complete");
	for (var str in arrMenu) {
		arrMenu[str] = arrMenu[str].replace(/\[+.*\]/g, "[]");
	}
	MainStart();
}

function ShowDiff() {
	if (isDone[0] && isDone[1] && isDone[2]) {
		var newFiles = [];
		var delFiles = [];

		for (var file in arrFilesDev1) {
			if (arrFilesDev2.indexOf(arrFilesDev1[file]) == -1) {
				delFiles.push(arrFilesDev1[file]);
			}
		}

		for (var file in arrFilesDev2) {
			if (arrFilesDev1.indexOf( arrFilesDev2[file]) == -1) {
				newFiles.push(arrFilesDev2[file]);
			}
		}

		console.log("New files: ", newFiles);
		console.log("Deleted files: ", delFiles);

		MainStart();

	} else {
		console.log("You have not complete the previous steps");
		MainStart();
	}
}

function OkStep(num) {
	switch(num) {
		case 1:
			isDone[num - 1] = true;
			arrMenu[num - 1] = arrMenu[num - 1].replace(/\[+.*\]/g, "[" + pathDir + "]");
			break;
		case 2:
			isDone[num - 1] = true;
			arrMenu[num - 1] = arrMenu[num - 1].replace(/\[+.*\]/g, "[files: " + arrFilesDev1.length + "]");
			break;
		case 3:
			isDone[num - 1] = true;
			arrMenu[num - 1] = arrMenu[num - 1].replace(/\[+.*\]/g, "[files: " + arrFilesDev2.length + "]");
			break;
	}
	MainStart();
}

MainStart();