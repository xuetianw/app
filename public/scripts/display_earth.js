/**
 * This JavaScript file has an additional feature of indicating country borders by
 * extracting data from the countries.geojson file, and the functionality where the
 * counties are clickable using a ray caster for song and book display based on a
 * specific location.
 *
 * This file is used for the song and book display only.
 */

// Import the function that must be invoked when a country is clicked on the Earth.
// Used when setting up the ray caster.
import displaySongsBooks from "./book_song_display.js";

let sceneEarth;
let cameraEarth;
let rendererEarth;
function setup() {

    // Obtaining the canvas element where the graphics resides.
    const canvasContainer = document.querySelector('#canvasContainer');

    // Creating the scene, camera, and the renderer.
    sceneEarth = new THREE.Scene();

    cameraEarth = new THREE.PerspectiveCamera(
        75, canvasContainer.offsetWidth/canvasContainer.offsetHeight, 0.1, 1000);
    cameraEarth.position.z = 4.2;

    rendererEarth = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.querySelector('#figureCanvas')
    });

    rendererEarth.setClearColor(0x000000);
    rendererEarth.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
    rendererEarth.setPixelRatio(window.devicePixelRatio);

    // Resize the window as the user alters the width and height of the window.
    window.addEventListener('resize', () => {
        rendererEarth.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
        cameraEarth.aspect = canvasContainer.offsetWidth / canvasContainer.offsetHeight;

        cameraEarth.updateProjectionMatrix();
    });
}

let sphere;
function createSphere() {

    // Loading textures from the images folder.
    const loader = new THREE.TextureLoader();
    const baseEarthTexture = loader.load('../images/8k_earth_daymap.jpeg');
    const cloudTexture = loader.load('../images/8k_earth_clouds.jpeg');
    const normalMap = loader.load('../images/8k_earth_normal_map.jpg');

    // Creating a shader material to blend the two textures.
    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            earthTexture: { value: baseEarthTexture },
            cloudTexture: { value: cloudTexture },
            normalMap: { value: normalMap}
        },
        vertexShader: document.getElementById('vertexShaderEarth').textContent,
        fragmentShader: document.getElementById('fragmentShaderEarth').textContent
    });

    // Creating the sphere.
    sphere = new THREE.Mesh(new THREE.SphereGeometry(2, 50, 50), shaderMaterial);

    // Add the sphere to the scene.
    sceneEarth.add(sphere);
}

let atmosphere;
function createEnvironment() {

    // Creating a shader material to blend the two textures.
    const shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: document.getElementById('vertexShaderAtm').textContent,
        fragmentShader: document.getElementById('fragmentShaderAtm').textContent,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
    });

    // Creating the atmosphere.
    atmosphere = new THREE.Mesh(new THREE.SphereGeometry(2, 50, 50), shaderMaterial);

    // Scale the atmosphere as compared to the sphere.
    atmosphere.scale.set(1.1, 1.1, 1.1);

    // Add the atmosphere to the scene.
    sceneEarth.add(atmosphere);
}

// This mouse object holds the current x and y coordinates of the mouse.
let mouse = {
    x: 0,
    y: 0
}
function eventListener() {
    // Only listen for the mouse coordinates if the mouse is pressed.
    document.addEventListener('mousemove', (event) => {
        if (event.buttons === 1) {
            mouse.x += event.movementY;
            mouse.y += event.movementX;
        }
    });
}

let group;
function addMovementToEarth() {
    group = new THREE.Group();
    group.add(sphere);
    sceneEarth.add(group);
}

function addBackgroundStars() {
    let starGeometry = new THREE.BufferGeometry();

    // Defining an array to hold the positions of stars
    const starPositions = [];

    // Generate 8000 stars in random positions in the scene.
    for (let i = 0; i < 8000; i++) {
        // Calculate a random position for each star.
        const x = (Math.random() - 0.5) * 35;
        const y = (Math.random() - 0.5) * 35;
        const z = -5;
        starPositions.push(x, y, z);
    }

    const positions = new Float32Array(starPositions);
    starGeometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    let starMaterial = new THREE.ShaderMaterial({
        vertexShader: `
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
        fragmentShader: `
        void main() {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
    `,
        blending: THREE.AdditiveBlending,
        transparent: false
    })

    let starPoint = new THREE.Points(starGeometry, starMaterial);
    sceneEarth.add(starPoint);
}

function fetchData() {
    return new Promise((resolve, reject) => {
        d3.json("../files/countries.geojson").then(function(data) {
            const polygonCoords = [];
            const countryNames = [];

            const features = data.features;

            features.forEach(function(feature) {
                const geometry = feature.geometry;
                const properties = feature.properties;

                // Populate the country names.
                const countryName = properties.ADMIN;

                if (geometry.type === "MultiPolygon") {
                    geometry.coordinates.forEach(function(polygon) {
                        polygonCoords.push(polygon[0]);
                        countryNames.push(countryName);
                    });
                }
            });

            resolve([polygonCoords, countryNames]);
        }).catch(error => {
            reject(error);
        });
    });
}

/** Converts longitude and latitude to a cartesian coordinates on a sphere of radius 2
 * @param lon
 * @param lat
 * @param radius
 * @returns {Vector3}
 */
function latLongToVector3(lon, lat, radius) {
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (lon + 180) * Math.PI / 180;

    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
}

function createMeshFromPolygon(polygonCoords, countryNames) {
    // Counter to go through countryNames array to add the country name to the corresponding mesh.
    let i = 0;

    polygonCoords.forEach(polygon => {
        const flatCoords = polygon.reduce((acc, val) => {
            const vertex = latLongToVector3(val[0], val[1], 2);
            return acc.concat(vertex.toArray());
        }, []);

        // Create buffer attributes
        const positions = new Float32Array(flatCoords);

        // Create buffer geometry
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // Create the mesh
        const material = new THREE.LineBasicMaterial({ color: 0xffffff, depthTest: true});
        const mesh = new THREE.Line(geometry, material);

        // Add the country name to the corresponding mesh.
        mesh.userData.countryName = countryNames[i];
        i++;

        sphere.add(mesh);
    });
}

function addTheRayCaster() {
    let rayCaster = new THREE.Raycaster();
    let mouseVector = new THREE.Vector2();

    // Add click event listener
    rendererEarth.domElement.addEventListener('contextmenu', onMouseClick, false);

    function onMouseClick(event) {
        event.preventDefault();

        // Calculate mouse position in normalized device coordinates (NDC)
        mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update the picking ray with the camera and mouse position
        rayCaster.setFromCamera(mouseVector, cameraEarth);

        // Calculate intersections
        const intersects = rayCaster.intersectObjects(sphere.children, true);

        // If there are intersections, log the country name
        if (intersects.length > 0) {
            const countryName = intersects[0].object.userData.countryName;

            // Invoke the displaySongsBooks from book_song_display.js to modify the table.
            displaySongsBooks(countryName);
        }
    }
}

function determineCountry() {

    fetchData().then(([polygonCoords, countryNames]) => {
        // After extracting the data create THREE.js meshes using the coordinates,
        // and add them to the sphere representing the earth.
        createMeshFromPolygon(polygonCoords, countryNames);

        // Adding the rayCaster.
        addTheRayCaster();

    }).catch(error => {
        // Handle errors
        console.error('Error fetching data:', error);
    });

}

function render() {
    requestAnimationFrame(render);
    rendererEarth.render(sceneEarth, cameraEarth);

    // Add a constant rotation to the earth.
    sphere.rotation.y += 0.0003;

    // Add movement to the earth based on the mouse coordinates.
    group.rotation.y = mouse.y * 0.002;
    group.rotation.x = mouse.x * 0.002;
}

function setupEarth() {
    // Set up the scene, perspective camera, and the renderer using Three.js.
    setup();

    // Creating a sphere to represent the globe.
    createSphere();

    // Creating the atmosphere surrounding environment.
    createEnvironment();

    // Adding event listener for mouse move.
    eventListener();

    // Adding rotation to the earth base on mouse movement.
    addMovementToEarth();

    // Adding background stars.
    addBackgroundStars();

    // Determine the county which was clicked.
    determineCountry();

    render();
}

document.addEventListener('DOMContentLoaded', setupEarth);