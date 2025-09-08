"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function About() {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2e2e2e);
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);

    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.borderRadius = "0.5rem"; 

    currentMount.appendChild(renderer.domElement);

    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 100);
    scene.add(light);

    const controls = new OrbitControls(camera, renderer.domElement);

    function loadModel(url) {
      const ext = url.split(".").pop().toLowerCase();
      let loader;

      if (ext === "gltf" || ext === "glb") {
        loader = new GLTFLoader();
        loader.load(url, (gltf) => scene.add(gltf.scene));
      } else if (ext === "fbx") {
        loader = new FBXLoader();
        loader.load(url, (fbx) => scene.add(fbx));
      } else if (ext === "obj") {
        loader = new OBJLoader();
        loader.load(url, (obj) => scene.add(obj));
      } else if (ext === "stl") {
        loader = new STLLoader();
        loader.load(url, (geometry) => {
          const material = new THREE.MeshStandardMaterial({ color: 0x888888 });
          const mesh = new THREE.Mesh(geometry, material);
          scene.add(mesh);
        });
      } else {
        console.error("Unsupported format:", ext);
      }
    }

    loadModel("/assets/3D/chevalier_sword.glb");

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      currentMount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section className="py-20 text-white">
      <div className="p-10 flex w-full gap-4 h-[500px]">
        <div
          ref={mountRef}
          className="w-2/6 h-full rounded-md overflow-hidden border"
        />
        <div className="mt-6 text-center">
          <h2 className="text-3xl font-bold mb-4">About Our 3D Assets</h2>
        </div>
      </div>
    </section>
  );
}
