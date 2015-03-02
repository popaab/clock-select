
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
var projector, mouse = { x: 0, y: 0 },INTERSECTED;
var selectedFaces = [];
var floorSide=1000;
var baseColor=new THREE.Color( 'white' );
var highlightedColor=new THREE.Color( 0xddaa00 );
var selectedColor=new THREE.Color( 0x4466dd );
var mouseSphereCoords = null;
var mouseSphere=[];
var mainTime;

var x1, y1;
x1 = null;
y1 = null;

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

  // FLOOR
  var faceMat = new THREE.MeshBasicMaterial({color: 0x888888,side: THREE.DoubleSide});

  var floor= THREE.SceneUtils.createMultiMaterialObject(new THREE.PlaneGeometry(floorSide, floorSide, 10, 10), faceMat);
  
  floor.rotation.x = Math.PI / 2;
  // scene.add(floor);
  
  // SKYBOX
  // var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
  // var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 'blue', side: THREE.BackSide } );
  // var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
  // scene.add(skyBox);
  
  ////////////
  // CUSTOM //
  ////////////

  addOcta();
  
  var newSphereGeom= new THREE.SphereGeometry(5,5,5);
  var sphere= new THREE.Mesh(newSphereGeom, new THREE.MeshBasicMaterial({ color: 0x2266dd }));
  scene.add(sphere);
  mouseSphere.push(sphere);

  //////////////////////////////////////////////////////////////////////
  
  // initialize object to perform world/screen calculations
  projector = new THREE.Projector();
  

}
function addOcta()
{
  var position = new Array();
  var notAboveGround = true;
  var face;
  var faces = [];
  while(notAboveGround){
    position[0]=Math.random()*floorSide-floorSide/2;
    position[1]=Math.random()*floorSide-floorSide/2;
    position[2]=Math.random()*floorSide/5;
    var cubeSide = Math.random()*floorSide/12+floorSide/50;
    //alert("cubeSide="+cubeSide);
    if(position[2]-cubeSide>0){
      notAboveGround = false;
    }
  }
  
  var faceColorMaterial = new THREE.MeshBasicMaterial( 
  { color: 'white', opacity: 0.1, transparent: true, vertexColors: THREE.FaceColors,shading:THREE.FlatShading,polygonOffset: true,polygonOffsetUnits: 1,polygonOffsetFactor: 1} );
  
  var octaGeom= new THREE.OctahedronGeometry(cubeSide,0);
  for ( var i = 0; i < octaGeom.faces.length; i++ ) 
  {
    face = octaGeom.faces[ i ]; 
    face.color= baseColor;    
  }
  var octa= new THREE.Mesh( octaGeom, faceColorMaterial );
  octa.position.set(position[0], position[2], position[1]);
  // creates a wireMesh object
  var wireOcta = new THREE.Mesh(octaGeom, new THREE.MeshBasicMaterial({ color: 'white', wireframe: true }));
  
  scene.add(octa);
  // wireMesh object is added to the original as a sub-object
  octa.add(wireOcta );
  
  targetList.push(octa);
}


var mc = new Hammer.Manager(document.body);
var element = document.getElementById("ThreeJS");

    mc.add(new Hammer.Pinch({ threshold: 0}));

    mc.add(new Hammer.Tap());

    mc.on("pinch", onPinch)
    mc.on("tap", function onTap(ev) {
        if( ev.pointerType === "touch"){

                  console.log(ev.pointerType);
                  
                  x1 = ev.pointers[0].clientX;
                  y1 = ev.pointers[0].clientY;
           
                  console.log("tap: " + x1 + " " + y1);
                  checkSelection(x1, y1);

                  document.getElementById("resultDIV").innerHTML = "tap: "+ x1 + " " + y1;
        }
                  

    });


    function onPinch(ev) {
    // if(ev.type == 'pinchout') {
          console.log("pinch");
            addOcta();
        // }

    }


function ColorSelected(){
  selectedFaces.forEach( function(arrayItem)
    {
      arrayItem.face.color = selectedColor;
      arrayItem.object.geometry.colorsNeedUpdate = true;
    });
}

function checkSelection(x1, y1){
  // find intersections
var vector = new THREE.Vector3( x1, y1, 1 ); 
console.log("check selection: " + x1 + " " + y1);
  // create a Ray with origin at the mouse position
  //   and direction into the scene (camera direction)
  
  projector.unprojectVector( vector, camera );
  var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

  // create an array containing all objects in the scene with which the ray intersects
  var intersects = ray.intersectObjects( targetList );

  //if an intersection is detected
  if ( intersects.length > 0 )
  {
    console.log("Hit @ " + toString( intersects[0].point ) );

    
    //test items in selected faces array
    var test=-1; 
    selectedFaces.forEach( function(arrayItem)
    {
      // if the faceIndex and object ID are the same between the intersect and selected faces ,
      // the face index is recorded
      if(intersects[0].faceIndex==arrayItem.faceIndex && intersects[0].object.id==arrayItem.object.id){
        test=selectedFaces.indexOf(arrayItem);
      }
    });
    
    // if is a previously selected face, change the color back to green, otherswise change to blue
    if(test>=0){
      intersects[ 0 ].face.color=new THREE.Color( 0x44dd66 ); 
      selectedFaces.splice(test, 1);
    }
    else{
      intersects[ 0 ].face.color=new THREE.Color( 0x222288 ); 
      selectedFaces.push(intersects[0]);
    }
    
    intersects[ 0 ].object.geometry.colorsNeedUpdate = true;
  }
}
function checkHighlight(){
  // find intersections

  // create a Ray with origin at the mouse position
  //   and direction into the scene (camera direction)
  var vector = new THREE.Vector3( x1, y1, 1 );
  projector.unprojectVector( vector, camera );
  var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

  // create an array containing all objects in the scene with which the ray intersects
  var intersects = ray.intersectObjects( targetList );

  // INTERSECTED = the object in the scene currently closest to the camera 
  //    and intersected by the Ray projected from the mouse position  
  
  // if there is one (or more) intersections
  if ( intersects.length > 0 )
  { // case if mouse is not currently over an object
    if(INTERSECTED==null){
      INTERSECTED = intersects[ 0 ];
      INTERSECTED.object.color = highlightedColor;
    }
    else{ // if thse mouse is over an object
      INTERSECTED.face.color= baseColor;
      INTERSECTED.object.geometry.colorsNeedUpdate=true;
      INTERSECTED = intersects[ 0 ];
      INTERSECTED.face.color = highlightedColor;      
    }
    // upsdate mouseSphere coordinates and update colors
    mouseSphereCoords = [INTERSECTED.point.x,INTERSECTED.point.y,INTERSECTED.point.z];
    INTERSECTED.object.geometry.colorsNeedUpdate=true;
    
  } 
  else // there are no intersections
  {
    // restore previous intersection object (if it exists) to its original color
    if ( INTERSECTED ){
      INTERSECTED.face.color = baseColor;
      INTERSECTED.object.geometry.colorsNeedUpdate=true;
    }
    // remove previous intersection object reference
    //     by setting current intersection object to "nothing"
    
    INTERSECTED = null;
    mouseSphereCoords = null;
    
    
  }
}

function CheckMouseSphere(){
  // if the coordinates exist, make the sphere visible
  if(mouseSphereCoords != null){
    //console.log(mouseSphereCoords[0].toString()+","+mouseSphereCoords[1].toString()+","+mouseSphereCoords[2].toString());
    mouseSphere[0].position.set(mouseSphereCoords[0],mouseSphereCoords[1],mouseSphereCoords[2]);
    mouseSphere[0].visible = true;
  }
  else{ // otherwise hide the sphere

    console.log('gone');
  }
}
function toString(v) { return "[ " + v.x + ", " + v.y + ", " + v.z + " ]"; }


function animate() 
{
    requestAnimationFrame( animate );
  render();   
  update();
}

function update()
{

  checkHighlight();
  CheckMouseSphere();
  keyboard.update();
  
  if ( keyboard.down("up") ) 
  {   
    addOcta();
  }
  ColorSelected();
  //intersects[ 0 ].object.geometry.colorsNeedUpdate = true;
  controls.update();
}

function render() 
{
  renderer.render( scene, camera );
}




