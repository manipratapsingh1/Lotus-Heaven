import { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Html, PerspectiveCamera, useTexture } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Bed, Bath, Wifi, Coffee, Tv, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as THREE from 'three';

interface HotspotData {
  position: [number, number, number];
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const hotspots: HotspotData[] = [
  { position: [-3, 0, 0], label: 'King Size Bed', description: 'Premium Egyptian cotton sheets with memory foam mattress', icon: Bed },
  { position: [3, 0, -2], label: 'Marble Bathroom', description: 'Heated floors, rainfall shower, and soaking tub', icon: Bath },
  { position: [2, 1, 2], label: 'Smart TV', description: '65" OLED with streaming services included', icon: Tv },
  { position: [-2, 0.5, 3], label: 'Mini Bar', description: 'Complimentary premium beverages and snacks', icon: Coffee },
  { position: [0, 2, 0], label: 'Climate Control', description: 'Individual AC with air purification system', icon: Wind },
  { position: [-3, 0.5, -3], label: 'High-Speed WiFi', description: '1Gbps fiber connection throughout the room', icon: Wifi },
];

const Hotspot = ({ 
  position, 
  label, 
  description, 
  icon: Icon, 
  onClick 
}: HotspotData & { onClick: () => void }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshStandardMaterial
        color={hovered ? '#ffd700' : '#a855f7'}
        emissive={hovered ? '#ffd700' : '#a855f7'}
        emissiveIntensity={hovered ? 0.8 : 0.4}
      />
      <Html distanceFactor={10}>
        <div
          className={`transition-all duration-300 ${
            hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <div className="glass-card rounded-lg p-3 min-w-[150px] text-center">
            <Icon className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-xs font-semibold text-foreground">{label}</p>
          </div>
        </div>
      </Html>
    </mesh>
  );
};

const Room = () => {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      
      {/* Walls */}
      <mesh position={[0, 2, -7]}>
        <planeGeometry args={[15, 8]} />
        <meshStandardMaterial color="#16213e" />
      </mesh>
      <mesh position={[-7, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[15, 8]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[7, 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[15, 8]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      
      {/* Bed */}
      <group position={[-3, -1, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3, 0.5, 4]} />
          <meshStandardMaterial color="#2d3a4f" />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[2.8, 0.3, 3.8]} />
          <meshStandardMaterial color="#f5f5f5" />
        </mesh>
        <mesh position={[0, 0.7, -1.5]}>
          <boxGeometry args={[2.6, 0.4, 0.8]} />
          <meshStandardMaterial color="#8b5cf6" />
        </mesh>
      </group>
      
      {/* TV Stand */}
      <group position={[3, -1.5, 2]}>
        <mesh>
          <boxGeometry args={[2, 0.8, 0.5]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[2.5, 1.5, 0.1]} />
          <meshStandardMaterial color="#000" emissive="#333" emissiveIntensity={0.2} />
        </mesh>
      </group>
      
      {/* Lighting */}
      <pointLight position={[0, 4, 0]} intensity={1} color="#ffd700" />
      <pointLight position={[-4, 3, -4]} intensity={0.5} color="#a855f7" />
      <pointLight position={[4, 3, 4]} intensity={0.5} color="#ffd700" />
    </group>
  );
};

interface VirtualRoomTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VirtualRoomTour = ({ isOpen, onClose }: VirtualRoomTourProps) => {
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotData | null>(null);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl"
      >
        <div className="absolute top-4 right-4 z-10 flex items-center gap-4">
          <div className="glass-card rounded-full px-4 py-2">
            <p className="text-sm text-foreground">
              <Info className="h-4 w-4 inline mr-2 text-primary" />
              Click hotspots to explore
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-12 w-12 rounded-full glass-card hover:bg-destructive/20"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <Canvas className="w-full h-full">
          <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={60} />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={3}
            maxDistance={12}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
          />
          <ambientLight intensity={0.3} />
          <Environment preset="night" />
          
          <Suspense fallback={null}>
            <Room />
            {hotspots.map((hotspot, index) => (
              <Hotspot
                key={index}
                {...hotspot}
                onClick={() => setSelectedHotspot(hotspot)}
              />
            ))}
          </Suspense>
        </Canvas>

        {/* Hotspot Detail Panel */}
        <AnimatePresence>
          {selectedHotspot && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
              <div className="glass-card rounded-2xl p-6 min-w-[300px] border border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-xl bg-gradient-gold flex items-center justify-center shadow-glow">
                    <selectedHotspot.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {selectedHotspot.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedHotspot.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedHotspot(null)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Hint */}
        <div className="absolute bottom-8 right-8 glass-card rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-2 font-medium">Controls</p>
          <div className="space-y-1 text-xs text-muted-foreground/70">
            <p>🖱️ Drag to rotate</p>
            <p>📍 Click hotspots for details</p>
            <p>🔍 Scroll to zoom</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
