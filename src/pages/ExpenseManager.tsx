import { useState, useMemo } from 'react';
import { Navigation } from '@/components/Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Download, AlertTriangle, Sparkles, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useExpenseStore, CATEGORY_CONFIG } from '@/lib/stores/expenseStore';
import { useTripStore } from '@/lib/stores/tripStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ExpenseManager = () => {
  const { expenses, addExpense, deleteExpense, budgets, setBudget } = useExpenseStore();
  const { trips } = useTripStore();
  const [selectedTripId, setSelectedTripId] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ tripId: '', category: 'food', title: '', amount: '', currency: '₹', date: new Date().toISOString().split('T')[0], notes: '' });

  const filtered = useMemo(() => selectedTripId === 'all' ? expenses : expenses.filter((e) => e.tripId === selectedTripId), [expenses, selectedTripId]);
  const total = filtered.reduce((sum, e) => sum + e.amount, 0);
  const budget = selectedTripId !== 'all' ? budgets[selectedTripId] || 0 : Object.values(budgets).reduce((s, b) => s + b, 0);

  const categoryBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {};
    filtered.forEach((e) => { breakdown[e.category] = (breakdown[e.category] || 0) + e.amount; });
    return Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
  }, [filtered]);

  const dailySpending = useMemo(() => {
    const daily: Record<string, number> = {};
    filtered.forEach((e) => { daily[e.date] = (daily[e.date] || 0) + e.amount; });
    return Object.entries(daily).sort((a, b) => a[0].localeCompare(b[0])).slice(-7);
  }, [filtered]);

  const maxDaily = Math.max(...dailySpending.map(([, v]) => v), 1);
  const avgDaily = dailySpending.length > 0 ? total / dailySpending.length : 0;

  // AI forecast
  const forecastDaysRemaining = selectedTripId !== 'all' ? (() => {
    const trip = trips.find((t) => t.id === selectedTripId);
    if (!trip) return 0;
    const end = new Date(trip.endDate);
    const now = new Date();
    return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  })() : 0;
  const projectedTotal = avgDaily > 0 && forecastDaysRemaining > 0 ? total + avgDaily * forecastDaysRemaining : total;
  const budgetDiff = budget > 0 ? ((projectedTotal - budget) / budget) * 100 : 0;

  const handleAdd = () => {
    addExpense({
      tripId: newExpense.tripId || selectedTripId || 'general',
      category: newExpense.category as any,
      title: newExpense.title,
      amount: parseFloat(newExpense.amount) || 0,
      currency: newExpense.currency,
      date: newExpense.date,
      notes: newExpense.notes,
      paidBy: 'You',
      splitWith: [],
    });
    setNewExpense({ tripId: '', category: 'food', title: '', amount: '', currency: '₹', date: new Date().toISOString().split('T')[0], notes: '' });
    setIsAddOpen(false);
  };

  const exportCSV = () => {
    const csv = ['Title,Category,Amount,Currency,Date,Notes', ...filtered.map((e) => `"${e.title}","${e.category}",${e.amount},"${e.currency}","${e.date}","${e.notes}"`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'expenses.csv'; a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />

      <section className="relative pt-28 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.12),transparent_60%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 glass-card rounded-full text-sm font-medium text-primary mb-4"><DollarSign className="h-4 w-4" /> Smart Tracking</div>
              <h1 className="text-4xl md:text-6xl font-bold"><span className="luxury-text">Expense Manager</span></h1>
              <p className="text-muted-foreground text-lg mt-2">Track spending, manage budgets, get AI insights</p>
            </div>
            <div className="flex items-center gap-3">
              <select className="px-4 py-2 glass-card rounded-xl border border-border/30 bg-transparent text-foreground text-sm" value={selectedTripId} onChange={(e) => setSelectedTripId(e.target.value)}>
                <option value="all">All Expenses</option>
                {trips.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <Button variant="outline" onClick={exportCSV} className="gap-2"><Download className="h-4 w-4" />Export</Button>
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild><Button className="bg-gradient-gold hover:opacity-90 text-primary-foreground font-semibold px-6 py-5"><Plus className="h-4 w-4 mr-2" />Add Expense</Button></DialogTrigger>
                <DialogContent className="glass-card border-2 border-primary/20">
                  <DialogHeader><DialogTitle className="text-xl font-bold luxury-text">Add Expense</DialogTitle></DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Title</Label><Input value={newExpense.title} onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })} placeholder="Dinner at restaurant" /></div>
                      <div className="space-y-2 flex flex-col justify-end">
                        <Label className="mb-1">Category</Label>
                        <Select value={newExpense.category} onValueChange={(val) => setNewExpense({ ...newExpense, category: val })}>
                          <SelectTrigger className="w-full bg-background border-input rounded-md h-10">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent className="glass-card border border-primary/20">
                            {Object.entries(CATEGORY_CONFIG).map(([key, val]) => (
                              <SelectItem key={key} value={key}>
                                {val.icon} {val.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2"><Label>Amount</Label><Input type="number" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} placeholder="1500" /></div>
                      <div className="space-y-2"><Label>Date</Label><Input type="date" value={newExpense.date} onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })} /></div>
                    </div>
                    <div className="space-y-2"><Label>Notes (optional)</Label><Input value={newExpense.notes} onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })} placeholder="Paid by card" /></div>
                    <Button onClick={handleAdd} className="w-full bg-gradient-gold hover:opacity-90 text-primary-foreground py-6 font-semibold">Add Expense</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Spent', value: `₹${total.toLocaleString()}`, icon: DollarSign, color: 'from-amber-500 to-orange-500' },
            { label: 'Transactions', value: filtered.length, icon: BarChart3, color: 'from-blue-500 to-cyan-500' },
            { label: 'Avg / Day', value: `₹${Math.round(avgDaily).toLocaleString()}`, icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
            { label: budget > 0 ? 'Budget Left' : 'Set Budget', value: budget > 0 ? `₹${(budget - total).toLocaleString()}` : '—', icon: PieChart, color: 'from-purple-500 to-pink-500' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="glass-card border-border/30 group hover:border-primary/30 transition-all">
                <CardContent className="p-5">
                  <div className={`inline-flex h-11 w-11 rounded-xl bg-gradient-to-br ${stat.color} items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* AI Forecast Banner */}
        {budget > 0 && budgetDiff !== 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className={`mb-8 border-2 ${budgetDiff > 0 ? 'border-destructive/30 bg-destructive/5' : 'border-green-500/30 bg-green-500/5'}`}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${budgetDiff > 0 ? 'bg-destructive/20' : 'bg-green-500/20'}`}>
                  {budgetDiff > 0 ? <AlertTriangle className="h-6 w-6 text-destructive" /> : <TrendingDown className="h-6 w-6 text-green-400" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <p className="text-sm font-semibold">AI Budget Forecast</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {budgetDiff > 0
                      ? `You're likely to exceed your budget by ${Math.round(budgetDiff)}%. Consider reducing daily spending by ₹${Math.round((projectedTotal - budget) / Math.max(1, forecastDaysRemaining)).toLocaleString()}/day.`
                      : `Great job! You're projected to be ${Math.round(Math.abs(budgetDiff))}% under budget.`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category Breakdown */}
          <Card className="glass-card border-border/30">
            <CardHeader><CardTitle className="flex items-center gap-2"><PieChart className="h-5 w-5 text-primary" />Category Breakdown</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {categoryBreakdown.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No expenses yet</p>
              ) : (
                categoryBreakdown.map(([cat, amount]) => {
                  const config = CATEGORY_CONFIG[cat];
                  const pct = total > 0 ? (amount / total) * 100 : 0;
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium flex items-center gap-2">{config?.icon} {config?.label || cat}</span>
                        <span className="text-sm font-bold">₹{amount.toLocaleString()} ({Math.round(pct)}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-muted/30 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full" style={{ backgroundColor: config?.color || '#6B7280' }} />
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Daily Spending Chart */}
          <Card className="glass-card border-border/30">
            <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" />Daily Spending</CardTitle></CardHeader>
            <CardContent>
              {dailySpending.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No spending data yet</p>
              ) : (
                <div className="flex items-end gap-2 h-48">
                  {dailySpending.map(([date, amount]) => (
                    <div key={date} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-xs font-bold text-foreground">
                        {amount >= 1000 ? `₹${(amount / 1000).toFixed(1).replace(/\.0$/, '')}k` : `₹${amount}`}
                      </span>
                      <motion.div initial={{ height: 0 }} animate={{ height: `${(amount / maxDaily) * 100}%` }} transition={{ duration: 0.8 }}
                        className="w-full bg-gradient-to-t from-primary to-accent rounded-t-lg min-h-[4px]" />
                      <span className="text-xs text-muted-foreground">{new Date(date).toLocaleDateString('en', { day: '2-digit', month: 'short' })}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Savings Tips */}
          <Card className="glass-card border-border/30">
            <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" />AI Savings Tips</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { tip: 'Book local transport passes for better rates', savings: '15%' },
                { tip: 'Eat at local restaurants instead of tourist spots', savings: '30%' },
                { tip: 'Use walking tours for free sightseeing', savings: '₹500/day' },
                { tip: 'Book accommodations with kitchen facilities', savings: '25%' },
                { tip: 'Travel during shoulder season for lower prices', savings: '20%' },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 p-3 glass rounded-xl">
                  <span className="text-lg">💡</span>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{item.tip}</p>
                    <Badge variant="secondary" className="text-xs mt-1 bg-green-500/10 text-green-400 border-green-500/30">Save {item.savings}</Badge>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Expense List */}
        <Card className="glass-card border-border/30 mt-8">
          <CardHeader><CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5 text-primary" />All Expenses</CardTitle></CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-40" />
                <p className="text-muted-foreground">No expenses recorded yet. Start tracking!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.sort((a, b) => b.date.localeCompare(a.date)).map((expense, i) => {
                  const config = CATEGORY_CONFIG[expense.category];
                  return (
                    <motion.div key={expense.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="flex items-center gap-4 p-3 glass rounded-xl hover:bg-primary/5 transition-colors group">
                      <span className="text-2xl">{config?.icon || '📦'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">{expense.title}</p>
                        <p className="text-xs text-muted-foreground">{new Date(expense.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })} • {config?.label}</p>
                      </div>
                      <span className="text-sm font-bold text-foreground">{expense.currency}{expense.amount.toLocaleString()}</span>
                      <button onClick={() => deleteExpense(expense.id)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-destructive/20 rounded transition-all"><Trash2 className="h-4 w-4 text-destructive" /></button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default ExpenseManager;
