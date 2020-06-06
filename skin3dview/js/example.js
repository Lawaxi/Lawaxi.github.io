// Use pure ES5 for max browser compatibility

var skinViewer, control, handles = {}, globalAnimationSpeed = 1;

var skinParts = {}

function el(id) {
	return document.getElementById(id);
}

function initSkinViewer() {
	if (skinViewer instanceof skinview3d.SkinViewer) {
		skinViewer.dispose();
		handles = {};
		control = undefined;
	}

	// Reset animation speed
	el('speed').value = globalAnimationSpeed = 1;

	skinViewer = new skinview3d.SkinViewer({
		domElement: el("skin_container"),
		width: el('width').value,
		height: el('height').value,
		skinUrl: "https://minotar.net/skin/Lawaxi",
		capeUrl: "http://121.37.27.192:233/capes/7bb0a5291cbc40be93c2ff1529c157cb.png"
	});

		
	skinViewer.camera.position.z = 70;
	control = skinview3d.createOrbitControls(skinViewer);
	var parts = skinViewer.playerObject.skin;

	// set inner parts
	skinParts.head = parts.head.innerLayer;
	skinParts.body = parts.body.innerLayer;
	skinParts.leftArm = parts.leftArm.innerLayer;
	skinParts.rightArm = parts.rightArm.innerLayer;
	skinParts.leftLeg = parts.leftLeg.innerLayer;
	skinParts.rightLeg = parts.rightLeg.innerLayer;

	// set outter parts
	skinParts.head2 = parts.head.outerLayer;
	skinParts.body2 = parts.body.outerLayer;
	skinParts.leftArm2 = parts.leftArm.outerLayer;
	skinParts.rightArm2 = parts.rightArm.outerLayer;
	skinParts.leftLeg2 = parts.leftLeg.outerLayer;
	skinParts.rightLeg2 = parts.rightLeg.outerLayer;

}

function hotReloadTextures() {
	
	//皮肤
	var name = el('mcname').value;
	skinViewer.skinUrl = "https://minotar.net/skin/"+name;

	//披风
	var capeObject = skinViewer.playerObject.cape;
	capeObject.visible = false;
	
	//教程：https://segmentfault.com/a/1190000004322487
	var http = new XMLHttpRequest();
	http.timeout = 3000;
	http.responseType = "text";
	http.open("GET","https://api.mojang.com/users/profiles/minecraft/"+name,true);
	http.setRequestHeader("Access-Control-Allow-Origin","*");
	http.send();

	http.onload = function(){

			if(http.status==200){
		
				var retun = JSON.parse(http.responseText);
				var uuid = alert(retun.id);
				if(uuid!=null){
					var capeurl = "http://121.37.27.192:233/capes/"+uuid+".png";
					if(capeurl != null){
						skinViewer.capeUrl = capeurl;
						capeObject.visible = true;
					}
				}
			}
		}
}

function resizeSkinViewer() {
	skinViewer.width = el('width').value;
	skinViewer.height = el('height').value;
}

function pause() {
	skinViewer.animations.paused = !skinViewer.animations.paused;
}

function walk() {
	if (handles.run) {
		handles.run.remove();
		delete handles.run;
	}

	handles.walk = handles.walk || skinViewer.animations.add(skinview3d.WalkingAnimation);
}

function run() {
	if (handles.walk) {
		handles.walk.remove();
		delete handles.walk;
	}

	handles.run = handles.run || skinViewer.animations.add(skinview3d.RunningAnimation);
}

function rotate() {
	if (handles.rotate) {
		handles.rotate.paused = !handles.rotate.paused;
	} else {
		handles.rotate = skinViewer.animations.add(skinview3d.RotatingAnimation);
	}
}

function togglePart(partName) {
	skinParts[partName].visible = !skinParts[partName].visible;
}

function setGlobalAnimationSpeed() {
	var currentSpeed = el('speed').value;

	if (!isNaN(currentSpeed)) {
        skinViewer.animations.speed = currentSpeed;
	}
}
