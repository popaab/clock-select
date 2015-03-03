
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
var container, scene, camera, renderer, controls;
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

    var maxParticles = 1000,
    particles,
    particleMaterial,
    particleSystem;

init();
animate();

// FUNCTIONS    
function init() 
{
  // SCENE
  scene = new THREE.Scene();
  // CAMERA

  camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  camera.position.set(0,250,950);
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
  

  // // LIGHT
  // var light = new THREE.AmbientLight( 0x333333 ); // soft white light
  // scene.add( light );
  // var light = new THREE.PointLight(0xffffff,1,4500);
  // light.position.set(-300,1000,-300);
  // scene.add(light);
  //lights red and blue
  var L1 = new THREE.PointLight(0xff0000, 0.7);
  L1.position.x = -1000;
  L1.position.y = 500;
  L1.position.z = 1000;

  scene.add(L1);

  var L1 = new THREE.PointLight('orange', 0.4);
  L1.position.x = 5000;
  L1.position.y = 500;
  L1.position.z = 5000;

  scene.add(L1);
  var L3 = new THREE.PointLight(0x0000ff, 0.4);
  L3.position.z = -2000;
  L3.position.x = 1000;
  L3.position.y = 500;

  scene.add(L3);  


        // particles
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
              shading: THREE.FlatShading,
              fog: false
              
          });

    var mainTime = new THREE.Mesh(new THREE.TetrahedronGeometry(100, 3), shiny);

          mainTime.position.x = 0;
          mainTime.position.y = 0;
          mainTime.position.z = 0;

          scene.add(mainTime);
          targetList.push(mainTime);

  // // FLOOR
  // var faceMat = new THREE.MeshBasicMaterial({color: 0x888888,side: THREE.DoubleSide});

  // var floor= THREE.SceneUtils.createMultiMaterialObject(new THREE.PlaneGeometry(floorSide, floorSide, 10, 10), faceMat);
  
  // floor.rotation.x = Math.PI / 2;
  // scene.add(floor);
  
  // SKYBOX
  // var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
  // var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 'blue', side: THREE.BackSide } );
  // var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
  // scene.add(skyBox);
  
  ////////////
  // CUSTOM //
  ////////////

  addOcta(180,0,0);
  
  // var newSphereGeom= new THREE.SphereGeometry(5,5,5);
  // var sphere= new THREE.Mesh(newSphereGeom, new THREE.MeshBasicMaterial({ color: 0x2266dd }));
  // scene.add(sphere);
  // mouseSphere.push(sphere);

  //////////////////////////////////////////////////////////////////////
  
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
    function screenToWorld(touchPos)
            {


                var worldPos = touchPos.clone();
                worldPos.x = worldPos.x / windowHalfX - 1;
                worldPos.y = - worldPos.y / windowHalfY + 1;
                projector.unprojectVector( worldPos, camera );
                return worldPos;                    
            }

function addOcta(x,y,z){


  var posx = x, posy = y, posz = z;
  var position = new Array();
  var notAboveGround = true;
  var face;
  var faces = [];
 
    position[0]= posx;
    position[1]= posy;
    position[2]= posz;

   var shiny2 = new THREE.MeshPhongMaterial({
              color: 'white',
              shading: THREE.FlatShading,
              opacity: 0.5, transparent: true,
              fog: false
              
          });
  var material = new THREE.MeshBasicMaterial( 
  { color: 'white', opacity: 0.3, transparent: true, shading:THREE.FlatShading} );
  
  var geometry = new THREE.OctahedronGeometry( 60, 0 );
  var octa= new THREE.Mesh( geometry, shiny2 );

  octa.position.set(position[0], position[1], position[2]);
  console.log(position[0] + " " + position[1] + " " + position[2]);
  // creates a wireMesh object
  var wireOcta = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 'white', wireframe: false }));
  

  // if( amountNow <= maxAlarms){

  scene.add(octa);
  // wireMesh object is added to the original as a sub-object
  // octa.add(wireOcta );
  
  targetList.push(octa);
  amountNow++;
    


}



var mc = new Hammer.Manager(document.body);
var element = document.getElementById("ThreeJS");

    mc.add(new Hammer.Pinch({ threshold: 0}));

    mc.add(new Hammer.Tap());
    mc.add(new Hammer.Pan());


    mc.on("pinchout pinchstart", onPinch);
    mc.on("panmove", function onPan(ev) {
         if( ev.pointerType === "touch"){

                  console.log(ev);
                  
                  var panx = ev.pointers[0].clientX;
                  var pany = ev.pointers[0].clientY;
           
                  console.log("paning : " + panx + " " + pany);
                  // checkSelection(panx1, pany1)
      
}
    });
          function getRandom(min, max) {
          return Math.random() * (max - min) + min;
        }

    mc.on("tap", function onTap(ev) {
        if( ev.pointerType === "touch"){

                  console.log(ev.pointerType);
                  
                  x1 = ev.pointers[0].clientX;
                  y1 = ev.pointers[0].clientY;
                  
           
                console.log("tap: " + x1 + " " + y1);
                touchPos.x = ( x1 / renderer.domElement.width) * 2 - 1 * 2;
                touchPos.y = - ( y1 / renderer.domElement.height ) * 2 + 1;
                
                raycaster.setFromCamera( touchPos, camera );


          // var square = new THREE.Mesh(new THREE.OctahedronGeometry( 10, 0 ), new THREE.MeshBasicMaterial({ color: 'green', wireframe: false }));
          // square.position.x = touchPos.x;
          // square.position.y = touchPos.y;
          // square.position.z = 10;
          
          // scene.add( square );

        var intersects = raycaster.intersectObjects( targetList );

        if ( intersects.length > 0 ) {

          intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );
          console.log("changed color");

        }
                  // checkSelection(x1, y1);

                  document.getElementById("resultDIV").innerHTML = "tap: "+ x1 + " " + y1;
        }
                  

    });


    function onPinch(ev) {
    // if(ev.type == 'pinchout') {

       if( ev.pointerType === "touch"){

            console.log(ev.pointerType);
            
            var pinchx = ev.pointers[0].clientX;
            var pinchy = ev.pointers[0].clientY;

                var scalefactor = 2;
                var cartesianx = 1.1 * pinchx- windowHalfX
                var cartesiany = - 1.1 * pinchy+ windowHalfY

                console.log("world cord: " + cartesianx + " " + cartesiany);
            

                addOcta(cartesianx,cartesiany, getRandom(-300, 300));


            
        // }
        }
 

    }

// function onWindowResize() {

// camera.aspect = window.innerWidth / window.innerHeight;
// camera.updateProjectionMatrix();

// renderer.setSize( window.innerWidth, window.innerHeight );

// }
function animate() 
{
  requestAnimationFrame( animate );
  render();   
  update();
}

function update()
{


  controls.update();
}

function render() 
{

        deltaTime = clock.getDelta();
        particleSystem.rotation.y += deltaTime/40;

  renderer.render( scene, camera );
}




