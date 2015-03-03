
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
var container, scene, camera, renderer, controls;
var keyboard = new KeyboardState();

// custom global variables
var targetList = [];
var projector, touchPos = { x: 0, y: 0 },INTERSECTED;
var raycaster;


var baseColor=new THREE.Color( 'white' );
var highlightedColor=new THREE.Color( 0xddaa00 );
var selectedColor=new THREE.Color( 0x4466dd );

var mainTime;

var maxAlarms = 10;
var amountNow = 0;
var x1, y1;

init();
animate();

// FUNCTIONS    
function init() 
{
  // SCENE
  scene = new THREE.Scene();
  // CAMERA
  var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
  var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
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
  

  // LIGHT
  var light = new THREE.AmbientLight( 0x333333 ); // soft white light
  scene.add( light );
  var light = new THREE.PointLight(0xffffff,1,4500);
  light.position.set(-300,1000,-300);
  // scene.add(light);
  //lights red and blue
  var L1 = new THREE.PointLight(0xff0000, 1);
  L1.position.x = -1000;
  L1.position.y = 500;
  L1.position.z = 500;

  scene.add(L1);

  var L3 = new THREE.PointLight(0x0000ff, 0.4);
  L3.position.z = -500;
  L3.position.x = 1000;
  L3.position.y = 500;

  scene.add(L3);  

  //main time sphere 
   var shiny = new THREE.MeshPhongMaterial({
              color: 'white',
              shading: THREE.FlatShading,
              fog: false
              
          });

    var mainTime = new THREE.Mesh(new THREE.TetrahedronGeometry(60, 3), shiny);

          mainTime.position.x = 0;
          mainTime.position.y = 0;
          mainTime.position.z = 0;

          scene.add(mainTime);

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


function addOcta(x,y,z){


  var posx = x, posy = y, posz = z;
  var position = new Array();
  var notAboveGround = true;
  var face;
  var faces = [];
 
    position[0]= posx;
    position[1]= posy;
    position[2]= posz;


  var material = new THREE.MeshBasicMaterial( 
  { color: 'white', opacity: 0.5, transparent: true,shading:THREE.FlatShading} );
  
  var geometry = new THREE.OctahedronGeometry( 30, 0 );
  var octa= new THREE.Mesh( geometry, material );

  octa.position.set(position[0], position[1], position[2]);
  console.log(position[0] + " " + position[1] + " " + position[2]);
  // creates a wireMesh object
  var wireOcta = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 'white', wireframe: true }));
  

  // if( amountNow <= maxAlarms){

  scene.add(octa);
  // wireMesh object is added to the original as a sub-object
  octa.add(wireOcta );
  
  targetList.push(octa);
  amountNow++;
    


}



var mc = new Hammer.Manager(document.body);
var element = document.getElementById("ThreeJS");

    mc.add(new Hammer.Pinch({ threshold: 0}));

    mc.add(new Hammer.Tap());
    mc.add(new Hammer.Pan());


    mc.on("pinchout", onPinch);
    mc.on("panmove", function onPan(ev) {
         if( ev.pointerType === "touch"){

                  console.log(ev);
                  
                  var panx = ev.pointers[0].clientX;
                  var pany = ev.pointers[0].clientY;
           
                  console.log("paning : " + panx + " " + pany);
                  // checkSelection(panx1, pany1)
      
}
    });
  


    mc.on("tap", function onTap(ev) {
        if( ev.pointerType === "touch"){

                  console.log(ev.pointerType);
                  
                  x1 = ev.pointers[0].clientX;
                  y1 = ev.pointers[0].clientY;
                  
           
                  console.log("tap: " + x1 + " " + y1);


                

                touchPos.x = ( x1 / renderer.domElement.width ) * 2 - 1;
                touchPos.y = - ( y1 / renderer.domElement.height ) * 2 + 1;

                addOcta(touchPos.x,touchPos.y,0);
        // raycaster.setFromCamera( touchPos, camera );

        // var intersects = raycaster.intersectObjects( targetList );

        // if ( intersects.length > 0 ) {

        //   intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );
        //   console.log("changed color");

        //   var particle = new THREE.Sprite( particleMaterial );
        //   particle.position.copy( intersects[ 0 ].point );
        //   particle.scale.x = particle.scale.y = 16;
        //   scene.add( particle );

        // }
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
  renderer.render( scene, camera );
}




