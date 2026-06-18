import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Text, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface RoomBoxProps {
  position: [number, number, number];
  color: string;
  roomName: string;
  roomType: string;
  onClick: () => void;
}

function RoomBox({ position, color, roomName, roomType, onClick }: RoomBoxProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    } else if (meshRef.current) {
      meshRef.current.rotation.y = 0;
      meshRef.current.position.y = position[1];
    }
  });

  return (
    <group position={position}>
      <Box
        ref={meshRef}
        args={[1.5, 1, 1.5]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial color={hovered ? '#7C3AED' : color} />
      </Box>
      
      {hovered && (
        <Html distanceFactor={10}>
          <div className="glass px-3 py-2 rounded-lg whitespace-nowrap pointer-events-none">
            <p className="font-semibold text-white text-sm">{roomName}</p>
            <p className="text-xs text-white/70">{roomType}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

function Lobby() {
  return (
    <group position={[0, -0.5, 0]}>
      <Box args={[6, 0.2, 6]}>
        <meshStandardMaterial color="#0F6FFF" opacity={0.3} transparent />
      </Box>
      <Text
        position={[0, 0.2, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Lobby
      </Text>
    </group>
  );
}

export const Property3DExplorer = () => {
  const [selectedRoom, setSelectedRoom] = useState<{ name: string; type: string } | null>(null);

  const rooms = [
    { position: [-2, 0.5, -2] as [number, number, number], color: '#10B981', name: 'Deluxe King', type: 'Deluxe' },
    { position: [0, 0.5, -2] as [number, number, number], color: '#F59E0B', name: 'Presidential Suite', type: 'Suite' },
    { position: [2, 0.5, -2] as [number, number, number], color: '#EF4444', name: 'Executive Double', type: 'Executive' },
    { position: [-2, 0.5, 2] as [number, number, number], color: '#10B981', name: 'Deluxe Twin', type: 'Deluxe' },
    { position: [2, 0.5, 2] as [number, number, number], color: '#10B981', name: 'Deluxe Queen', type: 'Deluxe' },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full h-[500px] glass rounded-2xl overflow-hidden shadow-elegant"
      >
        <Suspense fallback={<div className="flex items-center justify-center h-full text-muted-foreground">Loading 3D Scene...</div>}>
          <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <Lobby />
          
          {rooms.map((room, index) => (
            <RoomBox
              key={index}
              position={room.position}
              color={room.color}
              roomName={room.name}
              roomType={room.type}
              onClick={() => setSelectedRoom({ name: room.name, type: room.type })}
            />
          ))}
          
            <OrbitControls enableZoom={true} enablePan={false} />
          </Canvas>
        </Suspense>
        
        <div className="absolute bottom-4 left-4 glass px-4 py-2 rounded-lg">
          <p className="text-xs text-white/70">Click & drag to rotate • Scroll to zoom • Click rooms for details</p>
        </div>
      </motion.div>

      <Dialog open={!!selectedRoom} onOpenChange={() => setSelectedRoom(null)}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>{selectedRoom?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Badge className="bg-accent">{selectedRoom?.type}</Badge>
            <p className="text-sm text-muted-foreground">
              Experience luxury and comfort in our {selectedRoom?.name}. This room features premium amenities and stunning views.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
