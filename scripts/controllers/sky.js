
'use strict';
 //  Experiment 02-05
 //  Seth Moczydlowski
 //  January 8th, 2014
 //  http://www.moczys.com
  
 //  Code architecture adapted from:
 //  http://stemkoski.github.io/Three.js/Template.html
  
 //  Three.js "tutorials by example"
 //  Author: Lee Stemkoski
 // */

// MAIN

// standard global variables


var  windowHalfX = window.innerWidth / 2, windowHalfY = window.innerHeight / 2
var container, scene, camera, renderer, controls, controls2;
var keyboard = new KeyboardState();
var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
// custom global variables
var targetList = [];

var projector, touchPos = { x: 0, y: 0 },INTERSECTED;
var raycaster;
var selectedObject; 
var k, cameraX, cameraY, cameraZ, intersects;

var baseColor=new THREE.Color( 'white' );
var highlightedColor=new THREE.Color( 0xddaa00 );
var selectedColor=new THREE.Color( 0x4466dd );
var clock = new THREE.Clock();
var deltaTime = 0;
var fov = 75;
var mainTime;
var sprite1;
var canvas1, context1, texture1;
var maxAlarms = 10;
var amountNow = 0;
var x1, y1;
var setId, getId;
var k;
var selected;
var cameraX
var cameraY;
var cameraZ;
var toDel;
var maxParticles = 2000,
particles,
particleMaterial,
particleSystem;

var editMode = false;
var alarmEdit = false;
var world = true, selectedOnce = false;

var rotation_matrix;


var count = 0,
    hour = 0,
    mins = 0,
    deltaTime = 0,
    finalRotationY;

    var targetRotationX = 0,
    targetRotationOnMouseDownX = 0,

    targetRotationY = 0,
    targetRotationOnMouseDownY = 0,

    mouseX = 0,
    mouseXOnMouseDown = 0,

    mouseY = 0,
    mouseYOnMouseDown = 0;



init();
animate();




function getRandom(min, max) {
          return Math.random() * (max - min) + min;
}
// FUNCTIONS    
function init() 
{
  // SCENE
  scene = new THREE.Scene();
  // CAMERA

  camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  camera.position.set(0,250,700);
  camera.lookAt(scene.position);  
  // RENDERER
  if ( Detector.webgl )
    renderer = new THREE.WebGLRenderer( {antialias:true, alpha:true} );
  else
    renderer = new THREE.CanvasRenderer(); 
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  container = document.getElementById( 'ThreeJS' );
  container.appendChild( renderer.domElement );
  // EVENTS
  THREEx.WindowResize(renderer, camera);
  // THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
  // CONTROLS
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls2 = new THREE.TrackballControls( camera, renderer.domElement );
  controls2.addEventListener( 'change', render );


  //lights red and blue
  var L1 = new THREE.PointLight(0xff0000, 0.7);
  L1.position.x = -1000;
  L1.position.y = 500;
  L1.position.z = 1000;

  scene.add(L1);

  // var L2 = new THREE.PointLight('orange', 0.4);
  // L2.position.x = 5000;
  // L2.position.y = 500;
  // L2.position.z = 5000;

  // scene.add(L2);
  var L3 = new THREE.PointLight(0x0000ff, 0.4);
  L3.position.z = -2000;
  L3.position.x = 1000;
  L3.position.y = 500;

  scene.add(L3);  

  particles = new THREE.Geometry();
    for (var i = 0; i < maxParticles; i++) {
      var particle = new THREE.Vector3(random(-800, 800), random(-400, 400), random(-1000, 1000));
      particles.vertices.push(particle);
    }
    particleMaterial = new THREE.ParticleBasicMaterial({ color: 0xeeeeee, size: 2 });
    particleSystem = new THREE.ParticleSystem(particles, particleMaterial);
    particleSystem.sortParticles = true;
    scene.add(particleSystem);


  //main time sphere 
   var shiny = new THREE.MeshPhongMaterial({
              color: 'white',
               opacity: 1, transparent: true,
              shading: THREE.FlatShading,
              fog: false
              
          });

   
    var mainTime = new THREE.Mesh(new THREE.TetrahedronGeometry(100, 3), shiny);
    mainTime.name = 'clock';

          mainTime.position.x = 0;
          mainTime.position.y = 0;
          mainTime.position.z = 0;
          mainTime.rotation.x = 0;
          mainTime.rotation.y = 0;
          mainTime.rotation.z = 0;

          scene.add(mainTime);

          var spritey = makeTextSprite( "", 
    { fontsize: 24, fontface: "Lato"} );
  spritey.position.set(-85,105,55);
  scene.add( spritey );

  // var spritey = makeTextSprite( "Alarm 1", 
  //   { fontsize: 32, fontface: "Lato"} );
  // spritey.position.set(190,50,0);
  // scene.add( spritey );
  
          // targetList.push(mainTime);
  addOcta(250,0,0);

  
  // initialize object to perform world/screen calculations
  projector = new THREE.Projector();
  raycaster = new THREE.Raycaster();
  touchPos = new THREE.Vector2();

  document.addEventListener( 'touchstart', onDocumentTouchStart, false );
  document.addEventListener( 'touchmove', onDocumentTouchMove, false );

  controls2.enable = false;

}

function random( min, max ) {
      if ( isNaN(max) ) {
        max = min;
        min = 0;
      }
      return Math.random() * ( max - min ) + min;
}

function addOcta(x,y,z){


  var posx = x, posy = y, posz = z;
  var position = new Array();
 
    position[0]= posx;
    position[1]= posy;
    position[2]= posz;



   var shiny2 = new THREE.MeshBasicMaterial({
              color: 'white',
              // shading: THREE.FlatShading,
              opacity: 0.5, transparent: true,
              fog: false
              
          });
  
  var geometry = new THREE.OctahedronGeometry( 60, 0 );
  var octa= new THREE.Mesh( geometry, shiny2 );

  octa.position.set(position[0], position[1], position[2]);
          octa.rotation.x = 0;
          octa.rotation.y = 0;
          octa.rotation.z = 0;
  // creates a wireMesh object
  var numb = amountNow + 1;
  var wireOcta = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 'white', wireframe: true }));
  var spritey = makeTextSprite( "Alarm " + numb, 
    { fontsize: 32, fontface: "Lato"} );
  spritey.position.set(x -170,y+ 50,z - 40);

  if( amountNow <= maxAlarms){

  scene.add(octa);
  // wireMesh object is added to the original as a sub-object
  octa.add(wireOcta );
  octa.add (spritey);
  
  targetList.push(octa);
  amountNow++;
}

}


var mc = new Hammer.Manager(document.body);
mc.add(new Hammer.Pinch({ threshold: 0}));

mc.add( new Hammer.Tap({ event: 'doubletap', taps: 2 }) );
// Single tap recognizer
mc.add( new Hammer.Tap({ event: 'tap' }) );


mc.get('doubletap').recognizeWith('tap');
mc.get('tap').requireFailure('doubletap');

    // mc.add(new Hammer.Pan());
    mc.add(new Hammer.Swipe());
    mc.add(new Hammer.Pan());

    mc.on("pinchout", onPinch);
    // mc.on("pinchin pinchend", onPinchIn);
    mc.on('tap doubletap', function(ev) {
    manageMultitouch(ev);

    });

    mc.on('doubletap tap panmove panleft panright panup pandown', function(ev){
      manageMultitouchAlarm(ev);
    });

    function onPinch(ev) {
    // if(ev.type == 'pinchout') {
      editMode = false;
      
       if( ev.pointerType === "touch" && editMode === false){

            console.log(ev.pointerType);
            
            var pinchx = ev.pointers[0].clientX;
            var pinchy = ev.pointers[0].clientY;

                
            var cartesianx = pinchx- windowHalfX
            var cartesiany = - pinchy+ windowHalfY

            console.log("world cord: " + cartesianx + " " + cartesiany);
        

            addOcta(cartesianx,cartesiany, getRandom(-300, 300));

        }
 

    }
    function manageMultitouchAlarm(event){
    
    if(event.type === 'doubletap'){
      
       if( event.pointerType === "touch"){
      alarmEdit = true;
          console.log(event);
          touchPos.x = ( event.pointers[0].clientX/ renderer.domElement.width ) * 2 - 1;
          touchPos.y = - ( event.pointers[0].clientY / renderer.domElement.height ) * 2 + 1;

          raycaster.setFromCamera( touchPos, camera );

          var intersects = raycaster.intersectObjects( targetList );
        
          if ( intersects.length > 0 ) {

            intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );
            console.log(intersects[0].object.id);
            k = targetList.indexOf(intersects[0].object.id);
            selectedObject = intersects[0].object;
            
            cameraX = selectedObject.position.x;
            cameraY = selectedObject.position.y;
            cameraZ = -selectedObject.position.z + 200;

            console.log(cameraX,cameraY,cameraZ);

            document.getElementById("resultDIV").innerHTML = ("double tap: "+ intersects[0].object.id);

          }      
        }


    }



        if(event.type === 'panleft' ){
          console.log(event);
        for(i = 0; i < 1; i++) {
          hour -= 1;
            if(hour < 0) {
                hour = 23;
            }
        }
        if(hour < 10) {
          document.getElementById("hour").innerHTML = '0' + hour;
        } else {
          document.getElementById("hour").innerHTML = hour;
        }
      }

      if(event.type === 'panright' ){
        console.log(event);
        for(i = 0; i < 1; i++) {
          hour += 1;
          if(hour > 23) {
            hour = 0;
          }
        }
        if(hour < 10) {
          document.getElementById("hour").innerHTML = '0' + hour;
        } else {
          document.getElementById("hour").innerHTML = hour;
        }
      }

      if(event.type === 'panup'){
        console.log(event);
        for(i = 0; i < 1; i++) {
          mins += 1;
          if(mins > 59) {
            mins = 0;
          }
        }
        if(mins < 10) {
          document.getElementById("mins").innerHTML = '0' + mins;
        } else {
          document.getElementById("mins").innerHTML = mins;
        }
          
      }

      if(event.type === 'pandown'){
        console.log(event);
        for(i = 0; i < 1; i++) {
          mins -= 1;
          if(mins < 0) {
            mins = 59;
          }
        }
          if(mins < 10) {
          document.getElementById("mins").innerHTML = '0' + mins;

        } else {
          document.getElementById("mins").innerHTML = mins;
        }
      }if(event.type === 'tap'){
        console.log(event);
        editMode = false;
   
      }
        
    

}

 function manageMultitouch(event){

    if(event.type === 'tap'){
      
       if( event.pointerType === "touch"){
          editMode = true;
          
          touchPos.x = ( event.pointers[0].clientX/ renderer.domElement.width ) * 2 - 1;
          touchPos.y = - ( event.pointers[0].clientY / renderer.domElement.height ) * 2 + 1;

          raycaster.setFromCamera( touchPos, camera );

          var intersects = raycaster.intersectObjects( targetList );
        
          if ( intersects.length > 0 ) {

            intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );
            console.log(intersects[0].object.id);
            k = targetList.indexOf(intersects[0].object.id);
            selectedObject = intersects[0].object;
            toDel= intersects[0].object;

            
            cameraX = selectedObject.position.x;
            cameraY = selectedObject.position.y;
            cameraZ = -selectedObject.position.z + 200;

            console.log(cameraX,cameraY,cameraZ);

            document.getElementById("resultDIV").innerHTML = ("tap: "+ intersects[0].object.id);

          }      
        }


    }


    if(event.type === 'doubletap' && editMode === true){

        if( event.pointerType === "touch"){
 
          
              scene.remove( toDel);

      

           document.getElementById("resultDIV").innerHTML = ("deleted: "+ toDel.object.id);
           editMode = false;

        }    

}
 
}

function onDocumentTouchStart( event ) {
 
    if ( event.touches.length == 1 ) {

        event.preventDefault();

        mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
        targetRotationOnMouseDownX = targetRotationX;

        mouseYOnMouseDown = event.touches[ 0 ].pageY - windowHalfY;
        targetRotationOnMouseDownY = targetRotationY;
    }
 console.log("Touch start: "+ targetRotationOnMouseDownX + " " + targetRotationOnMouseDownY);
}
 
function onDocumentTouchMove( event ) {
 
    if ( event.touches.length == 1  ) {

        event.preventDefault();

        mouseX = event.touches[ 0 ].pageX - windowHalfX;
        targetRotationX = targetRotationOnMouseDownX + ( mouseX - mouseXOnMouseDown ) * 0.05;

        mouseY = event.touches[ 0 ].pageY - windowHalfY;
        targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.05;
      }
 console.log("Touch move: "+ targetRotationX + " " + targetRotationY);
      
 
}


function makeTextSprite( message, parameters )
{
  if ( parameters === undefined ) parameters = {};
  
  var fontface = parameters.hasOwnProperty("fontface") ? 
    parameters["fontface"] : "Lato";
  
  var fontsize = parameters.hasOwnProperty("fontsize") ? 
    parameters["fontsize"] : 18;
  
  var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
    parameters["borderThickness"] : 4;
  
  var borderColor = parameters.hasOwnProperty("borderColor") ?
    parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
  
  var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
    parameters["backgroundColor"] : { r:0, g:0, b:0, a:1.0 };

    
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  context.font = "Bold " + fontsize + "px " + fontface;
    
  // get size data (height depends only on font size)
  var metrics = context.measureText( message );
  var textWidth = metrics.width;
  
  // background color
  context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
                  + backgroundColor.b + "," + backgroundColor.a + ")";
  // border color
  context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
                  + borderColor.b + "," + borderColor.a + ")";

  context.lineWidth = borderThickness;
  
  // 1.4 is extra height factor for text below baseline: g,j,p,q.
  
  // text color
  context.fillStyle = "rgba(255, 255, 255, 1.0)";

  context.fillText( message, borderThickness, fontsize + borderThickness);
  
  // canvas contents will be used for a texture
  var texture = new THREE.Texture(canvas) 
  texture.needsUpdate = true;

  var spriteMaterial = new THREE.SpriteMaterial( 
    { map: texture} );
  var sprite = new THREE.Sprite( spriteMaterial );
  sprite.scale.set(100,50,1.0);
  return sprite;  
}

function alarm() {

  var selectedId = setId(object); 
  scene.getObjectById(selectedId).rotation.y += ( targetRotationX - mainTime.rotation.y ) * 0.1;
  scene.getObjectById(selectedId).rotation.rotation.x += ( targetRotationY - mainTime.rotation.x ) * 0.1;

}

function animate() 
{
  requestAnimationFrame( animate );
    
  update();
  render(); 
}

function update()
{

  controls.update();
  controls2.update();
}

function render() 
{
  renderer.render( scene, camera );
  
  // scene.getObjectByName('clock').rotation.x += 0.05;
  deltaTime = clock.getDelta();
  particleSystem.rotation.y += deltaTime/40;
  // mainTime.rotation.y += 0.05;
//   mainTime.rotation.y += ( targetRotationX - mainTime.rotation.y ) * 0.1;
// mainTime.rotation.x += ( targetRotationY - mainTime.rotation.x ) * 0.1;
  
}

