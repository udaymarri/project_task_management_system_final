import { motion, useScroll, useTransform } from 'motion/react';
import { useState, useEffect } from 'react';
import {
  CheckCircle2,
  ArrowRight,
  Zap,
  Users,
  BarChart3,
  Lock,
  Globe,
  Sparkles,
  Star,
  Menu,
  X,
  Moon,
  Sun
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface LandingPageProps {
  onNavigate: (page: 'login' | 'signup') => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950 transition-colors duration-500">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-400/10 dark:bg-pink-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </motion.div>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Testimonials
              </a>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>
              <Button variant="ghost" onClick={() => onNavigate('login')}>
                Log in
              </Button>
              <Button
                onClick={() => onNavigate('signup')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block py-2 text-slate-700 dark:text-slate-300">Features</a>
              <a href="#pricing" className="block py-2 text-slate-700 dark:text-slate-300">Pricing</a>
              <a href="#testimonials" className="block py-2 text-slate-700 dark:text-slate-300">Testimonials</a>
              <Button variant="ghost" className="w-full" onClick={() => onNavigate('login')}>
                Log in
              </Button>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600" onClick={() => onNavigate('signup')}>
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            style={{ opacity, scale }}
            className="text-center space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                <Sparkles className="w-3 h-3 mr-1" />
                New: Intelligent productivity insights
              </Badge>
            </motion.div>

            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                Project Management
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Reimagined
              </span>
            </motion.h1>

            <motion.p
              className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              The ultimate platform for teams who demand excellence.
              Collaborate seamlessly, track progress effortlessly, and ship faster than ever.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button
                size="lg"
                onClick={() => onNavigate('signup')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-2xl shadow-blue-500/50 hover:shadow-blue-600/60 transition-all duration-300"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg rounded-xl border-2 dark:border-slate-700"
              >
                Watch Demo
              </Button>
            </motion.div>

            <motion.div
              className="flex justify-center gap-8 text-sm text-slate-600 dark:text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Free 14-day trial
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                No credit card required
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image/Dashboard Preview */}
          <motion.div
            className="mt-20 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20 border border-slate-200 dark:border-slate-800">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1770368787779-8472da646193?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9qZWN0JTIwbWFuYWdlbWVudCUyMGRhc2hib2FyZCUyMHNjcmVlbnxlbnwxfHx8fDE3NzE0MTcxNTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Dashboard Preview"
                className="w-full h-auto opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
            </div>

            {/* Floating cards */}
            <motion.div
              className="absolute -top-10 -left-10 hidden lg:block"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Card className="p-4 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-700 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">Task Completed</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Design review finished</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              className="absolute -bottom-10 -right-10 hidden lg:block"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Card className="p-4 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-700 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">New Team Member</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Sarah joined the project</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Active Users', value: '50K+', icon: Users },
              { label: 'Projects Completed', value: '1M+', icon: CheckCircle2 },
              { label: 'Time Saved', value: '500K hrs', icon: Zap },
              { label: 'Customer Rating', value: '4.9/5', icon: Star },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </motion.div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-slate-600 dark:text-slate-400 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge className="mb-4 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              Features
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                Everything you need to succeed
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Powerful features designed to supercharge your team's productivity
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Optimized performance ensures your team never waits. Real-time updates across all devices.',
                gradient: 'from-yellow-500 to-orange-600',
              },
              {
                icon: Users,
                title: 'Team Collaboration',
                description: 'Work together seamlessly with real-time comments, mentions, and activity feeds.',
                gradient: 'from-blue-500 to-cyan-600',
              },
              {
                icon: BarChart3,
                title: 'Advanced Analytics',
                description: 'Get insights into team performance, project progress, and resource allocation.',
                gradient: 'from-purple-500 to-pink-600',
              },
              {
                icon: Lock,
                title: 'Enterprise Security',
                description: 'Bank-level encryption, SSO, and compliance with SOC 2, GDPR, and HIPAA.',
                gradient: 'from-green-500 to-emerald-600',
              },
              {
                icon: Globe,
                title: 'Global Access',
                description: 'Access your projects from anywhere, on any device. Fully responsive and mobile-optimized.',
                gradient: 'from-indigo-500 to-blue-600',
              },
              {
                icon: Sparkles,
                title: 'Intelligent Insights',
                description: 'Smart productivity features, automated workflows, and intelligent prioritization.',
                gradient: 'from-rose-500 to-red-600',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card className="p-8 h-full backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
                  <motion.div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-90" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQyYzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to transform your workflow?
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              Join thousands of teams already using TaskFlow to ship faster and collaborate better.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={() => onNavigate('signup')}
                className="bg-white text-blue-600 hover:bg-blue-50 px-12 py-6 text-lg rounded-xl shadow-2xl"
              >
                Get Started for Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 dark:bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">TaskFlow</span>
              </div>
              <p className="text-slate-400">
                The ultimate project management platform for modern teams.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">License</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400">© 2026 TaskFlow. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
