"use client";

import React, {
  Suspense,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import {
  Box3,
  Group,
  Mesh,
  MeshStandardMaterial,
  Vector3,
  BufferGeometry,
} from "three";

/* =========================================================
   BODY PART DEFINITIONS
========================================================= */

interface BodyPart {
  id: string;
  label: string;
  file: string;
}

const BODY_PARTS: BodyPart[] = [
  { id: "abdominal_left", label: "Left Abdomen", file: "FinalBaseMesh_Abdominal_Left.glb" },
  { id: "abdominal_right", label: "Right Abdomen", file: "FinalBaseMesh_Abdominal_Right.glb" },

  { id: "cervical_left", label: "Left Cervical", file: "FinalBaseMesh_Cervical_Left.glb" },
  { id: "cervical_right", label: "Right Cervical", file: "FinalBaseMesh_Cervical_Right.glb" },

  { id: "cranial_left", label: "Left Cranium", file: "FinalBaseMesh_Cranial_Left.glb" },
  { id: "cranial_right", label: "Right Cranium", file: "FinalBaseMesh_Cranial_Right.glb" },

  { id: "thoracic_left", label: "Left Thorax", file: "FinalBaseMesh_Thoracic_Left.glb" },
  { id: "thoracic_right", label: "Right Thorax", file: "FinalBaseMesh_Thoracic_Right.glb" },

  { id: "pelvic_left", label: "Left Pelvis", file: "FinalBaseMesh_Pelvic_Left.glb" },
  { id: "pelvic_right", label: "Right Pelvis", file: "FinalBaseMesh_Pelvic_Right.glb" },

  { id: "femoral_left", label: "Left Femoral", file: "FinalBaseMesh_Femoral_Left.glb" },
  { id: "femoral_right", label: "Right Femoral", file: "FinalBaseMesh_Femoral_Right.glb" },

  { id: "foot_mid_r", label: "Right Foot Mid", file: "FinalBaseMesh_Foot_Mid.glb" },
  { id: "foot_toes_r", label: "Right Toes", file: "FinalBaseMesh_Foot_Toes.glb" },
  { id: "foot_mid_l", label: "Left Foot Mid", file: "FinalBaseMesh_Foot_Mid.001.glb" },
  { id: "foot_toes_l", label: "Left Toes", file: "FinalBaseMesh_Foot_Toes.001.glb" },
];

/* =========================================================
   BASE BODY SHELL (FILLS GAPS)
========================================================= */

function BaseBodyShell() {
  const { scene } = useGLTF("/models/FinalBaseMesh_FullBody.glb");

  useLayoutEffect(() => {
    scene.traverse((obj) => {
      if ((obj as Mesh).isMesh) {
        const mesh = obj as Mesh;
        mesh.material = new MeshStandardMaterial({
          color: "#dcdcdc",
          roughness: 0.9,
          metalness: 0,
        });
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
}

/* =========================================================
   SINGLE BODY PART
========================================================= */

function BodyPartMesh({
  part,
  selected,
  onSelect,
}: {
  part: BodyPart;
  selected: boolean;
  onSelect: (label: string) => void;
}) {
  const { scene } = useGLTF(`/models/${part.file}`);

  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        color: selected ? "#ff6b35" : "#e6e6e6",
        roughness: 0.85,
        metalness: 0,
        emissive: selected ? "#ff6b35" : "#000000",
        emissiveIntensity: selected ? 0.35 : 0,
      }),
    [selected]
  );

  useLayoutEffect(() => {
    scene.traverse((obj) => {
      if ((obj as Mesh).isMesh) {
        const mesh = obj as Mesh;
        mesh.material = material;

        const geo = mesh.geometry as BufferGeometry;
        geo.computeVertexNormals();

        mesh.userData.label = part.label;
      }
    });
  }, [scene, material, part.label]);

  return (
    <primitive
      object={scene}
      onClick={(e: any) => {
        e.stopPropagation();
        onSelect(part.label);
      }}
    />
  );
}

/* =========================================================
   HUMAN BODY GROUP
========================================================= */

function HumanBody({
  selectedAreas,
  onSelect,
}: {
  selectedAreas: string[];
  onSelect: (area: string) => void;
}) {
  const groupRef = useRef<Group>(null);
  const [fitted, setFitted] = useState(false);

  useLayoutEffect(() => {
    if (!groupRef.current || fitted) return;

    const box = new Box3().setFromObject(groupRef.current);
    if (box.isEmpty()) return;

    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());

    groupRef.current.position.set(-center.x, -center.y, -center.z);

    const scale = 10 / Math.max(size.x, size.y, size.z);
    groupRef.current.scale.setScalar(scale * 1.015); // micro inflation (safe)

    setFitted(true);
  }, [fitted]);

  return (
    <group ref={groupRef}>
      <BaseBodyShell />

      {BODY_PARTS.map((part) => (
        <BodyPartMesh
          key={part.id}
          part={part}
          selected={selectedAreas.includes(part.label)}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

/* =========================================================
   MAIN EXPORT
========================================================= */

export default function BodyMap3D({
  selectedAreas,
  onSelect,
}: {
  selectedAreas: string[];
  onSelect: (area: string) => void;
}) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 6, 4]} intensity={0.8} />
        <directionalLight position={[-3, 4, -2]} intensity={0.4} />

        <Suspense fallback={null}>
          <HumanBody selectedAreas={selectedAreas} onSelect={onSelect} />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}

/* =========================================================
   PRELOAD
========================================================= */

useGLTF.preload("/models/FinalBaseMesh_FullBody.glb");
BODY_PARTS.forEach((p) => useGLTF.preload(`/models/${p.file}`));
