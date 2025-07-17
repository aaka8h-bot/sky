import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCourses } from '@/lib/storage';
import { useAuth } from '@/components/Auth/AuthContext';

export default function Courses() {
  const [courses] = useState(getCourses());
  const { user } = useAuth();

  const enrolledCourseIds = user?.courses || [];

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Professional
              <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                {' '}Courses{' '}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Advance your career with industry-relevant courses designed by experts. Learn at your own pace and get certified.
            </p>
            {!user && (
              <div className="bg-card p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground mb-3">
                  Sign up to enroll in courses and track your progress
                </p>
                <Button asChild>
                  <Link to="/signup">Create Account</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => {
              const isEnrolled = enrolledCourseIds.includes(course.id);
              
              return (
                <Card key={course.id} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant={isEnrolled ? "default" : "secondary"}>
                        {isEnrolled ? 'Enrolled' : 'Available'}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="outline" className="bg-background/90">
                        {course.level}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{course.level}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-muted-foreground ml-2">4.9 (120 reviews)</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-primary">
                        ₹{course.price.toLocaleString()}
                      </div>
                      {user ? (
                        isEnrolled ? (
                          <Button variant="outline" asChild>
                            <Link to={`/course/${course.id}`}>
                              <BookOpen className="h-4 w-4 mr-2" />
                              Continue Learning
                            </Link>
                          </Button>
                        ) : (
                          <Button asChild>
                            <Link to={`/course/${course.id}/enroll`}>Enroll Now</Link>
                          </Button>
                        )
                      ) : (
                        <Button asChild>
                          <Link to="/login">Login to Enroll</Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Courses?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our courses are designed with industry best practices and real-world applications in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Expert-Led Content</h3>
              <p className="text-sm text-muted-foreground">
                Learn from industry professionals with years of experience
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Self-Paced Learning</h3>
              <p className="text-sm text-muted-foreground">
                Study at your own pace with lifetime access to materials
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Community Support</h3>
              <p className="text-sm text-muted-foreground">
                Join a community of learners and get help when needed
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Certification</h3>
              <p className="text-sm text-muted-foreground">
                Get industry-recognized certificates upon completion
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have advanced their careers with our professional courses.
          </p>
          {!user && (
            <Button size="lg" variant="secondary" asChild className="text-lg px-8">
              <Link to="/signup">Create Your Account</Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}