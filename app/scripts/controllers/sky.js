      var container, stats;
      var camera, scene, renderer;

      var radius = 100, theta = 0;

      init();
      animate();

      function init() {

        container = document.createElement( 'div' );
        document.body.appendChild( container );

        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor( 0xf0f0f0 );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.sortObjects = false;
        container.appendChild(renderer.domElement);

        var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
        var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 10, FAR = 80000;
        camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
        camera.position.set(0,250,400);
        
        scene = new THREE.Scene();


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


        EventsControls = new EventsControls( camera, renderer.domElement );

        EventsControls.attachEvent( 'mouseOver', function () {

          this.container.style.cursor = 'pointer';

          this.mouseOvered.currentHex = this.mouseOvered.material.emissive.getHex();
          this.mouseOvered.material.emissive.setHex( 0xff0000 );

          console.log( 'the box at number ' + this.event.item + ' is select' );

        });

        EventsControls.attachEvent( 'mouseOut', function () {

          this.container.style.cursor = 'auto';
          this.mouseOvered.material.emissive.setHex( this.mouseOvered.currentHex );

        });

        var geometry = new THREE.TetrahedronGeometry(30, 3);

        for ( var i = 0; i < 3; i ++ ) {

          var object = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({
          color: 'pink',
          shading: THREE.FlatShading,
          fog: false

        }));

          object.position.x = Math.random() * 200;
          object.position.y = Math.random() * 200;
          object.position.z = Math.random() * 220;

          scene.add( object );
          EventsControls.attach( object );

        }

      }

      function animate() {

        requestAnimationFrame( animate );

        render();

      }

      function render() {

        // theta += 0.1;

        // camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
        // camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
        // camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
        // camera.lookAt(scene.position);
        requestAnimationFrame(render);
        var x = camera.position.x;
        var z = camera.position.z;
        camera.position.x = x * Math.cos(0.005) + z * Math.sin(0.00025);
        camera.position.z = z * Math.cos(0.005) - x * Math.sin(0.00025);
        camera.lookAt(scene.position);

        EventsControls.update();

        renderer.render( scene, camera );

      }
