import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useControls, Leva } from 'leva';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { Layers, Moon, Globe, Sun, Mountain, Map as MapIcon } from 'lucide-react';

// Use environment variable for token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MAP_STYLES = [
  { id: 'standard', url: 'mapbox://styles/mapbox/standard', name: 'Tiêu chuẩn', icon: <Layers size={18} /> },
  { id: 'satellite', url: 'mapbox://styles/mapbox/satellite-streets-v12', name: 'Vệ tinh', icon: <Globe size={18} /> },
  { id: 'outdoors', url: 'mapbox://styles/mapbox/outdoors-v12', name: 'Địa hình', icon: <Mountain size={18} /> },
  { id: 'streets', url: 'mapbox://styles/mapbox/streets-v12', name: 'Đường phố', icon: <MapIcon size={18} /> },
  { id: 'light', url: 'mapbox://styles/mapbox/light-v11', name: 'Sáng', icon: <Sun size={18} /> },
  { id: 'dark', url: 'mapbox://styles/mapbox/dark-v11', name: 'Tối', icon: <Moon size={18} /> }
];

export default function Mapbox3DViewer({ centerPosition }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, lat] = [centerPosition[1], centerPosition[0]];
  const zoom = 16.5;
  const pitch = 60;
  const bearing = -30;
  
  const [mapStyle, setMapStyle] = useState('standard');

  const { scale, rotX, rotY, rotZ, transX, transY, transZ, altitude } = useControls('Mapbox Model', {
    scale: { value: 0.07, min: 0.0001, max: 10, step: 0.0001 },
    rotX: { value: 90, min: -180, max: 180, step: 1 },
    rotY: { value: 29, min: -180, max: 180, step: 1 },
    rotZ: { value: 0, min: -180, max: 180, step: 1 },
    transX: { value: -36, min: -10000, max: 10000, step: 1 },
    transY: { value: -73, min: -10000, max: 10000, step: 1 },
    transZ: { value: 0, min: -10000, max: 10000, step: 1 },
    altitude: { value: 0, min: -1000, max: 1000, step: 1 },
  });

  const modelGroupRef = useRef(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: MAP_STYLES[0].url,
        center: [lng, lat],
        zoom: zoom,
        pitch: pitch,
        bearing: bearing,
        antialias: true
      });

      map.current.on('style.load', () => {
        if (map.current.setConfigProperty && map.current.getStyle().name === 'Standard') {
            map.current.setConfigProperty('basemap', 'lightPreset', 'dusk');
        }

        // MAPBOX CUSTOM LAYER USING THREE.JS
        const modelOrigin = [lng, lat];
        const modelAltitude = 0;
        const modelRotate = [Math.PI / 2, 0, 0];

        const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
          modelOrigin,
          modelAltitude
        );

        const modelTransform = {
          translateX: modelAsMercatorCoordinate.x,
          translateY: modelAsMercatorCoordinate.y,
          translateZ: modelAsMercatorCoordinate.z,
          rotateX: modelRotate[0],
          rotateY: modelRotate[1],
          rotateZ: modelRotate[2],
          scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
        };

        const customLayer = {
          id: '3d-model',
          type: 'custom',
          renderingMode: '3d',
          onAdd: function (map, gl) {
            this.camera = new THREE.Camera();
            this.scene = new THREE.Scene();
            
            // Add lighting
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
            directionalLight.position.set(0, -70, 100).normalize();
            this.scene.add(directionalLight);
            
            const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.5);
            directionalLight2.position.set(0, 70, 100).normalize();
            this.scene.add(directionalLight2);
            
            const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
            this.scene.add(ambientLight);

            const loader = new GLTFLoader();
            loader.setMeshoptDecoder(MeshoptDecoder); // MUST DO THIS for compressed files
            loader.load('/assets/project-opt.glb', (gltf) => {
              // Center the model horizontally, but place the BOTTOM exactly at ground level (Y = 0)
              const box = new THREE.Box3().setFromObject(gltf.scene);
              const center = box.getCenter(new THREE.Vector3());
              // box.min.y is the lowest point of the building. Subtracting it lifts the building to sit flush on the ground.
              gltf.scene.position.set(-center.x, -box.min.y, -center.z);
              
              // Wrap in a group so we can control scale/trans from Leva
              const group = new THREE.Group();
              group.add(gltf.scene);
              this.scene.add(group);
              modelGroupRef.current = group;
              
              // Apply initial controls
              group.scale.set(scale, scale, scale);
              group.rotation.set(
                THREE.MathUtils.degToRad(rotX - 90), 
                THREE.MathUtils.degToRad(rotY),
                THREE.MathUtils.degToRad(rotZ)
              );
              // Mapbox Y is Three.js Z (North/South), Mapbox Z (Altitude) is Three.js Y (Up/Down)
              group.position.set(transX, altitude, transY);
              
              map.triggerRepaint();
            }, undefined, (err) => console.error("Lỗi tải 3D:", err));

            this.map = map;
            this.renderer = new THREE.WebGLRenderer({
              canvas: map.getCanvas(),
              context: gl,
              antialias: true
            });
            this.renderer.autoClear = false;
          },
          render: function (gl, matrix) {
            const rotationX = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), modelTransform.rotateX);
            const rotationY = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), modelTransform.rotateY);
            const rotationZ = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1), modelTransform.rotateZ);
            
            const m = new THREE.Matrix4().fromArray(matrix);
            const l = new THREE.Matrix4()
              .makeTranslation(modelTransform.translateX, modelTransform.translateY, modelTransform.translateZ)
              .scale(new THREE.Vector3(modelTransform.scale, -modelTransform.scale, modelTransform.scale))
              .multiply(rotationX)
              .multiply(rotationY)
              .multiply(rotationZ);

            this.camera.projectionMatrix = m.multiply(l);
            this.renderer.resetState();
            
            // Xóa bộ đệm chiều sâu (depth buffer) của Mapbox để Three.js luôn vẽ mô hình này LÊN TRÊN CÙNG
            this.renderer.clearDepth();
            
            this.renderer.render(this.scene, this.camera);
            this.map.triggerRepaint();
          }
        };

        map.current.addLayer(customLayer);
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    } catch (e) {
      console.error("Lỗi khởi tạo Mapbox:", e);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [lng, lat]);

  // Handle style change
  useEffect(() => {
    if (!map.current) return;
    const styleUrl = MAP_STYLES.find(s => s.id === mapStyle)?.url;
    if (styleUrl) {
      map.current.setStyle(styleUrl);
    }
  }, [mapStyle]);

  // Update Three.js model from Leva controls
  useEffect(() => {
    if (modelGroupRef.current) {
      const g = modelGroupRef.current;
      g.scale.set(scale, scale, scale);
      g.rotation.set(
        THREE.MathUtils.degToRad(rotX - 90),
        THREE.MathUtils.degToRad(rotY),
        THREE.MathUtils.degToRad(rotZ)
      );
      // Mapbox Y is Three.js Z (North/South), Mapbox Z (Altitude) is Three.js Y (Up/Down)
      g.position.set(transX, altitude, transY); 
      
      if (map.current) {
        map.current.triggerRepaint();
      }
    }
  }, [scale, rotX, rotY, rotZ, transX, transY, altitude]);

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 left-4 z-[500] w-72">
        <Leva hidden />
      </div>
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Style Switcher - Horizontal on Mobile (bottom), Vertical on Desktop (right) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 sm:bottom-auto sm:top-1/2 sm:left-auto sm:right-4 sm:-translate-x-0 sm:-translate-y-1/2 flex flex-row sm:flex-col bg-white/90 backdrop-blur-md shadow-2xl border border-slate-100 p-1.5 gap-1.5 z-[400] rounded-xl transition-all duration-300 max-w-[calc(100vw-32px)] overflow-x-auto hide-scrollbar">
        {MAP_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => setMapStyle(style.id)}
            title={style.name}
            className={`flex-shrink-0 flex flex-col items-center justify-center gap-0.5 w-12 h-12 sm:w-14 sm:h-14 text-[9px] sm:text-[10px] font-medium transition-all duration-300 rounded-lg ${
              mapStyle === style.id 
                ? "bg-[#d4ae6f] text-white shadow-lg scale-105" 
                : "text-slate-500 hover:bg-slate-50 hover:text-[#d4ae6f]"
            }`}
          >
            {style.icon}
            <span className="text-center whitespace-nowrap">{style.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
