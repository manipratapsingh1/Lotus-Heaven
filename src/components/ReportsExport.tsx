import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useBookings } from '@/hooks/useBookings';
import { useRooms } from '@/hooks/useRooms';
import { FileText, Download, Calendar as CalendarIcon, FileSpreadsheet, Loader2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type ReportType = 'bookings' | 'revenue' | 'occupancy';

const parseDate = (d: any): Date => {
  if (!d) return new Date();
  if (d instanceof Date) return d;
  if (typeof d === 'string') return parseISO(d);
  return new Date(d);
};

export const ReportsExport = () => {
  const { data: bookings = [] } = useBookings('admin') as { data: any[] };
  const { data: rooms = [] } = useRooms();
  const { toast } = useToast();
  const [reportType, setReportType] = useState<ReportType>('bookings');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [isExporting, setIsExporting] = useState(false);

  const filteredBookings = bookings.filter(booking => {
    const checkIn = parseDate(booking.checkIn);
    return isWithinInterval(checkIn, { start: dateRange.from, end: dateRange.to });
  });

  const generateCSV = () => {
    let csvContent = '';
    let filename = '';

    if (reportType === 'bookings') {
      csvContent = 'Booking ID,Guest Name,Email,Phone,Room,Check In,Check Out,Guests,Total Price,Status,Created At\n';
      filteredBookings.forEach(booking => {
        const room = rooms.find(r => r.id === booking.roomId);
        csvContent += `${booking.id},"${booking.guestName}","${booking.guestEmail}","${booking.guestPhone}","${room?.name || 'N/A'}",${booking.checkIn},${booking.checkOut},${booking.guests},₹${booking.totalPrice},${booking.status},"${booking.createdAt}"\n`;
      });
      filename = `bookings_report_${format(dateRange.from, 'yyyyMMdd')}_${format(dateRange.to, 'yyyyMMdd')}.csv`;
    } else if (reportType === 'revenue') {
      const totalRevenue = filteredBookings.reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);
      const confirmedRevenue = filteredBookings
        .filter(b => b.status === 'CONFIRMED')
        .reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);
      const pendingRevenue = filteredBookings
        .filter(b => b.status === 'PENDING')
        .reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);

      csvContent = 'Metric,Value\n';
      csvContent += `Report Period,"${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}"\n`;
      csvContent += `Total Bookings,${filteredBookings.length}\n`;
      csvContent += `Total Revenue,₹${totalRevenue.toFixed(2)}\n`;
      csvContent += `Confirmed Revenue,₹${confirmedRevenue.toFixed(2)}\n`;
      csvContent += `Pending Revenue,₹${pendingRevenue.toFixed(2)}\n`;
      csvContent += `Average Booking Value,₹${(totalRevenue / filteredBookings.length || 0).toFixed(2)}\n`;
      csvContent += '\nRevenue by Room Type\n';
      csvContent += 'Room Type,Bookings,Revenue\n';
      
      const roomTypeStats: Record<string, { count: number; revenue: number }> = {};
      filteredBookings.forEach(booking => {
        const room = rooms.find(r => r.id === booking.roomId);
        const type = room?.type || 'unknown';
        if (!roomTypeStats[type]) roomTypeStats[type] = { count: 0, revenue: 0 };
        roomTypeStats[type].count++;
        roomTypeStats[type].revenue += Number(booking.totalPrice || 0);
      });
      
      Object.entries(roomTypeStats).forEach(([type, stats]) => {
        csvContent += `${type},${stats.count},₹${stats.revenue.toFixed(2)}\n`;
      });
      
      filename = `revenue_report_${format(dateRange.from, 'yyyyMMdd')}_${format(dateRange.to, 'yyyyMMdd')}.csv`;
    } else if (reportType === 'occupancy') {
      csvContent = 'Room Name,Type,Total Days,Booked Days,Occupancy Rate,Revenue\n';
      
      const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
      
      rooms.forEach(room => {
        const roomBookings = filteredBookings.filter(b => b.roomId === room.id && b.status === 'CONFIRMED');
        const bookedDays = roomBookings.reduce((sum, b) => {
          const checkIn = parseDate(b.checkIn);
          const checkOut = parseDate(b.checkOut);
          return sum + Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        }, 0);
        const revenue = roomBookings.reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);
        const occupancyRate = ((bookedDays / days) * 100).toFixed(1);
        
        csvContent += `"${room.name}",${room.type},${days},${bookedDays},${occupancyRate}%,₹${revenue.toFixed(2)}\n`;
      });
      
      filename = `occupancy_report_${format(dateRange.from, 'yyyyMMdd')}_${format(dateRange.to, 'yyyyMMdd')}.csv`;
    }

    return { csvContent, filename };
  };

  const downloadCSV = () => {
    setIsExporting(true);
    try {
      const { csvContent, filename } = generateCSV();
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
      
      toast({
        title: 'Export Successful',
        description: `${filename} has been downloaded`,
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to generate report',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const downloadPDF = () => {
    setIsExporting(true);
    try {
      // Generate HTML content for PDF
      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Report - ${reportType}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            h1 { color: #1a1a2e; border-bottom: 2px solid #d4af37; padding-bottom: 10px; }
            h2 { color: #4a4a6a; margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #1a1a2e; color: white; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .metric { display: inline-block; margin-right: 40px; }
            .metric-value { font-size: 24px; font-weight: bold; color: #d4af37; }
            .metric-label { font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <h1>Lotus Haven - ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</h1>
          <p>Period: ${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}</p>
      `;

      if (reportType === 'bookings') {
        htmlContent += `
          <div class="summary">
            <div class="metric">
              <div class="metric-value">${filteredBookings.length}</div>
              <div class="metric-label">Total Bookings</div>
            </div>
            <div class="metric">
              <div class="metric-value">₹${filteredBookings.reduce((s, b) => s + Number(b.totalPrice || 0), 0).toLocaleString()}</div>
              <div class="metric-label">Total Revenue</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Guest Name</th>
                <th>Room</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
        `;
        filteredBookings.forEach(booking => {
          const room = rooms.find(r => r.id === booking.roomId);
          htmlContent += `
            <tr>
              <td>${booking.guestName}</td>
              <td>${room?.name || 'N/A'}</td>
              <td>${booking.checkIn}</td>
              <td>${booking.checkOut}</td>
              <td>₹${Number(booking.totalPrice).toFixed(2)}</td>
              <td>${booking.status}</td>
            </tr>
          `;
        });
        htmlContent += '</tbody></table>';
      } else if (reportType === 'revenue') {
        const totalRevenue = filteredBookings.reduce((s, b) => s + Number(b.totalPrice || 0), 0);
        htmlContent += `
          <div class="summary">
            <div class="metric">
              <div class="metric-value">₹${totalRevenue.toLocaleString()}</div>
              <div class="metric-label">Total Revenue</div>
            </div>
            <div class="metric">
              <div class="metric-value">${filteredBookings.length}</div>
              <div class="metric-label">Total Bookings</div>
            </div>
            <div class="metric">
              <div class="metric-value">₹${(totalRevenue / filteredBookings.length || 0).toFixed(0)}</div>
              <div class="metric-label">Avg. Booking Value</div>
            </div>
          </div>
        `;
      } else if (reportType === 'occupancy') {
        const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
        htmlContent += `
          <table>
            <thead>
              <tr>
                <th>Room</th>
                <th>Type</th>
                <th>Booked Days</th>
                <th>Occupancy Rate</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
        `;
        rooms.forEach(room => {
          const roomBookings = filteredBookings.filter(b => b.roomId === room.id && b.status === 'CONFIRMED');
          const bookedDays = roomBookings.reduce((sum, b) => {
            const checkIn = parseDate(b.checkIn);
            const checkOut = parseDate(b.checkOut);
            return sum + Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
          }, 0);
          const revenue = roomBookings.reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);
          htmlContent += `
            <tr>
              <td>${room.name}</td>
              <td>${room.type}</td>
              <td>${bookedDays} / ${days}</td>
              <td>${((bookedDays / days) * 100).toFixed(1)}%</td>
              <td>₹${revenue.toFixed(2)}</td>
            </tr>
          `;
        });
        htmlContent += '</tbody></table>';
      }

      htmlContent += '</body></html>';

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.print();
      }

      toast({
        title: 'PDF Generated',
        description: 'Print dialog opened for PDF export',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to generate PDF',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="glass-card border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="h-10 w-10 rounded-xl bg-gradient-accent flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          Export Reports
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Report Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Report Type</label>
            <Select value={reportType} onValueChange={(v) => setReportType(v as ReportType)}>
              <SelectTrigger className="glass border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bookings">Bookings Report</SelectItem>
                <SelectItem value="revenue">Revenue Report</SelectItem>
                <SelectItem value="occupancy">Occupancy Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range From */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">From Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal glass border-border/50")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(dateRange.from, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange.from}
                  onSelect={(date) => date && setDateRange(prev => ({ ...prev, from: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Date Range To */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">To Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal glass border-border/50")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(dateRange.to, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange.to}
                  onSelect={(date) => date && setDateRange(prev => ({ ...prev, to: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Summary Preview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4"
        >
          <h4 className="font-medium mb-3 text-foreground">Report Preview</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total Records</p>
              <p className="text-xl font-bold text-primary">{filteredBookings.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Revenue</p>
              <p className="text-xl font-bold text-success">
                ₹{filteredBookings.reduce((s, b) => s + Number(b.totalPrice || 0), 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Confirmed</p>
              <p className="text-xl font-bold text-foreground">
                {filteredBookings.filter(b => b.status === 'CONFIRMED').length}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Pending</p>
              <p className="text-xl font-bold text-warning">
                {filteredBookings.filter(b => b.status === 'PENDING').length}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Export Buttons */}
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={downloadCSV}
            disabled={isExporting || filteredBookings.length === 0}
            className="bg-gradient-gold hover:opacity-90 text-primary-foreground"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileSpreadsheet className="h-4 w-4 mr-2" />
            )}
            Export as CSV
          </Button>
          <Button
            onClick={downloadPDF}
            disabled={isExporting || filteredBookings.length === 0}
            variant="outline"
            className="border-primary/50 text-primary hover:bg-primary/10"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Export as PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
