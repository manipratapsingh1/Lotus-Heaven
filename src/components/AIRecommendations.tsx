import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export const AIRecommendations = () => {
  const [recommendations] = useState([
    { id: '1', title: 'Presidential Suite', reason: 'Based on your luxury preferences', match: 95 },
    { id: '2', title: 'Garden View Suite', reason: 'Popular with returning guests', match: 88 },
    { id: '3', title: 'Deluxe King Room', reason: 'Best value for your dates', match: 82 },
  ]);

  return (
    <Card className="glass-card border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map(rec => (
          <div key={rec.id} className="flex items-center justify-between p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
            <div>
              <p className="font-semibold text-sm">{rec.title}</p>
              <p className="text-xs text-muted-foreground">{rec.reason}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">{rec.match}%</p>
              <p className="text-xs text-muted-foreground">match</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
