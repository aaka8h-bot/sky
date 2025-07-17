// Local storage management for SKY AGENCY platform

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
  isActive: boolean;
  courses: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  level: string;
  thumbnail: string;
  content: string;
  isActive: boolean;
}

export interface PaymentRequest {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  utrNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  processedAt?: string;
  userEmail: string;
  courseName: string;
}

export interface ContactForm {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
  status: 'new' | 'read' | 'replied';
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  tags: string[];
  isPublished: boolean;
  thumbnail: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  category: string;
  featured: boolean;
}

// Storage keys
const USERS_KEY = 'sky_agency_users';
const COURSES_KEY = 'sky_agency_courses';
const PAYMENTS_KEY = 'sky_agency_payments';
const CONTACTS_KEY = 'sky_agency_contacts';
const BLOG_POSTS_KEY = 'sky_agency_blog_posts';
const PROJECTS_KEY = 'sky_agency_projects';
const CURRENT_USER_KEY = 'sky_agency_current_user';

// Admin credentials
const ADMIN_EMAIL = 'admin@sky.com';
const ADMIN_PASSWORD = 'Aakash@@';

// Generic storage functions
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setToStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// User management
export const getUsers = (): User[] => getFromStorage(USERS_KEY, []);
export const saveUsers = (users: User[]): void => setToStorage(USERS_KEY, users);

export const getCurrentUser = (): User | null => getFromStorage(CURRENT_USER_KEY, null);
export const setCurrentUser = (user: User | null): void => setToStorage(CURRENT_USER_KEY, user);

export const createUser = (userData: Omit<User, 'id' | 'createdAt' | 'isActive' | 'courses'>): User => {
  const users = getUsers();
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    isActive: true,
    courses: []
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

export const authenticateUser = (email: string, password: string): User | null => {
  const users = getUsers();
  return users.find(user => user.email === email && user.password === password) || null;
};

// Admin authentication
export const authenticateAdmin = (email: string, password: string): boolean => {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
};

// Course management
export const getCourses = (): Course[] => getFromStorage(COURSES_KEY, []);
export const saveCourses = (courses: Course[]): void => setToStorage(COURSES_KEY, courses);

// Payment management
export const getPaymentRequests = (): PaymentRequest[] => getFromStorage(PAYMENTS_KEY, []);
export const savePaymentRequests = (payments: PaymentRequest[]): void => setToStorage(PAYMENTS_KEY, payments);

export const createPaymentRequest = (data: Omit<PaymentRequest, 'id' | 'submittedAt' | 'status'>): PaymentRequest => {
  const payments = getPaymentRequests();
  const newPayment: PaymentRequest = {
    ...data,
    id: Date.now().toString(),
    submittedAt: new Date().toISOString(),
    status: 'pending'
  };
  payments.push(newPayment);
  savePaymentRequests(payments);
  return newPayment;
};

// Contact management
export const getContacts = (): ContactForm[] => getFromStorage(CONTACTS_KEY, []);
export const saveContacts = (contacts: ContactForm[]): void => setToStorage(CONTACTS_KEY, contacts);

export const createContact = (data: Omit<ContactForm, 'id' | 'submittedAt' | 'status'>): ContactForm => {
  const contacts = getContacts();
  const newContact: ContactForm = {
    ...data,
    id: Date.now().toString(),
    submittedAt: new Date().toISOString(),
    status: 'new'
  };
  contacts.push(newContact);
  saveContacts(contacts);
  return newContact;
};

// Blog management
export const getBlogPosts = (): BlogPost[] => getFromStorage(BLOG_POSTS_KEY, []);
export const saveBlogPosts = (posts: BlogPost[]): void => setToStorage(BLOG_POSTS_KEY, posts);

// Project management
export const getProjects = (): Project[] => getFromStorage(PROJECTS_KEY, []);
export const saveProjects = (projects: Project[]): void => setToStorage(PROJECTS_KEY, projects);

// Initialize default data
export const initializeDefaultData = () => {
  // Initialize demo user if no users exist
  const users = getUsers();
  if (users.length === 0) {
    const demoUser: User = {
      id: 'demo-user-1',
      name: 'Demo User',
      email: 'demo@skyagency.com',
      password: 'demo123',
      createdAt: new Date().toISOString(),
      isActive: true,
      courses: []
    };
    saveUsers([demoUser]);
  }

  // Initialize courses if empty
  const courses = getCourses();
  if (courses.length === 0) {
    const defaultCourses: Course[] = [
      {
        id: '1',
        title: 'Digital Marketing Mastery',
        description: 'Complete guide to digital marketing strategies, SEO, social media, and analytics.',
        price: 2999,
        duration: '8 weeks',
        level: 'Beginner to Intermediate',
        thumbnail: '/api/placeholder/400/250',
        content: 'Comprehensive digital marketing course covering all aspects of online marketing.',
        isActive: true
      },
      {
        id: '2',
        title: 'Web Development Bootcamp',
        description: 'Full-stack web development course covering HTML, CSS, JavaScript, React, and Node.js.',
        price: 4999,
        duration: '12 weeks',
        level: 'Beginner to Advanced',
        thumbnail: '/api/placeholder/400/250',
        content: 'Complete web development bootcamp with hands-on projects.',
        isActive: true
      }
    ];
    saveCourses(defaultCourses);
  }

  // Initialize projects if empty
  const projects = getProjects();
  if (projects.length === 0) {
    const defaultProjects: Project[] = [
      {
        id: '1',
        title: 'E-commerce Platform',
        description: 'Modern e-commerce solution with payment integration',
        image: '/api/placeholder/600/400',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        liveUrl: 'https://example.com',
        category: 'Web Development',
        featured: true
      },
      {
        id: '2',
        title: 'Mobile Banking App',
        description: 'Secure mobile banking application with biometric authentication',
        image: '/api/placeholder/600/400',
        technologies: ['React Native', 'Firebase', 'Redux'],
        category: 'Mobile Development',
        featured: true
      }
    ];
    saveProjects(defaultProjects);
  }

  // Initialize blog posts if empty
  const blogPosts = getBlogPosts();
  if (blogPosts.length === 0) {
    const defaultPosts: BlogPost[] = [
      {
        id: '1',
        title: 'The Future of Digital Marketing',
        content: 'Digital marketing is evolving rapidly with new technologies and strategies...',
        excerpt: 'Explore the latest trends and future of digital marketing',
        author: 'SKY AGENCY Team',
        publishedAt: new Date().toISOString(),
        tags: ['Digital Marketing', 'Technology', 'Future'],
        isPublished: true,
        thumbnail: '/api/placeholder/600/400'
      }
    ];
    saveBlogPosts(defaultPosts);
  }
};