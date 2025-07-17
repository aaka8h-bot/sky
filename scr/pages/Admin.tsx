import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  CreditCard, 
  MessageCircle, 
  BarChart3, 
  Settings,
  Eye,
  Check,
  X,
  Mail,
  Plus,
  Edit,
  Trash2,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  getUsers, 
  getPaymentRequests, 
  savePaymentRequests,
  getContacts,
  saveContacts,
  getCourses,
  saveCourses,
  getBlogPosts,
  saveBlogPosts,
  getProjects,
  saveProjects,
  User,
  PaymentRequest,
  ContactForm,
  Course,
  BlogPost,
  Project 
} from '@/lib/storage';
import { toast } from '@/hooks/use-toast';

const ADMIN_PASSWORD = 'Aakash@@2007';

// Course Management Component
interface CourseManagementProps {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  onBack: () => void;
}

function CourseManagement({ courses, setCourses, onBack }: CourseManagementProps) {
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSaveCourse = (courseData: Partial<Course>) => {
    if (editingCourse) {
      // Update existing course
      const updatedCourses = courses.map(course =>
        course.id === editingCourse.id ? { ...course, ...courseData } : course
      );
      setCourses(updatedCourses);
      saveCourses(updatedCourses);
    } else {
      // Create new course
      const newCourse: Course = {
        id: Date.now().toString(),
        title: courseData.title || '',
        description: courseData.description || '',
        price: courseData.price || 0,
        duration: courseData.duration || '',
        level: courseData.level || '',
        thumbnail: courseData.thumbnail || '/api/placeholder/400/250',
        content: courseData.content || '',
        isActive: courseData.isActive !== false
      };
      const updatedCourses = [...courses, newCourse];
      setCourses(updatedCourses);
      saveCourses(updatedCourses);
    }
    setEditingCourse(null);
    setIsDialogOpen(false);
    toast({ title: "Course saved successfully" });
  };

  const handleDeleteCourse = (courseId: string) => {
    const updatedCourses = courses.filter(course => course.id !== courseId);
    setCourses(updatedCourses);
    saveCourses(updatedCourses);
    toast({ title: "Course deleted successfully" });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Courses</CardTitle>
          <CardDescription>Add, edit, or remove courses</CardDescription>
        </div>
        <div className="space-x-2">
          <Button onClick={() => { setEditingCourse(null); setIsDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold">{course.title}</h4>
                  <p className="text-sm text-muted-foreground">{course.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-lg font-bold">₹{course.price}</span>
                    <Badge variant={course.isActive ? 'default' : 'secondary'}>
                      {course.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                <div className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setEditingCourse(course); setIsDialogOpen(true); }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
          </DialogHeader>
          <CourseForm 
            course={editingCourse} 
            onSave={handleSaveCourse}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// Course Form Component
interface CourseFormProps {
  course: Course | null;
  onSave: (data: Partial<Course>) => void;
  onCancel: () => void;
}

function CourseForm({ course, onSave, onCancel }: CourseFormProps) {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    price: course?.price || 0,
    duration: course?.duration || '',
    level: course?.level || '',
    thumbnail: course?.thumbnail || '',
    content: course?.content || '',
    isActive: course?.isActive !== false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Course Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            required
          />
        </div>
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="e.g., 8 weeks"
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="level">Level</Label>
        <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
            <SelectItem value="Beginner to Intermediate">Beginner to Intermediate</SelectItem>
            <SelectItem value="Beginner to Advanced">Beginner to Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="thumbnail">Thumbnail Image URL</Label>
        <Input
          id="thumbnail"
          value={formData.thumbnail}
          onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
          placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
        />
        {formData.thumbnail && (
          <div className="mt-2">
            <img 
              src={formData.thumbnail} 
              alt="Course thumbnail preview" 
              className="w-32 h-20 object-cover rounded border"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
      <div>
        <Label htmlFor="content">Course Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Detailed course content description"
          className="h-32"
          required
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>
      <div className="flex space-x-2">
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Save Course
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

// Blog Management Component
interface BlogManagementProps {
  blogPosts: BlogPost[];
  setBlogPosts: (posts: BlogPost[]) => void;
  onBack: () => void;
}

function BlogManagement({ blogPosts, setBlogPosts, onBack }: BlogManagementProps) {
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSavePost = (postData: Partial<BlogPost>) => {
    if (editingPost) {
      const updatedPosts = blogPosts.map(post =>
        post.id === editingPost.id ? { ...post, ...postData } : post
      );
      setBlogPosts(updatedPosts);
      saveBlogPosts(updatedPosts);
    } else {
      const newPost: BlogPost = {
        id: Date.now().toString(),
        title: postData.title || '',
        content: postData.content || '',
        excerpt: postData.excerpt || '',
        author: postData.author || 'SKY AGENCY Team',
        publishedAt: new Date().toISOString(),
        tags: postData.tags || [],
        isPublished: postData.isPublished !== false,
        thumbnail: postData.thumbnail || '/api/placeholder/600/400'
      };
      const updatedPosts = [...blogPosts, newPost];
      setBlogPosts(updatedPosts);
      saveBlogPosts(updatedPosts);
    }
    setEditingPost(null);
    setIsDialogOpen(false);
    toast({ title: "Blog post saved successfully" });
  };

  const handleDeletePost = (postId: string) => {
    const updatedPosts = blogPosts.filter(post => post.id !== postId);
    setBlogPosts(updatedPosts);
    saveBlogPosts(updatedPosts);
    toast({ title: "Blog post deleted successfully" });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Blog Posts</CardTitle>
          <CardDescription>Add, edit, or remove blog posts</CardDescription>
        </div>
        <div className="space-x-2">
          <Button onClick={() => { setEditingPost(null); setIsDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Post
          </Button>
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {blogPosts.map((post) => (
            <div key={post.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold">{post.title}</h4>
                  <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm">By {post.author}</span>
                    <Badge variant={post.isPublished ? 'default' : 'secondary'}>
                      {post.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </div>
                <div className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setEditingPost(post); setIsDialogOpen(true); }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}</DialogTitle>
          </DialogHeader>
          <BlogForm 
            post={editingPost} 
            onSave={handleSavePost}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// Blog Form Component
interface BlogFormProps {
  post: BlogPost | null;
  onSave: (data: Partial<BlogPost>) => void;
  onCancel: () => void;
}

function BlogForm({ post, onSave, onCancel }: BlogFormProps) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    author: post?.author || 'SKY AGENCY Team',
    thumbnail: post?.thumbnail || '',
    tags: post?.tags?.join(', ') || '',
    isPublished: post?.isPublished !== false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    onSave({ ...formData, tags });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Post Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          placeholder="Brief description of the post"
          required
        />
      </div>
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Full blog post content"
          className="h-48"
          required
        />
      </div>
      <div>
        <Label htmlFor="thumbnail">Thumbnail Image URL</Label>
        <Input
          id="thumbnail"
          value={formData.thumbnail}
          onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
          placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
        />
        {formData.thumbnail && (
          <div className="mt-2">
            <img 
              src={formData.thumbnail} 
              alt="Blog post thumbnail preview" 
              className="w-32 h-20 object-cover rounded border"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="e.g., Technology, Marketing, Tips"
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="isPublished"
          checked={formData.isPublished}
          onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
        />
        <Label htmlFor="isPublished">Published</Label>
      </div>
      <div className="flex space-x-2">
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Save Post
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

// Project Management Component
interface ProjectManagementProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  onBack: () => void;
}

function ProjectManagement({ projects, setProjects, onBack }: ProjectManagementProps) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSaveProject = (projectData: Partial<Project>) => {
    if (editingProject) {
      const updatedProjects = projects.map(project =>
        project.id === editingProject.id ? { ...project, ...projectData } : project
      );
      setProjects(updatedProjects);
      saveProjects(updatedProjects);
    } else {
      const newProject: Project = {
        id: Date.now().toString(),
        title: projectData.title || '',
        description: projectData.description || '',
        image: projectData.image || '/api/placeholder/600/400',
        technologies: projectData.technologies || [],
        liveUrl: projectData.liveUrl || '',
        githubUrl: projectData.githubUrl || '',
        category: projectData.category || '',
        featured: projectData.featured || false
      };
      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);
      saveProjects(updatedProjects);
    }
    setEditingProject(null);
    setIsDialogOpen(false);
    toast({ title: "Project saved successfully" });
  };

  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(project => project.id !== projectId);
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    toast({ title: "Project deleted successfully" });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Projects</CardTitle>
          <CardDescription>Add, edit, or remove portfolio projects</CardDescription>
        </div>
        <div className="space-x-2">
          <Button onClick={() => { setEditingProject(null); setIsDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold">{project.title}</h4>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm">{project.category}</span>
                    <Badge variant={project.featured ? 'default' : 'secondary'}>
                      {project.featured ? 'Featured' : 'Regular'}
                    </Badge>
                  </div>
                </div>
                <div className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setEditingProject(project); setIsDialogOpen(true); }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          </DialogHeader>
          <ProjectForm 
            project={editingProject} 
            onSave={handleSaveProject}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// Project Form Component
interface ProjectFormProps {
  project: Project | null;
  onSave: (data: Partial<Project>) => void;
  onCancel: () => void;
}

function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    image: project?.image || '',
    technologies: project?.technologies?.join(', ') || '',
    liveUrl: project?.liveUrl || '',
    githubUrl: project?.githubUrl || '',
    category: project?.category || '',
    featured: project?.featured || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const technologies = formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech);
    onSave({ ...formData, technologies });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Project Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="image">Project Image URL</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
        />
        {formData.image && (
          <div className="mt-2">
            <img 
              src={formData.image} 
              alt="Project image preview" 
              className="w-32 h-20 object-cover rounded border"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
      <div>
        <Label htmlFor="technologies">Technologies (comma separated)</Label>
        <Input
          id="technologies"
          value={formData.technologies}
          onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
          placeholder="e.g., React, Node.js, MongoDB"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="liveUrl">Live URL</Label>
          <Input
            id="liveUrl"
            type="url"
            value={formData.liveUrl}
            onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
            placeholder="https://example.com"
          />
        </div>
        <div>
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input
            id="githubUrl"
            type="url"
            value={formData.githubUrl}
            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            placeholder="https://github.com/..."
          />
        </div>
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Web Development">Web Development</SelectItem>
            <SelectItem value="Mobile Development">Mobile Development</SelectItem>
            <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
            <SelectItem value="E-commerce">E-commerce</SelectItem>
            <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          checked={formData.featured}
          onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
        />
        <Label htmlFor="featured">Featured Project</Label>
      </div>
      <div className="flex space-x-2">
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Save Project
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [contacts, setContacts] = useState<ContactForm[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeManagement, setActiveManagement] = useState<'courses' | 'blog' | 'projects' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = () => {
    setUsers(getUsers());
    setPaymentRequests(getPaymentRequests());
    setContacts(getContacts());
    setCourses(getCourses());
    setBlogPosts(getBlogPosts());
    setProjects(getProjects());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({
        title: "Admin Access Granted",
        description: "Welcome to the admin dashboard",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid password",
        variant: "destructive",
      });
    }
  };

  const handlePaymentAction = (paymentId: string, action: 'approved' | 'rejected') => {
    const updatedPayments = paymentRequests.map(payment => 
      payment.id === paymentId 
        ? { 
            ...payment, 
            status: action,
            processedAt: new Date().toISOString()
          }
        : payment
    );
    
    setPaymentRequests(updatedPayments);
    savePaymentRequests(updatedPayments);
    
    // Here you would typically send an email to the user
    toast({
      title: `Payment ${action}`,
      description: `Payment request has been ${action}. User will be notified via email.`,
    });
  };

  const handleContactAction = (contactId: string, status: 'read' | 'replied') => {
    const updatedContacts = contacts.map(contact =>
      contact.id === contactId ? { ...contact, status } : contact
    );
    
    setContacts(updatedContacts);
    saveContacts(updatedContacts);
    
    toast({
      title: "Contact Updated",
      description: `Contact marked as ${status}`,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
            <CardDescription>Enter admin password to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Access Dashboard
              </Button>
            </form>
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="w-full mt-4"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = {
    totalUsers: users.length,
    pendingPayments: paymentRequests.filter(p => p.status === 'pending').length,
    newContacts: contacts.filter(c => c.status === 'new').length,
    totalRevenue: paymentRequests
      .filter(p => p.status === 'approved')
      .reduce((sum, p) => sum + p.amount, 0)
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Website
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-8 w-8 text-warning" />
                <div>
                  <p className="text-2xl font-bold">{stats.pendingPayments}</p>
                  <p className="text-sm text-muted-foreground">Pending Payments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold">{stats.newContacts}</p>
                  <p className="text-sm text-muted-foreground">New Messages</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-success" />
                <div>
                  <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="payments" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>

          {/* Payment Requests */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment Requests</CardTitle>
                <CardDescription>Manage course enrollment payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentRequests.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No payment requests found</p>
                  ) : (
                    paymentRequests.map((payment) => (
                      <div key={payment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">{payment.courseName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {payment.userEmail} • UTR: {payment.utrNumber}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Submitted: {new Date(payment.submittedAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">₹{payment.amount}</div>
                            <Badge 
                              variant={
                                payment.status === 'approved' ? 'default' : 
                                payment.status === 'rejected' ? 'destructive' : 'secondary'
                              }
                            >
                              {payment.status}
                            </Badge>
                          </div>
                        </div>
                        
                        {payment.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handlePaymentAction(payment.id, 'approved')}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handlePaymentAction(payment.id, 'rejected')}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Messages */}
          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
                <CardDescription>Manage customer inquiries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contacts.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No contact messages found</p>
                  ) : (
                    contacts.map((contact) => (
                      <div key={contact.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">{contact.subject}</h4>
                            <p className="text-sm text-muted-foreground">
                              {contact.name} • {contact.email}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(contact.submittedAt).toLocaleString()}
                            </p>
                          </div>
                          <Badge 
                            variant={
                              contact.status === 'replied' ? 'default' : 
                              contact.status === 'read' ? 'secondary' : 'outline'
                            }
                          >
                            {contact.status}
                          </Badge>
                        </div>
                        
                        <p className="text-sm mb-3">{contact.message}</p>
                        
                        {contact.status === 'new' && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleContactAction(contact.id, 'read')}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Mark as Read
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleContactAction(contact.id, 'replied')}
                            >
                              <Mail className="h-4 w-4 mr-1" />
                              Mark as Replied
                            </Button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Registered Users</CardTitle>
                <CardDescription>View all registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No users found</p>
                  ) : (
                    users.map((user) => (
                      <div key={user.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">{user.name}</h4>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <p className="text-sm text-muted-foreground">
                              Joined: {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={user.isActive ? 'default' : 'secondary'}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">
                              {user.courses.length} courses enrolled
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Management */}
          <TabsContent value="content">
            {activeManagement === null ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5" />
                      <span>Courses</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold mb-2">{courses.length}</p>
                    <p className="text-sm text-muted-foreground">Active courses</p>
                    <Button 
                      size="sm" 
                      className="mt-4 w-full"
                      onClick={() => setActiveManagement('courses')}
                    >
                      Manage Courses
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageCircle className="h-5 w-5" />
                      <span>Blog Posts</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold mb-2">{blogPosts.length}</p>
                    <p className="text-sm text-muted-foreground">Published posts</p>
                    <Button 
                      size="sm" 
                      className="mt-4 w-full"
                      onClick={() => setActiveManagement('blog')}
                    >
                      Manage Blog
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Projects</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold mb-2">{projects.length}</p>
                    <p className="text-sm text-muted-foreground">Portfolio items</p>
                    <Button 
                      size="sm" 
                      className="mt-4 w-full"
                      onClick={() => setActiveManagement('projects')}
                    >
                      Manage Projects
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : activeManagement === 'courses' ? (
              <CourseManagement 
                courses={courses}
                setCourses={setCourses}
                onBack={() => setActiveManagement(null)}
              />
            ) : activeManagement === 'blog' ? (
              <BlogManagement 
                blogPosts={blogPosts}
                setBlogPosts={setBlogPosts}
                onBack={() => setActiveManagement(null)}
              />
            ) : (
              <ProjectManagement 
                projects={projects}
                setProjects={setProjects}
                onBack={() => setActiveManagement(null)}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}