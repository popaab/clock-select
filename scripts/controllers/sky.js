var width = window.innerWidth,
    height = window.innerHeight,
    scene = new THREE.Scene(),
    clock = new THREE.Clock(),
    deltaTime = 0,
    fov = 75,
    aspectRatio = width / height,
    near = 0.1,
    far = 1000,
    camera,
    renderer,
    maxParticles = 200,
    particles,
    particleMaterial,
    particleSystem;

  // renderer
  if (window.WebGLRenderingContext) {
    renderer = new THREE.WebGLRenderer({alpha: true});
  } else {
    renderer = new THREE.CanvasRenderer();
  }
  renderer.setSize( width, height );
  document.body.appendChild( renderer.domElement );

  var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
  var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
  camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  camera.position.set(0,150,400);
  camera.lookAt(scene.position);  

    // // camera
    // camera = new THREE.PerspectiveCamera( fov, aspectRatio, near, far );
    // camera.position.x = 0;
    // camera.position.y = 0;
    // camera.position.z = 300;
    // camera.lookAt(new THREE.Vector3(0, 0, 0));

    // light = new THREE.DirectionalLight(0xffffff);
    // light.position.set(0, 0, 1);
    // scene.add(light);
    
    // particles
    particles = new THREE.Geometry();
    for (var i = 0; i < maxParticles; i++) {
      var particle = new THREE.Vector3(random(-400, 400), random(-200, 200), random(-1000, 100));
      particles.vertices.push(particle);
    }
    particleMaterial = new THREE.ParticleBasicMaterial({ color: 0xeeeeee, size: 2 });
    particleSystem = new THREE.ParticleSystem(particles, particleMaterial);
    particleSystem.sortParticles = true;
    scene.add(particleSystem);

    var faceIndices = ['a', 'b', 'c', 'd'];
    var color, f, f2, f3, p, n, vertexIndex, 

    radius = 200,
    geometry = new THREE.IcosahedronGeometry(radius, 1);

    var materials = [
        new THREE.MeshLambertMaterial({
            color: 'white',
            shading: THREE.FlatShading,
            vertexColors: THREE.VertexColors
        }),
        new THREE.MeshBasicMaterial({
            color: 'white',
            shading: THREE.FlatShading,
            wireframe: true,
            transparent: true

        })
    ];

    // group = THREE.SceneUtils.createMultiMaterialObject(geometry, materials);
    // group.position.x = 0;
    // group.position.z = -1000;
    // group.rotation.x = 0;
    // scene.add(group);

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

    var shiny = new THREE.MeshPhongMaterial({
    color: 'pink',
    shading: THREE.FlatShading,
   
   
    fog: false
  });

  var shiny_red = new THREE.MeshPhongMaterial({
    color: 'red',
    shading: THREE.FlatShading,

    
  
  });
  // Using wireframe materials to illustrate shape details.
  var darkMaterial = new THREE.MeshBasicMaterial( { color: 'white', opacity: 0.5, transparent: true} );
  var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 'white', wireframe: true, transparent: true } ); 
  var multiMaterial = [ darkMaterial, wireframeMaterial ]; 

  // icosahedron
  // var shape = new THREE.Mesh(new THREE.IcosahedronGeometry( 40, 0 ), // radius, subdivisions
  //   shiny_red);
  // shape.position.set(-100, 50, 400);
  // scene.add( shape );

  // octahedron
  var shape = THREE.SceneUtils.createMultiMaterialObject( 
    new THREE.OctahedronGeometry( 40, 0 ), 
    multiMaterial );
    shape.position.set(30, 100, 100);
    scene.add( shape );

  // tetrahedron
  // var shape = new THREE.Mesh(new THREE.TetrahedronGeometry( 40, 0 ), shiny);
  // shape.position.set(100, 200, 400);
  // scene.add( shape );

  dot = new THREE.Mesh(new THREE.TetrahedronGeometry(60, 3), shiny);

  scene.add(dot);

var count = 0;
var delay=100;//1 seconds
var hammerDelay = 1000;


    // render loop
    function render() {
      requestAnimationFrame(render);
       var x = camera.position.x;
        var z = camera.position.z;
        camera.position.x = x * Math.cos(0.005) + z * Math.sin(0.005);
        camera.position.z = z * Math.cos(0.005) - x * Math.sin(0.005);
        camera.lookAt(scene.position);

      deltaTime = clock.getDelta();
      particleSystem.rotation.y += deltaTime/40;
    console.log(count);
      renderer.render(scene, camera);
    }
    render();

    // random helper
    function random( min, max ) {
      if ( isNaN(max) ) {
        max = min;
        min = 0;
      }
      return Math.random() * ( max - min ) + min;
    }

    // resize
    function resize() {
      camera.aspect = window.innerWidth/ window.innerHeight;
      camera.updateProjectionMatrix();
      shape.position.set(100, 50, -400);

      renderer.setSize( window.innerWidth, window.innerHeight );
    }
    window.addEventListener( 'resize', resize, false );


    //main clock
    var Clock = (function(){  
    var exports = function(element) {
    this._element = element;
    var html = '';
    for (var i=0;i<6;i++) {
      html += '<span>&nbsp;</span>';
    }
    this._element.innerHTML = html;
    this._slots = this._element.getElementsByTagName('span');
    this._tick();
  };
  exports.prototype = {
    _tick:function() {
      var time = new Date();
      this._update(this._pad(time.getHours()) + this._pad(time.getMinutes()) + this._pad(time.getSeconds()));
      var self = this;
      setTimeout(function(){
        self._tick();
      },1000);
    },
    _pad:function(value) {
      return ('0' + value).slice(-2);
    },
    _update:function(timeString) {
      var i=0,l=this._slots.length,value,slot,now;
      for (;i<l;i++) {
        value = timeString.charAt(i);
        slot = this._slots[i];
        now = slot.dataset.now;
        if (!now) {
          slot.dataset.now = value;
          slot.dataset.old = value;
          continue;
        }
        if (now !== value) {
          this._flip(slot,value);
        }
      }
    },
    _flip:function(slot,value) {
      slot.classList.remove('flip');
      slot.dataset.old = slot.dataset.now;
      slot.dataset.now = value;
      slot.classList.add('flip');
    }
  };
  return exports;
}());
var i=0,clocks = document.querySelectorAll('.clock'),l=clocks.length;
for (;i<l;i++) {
  new Clock(clocks[i]);
}


var mc = new Hammer.Manager(document.body);

var pinch = new Hammer.Pinch();
// add to the Manager
mc.add([pinch]);



mc.on("pinch", function(ev) {
        ev.preventDefault();


        if( count == 0){
            var shape = THREE.SceneUtils.createMultiMaterialObject( 
            new THREE.OctahedronGeometry( 40, 0 ), 
            multiMaterial );
            shape.position.set(random(100, 0), random(100, 0), random(100, 0));
            scene.add( shape );
            count = 1;

       
        }

          setInterval(function(){
    count = 0;

  }, 2000);


});