
let sceneStar;
let cameraStar;
let rendererStar;
function setup() {

    // Obtaining the  element where the graphics resides.
    const articleContainer = document.querySelector('#articleContainer');

    // Creating the scene, camera, and the renderer.
    sceneStar = new THREE.Scene();

    cameraStar = new THREE.PerspectiveCamera(
        75, articleContainer.offsetWidth/articleContainer.offsetHeight, 0.1, 1000);
    cameraStar.position.z = 4.2;

    rendererStar = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.querySelector('#articleCanvas')
    });

    rendererStar.setClearColor(0x000000);
    rendererStar.setSize(articleContainer.offsetWidth, articleContainer.offsetHeight);
    rendererStar.setPixelRatio(window.devicePixelRatio);

    // Resize the window as the user alters the width and height of the window.
    window.addEventListener('resize', () => {
        rendererStar.setSize(articleContainer.offsetWidth, articleContainer.offsetHeight);
        cameraStar.aspect = articleContainer.offsetWidth / articleContainer.offsetHeight;

        cameraStar.updateProjectionMatrix();
    });
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
    sceneStar.add(starPoint);
}

function render() {
    requestAnimationFrame(render);
    rendererStar.render(sceneStar, cameraStar);
}


function setupStars() {
    // Set up the scene, perspective camera, and the renderer using Three.js.
    setup();

    // Adding background stars.
    addBackgroundStars();

    render();
}

document.addEventListener('DOMContentLoaded', setupStars);