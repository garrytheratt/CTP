
// SETUP
var Defmech = Defmech ||
{};

Defmech.RotationWithQuaternion = (function()
{
	'use_strict';

	var container;

	var camera, scene;
	var renderer = new THREE.WebGLRenderer( { alpha: true } );

	var shape, shape2, shape3, plane;

	var mouseDown = false;
	var rotateStartPoint = new THREE.Vector3(0.008, 0.001, 1); //rotation axis

	var curQuaternion;
	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;
	var rotationSpeed = 0.3; //speed of rotation
	var lastMoveTimestamp, moveReleaseTimeDelta = 50;

	var deltaX = 0, deltaY = 0; //used for rotation & inertia effect

	var setup = function() //3d space setup
	{
		container = document.createElement('div');
		document.body.appendChild(container);

		camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
		camera.position.y = 150;
		camera.position.z = 600;

		scene = new THREE.Scene();

//SHAPE
		var boxGeometry = new THREE.IcosahedronGeometry( 120, 0 );

		var shapeMaterial = new THREE.MeshBasicMaterial(
		{	color: 0xFFFFFF, wireframe: true, wireframeLinewidth: 5 });


		shape = new THREE.Mesh(boxGeometry, shapeMaterial);
		shape.position.y = 170;
		scene.add(shape);


		renderer = new THREE.CanvasRenderer();
		renderer.setClearColor(0x000000, 0);
		renderer.setSize(window.innerWidth, window.innerHeight);

		container.appendChild(renderer.domElement);

		document.addEventListener('mousedown', onDocumentMouseDown, false);

		window.addEventListener('resize', onWindowResize, false);

		animate();
	};


//WINDOW RESIZE

	function onWindowResize()
	{
		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	function onDocumentMouseDown(event)
	{
		event.preventDefault();

		document.addEventListener('mousemove', onDocumentMouseMove, false);
		document.addEventListener('mouseup', onDocumentMouseUp, false);

		mouseDown = true;

		startPoint = {
			x: event.clientX,

		};

		rotateStartPoint = rotateEndPoint = projectOnTrackball(0, 0);
	}

//ROTATION WITH MOUSE
	function onDocumentMouseMove(event)
	{
		deltaX = event.x - startPoint.x;

		handleRotation();

		startPoint.x = event.x;

		lastMoveTimestamp = new Date();
	}

	function onDocumentMouseUp(event)
	{
		if (new Date().getTime() - lastMoveTimestamp.getTime() > moveReleaseTimeDelta)
		{
			deltaX = event.x - startPoint.x;
		}

		mouseDown = false;

		rotateStartPoint = new THREE.Vector3(0.008, 0.001, 1);

		document.removeEventListener('mousemove', onDocumentMouseMove, false);
		document.removeEventListener('mouseup', onDocumentMouseUp, false);
	}

	function projectOnTrackball(touchX, touchY)
	{
		var mouseOnBall = new THREE.Vector3();

		mouseOnBall.set(
			clamp(touchX / windowHalfX, -1, 1), clamp(-touchY / windowHalfY, -1, 1),
			0.0
		);

		var length = mouseOnBall.length();

		if (length > 1.0)
		{
			mouseOnBall.normalize();
		}
		else
		{
			mouseOnBall.z = Math.sqrt(1.0 - length * length);
		}

		return mouseOnBall;
	}

	function rotateMatrix(rotateStart, rotateEnd)
	{
		var axis = new THREE.Vector3(),
			quaternion = new THREE.Quaternion();

		var angle = Math.acos(rotateStart.dot(rotateEnd) / rotateStart.length() / rotateEnd.length());

		if (angle)
		{
			axis.crossVectors(rotateStart, rotateEnd).normalize();
			angle *= rotationSpeed;
			quaternion.setFromAxisAngle(axis, angle);
		}
		return quaternion;
	}

	function clamp(value, min, max)
	{
		return Math.min(Math.max(value, min), max);
	}



//THE MAGIC

var turns = 0;
var globalshapeAngle = null;

	function animate()
	{
var vid = document.getElementById('v0');
		requestAnimationFrame(animate);
		render();

		var shapeAngle = getShapeAngle(shape.getWorldDirection());
		var dir = null;
		var frame = shapeAngle + (turns * 360);
		var checker = null;

globalshapeAngle = shapeAngle;
		//CHECKS DIRECTION


		if (shapeAngle < checker) {dir = "right"} else {dir = "left"} // If "shapeAngle" is smaller than "checker", then "dir" = right, otherwise it's left
		setInterval(checker = shapeAngle - 0.02 , 40); // Every x milliseconds, "checker" becomes a number .001 smaller than "shapeAngle"

		//CONTINUOUS COUNTING
		if (shapeAngle < 36.1 && shapeAngle > 35.98 && dir === "left") {turns++}
		if (shapeAngle < 36.1 && shapeAngle > 35.98 && dir === "right") {turns --}


//CONSOLE COMMAND TO HELP WHILE DEVELOPING
	//	document.body.onkeyup = function(e){
	//	if(e.keyCode == 32){
	//			console.log("dir: " + dir + "   checker: " + checker + "   shapeAngle: " + shapeAngle + "   frame: " + frame + "   turns: " + turns);
//		}
//		}


//COLOUR CHANGE
		console.log(shapeAngle)
	if (shapeAngle > 31.018547244577828 && shapeAngle < 38.06662983870188){
				shape.material.color.setHex(0x000000);
			} else {shape.material.color.setHex(0xffffff)}


		//VIDEO CONTROL
		vid.currentTime = shapeAngle;

	}

	function getShapeAngle(shapeVector)//watching the rotation angle of the shape
    {
        return radiansToDegrees(Math.atan2(shapeVector.x, shapeVector.z));
    }

		function radiansToDegrees(radians)
    {
        var xangle = 180 - ((radians * 360 / Math.PI)/2) - 179;

					if (xangle < 0) {
						xangle = (xangle - 360 * -1);
					}

				var doge = xangle/7;
				return doge
    }

//NUMBER ROUNDING FUNCTION
		function roundUp(num, precision) {
		  return Math.ceil(num * precision) / precision
		}


//RENDER & INERTIA
	function render()
	{
		if (!mouseDown)
		{
			var drag = 0.95;
			var minDelta = 0.05;

			if (deltaX < -minDelta || deltaX > minDelta)
			{
				deltaX *= drag;
			}
			else
			{
				deltaX = 0;
			}

			handleRotation();
		}

		renderer.render(scene, camera);
	}

	var handleRotation = function()
	{
		rotateEndPoint = projectOnTrackball(deltaX, deltaY);

		var rotateQuaternion = rotateMatrix(rotateStartPoint, rotateEndPoint);
		curQuaternion = shape.quaternion;
		curQuaternion.multiplyQuaternions(rotateQuaternion, curQuaternion);
		curQuaternion.normalize();
		shape.setRotationFromQuaternion(curQuaternion);

		rotateEndPoint = rotateStartPoint;
	};

// PUBLIC INTERFACE
	return {
		init: function()
		{
			setup();
		}
	};
})();

document.onreadystatechange = function()
{
	if (document.readyState === 'complete')
	{
		Defmech.RotationWithQuaternion.init();
	}
};
