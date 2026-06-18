import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { reviewsApi } from '@/lib/api-client';
import { useAuthStore } from '@/lib/stores/authStore';
import { toast } from 'sonner';

interface ReviewSystemProps {
  roomId: string;
}

export const ReviewSystem = ({ roomId }: ReviewSystemProps) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const { isAuthenticated } = useAuthStore();

  const loadReviews = async () => {
    try {
      const data = await reviewsApi.getByRoom(roomId);
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load reviews');
    }
  };

  useEffect(() => { loadReviews(); }, [roomId]);

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to leave a review');
      return;
    }

    try {
      await reviewsApi.create({ roomId, title, rating, comment });
      toast.success('Review submitted!');
      setTitle('');
      setComment('');
      setRating(5);
      loadReviews();
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  return (
    <div className="space-y-6">
      {/* Submit Review */}
      {isAuthenticated && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Leave a Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      star <= (hoveredStar || rating)
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>
            <Input
              placeholder="Review title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Share your experience..."
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <Button onClick={handleSubmit} className="bg-gradient-gold">
              Submit Review
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map(review => (
          <Card key={review.id} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{review.user?.fullName || 'Guest'}</span>
                  {review.verifiedStay && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Verified Stay</span>
                  )}
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star
                      key={s}
                      className={`h-4 w-4 ${s <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`}
                    />
                  ))}
                </div>
              </div>
              <h4 className="font-medium mb-1">{review.title}</h4>
              {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
              <p className="text-xs text-muted-foreground mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}

        {reviews.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
};
