import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Users, Calendar, TrendingUp, Settings, RotateCcw, GripVertical } from 'lucide-react';

// Simplified drag-drop without external library - using native HTML5 drag API

interface Widget {
  id: string;
  title: string;
  value: string;
  change: string;
  icon: any;
  color: string;
  order: number;
}

const defaultWidgets: Widget[] = [
  { id: 'revenue', title: 'Total Revenue', value: '₹48,592', change: '+12.5%', icon: DollarSign, color: 'from-primary to-accent', order: 0 },
  { id: 'bookings', title: 'Total Bookings', value: '156', change: '+8.2%', icon: Calendar, color: 'from-accent to-success', order: 1 },
  { id: 'occupancy', title: 'Occupancy Rate', value: '78%', change: '+5.1%', icon: TrendingUp, color: 'from-success to-primary', order: 2 },
  { id: 'guests', title: 'Active Guests', value: '42', change: '+3.4%', icon: Users, color: 'from-primary to-success', order: 3 },
];

export const DragDropDashboard = () => {
  const [widgets, setWidgets] = useState<Widget[]>(defaultWidgets);
  const [isEditMode, setIsEditMode] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    const savedWidgets = localStorage.getItem('dashboardWidgets');
    if (savedWidgets) {
      try {
        setWidgets(JSON.parse(savedWidgets));
      } catch (e) {
        console.error('Failed to load saved widgets', e);
      }
    }
  }, []);

  const saveWidgets = (newWidgets: Widget[]) => {
    setWidgets(newWidgets);
    localStorage.setItem('dashboardWidgets', JSON.stringify(newWidgets));
  };

  const resetLayout = () => {
    setWidgets(defaultWidgets);
    localStorage.removeItem('dashboardWidgets');
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newWidgets = [...widgets];
    const draggedWidget = newWidgets[draggedIndex];
    newWidgets.splice(draggedIndex, 1);
    newWidgets.splice(index, 0, draggedWidget);
    
    setWidgets(newWidgets);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null) {
      saveWidgets(widgets);
    }
    setDraggedIndex(null);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Customizable Dashboard</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsEditMode(!isEditMode)}
            variant={isEditMode ? 'default' : 'outline'}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            {isEditMode ? 'Done Editing' : 'Edit Layout'}
          </Button>
          {isEditMode && (
            <Button onClick={resetLayout} variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {widgets.map((widget, index) => (
          <div
            key={widget.id}
            draggable={isEditMode}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`${isEditMode ? 'cursor-move' : ''} transition-all`}
          >
            <Card className={`glass h-full ${isEditMode ? 'ring-2 ring-primary/50' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    {isEditMode && <GripVertical className="h-4 w-4" />}
                    {widget.title}
                  </CardTitle>
                  <div className={`h-10 w-10 rounded-full bg-gradient-to-r ${widget.color} flex items-center justify-center shadow-glow`}>
                    <widget.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{widget.value}</div>
                <p className="text-sm text-success">{widget.change} from last month</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {isEditMode && (
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Drag widgets to rearrange • Layout saves automatically
        </p>
      )}
    </div>
  );
};
