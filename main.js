(function() {
    var stats = new Stats();
    //FPS - panel 0
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var scene, camera;
    var geom = new THREE.PlaneGeometry(10,10,1,1);
    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000
    });

    var vert = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

    var frag = `
uniform sampler2D tex;
varying vec2 vUv;

void main() {
  gl_FragColor = texture2D(tex, vUv);
}
`;

    material = new THREE.ShaderMaterial({
        uniforms: {
            tex: {}
        },
        fragmentShader: frag,
        vertexShader: vert
    });
    var mesh = new THREE.Mesh(geom, material);

    new THREE.TextureLoader().load(
        './rock_colormap.bmp',
        function(texture) {
            material.uniforms.tex.value = texture;
        },
        function(p) {
            console.log('progress');
        },
        function(err) {
            console.log(err);
        }
    );

    scene = new THREE.Scene();
    scene.add(mesh);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 500);
    camera.position.z = 10;

    // Enable orbital controls on the view
    var controls = new THREE.OrbitControls(camera);

    var totRot = 0;
    function render() {
        stats.begin();
        renderer.render(scene, camera);

        // Rotate the plane
        totRot += THREE.Math.degToRad(1);
        scene.rotation.x = THREE.Math.degToRad(35) * Math.sin(totRot);
        scene.rotation.y = THREE.Math.degToRad(35) * Math.sin(totRot);
        stats.end();
        requestAnimationFrame(render);
    }
    render();
})();
