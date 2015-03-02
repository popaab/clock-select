      var container;
      var width = window.innerWidth,
          height = window.innerHeight,
          camera, scene, renderer
          aspectRatio = width / height,
          near = 0.1,
          far = 1000,
          clock = new THREE.Clock(),
          deltaTime = 0,
          fov = 75;



      var windowHalfX = window.innerWidth / 2;
      var windowHalfY = window.innerHeight / 2;



                var targetRotation = 0;
      var targetRotationOnMouseDown = 0;

      var mouseX = 0;
      var mouseXOnMouseDown = 0;
          
 

      var radius = 100, theta = 0;

      init();
      animate();

      var maxParticles = 100,
          particles,
          particleMaterial,
          particleSystem;

      function init() {

        if (window.WebGLRenderingContext) {
          renderer = new THREE.WebGLRenderer({alpha: true});
        } else {
          renderer = new THREE.CanvasRenderer();
        }
        container = document.createElement( 'div' );
        document.body.appendChild( container );
        scene = new THREE.Scene();
  
        // renderer.setClearColor( 0xf0f0f0 );
        renderer.setSize( width, height );
        renderer.sortObjects = false;
        container.appendChild(renderer.domElement);


        //add camera
        var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
        var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 10, FAR = 80000;
        camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
        camera.position.set(0,150,400);
        scene.add(camera);
        camera.lookAt(scene.position);
        
        // // particles
        // particleMaterial = new THREE.ParticleBasicMaterial({ color: 'white', size: 2 });
        // particleSystem = new THREE.ParticleSystem(particles, particleMaterial);
        // particleSystem.sortParticles = true;
        // particles = new THREE.Geometry();
        // for (var i = 0; i < maxParticles; i++) {
        //   var particle = new THREE.Vector3(random(-100, 100), random(-100, 100), random(-100, 100));
        //   particleSystem.vertices.push(particle);
        // }
        
        // scene.add(particleSystem);
            

        //lights red and blue
        var L1 = new THREE.PointLight(0xff0000, 1);
        L1.position.x = 500;
        L1.position.y = 400;
        L1.position.z = 1000;

        scene.add(L1);

        var L3 = new THREE.PointLight(0x0000ff, 0.4);
        L3.position.z = -500;
        L3.position.x = 700;
        L3.position.y = 400;

        scene.add(L3);

document.addEventListener( 'mousedown', onDocumentMouseDown, false );
document.addEventListener( 'touchstart', onDocumentTouchStart, false );
document.addEventListener( 'touchmove', onDocumentTouchMove, false );

        // //select controls
        // EventsControls = new EventsControls( camera, renderer.domElement );

        // EventsControls.attachEvent( 'mouseOver', function () {

        //   this.container.style.cursor = 'pointer';

        //   this.mouseOvered.currentHex = this.mouseOvered.material.color.getHex();
        //   this.mouseOvered.material.color.setHex( 'red' );

        //   console.log( 'the box at number ' + this.event.item + ' is select' );

        // });

        // EventsControls.attachEvent( 'mouseOut', function () {

        //   this.container.style.cursor = 'auto';
        //   this.mouseOvered.material.color.setHex( this.mouseOvered.currentHex );

        // });

        function getRandom(min, max) {
          return Math.random() * (max - min) + min;
        }
        
        var geometry = new THREE.OctahedronGeometry( getRandom(10, 30), 0 );

       
        for ( var i = 0; i < 7; i ++ ) {

          var object = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({
              color: 'white', 
              opacity: 0.5, 
              transparent: true

          }));
          


          object.position.x = getRandom(-80, 50) + 70;
          object.position.y = getRandom(-80, 50) + 70;
          object.position.z = getRandom(-80, 50) + 70;

          scene.add( object );
          // EventsControls.attach( object );

          var wireobj = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({
              color: 'black', 
              wireframe: true, 
              transparent: true
          }));
          
          wireobj.position.x = object.position.x;
          wireobj.position.y = object.position.y;
          wireobj.position.z = object.position.z;
          scene.add( wireobj );

        

      }

          var shiny = new THREE.MeshPhongMaterial({
              color: 'pink',
              shading: THREE.FlatShading,
              fog: false
              
          });

          object = new THREE.Mesh(new THREE.TetrahedronGeometry(40, 3), shiny);

          object.position.x = 0;
          object.position.y = 0;
          object.position.z = 0;

          scene.add(object);
          // EventsControls.attach( object );

    }


      function animate() {

        requestAnimationFrame( animate );

        render();

      }

      function render() {
        requestAnimationFrame(render);

        // deltaTime = clock.getDelta();
        // particleSystem.rotation.y += deltaTime/40;

        
        var x = camera.position.x;
        var z = camera.position.z;
        camera.position.x += x * Math.cos(0.00031) + z * Math.sin(0.00031);
        camera.position.z += z * Math.cos(0.00031) - x * Math.sin(0.00031);
        camera.lookAt(scene.position);

        

        // EventsControls.update();

        renderer.render( scene, camera );

      }
      function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

      }

      //

      function onDocumentMouseDown( event ) {

        event.preventDefault();

        document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        document.addEventListener( 'mouseup', onDocumentMouseUp, false );
        document.addEventListener( 'mouseout', onDocumentMouseOut, false );

        mouseXOnMouseDown = event.clientX - windowHalfX;
        targetRotationOnMouseDown = targetRotation;

      }

      function onDocumentMouseMove( event ) {

        mouseX = event.clientX - windowHalfX;

        targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;

      }

      function onDocumentMouseUp( event ) {

        document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
        document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
        document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

      }

      function onDocumentMouseOut( event ) {

        document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
        document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
        document.removeEventListener( 'mouseout', onDocumentMouseOut, false );

      }

      function onDocumentTouchStart( event ) {

        if ( event.touches.length === 1 ) {

          event.preventDefault();

          mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
          targetRotationOnMouseDown = targetRotation;

          this.mouseXOnMouseDown.currentHex = this.mouseXOnMouseDown.material.color.getHex();
          this.mouseXOnMouseDown.material.color.setHex( 'red' );

          console.log( 'the box at number ' + this.event.item + ' is select' );


        }

      }

      function onDocumentTouchMove( event ) {

        if ( event.touches.length === 1 ) {

          event.preventDefault();

          mouseX = event.touches[ 0 ].pageX - windowHalfX;
          targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;

        }

      }

      function resize() {
          camera.aspect = window.innerWidth/ window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize( window.innerWidth, window.innerHeight );
        }
    window.addEventListener( 'resize', resize, false );


var count = 0;
var delay=100;//1 seconds
var hammerDelay = 1000;
var mc = new Hammer.Manager(document.body);

var pinch = new Hammer.Pinch();
// add to the Manager
mc.add([pinch]);



// mc.on("pinch", function(ev) {
//         ev.preventDefault();


//         if( count == 0){
//             var shape = THREE.SceneUtils.createMultiMaterialObject( 
//             new THREE.OctahedronGeometry( 40, 0 ), 
//             multiMaterial );
//             shape.position.set(random(100, 0), random(100, 0), random(100, 0));
//             scene.add( shape );
//             count = 1;

       
//         }

//           setInterval(function(){
//     count = 0;

//   }, 2000);


// });





//       var container;
//       var width = window.innerWidth,
//           height = window.innerHeight,
//           camera, scene, renderer
//           aspectRatio = width / height,
//           near = 0.1,
//           far = 1000,
//           clock = new THREE.Clock(),
//           deltaTime = 0,
//           fov = 75;
          
 

//       var radius = 100, theta = 0;

//       init();
//       animate();

//       var maxParticles = 100,
//           particles,
//           particleMaterial,
//           particleSystem;

//       function init() {

//         if (window.WebGLRenderingContext) {
//           renderer = new THREE.WebGLRenderer({alpha: true});
//         } else {
//           renderer = new THREE.CanvasRenderer();
//         }
//         container = document.createElement( 'div' );
//         document.body.appendChild( container );
//         scene = new THREE.Scene();
  
//         // renderer.setClearColor( 0xf0f0f0 );
//         renderer.setSize( width, height );
//         renderer.sortObjects = false;
//         container.appendChild(renderer.domElement);


//         //add camera
//         var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
//         var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 10, FAR = 80000;
//         camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
//         camera.position.set(0,150,400);
//         scene.add(camera);
//         camera.lookAt(scene.position);
        
//         // // particles
//         // particleMaterial = new THREE.ParticleBasicMaterial({ color: 'white', size: 2 });
//         // particleSystem = new THREE.ParticleSystem(particles, particleMaterial);
//         // particleSystem.sortParticles = true;
//         // particles = new THREE.Geometry();
//         // for (var i = 0; i < maxParticles; i++) {
//         //   var particle = new THREE.Vector3(random(-100, 100), random(-100, 100), random(-100, 100));
//         //   particleSystem.vertices.push(particle);
//         // }
        
//         // scene.add(particleSystem);
            

//         //lights red and blue
//         var L1 = new THREE.PointLight(0xff0000, 1);
//         L1.position.x = 500;
//         L1.position.y = 400;
//         L1.position.z = 1000;

//         scene.add(L1);

//         var L3 = new THREE.PointLight(0x0000ff, 0.4);
//         L3.position.z = -500;
//         L3.position.x = 700;
//         L3.position.y = 400;

//         scene.add(L3);

//         //select controls
//         EventsControls = new EventsControls( camera, renderer.domElement );

//         EventsControls.attachEvent( 'mouseOver', function () {

//           this.container.style.cursor = 'pointer';

//           this.mouseOvered.currentHex = this.mouseOvered.material.color.getHex();
//           this.mouseOvered.material.color.setHex( 'red' );

//           console.log( 'the box at number ' + this.event.item + ' is select' );

//         });

//         EventsControls.attachEvent( 'mouseOut', function () {

//           this.container.style.cursor = 'auto';
//           this.mouseOvered.material.color.setHex( this.mouseOvered.currentHex );

//         });

//         function getRandom(min, max) {
//           return Math.random() * (max - min) + min;
//         }
        
//         var geometry = new THREE.OctahedronGeometry( getRandom(10, 30), 0 );

       
//         for ( var i = 0; i < 7; i ++ ) {

//           var object = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({
//               color: 'white', 
//               opacity: 0.5, 
//               transparent: true

//           }));
          


//           object.position.x = getRandom(-80, 50) + 70;
//           object.position.y = getRandom(-80, 50) + 70;
//           object.position.z = getRandom(-80, 50) + 70;

//           scene.add( object );
//           EventsControls.attach( object );

//           var wireobj = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({
//               color: 'black', 
//               wireframe: true, 
//               transparent: true
//           }));
          
//           wireobj.position.x = object.position.x;
//           wireobj.position.y = object.position.y;
//           wireobj.position.z = object.position.z;
//           scene.add( wireobj );
//           EventsControls.attach( object );

        

//       }

//           var shiny = new THREE.MeshPhongMaterial({
//               color: 'pink',
//               shading: THREE.FlatShading,
//               fog: false
              
//           });

//           dot = new THREE.Mesh(new THREE.TetrahedronGeometry(40, 3), shiny);

//           dot.position.x = 0;
//           dot.position.y = 0;
//           dot.position.z = 0;

//           scene.add(dot);
          

//     }


//       function animate() {

//         requestAnimationFrame( animate );

//         render();

//       }

//       function render() {
//         requestAnimationFrame(render);

//         // deltaTime = clock.getDelta();
//         // particleSystem.rotation.y += deltaTime/40;

        
//         var x = camera.position.x;
//         var z = camera.position.z;
//         camera.position.x = x * Math.cos(0.00001) + z * Math.sin(0.00001);
//         camera.position.z = z * Math.cos(0.00001) - x * Math.sin(0.00001);
//         camera.lookAt(scene.position);

//         EventsControls.update();

//         renderer.render( scene, camera );

//       }

//       function resize() {
//           camera.aspect = window.innerWidth/ window.innerHeight;
//           camera.updateProjectionMatrix();
//           renderer.setSize( window.innerWidth, window.innerHeight );
//         }
//     window.addEventListener( 'resize', resize, false );


// var count = 0;
// var delay=100;//1 seconds
// var hammerDelay = 1000;
// var mc = new Hammer.Manager(document.body);

// var pinch = new Hammer.Pinch();
// // add to the Manager
// mc.add([pinch]);



// mc.on("pinch", function(ev) {
//         ev.preventDefault();


//         if( count == 0){
//             var shape = THREE.SceneUtils.createMultiMaterialObject( 
//             new THREE.OctahedronGeometry( 40, 0 ), 
//             multiMaterial );
//             shape.position.set(random(100, 0), random(100, 0), random(100, 0));
//             scene.add( shape );
//             count = 1;

       
//         }

//           setInterval(function(){
//     count = 0;

//   }, 2000);


// });



