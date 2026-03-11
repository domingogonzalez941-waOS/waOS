lucide.createIcons();

// Navbar Blur
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('bg-dark/90', 'backdrop-blur-md', 'border-b', 'border-white/5', 'py-4');
        navbar.classList.remove('bg-transparent', 'py-6');
    } else {
        navbar.classList.remove('bg-dark/90', 'backdrop-blur-md', 'border-b', 'border-white/5', 'py-4');
        navbar.classList.add('bg-transparent', 'py-6');
    }
});

// Mouse global para el gradiente superior
let globalMouseX = window.innerWidth / 2;
let globalMouseY = window.innerHeight / 2;

window.addEventListener('mousemove', (e) => {
    globalMouseX = e.clientX;
    globalMouseY = e.clientY;
    const x = e.clientX - 400;
    const y = e.clientY - 400;
    const mouseGlow = document.getElementById('mouse-glow');
    if (mouseGlow) mouseGlow.style.transform = `translate(${x}px, ${y}px)`;
});

// Carrusel de texto Hero
const words = [
    { text: "n8n", color: "from-[#c4ff00] to-[#e2ff66]" },
    { text: "la IA", color: "from-cyan-400 to-blue-500" },
    { text: "Diseño Gráfico", color: "from-fuchsia-400 to-pink-500" },
    { text: "Bitcoin", color: "from-[#F7931A] to-yellow-500" },
    { text: "Ciberseguridad", color: "from-red-500 to-rose-400" }
];

let currentWordIndex = 0;
const dynamicWordEl = document.getElementById('dynamic-word');

setInterval(() => {
    currentWordIndex = (currentWordIndex + 1) % words.length;
    const item = words[currentWordIndex];
    dynamicWordEl.style.animation = 'none';
    dynamicWordEl.offsetHeight;
    dynamicWordEl.style.animation = null;
    dynamicWordEl.textContent = item.text + ".";
    dynamicWordEl.className = `inline-block text-transparent bg-clip-text bg-gradient-to-r ${item.color} word-transition drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]`;
}, 3000);

const initN8nMesh = () => {
    const container = document.getElementById('canvas-container-n8n');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Crear malla (Wireframe)
    const geometry = new THREE.PlaneGeometry(150, 150, 40, 40);

    // Guardar vértices originales para que la malla pueda volver a su forma
    const originalVertices = [];
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        originalVertices.push({ x: positions[i], y: positions[i + 1], z: positions[i + 2] });
    }

    const material = new THREE.MeshBasicMaterial({
        color: 0xc4ff00,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2.5;
    plane.position.y = -10;
    scene.add(plane);

    camera.position.z = 40;

    // Raycaster para interaccion con el mouse
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-1000, -1000); // Empezar fuera

    container.addEventListener('mousemove', (event) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
    });

    container.addEventListener('mouseleave', () => {
        mouse.x = -1000; mouse.y = -1000;
    });

    const animate = function () {
        requestAnimationFrame(animate);

        // Rotacion suave automatica
        plane.rotation.z += 0.0005;

        // Deformacion por Raycasting
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(plane);

        let targetZ = new Float32Array(positions.length / 3);

        if (intersects.length > 0) {
            const intersectPoint = intersects[0].point;

            // Calcular deformacion
            for (let i = 0; i < positions.length / 3; i++) {
                const vx = positions[i * 3];
                const vy = positions[i * 3 + 1];

                // Vector global del vértice
                const vector = new THREE.Vector3(vx, vy, 0);
                vector.applyMatrix4(plane.matrixWorld);

                const dist = vector.distanceTo(intersectPoint);
                const maxDist = 15;

                if (dist < maxDist) {
                    const force = (maxDist - dist) / maxDist;
                    targetZ[i] = force * 8; // Altura de deformación
                } else {
                    targetZ[i] = 0;
                }
            }
        }

        // Aplicar easing a los vértices (volver a posición suavemente)
        for (let i = 0; i < positions.length / 3; i++) {
            const currentZ = positions[i * 3 + 2];
            const tz = targetZ[i] || 0;
            positions[i * 3 + 2] += (tz - currentZ) * 0.1;
        }
        geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
};
initN8nMesh();
const initDesignCanvas = () => {
    const canvas = document.getElementById('canvas-diseno');
    const ctx = canvas.getContext('2d');

    let width, height;
    const size = 30; // tamaño del pixel
    let cols, rows;
    let grid = [];

    const resize = () => {
        const parent = canvas.parentElement;
        width = parent.clientWidth;
        height = parent.clientHeight;
        canvas.width = width;
        canvas.height = height;
        cols = Math.ceil(width / size);
        rows = Math.ceil(height / size);

        grid = new Array(cols * rows).fill(0); // 0 representa opacidad
    };

    window.addEventListener('resize', resize);
    resize();

    let mouseX = -1000;
    let mouseY = -1000;

    canvas.parentElement.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    canvas.parentElement.addEventListener('mouseleave', () => {
        mouseX = -1000; mouseY = -1000;
    });

    const draw = () => {
        ctx.clearRect(0, 0, width, height);

        // Efecto de rastro de mouse
        if (mouseX >= 0 && mouseY >= 0) {
            const col = Math.floor(mouseX / size);
            const row = Math.floor(mouseY / size);

            // Activar el pixel debajo del raton y adyacentes aleatoriamente
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const c = col + i;
                    const r = row + j;
                    if (c >= 0 && c < cols && r >= 0 && r < rows) {
                        if (Math.random() > 0.3) {
                            grid[c + r * cols] = 1; // Alpha máximo
                        }
                    }
                }
            }
        }

        // Dibujar y desvanecer grid
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const idx = i + j * cols;
                if (grid[idx] > 0.01) {
                    ctx.fillStyle = `rgba(217, 70, 239, ${grid[idx] * 0.3})`; // Fuchsia (tailwind)
                    ctx.fillRect(i * size, j * size, size - 1, size - 1);

                    // Desvanecimiento suave
                    grid[idx] -= 0.02;
                }
            }
        }

        requestAnimationFrame(draw);
    };
    draw();
};
initDesignCanvas();
const initCyberGlobe = () => {
    const container = document.getElementById('canvas-container-cyber');
    const scene = new THREE.Scene();
    // Camara ajustada para dejar el globo un poco a un lado
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Contenedor principal para rotar todo junto
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Esfera de Puntos (El planeta)
    const radius = 20;
    const segments = 50;
    const geometry = new THREE.SphereGeometry(radius, segments, segments);

    // Eliminar caras, dejar solo puntos
    const pointsMaterial = new THREE.PointsMaterial({
        color: 0x333333,
        size: 0.2,
        transparent: true,
        opacity: 0.8
    });
    const globePoints = new THREE.Points(geometry, pointsMaterial);
    globeGroup.add(globePoints);

    // Variables de Ataques (Líneas rojas)
    const attacks = [];
    const attackMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, transparent: true, opacity: 1 });

    // Función matemática para obtener un punto en la esfera
    function getPointOnSphere(r) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        return new THREE.Vector3(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        );
    }

    // Crear un ataque simulado
    function createAttack() {
        const start = getPointOnSphere(radius);
        const end = getPointOnSphere(radius);

        // Punto medio elevado para crear curva
        const mid = start.clone().lerp(end, 0.5).normalize().multiplyScalar(radius * 1.3);

        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        // Menos puntos para apariencia más de "vector" técnico
        const points = curve.getPoints(20);
        const attackGeo = new THREE.BufferGeometry().setFromPoints(points);

        const line = new THREE.Line(attackGeo, attackMaterial.clone());
        globeGroup.add(line);

        attacks.push({
            mesh: line,
            life: 1.0 // 1 a 0
        });
    }

    // Posicionar camara
    camera.position.z = 60;
    camera.position.x = 20; // Desplazar globo a la izquierda

    // Interacción del mouse para rotar el globo
    let mouseX = 0;
    let mouseY = 0;
    container.addEventListener('mousemove', (event) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouseY = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
    });

    let frame = 0;
    const animate = function () {
        requestAnimationFrame(animate);

        // Rotación base automática + influencia del mouse
        globeGroup.rotation.y += 0.002 + (mouseX * 0.01);
        globeGroup.rotation.x += (mouseY * 0.01);

        // Generar ataques aleatorios
        frame++;
        if (frame % 30 === 0) { // Cada cierto número de frames
            createAttack();
        }

        // Animar ataques (desvanecer y eliminar)
        for (let i = attacks.length - 1; i >= 0; i--) {
            let atk = attacks[i];
            atk.life -= 0.015;
            atk.mesh.material.opacity = atk.life;

            if (atk.life <= 0) {
                globeGroup.remove(atk.mesh);
                atk.mesh.geometry.dispose();
                atk.mesh.material.dispose();
                attacks.splice(i, 1);
            }
        }

        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
};
initCyberGlobe();
const initBitcoinNetwork = () => {
    const container = document.getElementById('canvas-container-bitcoin');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Grupo para la red de nodos
    const networkGroup = new THREE.Group();
    scene.add(networkGroup);

    // Parámetros de la red
    const nodeCount = 150;
    const nodes = [];
    const maxDistance = 25; // Distancia para crear conexión

    // Materiales Bitcoin
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xF7931A }); // Naranja Bitcoin
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xF7931A,
        transparent: true,
        opacity: 0.15
    });

    // Geometría del nodo (pequeña esfera/punto)
    const nodeGeometry = new THREE.SphereGeometry(0.3, 8, 8);

    // Crear nodos
    for (let i = 0; i < nodeCount; i++) {
        const mesh = new THREE.Mesh(nodeGeometry, nodeMaterial);

        // Distribuir en un volumen amplio
        mesh.position.x = (Math.random() - 0.5) * 120;
        mesh.position.y = (Math.random() - 0.5) * 80;
        mesh.position.z = (Math.random() - 0.5) * 80;

        // Añadir velocidad de movimiento
        mesh.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1
            ),
            originalPos: mesh.position.clone() // Para que no se alejen infinitamente
        };

        networkGroup.add(mesh);
        nodes.push(mesh);
    }

    // Variables para líneas
    const linesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(nodeCount * nodeCount * 3); // Tamaño máximo posible
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const linesMesh = new THREE.LineSegments(linesGeometry, lineMaterial);
    networkGroup.add(linesMesh);

    camera.position.z = 100;
    camera.position.x = -30; // Desplazar red un poco a la derecha

    // Interacción del Mouse (Repulsión)
    const mouse = new THREE.Vector2(-1000, -1000);
    const raycaster = new THREE.Raycaster();
    // Plano invisible para detectar la posición exacta del ratón en el espacio 3D
    const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
    const planeMaterial = new THREE.MeshBasicMaterial({ visible: false });
    const interactPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(interactPlane);

    let intersectPoint = new THREE.Vector3();

    container.addEventListener('mousemove', (event) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

        // Calcular intersección con el plano
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(interactPlane);
        if (intersects.length > 0) {
            intersectPoint.copy(intersects[0].point);
        }
    });

    container.addEventListener('mouseleave', () => {
        mouse.x = -1000; mouse.y = -1000;
        intersectPoint.set(-1000, -1000, 0);
    });

    const animate = function () {
        requestAnimationFrame(animate);

        // Rotación muy suave de toda la red
        networkGroup.rotation.y += 0.001;
        networkGroup.rotation.z += 0.0005;

        let vertexIndex = 0;
        const positions = linesMesh.geometry.attributes.position.array;

        // Animar Nodos y Conexiones
        for (let i = 0; i < nodes.length; i++) {
            const nodeA = nodes[i];

            // Movimiento natural
            nodeA.position.add(nodeA.userData.velocity);

            // Rebote suave si se alejan mucho de su centro original
            if (nodeA.position.distanceTo(nodeA.userData.originalPos) > 20) {
                nodeA.userData.velocity.multiplyScalar(-1);
            }

            // Interacción Mouse: Repulsión magnética
            if (mouse.x !== -1000) {
                // Transformar punto de intersección a espacio local del grupo
                const localIntersect = intersectPoint.clone().applyMatrix4(new THREE.Matrix4().copy(networkGroup.matrixWorld).invert());
                const distToMouse = nodeA.position.distanceTo(localIntersect);

                if (distToMouse < 30) {
                    const repulsionForce = (30 - distToMouse) * 0.05;
                    const dir = new THREE.Vector3().subVectors(nodeA.position, localIntersect).normalize();
                    nodeA.position.add(dir.multiplyScalar(repulsionForce));
                }
            }

            // Encontrar conexiones cercanas
            for (let j = i + 1; j < nodes.length; j++) {
                const nodeB = nodes[j];
                const distance = nodeA.position.distanceTo(nodeB.position);

                if (distance < maxDistance) {
                    positions[vertexIndex++] = nodeA.position.x;
                    positions[vertexIndex++] = nodeA.position.y;
                    positions[vertexIndex++] = nodeA.position.z;

                    positions[vertexIndex++] = nodeB.position.x;
                    positions[vertexIndex++] = nodeB.position.y;
                    positions[vertexIndex++] = nodeB.position.z;
                }
            }
        }

        // Actualizar líneas
        linesMesh.geometry.setDrawRange(0, vertexIndex / 3);
        linesMesh.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
};
initBitcoinNetwork();
