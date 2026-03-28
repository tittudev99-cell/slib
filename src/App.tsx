import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  MessageCircle, 
  Wifi, 
  Zap, 
  Wind, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ChevronUp,
  Menu,
  X,
  BookOpen,
  ShieldCheck,
  Coffee,
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  CalendarIcon,
  ArrowRight,
  LogOut,
  Armchair,
  Info,
  Sun,
  Moon,
  Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';

const BUSINESS_DETAILS = {
  name: "Swami Vivekanand Library & Study Zone",
  address: "Railway Colony, Satna – 485001, Madhya Pradesh",
  timings: "Open Daily: 7:00 AM – 9:00 PM",
  phone: "+918827006529",
  whatsapp: "918827006529",
  tagline: "“शांत, सुरक्षित और ध्यान केंद्रित पढ़ाई का माहौल”",
  about: "Swami Vivekanand Library & Study Zone एक शांत, सुरक्षित और सुविधाजनक पढ़ाई का स्थान है, जहाँ छात्र बिना किसी व्यवधान के अपने लक्ष्य पर ध्यान केंद्रित कर सकते हैं।"
};

const FACILITIES = [
  { icon: Wind, title: "AC / Non-AC Seating", desc: "Choose your comfort level for long study hours." },
  { icon: Wifi, title: "High-speed WiFi", desc: "Seamless internet for online classes and research." },
  { icon: Zap, title: "Power Backup", desc: "Uninterrupted study with 24/7 electricity support." },
  { icon: ShieldCheck, title: "Safe Environment", desc: "Secure and peaceful atmosphere for everyone." },
  { icon: BookOpen, title: "Silent Zone", desc: "Strict silence policy to ensure maximum focus." },
  { icon: Coffee, title: "Comfortable Chairs", desc: "Ergonomic seating to prevent fatigue." }
];

const PRICING = [
  { name: "Monthly Plan", price: "₹499", features: ["Full Day Access", "WiFi Included", "Locker Facility"], popular: false },
  { name: "Quarterly Plan", price: "₹1199", features: ["Full Day Access", "WiFi Included", "Locker Facility", "Discounted Rate"], popular: true },
  { name: "Half-Yearly Plan", price: "₹2999", features: ["Full Day Access", "WiFi Included", "Locker Facility", "Priority Support"], popular: false },
  { name: "Yearly Plan", price: "₹3999", features: ["Full Day Access", "WiFi Included", "Locker Facility", "Best Value"], popular: false }
];

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800", // Library books
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800", // Study space
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=800", // Books on desk
  "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800", // Modern library
  "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&q=80&w=800", // Study desk
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800"  // Library interior
];

const TESTIMONIALS = [
  {
    name: "Rahul Sharma",
    role: "UPSC Aspirant",
    quote: "The best place in Satna for serious study. The environment is extremely quiet and the high-speed WiFi is a lifesaver for online lectures.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
  },
  {
    name: "Priya Singh",
    role: "CA Student",
    quote: "Safe and secure for female students. I can focus for 10-12 hours without any disturbance. Highly recommended!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
  },
  {
    name: "Amit Patel",
    role: "SSC Candidate",
    quote: "Comfortable chairs and great power backup. Even during power cuts, my study doesn't stop. The staff is very helpful.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
  }
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [availability, setAvailability] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [themeColor, setThemeColor] = useState('#2563eb');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', themeColor);
    // Calculate a darker version for primary-dark
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };
    const rgb = hexToRgb(themeColor);
    if (rgb) {
      const darker = `rgb(${Math.max(0, rgb.r - 40)}, ${Math.max(0, rgb.g - 40)}, ${Math.max(0, rgb.b - 40)})`;
      document.documentElement.style.setProperty('--primary-dark-color', darker);
    }
  }, [themeColor]);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const res = await fetch('/api/availability');
      const data = await res.json();
      setAvailability(data);
    } catch (e) {
      console.error("Failed to fetch availability");
    }
  };

  const handleJoinNow = (plan: any) => {
    setSelectedPlan(plan);
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        alert(`Booking Successful! You have reserved Seat #${data.seatId} for ${data.date}.`);
        setIsBookingModalOpen(false);
        fetchAvailability();
      } else {
        alert(result.message || "Booking failed.");
      }
    } catch (error) {
      alert("Error connecting to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: null, message: '' });

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setFormStatus({ type: 'success', message: result.message });
        (e.target as HTMLFormElement).reset();
      } else {
        setFormStatus({ type: 'error', message: result.message || 'Something went wrong.' });
      }
    } catch (error) {
      setFormStatus({ type: 'error', message: 'Failed to connect to server.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
            <span className="font-bold text-lg hidden sm:block text-primary">SV Library</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-medium text-slate-600 dark:text-slate-300">
            <a href="#home" className="hover:text-primary transition-colors">Home</a>
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#facilities" className="hover:text-primary transition-colors">Facilities</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-full">
              <button 
                onClick={() => setIsDarkMode(false)}
                className={`p-1.5 rounded-full transition-all ${!isDarkMode ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                title="Light Mode"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsDarkMode(true)}
                className={`p-1.5 rounded-full transition-all ${isDarkMode ? 'bg-slate-700 text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                title="Dark Mode"
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>

            <div className="relative group">
              <button className="p-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                <Palette className="w-5 h-5" />
              </button>
              <div className="absolute right-0 top-full mt-2 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-48">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Theme Color</p>
                <div className="grid grid-cols-4 gap-2">
                  {['#2563eb', '#7c3aed', '#db2777', '#dc2626', '#ea580c', '#16a34a', '#0891b2', '#4b5563'].map(color => (
                    <button
                      key={color}
                      onClick={() => setThemeColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${themeColor === color ? 'border-primary' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button 
              className="md:hidden text-slate-900 dark:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-6 flex flex-col gap-4 font-medium text-slate-600 dark:text-slate-300 transition-colors duration-300"
            >
              <a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a>
              <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
              <a href="#facilities" onClick={() => setIsMenuOpen(false)}>Facilities</a>
              <a href="#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1920" 
            alt="Library Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary-foreground border border-primary/30 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
              Limited Seats Available
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {BUSINESS_DETAILS.name}
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 mb-4 font-medium italic">
              {BUSINESS_DETAILS.tagline}
            </p>
            <div className="flex items-center justify-center gap-2 text-slate-300 mb-10">
              <Clock className="w-5 h-5 text-secondary" />
              <span className="text-lg">{BUSINESS_DETAILS.timings}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href={`tel:${BUSINESS_DETAILS.phone}`}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary/30"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </a>
              <a 
                href={`https://wa.me/${BUSINESS_DETAILS.whatsapp}`}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-secondary hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-secondary/30"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">About Our Library</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              {BUSINESS_DETAILS.about}
            </p>
            <div className="space-y-4">
              {[
                "शांत वातावरण (Peaceful Environment)",
                "सुरक्षित स्थान (Safe Location)",
                "लंबे समय तक पढ़ाई की सुविधा (Long Study Hours)"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-secondary w-6 h-6" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img 
              src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800" 
              alt="Library Interior" 
              className="rounded-3xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl hidden lg:block border border-slate-100 dark:border-slate-700">
              <div className="text-primary font-bold text-4xl">100%</div>
              <div className="text-slate-500 dark:text-slate-400 font-medium">Focus Guaranteed</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Facilities Section */}
      <section id="facilities" className="section-padding bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">World-Class Facilities</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Everything you need to stay focused and productive during your study sessions.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FACILITIES.map((facility, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-14 h-14 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <facility.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">{facility.title}</h3>
              <p className="text-slate-500 dark:text-slate-400">{facility.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section-padding bg-slate-900 dark:bg-slate-950 text-white transition-colors duration-300">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Affordable Pricing Plans</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Choose a plan that fits your study schedule and goals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRICING.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ 
                y: -12, 
                boxShadow: plan.popular 
                  ? "0 25px 50px -12px rgba(59, 130, 246, 0.4)" 
                  : "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
                borderColor: plan.popular ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)",
                scale: 1.02
              }}
              viewport={{ once: true }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: i * 0.1 
              }}
              className={`relative p-8 rounded-3xl border transition-all ${plan.popular ? 'bg-primary border-primary' : 'bg-slate-800 dark:bg-slate-900 border-slate-700 dark:border-slate-800'} flex flex-col cursor-default`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold mb-6">{plan.price}</div>
              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleJoinNow(plan)}
                className={`w-full py-3 rounded-xl font-bold transition-all ${plan.popular ? 'bg-white text-primary hover:bg-slate-100' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
              >
                Join Now
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-padding bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Our Study Zone</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Take a look at our peaceful and modern environment.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {GALLERY_IMAGES.map((img, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="aspect-square overflow-hidden rounded-2xl cursor-zoom-in border border-slate-100 dark:border-slate-800"
            >
              <img 
                src={img} 
                alt={`Gallery ${i + 1}`} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">What Our Students Say</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Real experiences from students who have achieved their goals with us.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col"
            >
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{testimonial.name}</h3>
                  <p className="text-sm text-primary font-medium">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 italic leading-relaxed">
                "{testimonial.quote}"
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Location Section */}
      <section className="section-padding bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 h-[400px] rounded-3xl overflow-hidden shadow-xl border-4 border-white dark:border-slate-800">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14554.444747738245!2d80.8256333!3d24.5772333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39847f9600000001%3A0x0!2zMjTCsDM0JzM4LjAiTiA4MMKwNDknMzIuMyJF!5e0!3m2!1sen!2sin!4v1711640000000!5m2!1sen!2sin" 
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">Find Us Here</h2>
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="text-primary w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 dark:text-white">Our Address</h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                  {BUSINESS_DETAILS.address}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary/10 dark:bg-secondary/20 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="text-secondary w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 dark:text-white">Library Hours</h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  {BUSINESS_DETAILS.timings}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="bg-primary rounded-[3rem] p-8 md:p-16 text-white overflow-hidden relative shadow-2xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Get in Touch</h2>
              <p className="text-primary-foreground/80 text-lg mb-10 max-w-md">
                Have questions? Want to book a seat? Contact us via phone or WhatsApp for immediate assistance.
              </p>
              
              <div className="space-y-6">
                <a href={`tel:${BUSINESS_DETAILS.phone}`} className="flex items-center gap-4 group">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all">
                    <Phone />
                  </div>
                  <span className="text-xl font-semibold">{BUSINESS_DETAILS.phone}</span>
                </a>
                <a href={`https://wa.me/${BUSINESS_DETAILS.whatsapp}`} className="flex items-center gap-4 group">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-emerald-500 transition-all">
                    <MessageCircle />
                  </div>
                  <span className="text-xl font-semibold">WhatsApp Us</span>
                </a>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-slate-900 dark:text-white shadow-2xl transition-colors duration-300">
              <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 dark:text-slate-300">Full Name</label>
                  <input 
                    required
                    name="name"
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                    placeholder="Enter your name" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 dark:text-slate-300">Phone Number</label>
                  <input 
                    required
                    name="phone"
                    type="tel" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                    placeholder="Enter your phone number" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 dark:text-slate-300">Message</label>
                  <textarea 
                    required
                    name="message"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all h-32" 
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                
                {formStatus.type && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-2xl text-sm border ${
                      formStatus.type === 'success' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-red-50 text-red-700 border-red-100'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {formStatus.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                      ) : (
                        <X className="w-5 h-5 shrink-0" />
                      )}
                      <div className="space-y-2">
                        <p className="font-bold text-base">
                          {formStatus.type === 'success' ? 'Success!' : 'Submission Error'}
                        </p>
                        <div className="whitespace-pre-wrap leading-relaxed opacity-90">
                          {formStatus.message}
                        </div>
                        {formStatus.type === 'error' && (
                          <button 
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(formStatus.message);
                              alert("Error details copied to clipboard!");
                            }}
                            className="text-xs font-bold uppercase tracking-wider text-red-800 hover:underline mt-2 flex items-center gap-1"
                          >
                            Copy full error details
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                <button 
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 py-12 px-6 border-t border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold">S</div>
            <span className="font-bold text-white tracking-tight">SV Library & Study Zone</span>
          </div>
          <p className="mb-8 max-w-md mx-auto">
            Providing the best study environment for students in Satna since 2024.
          </p>
          <div className="text-sm">
            © {new Date().getFullYear()} Swami Vivekanand Library & Study Zone. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Sticky Mobile Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 p-4 flex gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_10px_rgba(0,0,0,0.3)] transition-colors duration-300">
        <a 
          href={`tel:${BUSINESS_DETAILS.phone}`}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-bold"
        >
          <Phone className="w-4 h-4" />
          Call
        </a>
        <a 
          href={`https://wa.me/${BUSINESS_DETAILS.whatsapp}`}
          className="flex-1 flex items-center justify-center gap-2 bg-secondary text-white py-3 rounded-xl font-bold"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </a>
      </div>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-40 w-12 h-12 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-full shadow-xl flex items-center justify-center border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <ChevronUp />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <BookingModal 
            plan={selectedPlan} 
            onClose={() => setIsBookingModalOpen(false)} 
            onSubmit={handleBookingSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </AnimatePresence>

      {/* Admin Panel Link */}
      <button 
        onClick={() => setShowAdmin(true)}
        className="fixed bottom-8 right-24 z-40 w-12 h-12 bg-slate-800 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-slate-700 transition-colors"
        title="Admin Panel"
      >
        <ShieldCheck className="w-6 h-6" />
      </button>

      {/* Admin Panel Modal */}
      <AnimatePresence>
        {showAdmin && (
          <AdminPanel 
            onClose={() => setShowAdmin(false)} 
            isLoggedIn={isAdminLoggedIn} 
            setIsLoggedIn={setIsAdminLoggedIn} 
          />
        )}
      </AnimatePresence>

      {/* Gemini Chatbot */}
      <Chatbot />
    </div>
  );
}

function AdminPanel({ onClose, isLoggedIn, setIsLoggedIn }: any) {
  const [password, setPassword] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'bookings' | 'contacts'>('bookings');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsLoggedIn(true);
      fetchData();
    } else {
      alert("Invalid Password");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassword('');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'bookings' ? '/api/admin/bookings' : '/api/admin/contacts';
      const res = await fetch(`${endpoint}?password=admin123`);
      const data = await res.json();
      if (activeTab === 'bookings') {
        setBookings(data.bookings || []);
      } else {
        setContacts(data.contacts || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [activeTab, isLoggedIn]);

  const currentData = activeTab === 'bookings' ? bookings : contacts;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6"
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[80vh] rounded-[2rem] overflow-hidden flex flex-col transition-colors duration-300">
        <div className="p-6 bg-slate-900 dark:bg-slate-950 text-white flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Admin Dashboard</h2>
            {isLoggedIn && (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg"><X /></button>
        </div>

        {!isLoggedIn ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <ShieldCheck className="w-16 h-16 text-primary mb-6" />
            <h3 className="text-2xl font-bold mb-6 dark:text-white">Admin Login</h3>
            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Admin Password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <button className="w-full bg-primary text-white py-3 rounded-xl font-bold">Login</button>
            </form>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-6">
            <div className="flex border-b border-slate-100 dark:border-slate-800 mb-6">
              <button 
                onClick={() => setActiveTab('bookings')}
                className={`px-6 py-3 font-bold transition-all ${activeTab === 'bookings' ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
              >
                Bookings (Pricing Plans)
              </button>
              <button 
                onClick={() => setActiveTab('contacts')}
                className={`px-6 py-3 font-bold transition-all ${activeTab === 'contacts' ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
              >
                Contacts (Form)
              </button>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold capitalize dark:text-white">{activeTab} List</h3>
              <button onClick={fetchData} className="text-primary font-bold text-sm hover:underline">Refresh</button>
            </div>
            {loading ? (
              <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <th className="pb-4 font-bold dark:text-slate-300">Name</th>
                      <th className="pb-4 font-bold dark:text-slate-300">Phone</th>
                      <th className="pb-4 font-bold dark:text-slate-300">Date</th>
                      <th className="pb-4 font-bold dark:text-slate-300">{activeTab === 'bookings' ? 'Plan' : 'Subject'}</th>
                      <th className="pb-4 font-bold dark:text-slate-300">{activeTab === 'bookings' ? 'Slot' : 'Message'}</th>
                      {activeTab === 'bookings' && <th className="pb-4 font-bold dark:text-slate-300">Seat</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {currentData.map((b, i) => (
                      <tr key={i} className="text-slate-600 dark:text-slate-400">
                        <td className="py-4">{b.name}</td>
                        <td className="py-4">{b.phone}</td>
                        <td className="py-4">{b.date}</td>
                        <td className="py-4">{b.plan}</td>
                        <td className="py-4">{b.message}</td>
                        {activeTab === 'bookings' && <td className="py-4 font-bold text-primary">#{b.seatId}</td>}
                      </tr>
                    ))}
                    {currentData.length === 0 && (
                      <tr><td colSpan={6} className="py-12 text-center text-slate-400 dark:text-slate-500">No {activeTab} found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function BookingModal({ plan, onClose, onSubmit, isSubmitting }: any) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [bookedSeats, setBookedSeats] = useState<number[]>([]);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [tempData, setTempData] = useState<any>(null);

  const timeSlots = [
    "07:00 AM - 11:00 AM",
    "11:00 AM - 03:00 PM",
    "03:00 PM - 07:00 PM",
    "07:00 PM - 09:00 PM",
    "Full Day (7 AM - 9 PM)"
  ];

  const totalSeats = 50;

  useEffect(() => {
    if (selectedDate && selectedSlot) {
      fetchBookedSeats();
    }
  }, [selectedDate, selectedSlot]);

  const fetchBookedSeats = async () => {
    setLoadingSeats(true);
    try {
      const formattedDate = format(selectedDate!, 'dd-MM-yyyy');
      const res = await fetch(`/api/booked-seats?date=${formattedDate}&slot=${selectedSlot}`);
      const data = await res.json();
      setBookedSeats(data.bookedSeats || []);
      setSelectedSeat(null); // Reset seat on slot/date change
    } catch (e) {
      console.error("Failed to fetch booked seats");
    } finally {
      setLoadingSeats(false);
    }
  };

  const handleProceedToConfirm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      date: selectedDate ? format(selectedDate, 'dd-MM-yyyy') : '',
      slot: selectedSlot,
      plan: plan?.name,
      seatId: selectedSeat,
    };
    setTempData(data);
    setIsConfirming(true);
  };

  const handleFinalSubmit = () => {
    if (tempData) {
      onSubmit(tempData);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[95vh] rounded-[2rem] overflow-hidden flex flex-col shadow-2xl transition-colors duration-300"
      >
        <div className="p-6 bg-primary text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{isConfirming ? 'Confirm Your Booking' : 'Book Your Seat'}</h2>
            <p className="text-white/80 text-sm">Plan: {plan?.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg"><X /></button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 md:p-10">
          {!isConfirming ? (
            <form onSubmit={handleProceedToConfirm} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Details & Slots */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-lg">
                      <User className="w-5 h-5 text-primary" /> Personal Details
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <input 
                        required 
                        name="name" 
                        defaultValue={tempData?.name || ''}
                        placeholder="Full Name" 
                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                      <input 
                        required 
                        name="phone" 
                        defaultValue={tempData?.phone || ''}
                        placeholder="Phone Number" 
                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-lg">
                      <Clock className="w-5 h-5 text-primary" /> Select Time Slot
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`px-4 py-3 rounded-2xl text-sm text-left border transition-all duration-200 ${
                            selectedSlot === slot 
                              ? 'bg-primary border-primary text-white font-bold shadow-md shadow-primary/20' 
                              : 'border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Middle Column: Calendar */}
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-lg">
                    <CalendarIcon className="w-5 h-5 text-primary" /> Select Date
                  </h3>
                  <div className="p-4 border border-slate-100 dark:border-slate-700 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 flex justify-center transition-colors">
                    <DayPicker
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={{ before: new Date() }}
                      className="rdp-custom dark:text-white"
                    />
                  </div>
                  {selectedDate && (
                    <p className="text-center text-primary font-bold">
                      Selected: {format(selectedDate, 'PPPP')}
                    </p>
                  )}
                </div>

                {/* Right Column: Seat Map */}
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-lg">
                    <Armchair className="w-5 h-5 text-primary" /> Select Your Seat
                  </h3>
                  
                  {!selectedSlot || !selectedDate ? (
                    <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-700 transition-colors">
                      <Info className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-4" />
                      <p className="text-slate-500 dark:text-slate-400 text-sm">Please select a date and time slot first to see available seats.</p>
                    </div>
                  ) : loadingSeats ? (
                    <div className="h-full min-h-[300px] flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] transition-colors">
                      <Loader2 className="animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-slate-900 dark:bg-black p-2 rounded-lg text-center text-[10px] text-white/40 uppercase tracking-widest mb-4">
                        Front / Entrance
                      </div>
                      
                      <div className="grid grid-cols-5 gap-2">
                        {Array.from({ length: totalSeats }).map((_, i) => {
                          const seatId = i + 1;
                          const isBooked = bookedSeats.includes(seatId);
                          const isSelected = selectedSeat === seatId;
                          
                          return (
                            <button
                              key={seatId}
                              type="button"
                              disabled={isBooked}
                              onClick={() => setSelectedSeat(seatId)}
                              className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${
                                isBooked 
                                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed' 
                                  : isSelected
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110 z-10'
                                    : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary'
                              }`}
                            >
                              {seatId}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 pt-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600"></div> Available
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded bg-primary"></div> Selected
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded bg-slate-100 dark:bg-slate-800"></div> Booked
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                <button 
                  disabled={isSubmitting || !selectedSlot || !selectedDate || !selectedSeat}
                  className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-xl shadow-xl shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                  Review Booking <ArrowRight className="w-6 h-6" />
                </button>
                <p className="text-center text-xs text-slate-400 dark:text-slate-500">
                  By confirming, you agree to our library rules and regulations.
                </p>
              </div>
            </form>
          ) : (
            <div className="max-w-2xl mx-auto space-y-8 py-10">
              <div className="text-center space-y-2">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Review Your Booking</h3>
                <p className="text-slate-500 dark:text-slate-400">Please verify your details before finalizing your reservation.</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">Full Name</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{tempData.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">Phone Number</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{tempData.phone}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">Selected Date</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{tempData.date}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">Time Slot</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{tempData.slot}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">Pricing Plan</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{tempData.plan}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">Seat Number</p>
                      <p className="text-2xl font-black text-primary">Seat #{tempData.seatId}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-primary/5 p-4 text-center">
                  <p className="text-sm text-primary font-medium flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" /> Your seat will be reserved immediately after confirmation.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setIsConfirming(false)}
                  className="flex-1 px-8 py-5 rounded-2xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                >
                  Go Back
                </button>
                <button 
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="flex-[2] bg-primary text-white py-5 rounded-2xl font-bold text-xl shadow-xl shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : (
                    <>
                      Finalize Booking <ArrowRight className="w-6 h-6" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: "Hello! I'm your SV Library assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: `You are a helpful assistant for "Swami Vivekanand Library & Study Zone" in Satna, MP. 
            Library Details:
            - Location: Railway Colony, Satna.
            - Timings: 7 AM to 9 PM Daily.
            - Facilities: AC/Non-AC seating, High-speed WiFi (100Mbps+), Power backup, Comfortable chairs, Silent zone.
            - Pricing: Monthly (₹499), Quarterly (₹1199), Half-Yearly (₹2999), Yearly (₹3999).
            - Environment: Quiet, safe, and focused.
            
            Answer the following user query based on these details. Be brief and polite.
            
            User: ${userMessage}` }]
          }
        ]
      });

      const response = await model;
      const botResponse = response.text || "I'm sorry, I couldn't process that. Please try again.";
      
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: `Sorry, I'm having trouble connecting right now. Please call us at ${BUSINESS_DETAILS.phone}.` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-8 z-40 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform group"
      >
        <Bot className="w-7 h-7 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded-full animate-bounce">AI</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-6 md:bottom-28 md:left-8 z-50 w-[calc(100vw-3rem)] sm:w-96 h-[500px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden transition-colors duration-300"
          >
            {/* Header */}
            <div className="bg-primary p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold">SV AI Assistant</h3>
                  <p className="text-[10px] text-white/70">Always here to help</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-700 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-700">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2 transition-colors duration-300">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about seats, WiFi, timings..."
                className="flex-grow px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-primary text-white p-2 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
