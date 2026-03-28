import React, { useState, useEffect } from 'react';
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
  Coffee
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const BUSINESS_DETAILS = {
  name: "Swami Vivekanand Library & Study Zone",
  address: "Railway Colony, Satna – 485001, Madhya Pradesh",
  timings: "Open Daily: 7:00 AM – 9:00 PM",
  phone: "+91XXXXXXXXXX", // Placeholder
  whatsapp: "91XXXXXXXXXX", // Placeholder
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
  "https://images.unsplash.com/photo-1507733108721-448cf612ad44?auto=format&fit=crop&q=80&w=800"  // Reading area
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
            <span className="font-bold text-lg hidden sm:block text-primary">SV Library</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
            <a href="#home" className="hover:text-primary transition-colors">Home</a>
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#facilities" className="hover:text-primary transition-colors">Facilities</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>

          <button 
            className="md:hidden text-slate-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-white border-b border-slate-100 p-6 flex flex-col gap-4 font-medium"
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
      <section id="about" className="section-padding bg-slate-50">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">About Our Library</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
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
                  <span className="font-medium text-slate-700">{item}</span>
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
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl hidden lg:block">
              <div className="text-primary font-bold text-4xl">100%</div>
              <div className="text-slate-500 font-medium">Focus Guaranteed</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Facilities Section */}
      <section id="facilities" className="section-padding">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">World-Class Facilities</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Everything you need to stay focused and productive during your study sessions.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FACILITIES.map((facility, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <facility.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{facility.title}</h3>
              <p className="text-slate-500">{facility.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section-padding bg-slate-900 text-white">
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
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-8 rounded-3xl border ${plan.popular ? 'bg-primary border-primary' : 'bg-slate-800 border-slate-700'} flex flex-col`}
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
              <button className={`w-full py-3 rounded-xl font-bold transition-all ${plan.popular ? 'bg-white text-primary hover:bg-slate-100' : 'bg-slate-700 text-white hover:bg-slate-600'}`}>
                Join Now
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-padding">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Study Zone</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Take a look at our peaceful and modern environment.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {GALLERY_IMAGES.map((img, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="aspect-square overflow-hidden rounded-2xl cursor-zoom-in"
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

      {/* Location Section */}
      <section className="section-padding bg-slate-50">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 h-[400px] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14554.444747738245!2d80.8256333!3d24.5772333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39847f9600000001%3A0x0!2zMjTCsDM0JzM4LjAiTiA4MMKwNDknMzIuMyJF!5e0!3m2!1sen!2sin!4v1711640000000!5m2!1sen!2sin" 
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Find Us Here</h2>
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="text-primary w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Our Address</h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  {BUSINESS_DETAILS.address}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="text-secondary w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Library Hours</h3>
                <p className="text-slate-600 text-lg">
                  {BUSINESS_DETAILS.timings}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding">
        <div className="bg-primary rounded-[3rem] p-8 md:p-16 text-white overflow-hidden relative">
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

            <form onSubmit={handleFormSubmit} className="bg-white rounded-3xl p-8 text-slate-900 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name</label>
                  <input 
                    required
                    name="name"
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                    placeholder="Enter your name" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Phone Number</label>
                  <input 
                    required
                    name="phone"
                    type="tel" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                    placeholder="Enter your phone number" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Message</label>
                  <textarea 
                    required
                    name="message"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all h-32" 
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                
                {formStatus.type && (
                  <div className={`p-4 rounded-xl text-sm font-medium ${formStatus.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {formStatus.message}
                  </div>
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
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-800">
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 p-4 flex gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
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
            className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-40 w-12 h-12 bg-white text-slate-900 rounded-full shadow-xl flex items-center justify-center border border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <ChevronUp />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
