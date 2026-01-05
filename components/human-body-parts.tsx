"use client";

import { useGLTF, Html } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import {
    Box3,
    Vector3,
    MeshStandardMaterial,
    Group,
    Mesh,
    Raycaster,
    Vector2
} from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// ------------------------------------
// Types
// ------------------------------------
interface BodyPartGroup {
    id: string; // unique group id
    label: string; // UI label for this group
    region: string;
    side?: "left" | "right";
    files: string[];
}

// These are the same groups from previous logic, but now only select a group, not the individual files.
export const groupedBodyParts: BodyPartGroup[] = [
    {
        id: "abdomen_left",
        label: "Left Abdomen",
        region: "abdomen",
        side: "left",
        files: [
            "FinalBaseMesh_Abdominal_Left.glb",

        ],
    },
    {
        id: "abdomen_right",
        label: "Right Abdomen",
        region: "abdomen",
        side: "right",
        files: [
            "FinalBaseMesh_Abdominal_Right.glb",

        ],
    },
    {
        id: "bicep_right",
        label: "Right Bicep",
        region: "bicep",
        side: "right",
        files: [
            "FinalBaseMesh_Abdominal.002.glb",


        ],
    },
    {
        id: "bicep_left",
        label: "Left Bicep",
        region: "bicep",
        side: "left",
        files: [
            "FinalBaseMesh_Abdominal.001.glb",


        ],
    },
    {
        id: "cervical_left",
        label: "Left Neck",
        region: "cervical",
        side: "left",
        files: ["FinalBaseMesh_Cervical_Left.glb"],
    },
    {
        id: "cervical_right",
        label: "Right Neck",
        region: "cervical",
        side: "right",
        files: ["FinalBaseMesh_Cervical_Right.glb"],
    },
    {
        id: "cranial_left",
        label: "Left Head",
        region: "cranial",
        side: "left",
        files: ["FinalBaseMesh_Cranial_Left.glb"],
    },
    {
        id: "cranial_right",
        label: "Right Head",
        region: "cranial",
        side: "right",
        files: ["FinalBaseMesh_Cranial_Right.glb"],
    },
    {
        id: "pelvic_right",
        label: "Right forehand",
        region: "pelvic",
        side: "right",
        files: ["FinalBaseMesh_Pelvic.001.glb"],
    },
    {
        id: "pelvic_left",
        label: "Left forehand",
        region: "pelvic",
        side: "left",
        files: ["FinalBaseMesh_Pelvic.002.glb"],
    },
    {
        id: "fingers_left",
        label: "Left Fingers",
        region: "Fingers",
        side: "left",
        files: ["FinalBaseMesh_Femoral.001.glb"],
    },
    {
        id: "fingers_right",
        label: "Right Fingers",
        region: "Fingers",
        side: "right",
        files: ["FinalBaseMesh_Femoral.002.glb"],
    },
    {
        id: "knee_left",
        label: "Left Knee",
        region: "crural",
        side: "left",
        files: [
            "FinalBaseMesh_Crural.glb",

        ],
    },
    {
        id: "knee_right",
        label: "Right Knee",
        region: "crural",
        side: "right",
        files: [

            "FinalBaseMesh_Crural.001.glb",
        ],
    },
    {
        id: "femoral_left",
        label: "Left Thigh",
        region: "femoral",
        side: "left",
        files: [
            "FinalBaseMesh_Femoral_Left.glb",

        ],
    },
    {
        id: "femoral_right",
        label: "Right Thigh",
        region: "femoral",
        side: "right",
        files: [
            "FinalBaseMesh_Femoral_Right.glb",

        ],
    },
    {
        id: "foot_left",
        label: "Left Foot",
        region: "foot",
        side: "left",
        files: [
            "FinalBaseMesh_Foot_Ankle.glb",

        ],
    },
    {
        id: "foot_left_1",
        label: "Left Ankle",
        region: "foot",
        side: "left",
        files: [
            "FinalBaseMesh_Foot_Mid.glb",


        ],
    },
    {
        id: "foot_left_2",
        label: "Left Toe",
        region: "foot",
        side: "left",
        files: [

            "FinalBaseMesh_Foot_Toes.glb",



        ],
    },
    {
        id: "foot_right_2",
        label: "Right Toe",
        region: "foot",
        side: "right",
        files: [

            "FinalBaseMesh_Foot_Toes.001.glb",



        ],
    },
    {
        id: "foot_right_3",
        label: "Right Ankle",
        region: "foot",
        side: "right",
        files: [

            "FinalBaseMesh_Foot_Mid.001.glb",



        ],
    },
    {
        id: "foot_right",
        label: "Right Foot",
        region: "foot",
        side: "right",
        files: [

            "FinalBaseMesh_Foot_Ankle.001.glb",

        ],
    },
    {
        id: "pelvis_left",
        label: "Left Pelvis",
        region: "pelvic",
        side: "left",
        files: [
            "FinalBaseMesh_Pelvic_Left.glb",

        ],
    },
    {
        id: "pelvis_right",
        label: "Right Pelvis",
        region: "pelvic",
        side: "right",
        files: [
            "FinalBaseMesh_Pelvic_Right.glb",

        ],
    },
    {
        id: "thoracic_left",
        label: "Left Chest",
        region: "thoracic",
        side: "left",
        files: ["FinalBaseMesh_Thoracic_Left.glb"],
    },
    {
        id: "thoracic_right",
        label: "Right Chest",
        region: "thoracic",
        side: "right",
        files: ["FinalBaseMesh_Thoracic_Right.glb"],
    }
];

// ----------------------------
// Mapping: Mesh -> Group
// ----------------------------
// Cache from mesh UUID to group id for use in selection
const meshUuidToGroupId: { [uuid: string]: string } = {};

// ------------------------------------
// Props
// ------------------------------------
interface HumanBodyPartsProps {
    selectedPart: string | null;
    selectedParts?: string[];
    onPartSelect: (partName: string) => void;
    focusRegions?: string[];
    clickable?: boolean;
    onModelLoaded?: () => void;
}

// ------------------------------------
// Sub-components
// ------------------------------------

// A group model loads and displays all files of the group together, but is selectable as a whole (not per piece)
function BodyPartGroupModel({
    bodyPartGroup,
    isSelected,
    onSelect,
    clickable,
}: {
    bodyPartGroup: BodyPartGroup;
    isSelected: boolean;
    onSelect: () => void;
    clickable: boolean;
}) {
    const groupRef = useRef<Group>(null);
    const meshesRef = useRef<Mesh[]>([]);

    // Load all GLTF scenes for this group and mount them under this group
    useEffect(() => {
        if (!groupRef.current) return;

        // Clear previous
        while (groupRef.current.children.length > 0) groupRef.current.remove(groupRef.current.children[0]);
        meshesRef.current = [];

        let isMounted = true;

        const loadAndAddAll = async () => {
            const loader = new GLTFLoader();
            
            for (const file of bodyPartGroup.files) {
                if (!isMounted) break;
                
                try {
                    // Use the GLTFLoader directly instead of the hook inside async
                    const loaded = await new Promise<any>((resolve, reject) => {
                        const timeout = setTimeout(() => {
                            reject(new Error(`Timeout loading /models/${file}`));
                        }, 10000); // 10 second timeout per model
                        
                        loader.load(
                            `/models/${file}`,
                            (gltf) => {
                                clearTimeout(timeout);
                                resolve(gltf);
                            },
                            (progress) => {
                                // Optional: log progress for debugging
                                if (progress.total > 0) {
                                    const percent = (progress.loaded / progress.total) * 100;
                                    // console.log(`Loading ${file}: ${percent.toFixed(0)}%`);
                                }
                            },
                            (error) => {
                                clearTimeout(timeout);
                                console.warn(`Failed to load model: /models/${file}`, error);
                                reject(error);
                            }
                        );
                    });
                    
                    if (!loaded || !loaded.scene || !isMounted) continue;
                    
                    const sceneClone = loaded.scene.clone(true);

                // Find main mesh(s) in scene
                sceneClone.traverse((obj: any) => {
                    if (obj.isMesh) {
                        // Material for selected/highlighted state
                        const newMat = new MeshStandardMaterial({
                            color: isSelected ? "#ff6b35" : "#eaeaea",
                            roughness: 0.85,
                            metalness: 0,
                            emissive: isSelected ? "#ff6b35" : "#000000",
                            emissiveIntensity: isSelected ? 0.35 : 0,
                        });
                        if (Array.isArray(obj.material)) {
                            obj.material = obj.material.map(() => newMat.clone());
                        } else {
                            obj.material = newMat;
                        }
                        (obj.material as any).needsUpdate = true;

                        // Identify meshes by group id
                        obj.userData.partName = bodyPartGroup.label;
                        obj.userData.groupId = bodyPartGroup.id; // <-- explicit

                        // For event support
                        if (clickable) {
                            obj.userData.onSelect = onSelect;
                        } else {
                            delete obj.userData.onSelect;
                        }

                        meshesRef.current.push(obj as Mesh);

                        // --- CRUCIAL: Link mesh uuid to group for selection check ---
                        meshUuidToGroupId[obj.uuid] = bodyPartGroup.id;
                    }
                });

                    if (groupRef.current && isMounted) {
                        groupRef.current.add(sceneClone);
                    }
                } catch (error) {
                    console.error(`Error loading model /models/${file} for ${bodyPartGroup.label}:`, error);
                    // Continue loading other models even if one fails
                    continue;
                }
            }
        };
        
        loadAndAddAll().catch((error) => {
            console.error(`Error in loadAndAddAll for ${bodyPartGroup.label}:`, error);
        });

        return () => {
            isMounted = false;
            if (!groupRef.current) return;
            while (groupRef.current.children.length > 0)
                groupRef.current.remove(groupRef.current.children[0]);
            // Cleanup mesh uuid mapping for this group
            meshesRef.current.forEach(mesh => {
                delete meshUuidToGroupId[mesh.uuid];
            });
        };
        // eslint-disable-next-line
    }, [isSelected, clickable, bodyPartGroup.label, bodyPartGroup.id]);

    // Highlight switching for all meshes in group
    useEffect(() => {
        for (const mesh of meshesRef.current) {
            if (mesh && mesh.material) {
                // If material is an array, update each material
                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach(mat => {
                        // Type guard for MeshStandardMaterial
                        if (
                            mat &&
                            typeof (mat as any).color?.set === "function" &&
                            typeof (mat as any).emissive?.set === "function"
                        ) {
                            (mat as MeshStandardMaterial).color.set(isSelected ? "#ff6b35" : "#eaeaea");
                            (mat as MeshStandardMaterial).emissive.set(isSelected ? "#ff6b35" : "#000000");
                            (mat as MeshStandardMaterial).emissiveIntensity = isSelected ? 0.3 : 0;
                        }
                        (mat as any).needsUpdate = true;
                    });
                } else {
                    const mat = mesh.material;
                    if (
                        mat &&
                        typeof (mat as any).color?.set === "function" &&
                        typeof (mat as any).emissive?.set === "function"
                    ) {
                        (mat as MeshStandardMaterial).color.set(isSelected ? "#ff6b35" : "#eaeaea");
                        (mat as MeshStandardMaterial).emissive.set(isSelected ? "#ff6b35" : "#000000");
                        (mat as MeshStandardMaterial).emissiveIntensity = isSelected ? 0.3 : 0;
                    }
                    (mat as any).needsUpdate = true;
                }
            }
        }
    }, [isSelected]);

    return <group ref={groupRef} />;
}

// Main rendered component
export function HumanBodyParts({
    selectedPart,
    selectedParts = [],
    onPartSelect,
    focusRegions = [],
    clickable = true,
    onModelLoaded
}: HumanBodyPartsProps) {
    const { camera, gl, scene } = useThree();
    const bodyGroupRef = useRef<Group>(null);
    const [isCentered, setIsCentered] = useState(false);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const hasCalledOnModelLoadedRef = useRef<boolean>(false);
    const centeringDoneRef = useRef<boolean>(false);
    const lastMeshCountRef = useRef<number>(0);
    const stableFrameCountRef = useRef<number>(0);

    // Raycast click handler for group selection
    useEffect(() => {
        if (!clickable) return;
        const handleClick = (event: MouseEvent) => {
            const rect = gl.domElement.getBoundingClientRect();
            const mouse = {
                x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
                y: -((event.clientY - rect.top) / rect.height) * 2 + 1
            };
            const raycaster = new Raycaster();
            raycaster.setFromCamera(new Vector2(mouse.x, mouse.y), camera);

            // Gather all meshes
            let allMeshes: Mesh[] = [];
            scene.traverse((obj: any) => {
                if (obj.isMesh) allMeshes.push(obj as Mesh);
            });

            const intersects = raycaster.intersectObjects(allMeshes, true);
            if (intersects.length > 0) {
                // Find the first valid hit that's NOT a child of another group
                let best: Mesh | null = null;
                for (let inter of intersects) {
                    const mesh = inter.object as Mesh;
                    if (mesh?.userData?.groupId) {
                        // Only allow the topmost mesh for the group, not a duplicated mesh from other groups
                        best = mesh;
                        break;
                    }
                }
                if (best && best.userData.partName && best.userData.onSelect) {
                    // For additional safety: only select by groupId (see below)
                    const groupId = best.userData.groupId;
                    // Defensive extra check: Only call select if this mesh's group is registered as expected
                    if (typeof groupId === "string" && meshUuidToGroupId[best.uuid] === groupId) {
                        best.userData.onSelect();
                    }
                }
            }
        };

        gl.domElement.addEventListener("click", handleClick);
        return () => {
            gl.domElement.removeEventListener("click", handleClick);
        };
    }, [camera, gl, scene, clickable]);

    // Reset centering state when component remounts or body parts change
    useEffect(() => {
        centeringDoneRef.current = false;
        lastMeshCountRef.current = 0;
        stableFrameCountRef.current = 0;
        setIsCentered(false);
    }, [selectedParts, focusRegions]);

    // Fallback timeout to ensure loading state doesn't stay forever
    useEffect(() => {
        const fallbackTimeout = setTimeout(() => {
            if (!modelsLoaded && bodyGroupRef.current && !centeringDoneRef.current) {
                // Check if we have at least some meshes
                let meshCount = 0;
                const box = new Box3();
                try {
                    bodyGroupRef.current.traverse((obj: any) => {
                        if (obj.isMesh && obj.geometry) {
                            meshCount++;
                            box.expandByObject(obj);
                        }
                    });
                    // If we have meshes, center and mark as loaded
                    if (meshCount > 0 && !hasCalledOnModelLoadedRef.current) {
                        const center = box.getCenter(new Vector3());
                        const size = box.getSize(new Vector3());
                        
                        if (size.length() > 0.1 && bodyGroupRef.current) {
                            // Center the model
                            bodyGroupRef.current.position.x = -center.x;
                            bodyGroupRef.current.position.y = -center.y;
                            bodyGroupRef.current.position.z = -center.z;
                            centeringDoneRef.current = true;
                            setIsCentered(true);
                        }
                        
                        setModelsLoaded(true);
                        if (onModelLoaded && !hasCalledOnModelLoadedRef.current) {
                            onModelLoaded();
                            hasCalledOnModelLoadedRef.current = true;
                        }
                    }
                } catch (error) {
                    console.error('Error in fallback timeout check:', error);
                    // Still mark as loaded to prevent infinite loading
                    if (meshCount > 0 && !hasCalledOnModelLoadedRef.current) {
                        setModelsLoaded(true);
                        if (onModelLoaded && !hasCalledOnModelLoadedRef.current) {
                            onModelLoaded();
                            hasCalledOnModelLoadedRef.current = true;
                        }
                    }
                }
            }
        }, 5000); // 5 second fallback

        return () => clearTimeout(fallbackTimeout);
    }, [modelsLoaded, onModelLoaded]);

    // Center vertically and track when all models are loaded
    useFrame(() => {
        if (!bodyGroupRef.current || modelsLoaded) return;

        const box = new Box3();
        let hasMeshes = false;
        let meshCount = 0;

        bodyGroupRef.current.traverse((obj: any) => {
            if (obj.isMesh && obj.geometry) {
                box.expandByObject(obj);
                hasMeshes = true;
                meshCount++;
            }
        });

        if (hasMeshes && !box.isEmpty() && meshCount > 0) {
            // Wait for stable mesh count (models finished loading)
            if (meshCount !== lastMeshCountRef.current) {
                lastMeshCountRef.current = meshCount;
                stableFrameCountRef.current = 0;
            } else {
                stableFrameCountRef.current++;
            }

            // Only center once after mesh count is stable for several frames (models finished loading)
            if (!centeringDoneRef.current && stableFrameCountRef.current >= 10 && meshCount >= 3) {
                const center = box.getCenter(new Vector3());
                const size = box.getSize(new Vector3());

                // Only center if we have a valid bounding box
                if (size.length() > 0.1) {
                    // Center the model both horizontally and vertically
                    bodyGroupRef.current.position.x = -center.x;
                    bodyGroupRef.current.position.y = -center.y;
                    bodyGroupRef.current.position.z = -center.z;

                    centeringDoneRef.current = true;
                    setIsCentered(true);

                    // Mark as loaded after centering is done
                    setTimeout(() => {
                        if (!modelsLoaded && !hasCalledOnModelLoadedRef.current) {
                            try {
                                setModelsLoaded(true);
                                if (onModelLoaded && !hasCalledOnModelLoadedRef.current) {
                                    onModelLoaded();
                                    hasCalledOnModelLoadedRef.current = true;
                                }
                            } catch (error) {
                                console.error('Error in onModelLoaded callback:', error);
                            }
                        }
                    }, 100);
                }
            }
        }
    });

    // Selection for groups: only group label/id (not individual file labels)
    const isGroupSelected = (groupLabel: string) => {
        if (selectedPart === groupLabel) return true;
        if (selectedParts && selectedParts.length > 0 && selectedParts.includes(groupLabel)) return true;
        if (focusRegions && focusRegions.length > 0) {
            return focusRegions.some(region =>
                groupLabel.toLowerCase().includes(region.toLowerCase()) ||
                region.toLowerCase().includes(groupLabel.toLowerCase())
            );
        }
        return false;
    };

    // Find the selected group's label, if any
    let selectedLabel = null;
    if (selectedPart) {
        // Try to match by label
        const match = groupedBodyParts.find(group => group.label === selectedPart);
        selectedLabel = match ? match.label : selectedPart;
    }

    // Outer container to allow showing label at the top-right
    return (
        <group>
            <group ref={bodyGroupRef}>
                {groupedBodyParts.map((group) => (
                    <BodyPartGroupModel
                        key={group.id}
                        bodyPartGroup={group}
                        isSelected={isGroupSelected(group.label)}
                        onSelect={() => onPartSelect(group.label)}
                        clickable={!!clickable}
                    />
                ))}
            </group>
            {/* Show the selected part in the top right, rendered as Drei's <Html /> overlay */}

        </group>
    );
}

// Preload all models (preload each file exactly once)
[...new Set(groupedBodyParts.flatMap(g => g.files))].forEach(file => {
    useGLTF.preload(`/models/${file}`);
});
