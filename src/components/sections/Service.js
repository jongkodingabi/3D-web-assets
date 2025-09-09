import Image from "next/image";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

const mockData = [
  {
    id: 1,
    title: "iPhone 14 Pro Model",
    description:
      "A highly detailed 3D model of the latest iPhone 14 Pro. Perfect for product visualization and AR applications.",
    modelUrl: "/assets/3D/iphone.glb",
    thumbnail: "/assets/iphone.jpg",
    backgroundColor: 0xf5f5f0,
  },
  {
    id: 2,
    title: "Medieval Sword Model",
    description:
      "An intricately designed 3D model of a medieval sword, ideal for games and historical visualizations.",
    modelUrl: "/assets/3D/stylized_sword.glb",
    thumbnail: "/assets/3D_model_sword.jpeg",
    backgroundColor: 0xb3b3ff,
  },
  {
    id: 3,
    title: "Modern House Model",
    description:
      "A contemporary 3D model of a modern house, suitable for architectural presentations and real estate marketing.",
    modelUrl: "/assets/3D/modern_house.glb",
    thumbnail: "/assets/house.webp",
    backgroundColor: 0xd1d1e0,
  },
  {
    id: 4,
    title: "3D Text Model",
    description:
      "A stylish 3D text model that can be customized for various design projects and presentations.",
    modelUrl: "/assets/3D/twitch_logo_3d_text.glb",
    thumbnail: "/assets/text.avif",
    backgroundColor: 0xcc99ff,
  },
];

export default function Service() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const [selectedObject, setSelectedObject] = useState(mockData[0]);

  const handleSetObject = (modelId) => {
    const newModel = mockData.find((model) => model.id === modelId);
    if (newModel) {
      setSelectedObject(newModel);
    }
  };

  const clearScene = () => {
    if (sceneRef.current) {
      // Remove all objects from scene except lights
      const objectsToRemove = [];
      sceneRef.current.traverse((child) => {
        if (child.isMesh || child.isGroup) {
          objectsToRemove.push(child);
        }
      });
      objectsToRemove.forEach((obj) => {
        sceneRef.current.remove(obj);
      });
    }
  };

  const loadModel = (url) => {
    if (!sceneRef.current) return;

    clearScene(); // Clear existing models

    const ext = url.split(".").pop().toLowerCase();
    let loader;

    if (ext === "gltf" || ext === "glb") {
      loader = new GLTFLoader();
      loader.load(
        url,
        (gltf) => {
          sceneRef.current.add(gltf.scene);
        },
        undefined,
        (error) => {
          console.error("Error loading GLTF model:", error);
        }
      );
    } else if (ext === "fbx") {
      loader = new FBXLoader();
      loader.load(
        url,
        (fbx) => {
          sceneRef.current.add(fbx);
        },
        undefined,
        (error) => {
          console.error("Error loading FBX model:", error);
        }
      );
    } else if (ext === "obj") {
      loader = new OBJLoader();
      loader.load(
        url,
        (obj) => {
          sceneRef.current.add(obj);
        },
        undefined,
        (error) => {
          console.error("Error loading OBJ model:", error);
        }
      );
    } else if (ext === "stl") {
      loader = new STLLoader();
      loader.load(
        url,
        (geometry) => {
          const material = new THREE.MeshStandardMaterial({ color: 0x888888 });
          const mesh = new THREE.Mesh(geometry, material);
          sceneRef.current.add(mesh);
        },
        undefined,
        (error) => {
          console.error("Error loading STL model:", error);
        }
      );
    } else {
      console.error("Unsupported format:", ext);
    }
  };

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(selectedObject.backgroundColor);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 3);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.borderRadius = "0.5rem";
    rendererRef.current = renderer;

    currentMount.appendChild(renderer.domElement);

    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 100);
    scene.add(light);

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Load model when selectedObject changes
  useEffect(() => {
    if (selectedObject && selectedObject.modelUrl) {
      loadModel(selectedObject.modelUrl);
    }
  }, [selectedObject]);

  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color(
        selectedObject.backgroundColor
      );
    }
  }, [selectedObject]);

  // Get the other models (excluding the selected one)
  const otherModels = mockData.filter(
    (model) => model.id !== selectedObject.id
  );

  return (
    <section
      id="service"
      className="section flex items-center justify-center flex-col px-4 sm:px-6 lg:px-2"
    >
      <h2 className="section-title text-white font-medium text-xl sm:text-xl lg:text-3xl mb-6 text-center w-full max-w-4xl">
        All the high-quality 3D models—plus special releases, crafted for your
        projects.
      </h2>

      {/* Desktop Layout - Original grid system */}
      <div className="w-full max-w-[1500px] mx-auto px-4 overflow-hidden mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
          {/* 3D Object - Display selected model */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="col-span-1 sm:col-span-2 lg:col-span-4 w-full h-[250px] sm:h-[300px] lg:h-[400px] xl:h-[450px] border-4 border-purple-500 hover:border-8 transition-all rounded-2xl overflow-hidden relative group"
            ref={mountRef}
          >
            <div className="absolute top-5 left-5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 transition duration-300">
              <ShoppingBag className="text-white m-4" />
            </div>
            <div className="flex flex-col justify-end items-start p-6 absolute bottom-0 bg-gradient-to-t from-black w-full pointer-events-none transition-all">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-2">
                {selectedObject.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-300">
                {selectedObject.description}
              </p>
            </div>
          </motion.div>

          {/* All Models - Map from mockData */}
          {mockData.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                delay: index * 0.1,
              }}
              onClick={() => handleSetObject(model.id)}
              className={`w-full h-[120px] sm:h-[150px] xl:h-[170px] bg-zinc-900 rounded-2xl border-4 cursor-pointer transition-all duration-300 ${
                selectedObject.id === model.id
                  ? "border-purple-300 scale-105 shadow-lg shadow-purple-500/50"
                  : "border-purple-400 hover:border-purple-300 hover:scale-105"
              }`}
            >
              <div className="relative h-full">
                {selectedObject.id === model.id && (
                  <div className="absolute top-2 right-2 bg-purple-500 rounded-full p-1 z-10">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                )}
                <Image
                  src={model.thumbnail}
                  alt={`${model.title} Thumbnail`}
                  width={400}
                  height={150}
                  className="object-cover w-full h-2/3 overflow-hidden rounded-t-xl"
                />
                <div className="h-1/3 flex items-center justify-center">
                  <h2
                    className={`text-sm sm:text-base lg:text-lg font-bold text-center px-2 ${
                      selectedObject.id === model.id
                        ? "text-purple-300"
                        : "text-white"
                    }`}
                  >
                    {model.title}
                  </h2>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
