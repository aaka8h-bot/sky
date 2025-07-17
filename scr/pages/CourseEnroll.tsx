import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Shield, Clock, Users } from 'lucide-react';
import upiQrImage from '@/assets/upi-qr.jpg';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getCourses, createPaymentRequest, Course } from '@/lib/storage';
import { useAuth } from '@/components/Auth/AuthContext';
import { toast } from '@/hooks/use-toast';

export default function CourseEnroll() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const courses = getCourses();
    const foundCourse = courses.find(c => c.id === courseId);
    if (foundCourse) {
      setCourse(foundCourse);
      setAmount(foundCourse.price.toString());
    } else {
      toast({
        title: "Course Not Found",
        description: "The requested course could not be found.",
        variant: "destructive",
      });
      navigate('/courses');
    }
  }, [courseId, user, navigate]);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course || !user) return;

    if (!utrNumber.trim()) {
      toast({
        title: "UTR Number Required",
        description: "Please enter your UTR number to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (parseInt(amount) !== course.price) {
      toast({
        title: "Incorrect Amount",
        description: `The amount should be ₹${course.price}`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      createPaymentRequest({
        userId: user.id,
        courseId: course.id,
        amount: course.price,
        utrNumber: utrNumber.trim(),
        userEmail: user.email,
        courseName: course.title
      });

      toast({
        title: "Payment Request Submitted",
        description: "Your payment is being verified. You'll receive an email confirmation once approved.",
      });

      navigate('/courses');
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit payment request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Course...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/courses')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Course Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video relative overflow-hidden rounded-lg">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>{course.level}</span>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">What you'll learn:</h4>
                  <p className="text-sm text-muted-foreground">{course.content}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Course Enrollment</span>
                </CardTitle>
                <CardDescription>
                  Complete your payment to get instant access to the course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-6 border rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-2">
                    ₹{course.price.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">One-time payment</p>
                </div>

                {/* UPI QR Code Section */}
                <div className="text-center p-6 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-4">Pay via UPI</h4>
                  <div className="w-48 h-48 bg-white border rounded-lg mx-auto mb-4 overflow-hidden">
                    <img 
                      src={upiQrImage} 
                      alt="UPI QR Code" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-sm font-medium mb-2">UPI ID: aakash2007@fam</p>
                  <p className="text-sm text-muted-foreground">
                    Scan the QR code or use UPI ID to make payment
                  </p>
                </div>

                {/* Payment Verification Form */}
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount Paid (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount paid"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="utr">UTR Number</Label>
                    <Input
                      id="utr"
                      type="text"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="Enter your 12-digit UTR number"
                      maxLength={12}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      You'll find the UTR number in your payment confirmation message
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                  </Button>
                </form>

                <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 mt-1 text-green-500" />
                  <div>
                    <p className="font-medium">Secure Payment Process</p>
                    <p className="text-xs">
                      Your payment will be verified within 24 hours. Course access will be granted upon approval.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}