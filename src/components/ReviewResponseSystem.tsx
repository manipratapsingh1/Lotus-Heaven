import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { reviewsApi } from '@/lib/api-client';

interface ReviewResponseSystemProps {
  roomId?: string;
}

export const ReviewResponseSystem = ({ roomId }: ReviewResponseSystemProps) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [respondedIds, setRespondedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;
    const loadReviews = async () => {
      try {
        const data = await reviewsApi.getByRoom(roomId);
        setReviews(Array.isArray(data) ? data : []);
      } catch {
        // Reviews may not be accessible
      }
    };
    loadReviews();
  }, [roomId]);

  const handleRespond = (reviewId: string) => {
    if (!responses[reviewId]?.trim()) return;
    setRespondedIds((prev) => new Set(prev).add(reviewId));
    setExpandedId(null);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Review Responses
          {reviews.length > 0 && (
            <Badge variant="secondary" className="ml-auto">{reviews.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <Star className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No reviews to respond to yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 rounded-xl border border-border/30 glass space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-gold flex items-center justify-center text-xs text-primary-foreground font-bold">
                      {(review.user?.fullName || 'G').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{review.user?.fullName || 'Guest'}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < review.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {review.title && (
                  <p className="text-sm font-medium text-foreground">{review.title}</p>
                )}
                {review.comment && (
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                )}

                {respondedIds.has(review.id) ? (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    Response sent
                  </div>
                ) : expandedId === review.id ? (
                  <div className="space-y-2 pt-2 border-t border-border/20">
                    <Textarea
                      value={responses[review.id] || ''}
                      onChange={(e) =>
                        setResponses((prev) => ({ ...prev, [review.id]: e.target.value }))
                      }
                      placeholder="Write your response to this review..."
                      className="text-sm min-h-[80px]"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedId(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        className="bg-gradient-gold hover:opacity-90 text-primary-foreground"
                        onClick={() => handleRespond(review.id)}
                      >
                        <Send className="h-3.5 w-3.5 mr-1.5" />
                        Send
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary text-xs"
                    onClick={() => setExpandedId(review.id)}
                  >
                    <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                    Respond
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
