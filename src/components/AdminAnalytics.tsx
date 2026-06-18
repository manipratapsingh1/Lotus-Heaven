import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBookings } from '@/hooks/useBookings';
import { useRooms } from '@/hooks/useRooms';
import { DollarSign, Users, TrendingUp, Percent } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['hsl(45, 95%, 60%)', 'hsl(280, 75%, 65%)', 'hsl(230, 70%, 45%)', 'hsl(145, 70%, 55%)', 'hsl(0, 70%, 55%)'];

export const AdminAnalytics = () => {
  const { data: bookings = [] } = useBookings('admin');
  const { data: rooms = [] } = useRooms();

  // Calculate metrics
  const totalRevenue = bookings.reduce((sum: number, booking: any) => sum + Number(booking.totalPrice || 0), 0);
  const totalBookings = bookings.length;
  const occupiedRooms = bookings.filter((b: any) => b.status === 'CONFIRMED').length;
  const occupancyRate = rooms.length > 0 ? ((occupiedRooms / rooms.length) * 100).toFixed(1) : '0';

  // Revenue by month — compute from actual bookings data when available
  const monthlyData = bookings.reduce((acc: Record<string, { revenue: number; bookings: number }>, booking: any) => {
    const date = new Date(booking.createdAt || booking.checkIn);
    const month = date.toLocaleString('default', { month: 'short' });
    if (!acc[month]) acc[month] = { revenue: 0, bookings: 0 };
    acc[month].revenue += Number(booking.totalPrice || 0);
    acc[month].bookings += 1;
    return acc;
  }, {});

  const revenueData = Object.keys(monthlyData).length > 0
    ? Object.entries(monthlyData).map(([month, data]) => ({
        month,
        revenue: Math.round(data.revenue),
        bookings: data.bookings,
      }))
    : [
        { month: 'Jan', revenue: 12400, bookings: 15 },
        { month: 'Feb', revenue: 18600, bookings: 22 },
        { month: 'Mar', revenue: 24800, bookings: 31 },
        { month: 'Apr', revenue: 31200, bookings: 39 },
        { month: 'May', revenue: 28900, bookings: 36 },
        { month: 'Jun', revenue: 35400, bookings: 44 },
      ];

  // Room type distribution
  const roomTypeData = rooms.reduce((acc: any[], room: any) => {
    const existing = acc.find(item => item.name === room.type);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: room.type, value: 1 });
    }
    return acc;
  }, []);

  // Booking status distribution
  const statusData = bookings.reduce((acc: any[], booking: any) => {
    const existing = acc.find(item => item.name === booking.status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: booking.status, value: 1 });
    }
    return acc;
  }, []);

  const stats = [
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: '+12.5%',
      color: 'text-primary',
      bgGradient: 'bg-gradient-gold',
    },
    {
      title: 'Total Bookings',
      value: totalBookings.toString(),
      icon: Users,
      trend: '+8.2%',
      color: 'text-accent',
      bgGradient: 'bg-gradient-accent',
    },
    {
      title: 'Occupancy Rate',
      value: `${occupancyRate}%`,
      icon: Percent,
      trend: '+5.7%',
      color: 'text-success',
      bgGradient: 'bg-gradient-to-br from-success to-success/70',
    },
    {
      title: 'Growth Rate',
      value: '+18.3%',
      icon: TrendingUp,
      trend: '+3.1%',
      color: 'text-primary',
      bgGradient: 'bg-gradient-hero',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="glass-card border-border/50 overflow-hidden group hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-12 w-12 rounded-xl ${stat.bgGradient} flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform`}>
                    <stat.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="text-xs font-semibold text-success px-3 py-1 glass rounded-full">
                    {stat.trend}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</h3>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(45, 95%, 60%)"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(45, 95%, 60%)', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bookings by Month */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                Bookings by Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="bookings" fill="hsl(280, 75%, 65%)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Room Type Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                Room Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              {roomTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={roomTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) => {
                        const total = roomTypeData.reduce((a: number, b: any) => a + b.value, 0);
                        return `${entry.name} ${((entry.value / total) * 100).toFixed(0)}%`;
                      }}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {roomTypeData.map((_entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No room data available
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Booking Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                Booking Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) => {
                        const total = statusData.reduce((a: number, b: any) => a + b.value, 0);
                        return `${entry.name} ${((entry.value / total) * 100).toFixed(0)}%`;
                      }}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((_entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No booking data available
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
