
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


var baseColor=new THREE.Color( 'white' );
var highlightedColor=new THREE.Color( 0xddaa00 );
var selectedColor=new THREE.Color( 0x4466dd );
var clock = new THREE.Clock();
var deltaTime = 0;
var fov = 75;
var mainTime;

var maxAlarms = 10;
var amountNow = 0;
var x1, y1;

var k;
var selected;
var cameraX
var cameraY;
var cameraZ;

var maxParticles = 5000,
particles,
particleMaterial,
particleSystem;
var editMode = false
var world = true, selectedOnce = false;
init();
animate();
state();

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

  var L2 = new THREE.PointLight('orange', 0.4);
  L2.position.x = 5000;
  L2.position.y = 500;
  L2.position.z = 5000;

  scene.add(L2);
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

          mainTime.position.x = 0;
          mainTime.position.y = 0;
          mainTime.position.z = 0;

          scene.add(mainTime);
          targetList.push(mainTime);
  addOcta(180,0,0);

  
  // initialize object to perform world/screen calculations
  projector = new THREE.Projector();
  raycaster = new THREE.Raycaster();
  touchPos = new THREE.Vector2();

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

   var shiny2 = new THREE.MeshPhongMaterial({
              color: 'white',
              shading: THREE.FlatShading,
              opacity: 1, transparent: true,
              fog: false
              
          });
  
  var geometry = new THREE.OctahedronGeometry( 60, 0 );
  var octa= new THREE.Mesh( geometry, shiny2 );

  octa.position.set(position[0], position[1], position[2]);
  // creates a wireMesh object
  // var wireOcta = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 'white', wireframe: false }));
  

  // if( amountNow <= maxAlarms){

  scene.add(octa);
  // wireMesh object is added to the original as a sub-object
  // octa.add(wireOcta );
  
  targetList.push(octa);
  amountNow++;

}


function animate() 
{
  requestAnimationFrame( animate );
  render();   
  update();
}

function update()
{

  controls.update();
  controls2.update();
}

function render() 
{

  deltaTime = clock.getDelta();
  particleSystem.rotation.y += deltaTime/40;
  
  renderer.render( scene, camera );
}



    var mc = new Hammer.Manager(document.body);

    mc.add(new Hammer.Pinch({ threshold: 0}));


    mc.add(new Hammer.Tap({ taps: 1}));
    // mc.add(new Hammer.Pan());
    mc.add(new Hammer.Swipe());

    mc.on("pinchout", onPinch);
    // mc.on("pinchin pinchend", onPinchIn);
    mc.on('tap swiperight', function(ev) {
    manageMultitouch(ev);

    });


    function state() {
      if(editMode === false){
          controls2.enabled = false;

        }else {
          controls2.enabled = true;

        }

    }

    function onPinch(ev) {
    // if(ev.type == 'pinchout') {
      state();
       if( ev.pointerType === "touch" && editMode === false){

            console.log(ev.pointerType);
            
            var pinchx = ev.pointers[0].clientX;
            var pinchy = ev.pointers[0].clientY;

                
            var cartesianx = pinchx- windowHalfX
            var cartesiany = - pinchy+ windowHalfY

            console.log("world cord: " + cartesianx + " " + cartesiany);
        

            addOcta(cartesianx,cartesiany, getRandom(-400, 300));

        }
 

    }
function removeEntity(object) {
    var del = scene.getObjectByName(object.id);
    scene.remove( del );
    
}

 function manageMultitouch(event){
  state();
     var selectedObject = null; 
     var k, cameraX, cameraY, cameraZ;
    
    if(event.type === 'tap'){
      
       if( event.pointerType === "touch"){
                  if(editMode === false){editMode = true;}
                  
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

                    document.getElementById("resultDIV").innerHTML = ("tap: "+ intersects[0].object.id);

                  }      
                }


    }

    if(event.type === 'swiperight' && editMode === true){


        if( event.pointerType === "touch"){

          removeEntity(selectedObject);

          console.log(cameraX,cameraY,cameraZ);

           document.getElementById("resultDIV").innerHTML = ("deleted: "+ selectedObject);
           editMode = false;

        }      
                    
    }
}
