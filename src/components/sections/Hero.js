import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { ArrowRight, CheckCircle, Check } from "lucide-react";

function initThreeJS(container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050505);

  const camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({
    alpha: false,
    antialias: true,
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  container.appendChild(renderer.domElement);

  // Array untuk menyimpan semua objects dan outline meshes
  const objects = [];
  const outlineMeshes = [];

  // Hitung pusat dari semua objek
  const center = new THREE.Vector3();

  // Point light yang lebih cerah dengan efek yang lebih menarik
  const pointLight = new THREE.PointLight(0xffffff, 200, 50, 1.5);
  pointLight.position.set(0, 0, 5);
  camera.add(pointLight);
  scene.add(camera);

  // Ambient light untuk pencahayaan global yang lebih baik
  const ambientLight = new THREE.AmbientLight(0x444444, 0.6);
  scene.add(ambientLight);

  // Tambahkan directional light untuk memberikan dimensi
  const directionalLight = new THREE.DirectionalLight(0x6699ff, 0.5);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // Tambahkan hemisphere light untuk efek yang lebih natural
  const hemisphereLight = new THREE.HemisphereLight(0x443388, 0x228855, 0.4);
  scene.add(hemisphereLight);

  // Buat environment map untuk refleksi
  const envMap = createEnvironmentMap();

  const createFloorGrid = () => {
    const gridSize = 300;
    const gridDivisions = 80;
    const gridColor = 0x222222;
    const gridCenterColor = 0x444444;

    // Buat geometry grid manual untuk kontrol penuh
    const gridGeometry = new THREE.BufferGeometry();
    const gridMaterial = new THREE.LineBasicMaterial({
      color: gridColor,
      opacity: 0.2,
      transparent: true,
    });

    const gridCenterMaterial = new THREE.LineBasicMaterial({
      color: gridCenterColor,
      opacity: 0.3,
      transparent: true,
    });

    // Array untuk menyimpan vertices
    const vertices = [];
    const centerVertices = [];

    const step = gridSize / gridDivisions;
    const halfSize = gridSize / 2;

    // Buat garis horizontal dan vertikal
    for (let i = 0; i <= gridDivisions; i++) {
      const pos = -halfSize + i * step;

      // Garis vertikal
      if (i === gridDivisions / 2) {
        // Garis tengah
        centerVertices.push(pos, -15, -halfSize);
        centerVertices.push(pos, -15, halfSize);
      } else {
        // Garis biasa
        vertices.push(pos, -15, -halfSize);
        vertices.push(pos, -15, halfSize);
      }

      // Garis horizontal
      if (i === gridDivisions / 2) {
        // Garis tengah
        centerVertices.push(-halfSize, -15, pos);
        centerVertices.push(halfSize, -15, pos);
      } else {
        // Garis biasa
        vertices.push(-halfSize, -15, pos);
        vertices.push(halfSize, -15, pos);
      }
    }

    // Set vertices untuk geometry
    gridGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    const centerGridGeometry = new THREE.BufferGeometry();
    centerGridGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(centerVertices, 3)
    );

    // Buat line segments
    const gridLines = new THREE.LineSegments(gridGeometry, gridMaterial);
    const centerGridLines = new THREE.LineSegments(
      centerGridGeometry,
      gridCenterMaterial
    );

    // Grid kedua untuk efek yang lebih menarik (lebih sparse)
    const gridGeometry2 = new THREE.BufferGeometry();
    const gridMaterial2 = new THREE.LineBasicMaterial({
      color: gridCenterColor,
      opacity: 0.1,
      transparent: true,
    });

    const vertices2 = [];
    const step2 = gridSize / (gridDivisions / 5);

    for (let i = 0; i <= gridDivisions / 5; i++) {
      const pos = -halfSize + i * step2;

      // Garis vertikal
      vertices2.push(pos, -15.1, -halfSize);
      vertices2.push(pos, -15.1, halfSize);

      // Garis horizontal
      vertices2.push(-halfSize, -15.1, pos);
      vertices2.push(halfSize, -15.1, pos);
    }

    gridGeometry2.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices2, 3)
    );
    const gridLines2 = new THREE.LineSegments(gridGeometry2, gridMaterial2);

    // Tambahkan semua grid ke scene
    scene.add(gridLines);
    scene.add(centerGridLines);
    scene.add(gridLines2);

    return [gridLines, centerGridLines, gridLines2];
  };

  const floorGrids = createFloorGrid();
  // ========== END FLOOR GRID ==========

  // Geometries yang lebih beragam dan menarik
  const geometries = [
    new THREE.BoxGeometry(0.8, 0.8, 0.8),
    new THREE.SphereGeometry(0.6, 64, 64),
    new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
    new THREE.ConeGeometry(0.6, 1.2, 32),
    new THREE.TorusGeometry(0.6, 0.3, 32, 64),
    new THREE.OctahedronGeometry(0.7, 2), // Meningkatkan detail
    new THREE.TetrahedronGeometry(0.8, 2), // Meningkatkan detail
    new THREE.IcosahedronGeometry(0.6, 2), // Meningkatkan detail
    new THREE.DodecahedronGeometry(0.7, 1), // Meningkatkan detail
    new THREE.TorusKnotGeometry(0.5, 0.2, 128, 24, 2, 3), // Meningkatkan detail
    new THREE.CapsuleGeometry(0.4, 1, 12, 24), // Meningkatkan detail
    new THREE.RingGeometry(0.4, 0.7, 32), // Meningkatkan detail
  ];

  // Warna-warna pastel dan cerah yang lebih menarik
  const colors = [
    0xff6b6b, 0x4ecdc4, 0x45b7d1, 0xf9ca24, 0xf0932b, 0xeb4d4b, 0x6c5ce7,
    0xa29bfe, 0xfd79a8, 0x00cec9, 0x0984e3, 0x00b894, 0xe17055, 0xd63031,
    0xfdcb6e, 0xe84393, 0x6c5ce7, 0x00cec9, 0x81ecec, 0x55efc4,
  ];

  // Jumlah objek
  const TOTAL_OBJECTS = 45;

  // Material khusus untuk efek yang lebih halus seperti Spline
  const materials = colors.map((color) => {
    return new THREE.MeshPhysicalMaterial({
      color: color,
      metalness: 0.4 + Math.random() * 0.4,
      roughness: 0.1 + Math.random() * 0.2,
      transparent: true,
      opacity: 0.9 + Math.random() * 0.1,
      clearcoat: 0.5 + Math.random() * 0.5,
      clearcoatRoughness: 0.1 + Math.random() * 0.2,
      reflectivity: 0.5 + Math.random() * 0.3,
      envMap: envMap,
      envMapIntensity: 0.5 + Math.random() * 0.5,
      emissive: new THREE.Color(color).multiplyScalar(0.1),
      emissiveIntensity: 0.2 + Math.random() * 0.3,
    });
  });

  // Material untuk outline (warna putih)
  const outlineMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.BackSide, // Render sisi belakang untuk outline effect
  });

  // Loop untuk membuat objects
  for (let i = 0; i < TOTAL_OBJECTS; i++) {
    // Pilih geometry dan material secara random
    const randomGeometry =
      geometries[Math.floor(Math.random() * geometries.length)];
    const randomMaterial =
      materials[Math.floor(Math.random() * materials.length)].clone();

    // Beberapa objek menggunakan wireframe untuk variasi
    if (Math.random() > 0.9) {
      // Mengurangi persentase wireframe untuk tampilan lebih halus
      randomMaterial.wireframe = true;
      randomMaterial.emissive = new THREE.Color(
        randomMaterial.color
      ).multiplyScalar(0.3);
      randomMaterial.wireframeLinewidth = 1;
    }

    const mesh = new THREE.Mesh(randomGeometry, randomMaterial);

    // Buat outline mesh
    const outlineMesh = new THREE.Mesh(randomGeometry, outlineMaterial);
    outlineMesh.scale.multiplyScalar(1.05); // Sedikit lebih besar dari mesh asli
    outlineMesh.visible = true; // Default visible

    // Posisi RANDOM dalam area yang lebih luas
    mesh.position.set(
      (Math.random() - 0.5) * 70,
      (Math.random() - 0.5) * 25,
      (Math.random() - 0.5) * 40
    );

    // Tambahkan posisi ke pusat untuk menghitung rata-rata nanti
    center.add(mesh.position);

    // Outline mengikuti posisi mesh utama
    outlineMesh.position.copy(mesh.position);

    // Random scale untuk variasi ukuran yang lebih menarik
    const randomScale = 0.5 + Math.random() * 1.2;
    mesh.scale.setScalar(randomScale);
    outlineMesh.scale.setScalar(randomScale * 1.05); // Outline sedikit lebih besar

    // Random rotation awal
    mesh.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );
    outlineMesh.rotation.copy(mesh.rotation);

    mesh.userData = {
      originalPosition: mesh.position.clone(),
      originalScale: mesh.scale.clone(),
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02,
      },
      floatSpeed: 0.3 + Math.random() * 1.5,
      floatAmplitude: 0.4 + Math.random() * 1.0,
      driftSpeed: 0.1 + Math.random() * 0.4,
      pulseSpeed: 0.5 + Math.random() * 1.0,
      pulseAmplitude: 0.1 + Math.random() * 0.2,
      outlineVisible: Math.random() > 0.3,
    };

    // Atur visibility outline
    outlineMesh.visible = mesh.userData.outlineVisible;

    // Tambahkan ke scene dan array
    scene.add(mesh);
    scene.add(outlineMesh);
    objects.push(mesh);
    outlineMeshes.push(outlineMesh);
  }

  // Hitung pusat dari semua objek
  center.divideScalar(TOTAL_OBJECTS);

  // Posisi camera agar melihat ke pusat objek
  camera.position.set(0, 0, 30);
  camera.lookAt(center);

  // Mouse tracking untuk rotasi kamera
  let isMouseDown = false;
  const targetRotation = { x: 0, y: 0 };
  const currentRotation = { x: 0, y: 0 };
  const previousMouse = { x: 0, y: 0 };

  function onMouseMove(event) {
    if (isMouseDown) {
      const deltaX = event.clientX - previousMouse.x;
      const deltaY = event.clientY - previousMouse.y;

      targetRotation.y += deltaX * 0.003;
      targetRotation.x += deltaY * 0.003;

      // Batasi rotasi vertikal untuk menghindari flip
      targetRotation.x = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, targetRotation.x)
      );
    }

    previousMouse.x = event.clientX;
    previousMouse.y = event.clientY;
  }

  function onMouseDown(event) {
    isMouseDown = true;
    previousMouse.x = event.clientX;
    previousMouse.y = event.clientY;
  }

  function onMouseUp() {
    isMouseDown = false;
  }

  function onTouchStart(event) {
    if (event.touches.length === 1) {
      isMouseDown = true;
      previousMouse.x = event.touches[0].clientX;
      previousMouse.y = event.touches[0].clientY;
    }
  }

  function onTouchMove(event) {
    if (isMouseDown && event.touches.length === 1) {
      const deltaX = event.touches[0].clientX - previousMouse.x;
      const deltaY = event.touches[0].clientY - previousMouse.y;

      targetRotation.y += deltaX * 0.003;
      targetRotation.x += deltaY * 0.003;

      targetRotation.x = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, targetRotation.x)
      );

      previousMouse.x = event.touches[0].clientX;
      previousMouse.y = event.touches[0].clientY;
    }
  }

  function onTouchEnd() {
    isMouseDown = false;
  }

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mouseup", onMouseUp);
  document.addEventListener("touchstart", onTouchStart);
  document.addEventListener("touchmove", onTouchMove);
  document.addEventListener("touchend", onTouchEnd);

  // Handle window resize
  function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  window.addEventListener("resize", onWindowResize);

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    // Smooth rotation damping
    currentRotation.x += (targetRotation.x - currentRotation.x) * 0.1;
    currentRotation.y += (targetRotation.y - currentRotation.y) * 0.1;

    // Rotasi kamera mengelilingi pusat objek
    const radius = 30;
    camera.position.x =
      center.x +
      radius * Math.sin(currentRotation.y) * Math.cos(currentRotation.x);
    camera.position.y = center.y + radius * Math.sin(currentRotation.x);
    camera.position.z =
      center.z +
      radius * Math.cos(currentRotation.y) * Math.cos(currentRotation.x);

    camera.lookAt(center);

    // Update setiap object
    const time = Date.now() * 0.001;

    objects.forEach((obj, index) => {
      // Rotasi individual
      obj.rotation.x += obj.userData.rotationSpeed.x;
      obj.rotation.y += obj.userData.rotationSpeed.y;
      obj.rotation.z += obj.userData.rotationSpeed.z;

      // Outline mengikuti rotasi objek utama
      if (outlineMeshes[index]) {
        outlineMeshes[index].rotation.copy(obj.rotation);
      }

      // Floating animation
      const floatOffsetY =
        Math.sin(time * obj.userData.floatSpeed + index) *
        obj.userData.floatAmplitude;
      const floatOffsetX =
        Math.cos(time * obj.userData.floatSpeed * 0.7 + index) *
        obj.userData.floatAmplitude *
        0.5;
      const floatOffsetZ =
        Math.sin(time * obj.userData.floatSpeed * 0.5 + index) *
        obj.userData.floatAmplitude *
        0.3;

      obj.position.y = obj.userData.originalPosition.y + floatOffsetY;
      obj.position.x = obj.userData.originalPosition.x + floatOffsetX;
      obj.position.z = obj.userData.originalPosition.z + floatOffsetZ;

      // Outline mengikuti posisi objek utama
      if (outlineMeshes[index]) {
        outlineMeshes[index].position.copy(obj.position);
      }

      // Pulsating scale animation
      const pulse =
        Math.sin(time * obj.userData.pulseSpeed + index) *
          obj.userData.pulseAmplitude +
        1;
      obj.scale.x = obj.userData.originalScale.x * pulse;
      obj.scale.y = obj.userData.originalScale.y * pulse;
      obj.scale.z = obj.userData.originalScale.z * pulse;

      // Outline mengikuti scale objek utama (dengan faktor 1.05)
      if (outlineMeshes[index]) {
        outlineMeshes[index].scale.x =
          obj.userData.originalScale.x * pulse * 1.05;
        outlineMeshes[index].scale.y =
          obj.userData.originalScale.y * pulse * 1.05;
        outlineMeshes[index].scale.z =
          obj.userData.originalScale.z * pulse * 1.05;
      }
    });

    renderer.render(scene, camera);
  }

  animate();

  // Cleanup function
  return () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mousedown", onMouseDown);
    document.removeEventListener("mouseup", onMouseUp);
    document.removeEventListener("touchstart", onTouchStart);
    document.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("touchend", onTouchEnd);
    window.removeEventListener("resize", onWindowResize);

    // Hapus grid dari scene
    floorGrids.forEach((grid) => {
      scene.remove(grid);
      if (grid.geometry) grid.geometry.dispose();
      if (grid.material) grid.material.dispose();
    });

    if (container && renderer.domElement) {
      container.removeChild(renderer.domElement);
    }
    renderer.dispose();

    objects.forEach((obj) => {
      obj.geometry.dispose();
      obj.material.dispose();
    });

    outlineMeshes.forEach((obj) => {
      obj.geometry.dispose();
      obj.material.dispose();
    });
  };
}

// Fungsi untuk membuat environment map sederhana
function createEnvironmentMap() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");

  // Buat gradient untuk environment map
  const gradient = context.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2
  );
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(1, "rgba(200, 200, 255, 1)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export default function HeroSection() {
  const mountRef = useRef(null);

  useEffect(() => {
    let cleanup = null;

    if (mountRef.current) {
      cleanup = initThreeJS(mountRef.current);
    }

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  return (
    <section className="h-screen flex items-center justify-center relative overflow-hidden">
      {/* Masking untuk sisi-sisi */}
      <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-black via-black/70 to-transparent z-10"></div>
      <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-black via-black/70 to-transparent z-10"></div>
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black via-black/70 to-transparent z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black via-black/70 to-transparent z-10"></div>

      {/* Masking untuk sudut-sudut (efek vignette) */}
      <div
        className="absolute inset-0 bg-radial-gradient-circle z-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, transparent 30%, rgba(0, 0, 0, 0.8) 100%)`,
        }}
      ></div>

      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        style={{ zIndex: 1 }}
      />

      {/* Overlay teks di tengah */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white drop-shadow-lg">
            Creative Studio
          </h1>
          <p className="text-xl md:text-2xl opacity-80 max-w-2xl mx-auto">
            Explore our interactive 3D world
          </p>
          {/* Versi yang diperbaiki */}
          <div className="flex flex-col items-center justify-center sm:flex-row gap-6 mt-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-white">Web Based</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-white">Interactive Model</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-white">Ready to use</span>
            </div>
          </div>
          <div className="mt-8">
            <a
              href="#"
              className="inline-block px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:bg-gray-200 transition duration-300"
            >
              Get Started <span className="ml-2">Start a project</span>{" "}
              <ArrowRight className="w-4 inline-flex" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
