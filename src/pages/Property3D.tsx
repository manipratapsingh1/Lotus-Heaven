import { Navigation } from '@/components/Navigation';
import { Property3DExplorer } from '@/components/Property3DExplorer';
import { FloorPlanViewer } from '@/components/FloorPlanViewer';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Property3D = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to="/">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Property Explorer
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explore our hotel with interactive 3D visualization and real-time floor plan availability.
            </p>
          </div>

          <Tabs defaultValue="3d" className="space-y-6">
            <TabsList className="glass-card p-1.5 h-auto">
              <TabsTrigger value="3d" className="data-[state=active]:bg-gradient-gold data-[state=active]:text-primary-foreground px-6 py-2.5 rounded-lg">
                3D Explorer
              </TabsTrigger>
              <TabsTrigger value="floorplan" className="data-[state=active]:bg-gradient-gold data-[state=active]:text-primary-foreground px-6 py-2.5 rounded-lg">
                Floor Plan
              </TabsTrigger>
            </TabsList>

            <TabsContent value="3d">
              <Property3DExplorer />
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-xl">
                  <h3 className="font-semibold text-lg mb-2">Interactive 3D</h3>
                  <p className="text-sm text-muted-foreground">
                    Experience our property like never before with real-time 3D visualization
                  </p>
                </div>
                <div className="glass p-6 rounded-xl">
                  <h3 className="font-semibold text-lg mb-2">Room Details</h3>
                  <p className="text-sm text-muted-foreground">
                    Click on any room to see detailed information and availability
                  </p>
                </div>
                <div className="glass p-6 rounded-xl">
                  <h3 className="font-semibold text-lg mb-2">Full Control</h3>
                  <p className="text-sm text-muted-foreground">
                    Navigate freely with mouse controls - zoom, rotate, and explore
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="floorplan">
              <FloorPlanViewer />
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-xl">
                  <h3 className="font-semibold text-lg mb-2">Real-Time Status</h3>
                  <p className="text-sm text-muted-foreground">
                    See live availability updates for all rooms across floors
                  </p>
                </div>
                <div className="glass p-6 rounded-xl">
                  <h3 className="font-semibold text-lg mb-2">Click to Book</h3>
                  <p className="text-sm text-muted-foreground">
                    Select any available room directly from the floor plan
                  </p>
                </div>
                <div className="glass p-6 rounded-xl">
                  <h3 className="font-semibold text-lg mb-2">Multi-Floor View</h3>
                  <p className="text-sm text-muted-foreground">
                    Switch between floors to find your perfect room location
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Property3D;
