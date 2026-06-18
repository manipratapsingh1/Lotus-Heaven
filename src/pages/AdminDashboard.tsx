import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRooms, useCreateRoom, useUpdateRoom, useDeleteRoom } from '@/hooks/useRooms';
import { useBookings, useUpdateBookingStatus } from '@/hooks/useBookings';
import { useAuthStore } from '@/lib/stores/authStore';
import { MOCK_HOTEL_ID } from '@/lib/mock-data';
import { Plus, Edit, Trash2, BarChart3, Hotel, CalendarDays, FileText, MessageSquare, ClipboardList, Star, CheckCircle2, XCircle, Clock, Eye } from 'lucide-react';
import { Room } from '@/lib/types';
import { AdminAnalytics } from '@/components/AdminAnalytics';
import { AIRecommendations } from '@/components/AIRecommendations';
import { AdminAvailabilityCalendar } from '@/components/AdminAvailabilityCalendar';
import { ReportsExport } from '@/components/ReportsExport';
import { GuestMessaging } from '@/components/GuestMessaging';
import { ReviewResponseSystem } from '@/components/ReviewResponseSystem';
import { AIYieldManagement } from '@/components/AIYieldManagement';
import { FloorBlueprintViewer } from '@/components/FloorBlueprintViewer';
import { Map as MapIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const { user, isAuthenticated, isLoading: authLoading, checkAuth } = useAuthStore();
  
  const { data: rooms = [] } = useRooms();
  const { data: bookings = [] } = useBookings('admin');
  const createRoom = useCreateRoom();
  const updateRoom = useUpdateRoom();
  const deleteRoom = useDeleteRoom();
  const updateBookingStatus = useUpdateBookingStatus();

  const [formData, setFormData] = useState({
    name: '',
    type: 'deluxe',
    description: '',
    price: '',
    originalPrice: '',
    capacity: '',
    size: '',
    amenities: '',
    images: '',
  });

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const isDemoMode = !isAuthenticated || !isAdmin;

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authLoading) return;
    // Always allow access — show demo mode if not admin
    setLoading(false);
  }, [authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const roomData = {
      hotelId: MOCK_HOTEL_ID,
      name: formData.name,
      type: formData.type as 'deluxe' | 'suite' | 'executive' | 'standard',
      description: formData.description,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      capacity: parseInt(formData.capacity),
      size: parseFloat(formData.size),
      amenities: formData.amenities.split(',').map(a => a.trim()),
      images: formData.images ? formData.images.split(',').map(i => i.trim()) : [],
      available: true,
    };

    try {
      if (editingRoom) {
        await updateRoom.mutateAsync({ id: editingRoom.id, data: roomData });
      } else {
        await createRoom.mutateAsync(roomData);
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving room:', error);
    }
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      type: room.type,
      description: room.description,
      price: room.price.toString(),
      originalPrice: room.originalPrice?.toString() || '',
      capacity: room.capacity.toString(),
      size: room.size.toString(),
      amenities: room.amenities.join(', '),
      images: room.images.map((img: any) => typeof img === 'string' ? img : img.url).join(', '),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this room?')) {
      await deleteRoom.mutateAsync(id);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await updateBookingStatus.mutateAsync({ id: bookingId, status: newStatus });
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'deluxe',
      description: '',
      price: '',
      originalPrice: '',
      capacity: '',
      size: '',
      amenities: '',
      images: '',
    });
    setEditingRoom(null);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { class: string; icon: any }> = {
      CONFIRMED: { class: 'bg-green-500/10 text-green-400 border-green-500/30', icon: CheckCircle2 },
      PENDING: { class: 'bg-amber-500/10 text-amber-400 border-amber-500/30', icon: Clock },
      CANCELLED: { class: 'bg-red-500/10 text-red-400 border-red-500/30', icon: XCircle },
      COMPLETED: { class: 'bg-blue-500/10 text-blue-400 border-blue-500/30', icon: CheckCircle2 },
    };
    const config = statusMap[status] || statusMap.PENDING;
    const Icon = config.icon;
    return (
      <Badge variant="outline" className={`${config.class} gap-1`}>
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const getRoomImage = (room: any) => {
    if (!room?.images || room.images.length === 0) {
      return 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800';
    }
    const firstImage = room.images[0];
    return typeof firstImage === 'string' ? firstImage : firstImage?.url || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800';
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="h-12 w-12 mx-auto rounded-xl bg-gradient-gold animate-pulse" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </motion.div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold mb-3">
            <span className="bg-gradient-gold bg-clip-text text-transparent">Admin Dashboard</span>
          </h1>
          <p className="text-lg text-muted-foreground">Manage your hotel operations and analytics</p>
          {isDemoMode && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 px-4 py-3 rounded-xl glass border border-amber-500/30 bg-amber-500/5"
            >
              <p className="text-sm text-amber-400">
                <span className="font-semibold">Demo Mode</span> — You're viewing the dashboard with sample data. Log in as an admin to manage live data.
              </p>
            </motion.div>
          )}
        </motion.div>

        <Tabs defaultValue="analytics" className="space-y-8">
          <TabsList className="glass-card border-border/50 p-1 flex-wrap h-auto">
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-gold data-[state=active]:text-primary-foreground gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-gradient-gold data-[state=active]:text-primary-foreground gap-2">
              <ClipboardList className="h-4 w-4" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-gradient-gold data-[state=active]:text-primary-foreground gap-2">
              <CalendarDays className="h-4 w-4" />
              Availability
            </TabsTrigger>
            <TabsTrigger value="yield" className="data-[state=active]:bg-gradient-gold data-[state=active]:text-primary-foreground gap-2">
              <Sparkles className="h-4 w-4" />
              Yield Management
            </TabsTrigger>
            <TabsTrigger value="rooms" className="data-[state=active]:bg-gradient-gold data-[state=active]:text-primary-foreground gap-2">
              <Hotel className="h-4 w-4" />
              Rooms
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-gradient-gold data-[state=active]:text-primary-foreground gap-2">
              <Star className="h-4 w-4" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-gradient-gold data-[state=active]:text-primary-foreground gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-gradient-gold data-[state=active]:text-primary-foreground gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <AdminAnalytics />
          </TabsContent>

          {/* Bookings Management Tab */}
          <TabsContent value="bookings">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Bookings Management</h2>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                    {bookings.filter((b: any) => b.status === 'CONFIRMED').length} Confirmed
                  </Badge>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
                    {bookings.filter((b: any) => b.status === 'PENDING').length} Pending
                  </Badge>
                </div>
              </div>

              <Card className="glass-card border-border/50">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/30">
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Guest</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Room</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Check In</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Check Out</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Total</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence>
                          {bookings.map((booking: any, index: number) => {
                            const room = rooms.find((r: any) => r.id === booking.roomId) || booking.room;
                            return (
                              <motion.tr
                                key={booking.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="border-b border-border/20 hover:bg-primary/5 transition-colors"
                              >
                                <td className="p-4">
                                  <div>
                                    <p className="font-medium text-sm">{booking.guestName}</p>
                                    <p className="text-xs text-muted-foreground">{booking.guestEmail}</p>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <p className="text-sm">{room?.name || 'N/A'}</p>
                                  <p className="text-xs text-muted-foreground capitalize">{room?.type}</p>
                                </td>
                                <td className="p-4 text-sm">
                                  {(() => {
                                    try { return format(new Date(booking.checkIn), 'MMM d, yyyy'); }
                                    catch { return booking.checkIn; }
                                  })()}
                                </td>
                                <td className="p-4 text-sm">
                                  {(() => {
                                    try { return format(new Date(booking.checkOut), 'MMM d, yyyy'); }
                                    catch { return booking.checkOut; }
                                  })()}
                                </td>
                                <td className="p-4 text-sm font-semibold">₹{Number(booking.totalPrice).toLocaleString()}</td>
                                <td className="p-4">{getStatusBadge(booking.status)}</td>
                                <td className="p-4">
                                  <div className="flex items-center gap-1">
                                    {booking.status === 'PENDING' && (
                                      <>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleStatusChange(booking.id, 'CONFIRMED')}
                                          className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                                        >
                                          <CheckCircle2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleStatusChange(booking.id, 'CANCELLED')}
                                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                        >
                                          <XCircle className="h-4 w-4" />
                                        </Button>
                                      </>
                                    )}
                                    {booking.status === 'CONFIRMED' && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleStatusChange(booking.id, 'COMPLETED')}
                                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                      >
                                        <CheckCircle2 className="h-4 w-4" />
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setSelectedBooking(selectedBooking?.id === booking.id ? null : booking)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </motion.tr>
                            );
                          })}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>

                  {bookings.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <ClipboardList className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      <p>No bookings found</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Booking Details Panel */}
              <AnimatePresence>
                {selectedBooking && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Card className="glass-card border-primary/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span>Booking Details — {selectedBooking.guestName}</span>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(null)}>✕</Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground mb-1">Email</p>
                            <p className="font-medium">{selectedBooking.guestEmail}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Phone</p>
                            <p className="font-medium">{selectedBooking.guestPhone}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Guests</p>
                            <p className="font-medium">{selectedBooking.guests}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Status</p>
                            {getStatusBadge(selectedBooking.status)}
                          </div>
                          {selectedBooking.specialRequests && (
                            <div className="col-span-full">
                              <p className="text-muted-foreground mb-1">Special Requests</p>
                              <p className="font-medium">{selectedBooking.specialRequests}</p>
                            </div>
                          )}
                          <div className="col-span-full">
                            <p className="text-muted-foreground mb-2">Update Status</p>
                            <div className="flex gap-2">
                              {['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(status => (
                                <Button
                                  key={status}
                                  variant={selectedBooking.status === status ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => handleStatusChange(selectedBooking.id, status)}
                                  disabled={selectedBooking.status === status}
                                  className={selectedBooking.status === status ? 'bg-gradient-gold text-primary-foreground' : ''}
                                >
                                  {status}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <div className="space-y-8">
              <AdminAvailabilityCalendar />
              <FloorBlueprintViewer />
            </div>
          </TabsContent>

          <TabsContent value="yield">
            <AIYieldManagement />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsExport />
          </TabsContent>

          <TabsContent value="messages">
            <GuestMessaging />
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Review Management</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {rooms.slice(0, 6).map((room: any) => (
                  <ReviewResponseSystem key={room.id} roomId={room.id} />
                ))}
              </div>
              {rooms.length === 0 && (
                <Card className="glass-card border-border/50">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <Star className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p>No rooms found. Add rooms first to manage reviews.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="rooms">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Rooms Management</h2>
                
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) resetForm();
                }}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-gold hover:opacity-90 text-primary-foreground">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Room
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-card border-2 border-primary/20">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                        {editingRoom ? 'Edit Room' : 'Add New Room'}
                      </DialogTitle>
                    </DialogHeader>
                    
                    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Room Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="type">Room Type</Label>
                          <Select
                            value={formData.type}
                            onValueChange={(value) => setFormData({ ...formData, type: value })}
                          >
                            <SelectTrigger id="type" className="w-full bg-background border-input rounded-md h-10">
                              <SelectValue placeholder="Select room type" />
                            </SelectTrigger>
                            <SelectContent className="glass-card border border-primary/20">
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="deluxe">Deluxe</SelectItem>
                              <SelectItem value="suite">Suite</SelectItem>
                              <SelectItem value="executive">Executive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2 col-span-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="price">Price per Night (₹)</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="originalPrice">Original Price (₹)</Label>
                          <Input
                            id="originalPrice"
                            type="number"
                            step="0.01"
                            value={formData.originalPrice}
                            onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="capacity">Capacity (guests)</Label>
                          <Input
                            id="capacity"
                            type="number"
                            value={formData.capacity}
                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="size">Size (m²)</Label>
                          <Input
                            id="size"
                            type="number"
                            step="0.1"
                            value={formData.size}
                            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2 col-span-2">
                          <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                          <Input
                            id="amenities"
                            value={formData.amenities}
                            onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                            placeholder="WiFi, TV, Mini Bar, etc."
                            required
                          />
                        </div>

                        <div className="space-y-2 col-span-2">
                          <Label htmlFor="images">Image URLs (comma-separated)</Label>
                          <Textarea
                            id="images"
                            value={formData.images}
                            onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-gradient-gold hover:opacity-90 text-primary-foreground py-6 font-semibold">
                        {editingRoom ? 'Update Room' : 'Create Room'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Rooms Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((room: any, index: number) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="glass-card border-border/50 overflow-hidden group hover:shadow-glow transition-all duration-300">
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={getRoomImage(room)}
                          alt={room.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className={room.available ? 'bg-green-500/80' : 'bg-red-500/80'}>
                            {room.available ? 'Available' : 'Unavailable'}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-foreground">{room.name}</h3>
                            <p className="text-sm text-muted-foreground capitalize">{room.type}</p>
                          </div>
                          <p className="text-lg font-bold text-primary">₹{room.price}</p>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{room.description}</p>
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {room.amenities?.slice(0, 3).map((amenity: string) => (
                            <Badge key={amenity} variant="secondary" className="text-[10px] px-2 py-0">
                              {amenity}
                            </Badge>
                          ))}
                          {room.amenities?.length > 3 && (
                            <span className="text-[10px] text-muted-foreground">+{room.amenities.length - 3} more</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(room)}>
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(room.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {rooms.length === 0 && (
                <Card className="glass-card border-border/50">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <Hotel className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p>No rooms yet. Click "Add Room" to create your first room.</p>
                  </CardContent>
                </Card>
              )}

              {/* AI Business Insights */}
              <AIRecommendations />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
