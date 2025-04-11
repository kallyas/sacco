import {
  ArrowRight,
  ArrowUpRight,
  BarChartIcon as ChartBar,
  Calculator,
  PiggyBank,
  Shield,
  Users,
  Wallet,
  Check,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Building,
  CreditCard,
  DollarSign,
  Lock,
  BarChart,
  Clock,
} from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { useState } from "react";

export function Welcome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <Wallet className="w-12 h-12 text-primary" />,
      title: "Easy Loan Management",
      description:
        "Quick loan applications with competitive rates and flexible repayment options tailored to your needs",
    },
    {
      icon: <PiggyBank className="w-12 h-12 text-success" />,
      title: "Smart Savings",
      description:
        "Multiple savings products with attractive interest rates and dividend earnings to help your money grow",
    },
    {
      icon: <Users className="w-12 h-12 text-primary" />,
      title: "Member Benefits",
      description:
        "Access to financial education, investment opportunities, and insurance products for complete coverage",
    },
    {
      icon: <BarChart className="w-12 h-12 text-success" />,
      title: "Financial Planning",
      description:
        "Personalized financial advice and retirement planning tools to secure your future",
    },
    {
      icon: <Lock className="w-12 h-12 text-primary" />,
      title: "Secure Banking",
      description:
        "State-of-the-art security measures protecting your financial assets and personal information",
    },
    {
      icon: <DollarSign className="w-12 h-12 text-success" />,
      title: "Investment Options",
      description:
        "Diverse investment portfolios and wealth management services to maximize your returns",
    },
  ];

  const testimonials = [
    {
      quote:
        "ModernSACCO transformed my financial journey. The loan process was seamless and their financial planning tools helped me save for my dream home.",
      author: "Sarah Johnson",
      position: "Small Business Owner",
      image: "/api/placeholder/100/100",
    },
    {
      quote:
        "The investment options at ModernSACCO have consistently outperformed my expectations. Their personalized approach makes all the difference.",
      author: "Michael Chen",
      position: "Tech Professional",
      image: "/api/placeholder/100/100",
    },
    {
      quote:
        "I joined ModernSACCO two years ago and already I've seen remarkable growth in my savings. Their mobile app makes banking incredibly convenient.",
      author: "Priya Patel",
      position: "Healthcare Worker",
      image: "/api/placeholder/100/100",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed w-full bg-background/95 backdrop-blur-md z-50 shadow-sm border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">
                ModernSACCO
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Testimonials
              </a>
              <a
                href="#about"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Contact
              </a>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Sign Up
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="flex justify-between items-center p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">
                ModernSACCO
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex flex-col p-4 space-y-4">
            <a
              href="#features"
              className="p-4 text-lg font-medium border-b border-border"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="p-4 text-lg font-medium border-b border-border"
              onClick={() => setMobileMenuOpen(false)}
            >
              Testimonials
            </a>
            <a
              href="#about"
              className="p-4 text-lg font-medium border-b border-border"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#contact"
              className="p-4 text-lg font-medium border-b border-border"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </a>
            <div className="mt-4 space-y-2 p-4">
              <Link to="/login" className="block w-full">
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary"
                >
                  Log In
                </Button>
              </Link>
              <Link to="/register" className="block w-full">
                <Button className="w-full bg-primary text-primary-foreground">
                  Sign Up
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 max-w-2xl">
              <div className="inline-block px-3 py-1 mb-6 bg-secondary text-primary rounded-md text-sm font-medium">
                Financial Solutions for Everyone
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-foreground">
                Banking Reimagined for the{" "}
                <span className="text-primary">Digital Age</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Experience the future of financial services with our innovative
                SACCO platform. Smart savings, instant loans, and seamless
                investments all in one place.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                >
                  Open Account
                  <ArrowUpRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  Learn More
                </Button>
              </div>

              <div className="mt-8 flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-full border-2 border-background bg-muted overflow-hidden"
                    >
                      <img
                        src={`/api/placeholder/32/32`}
                        alt={`User ${idx}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-bold text-primary">15,000+</span>{" "}
                  members already trust us
                </p>
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="relative z-10 rounded-lg shadow-2xl overflow-hidden border border-border">
                <img
                  src="/api/placeholder/600/400"
                  alt="Banking App Interface"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 rounded-full blur-3xl opacity-30"></div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            {[
              {
                value: "98%",
                label: "Customer Satisfaction",
                description: "Based on over 10,000 reviews",
              },
              {
                value: "$50M+",
                label: "Loans Disbursed",
                description: "Supporting businesses and dreams",
              },
              {
                value: "15K+",
                label: "Active Members",
                description: "And growing every day",
              },
            ].map((stat, index) => (
              <Card
                key={index}
                className="p-8 bg-card border border-border shadow-md rounded-lg hover:shadow-lg transition-all duration-300 group"
              >
                <h3 className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">
                  {stat.value}
                </h3>
                <p className="text-foreground font-semibold text-lg">
                  {stat.label}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {stat.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Subtle background */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full opacity-70 animate-blob"></div>
          <div className="absolute top-40 -left-40 w-80 h-80 bg-accent/5 rounded-full opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 left-20 w-80 h-80 bg-success/5 rounded-full opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-muted-foreground mb-8 uppercase tracking-wider text-sm font-medium">
            Trusted by leading organizations
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div
                key={idx}
                className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              >
                <img
                  src={`/api/placeholder/120/40`}
                  alt={`Partner ${idx}`}
                  className="h-8"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background" id="features">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block px-3 py-1 bg-secondary text-primary rounded-md text-sm font-medium mb-4">
              Our Features
            </span>
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Everything you need to succeed financially
            </h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive financial solutions designed for your growth and
              prosperity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-8 hover:shadow-lg transition-all duration-300 group rounded-lg border border-border hover:-translate-y-1"
              >
                <div className="h-16 w-16 rounded-lg flex items-center justify-center mb-6 bg-secondary group-hover:bg-secondary/70 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {feature.description}
                </p>
                <Button
                  variant="ghost"
                  className="p-0 h-auto text-primary group-hover:text-primary hover:bg-transparent flex items-center"
                >
                  Learn more <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block px-3 py-1 bg-success/20 text-success rounded-md text-sm font-medium mb-4">
              Simple Process
            </span>
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              How ModernSACCO Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Three simple steps to start your financial journey with us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Sign Up",
                description:
                  "Create your account in minutes. No paperwork required.",
                icon: <Users className="w-10 h-10 text-primary" />,
              },
              {
                step: "02",
                title: "Select Products",
                description:
                  "Choose from our range of financial products that match your goals.",
                icon: <CreditCard className="w-10 h-10 text-primary" />,
              },
              {
                step: "03",
                title: "Start Growing",
                description:
                  "Watch your wealth grow with our competitive returns and services.",
                icon: <BarChart className="w-10 h-10 text-primary" />,
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="relative p-8 bg-card rounded-lg shadow-md border border-border"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                  {step.step}
                </div>
                <div className="pt-4 pb-2">{step.icon}</div>
                <h3 className="text-2xl font-semibold my-4">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background" id="testimonials">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block px-3 py-1 bg-accent/20 text-accent-foreground rounded-md text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              What Our Members Say
            </h2>
            <p className="text-xl text-muted-foreground">
              Hear from people who have transformed their finances with
              ModernSACCO
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <Card
                key={idx}
                className="p-8 border border-border shadow-md rounded-lg hover:shadow-lg transition-all"
              >
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-5 h-5 text-accent fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-foreground mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {testimonial.author}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {testimonial.position}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-12 border border-white/20 shadow-2xl">
            <div className="text-center text-primary-foreground mb-8">
              <h2 className="text-4xl font-bold mb-4">
                Ready to transform your finances?
              </h2>
              <p className="text-xl opacity-90 mb-8">
                Join thousands of members already benefiting from our innovative
                financial solutions. Open your account in minutes.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-primary-foreground border-white hover:bg-white/10"
                >
                  Contact Sales
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
              {[
                {
                  title: "24/7 Support",
                  icon: <Clock className="h-5 w-5" />,
                },
                {
                  title: "Free Financial Consultation",
                  icon: <Calculator className="h-5 w-5" />,
                },
                {
                  title: "Money-Back Guarantee",
                  icon: <Shield className="h-5 w-5" />,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center md:justify-start space-x-2 text-primary-foreground"
                >
                  <Check className="h-5 w-5 text-success" />
                  <div className="flex items-center">
                    {item.icon}
                    <span className="ml-2">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-background" id="contact">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <span className="inline-block px-3 py-1 bg-secondary text-primary rounded-md text-sm font-medium mb-4">
                  Contact Us
                </span>
                <h2 className="text-4xl font-bold mb-6 text-foreground">
                  Get in Touch
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Have questions about our services? Our team is here to help
                  you with any inquiries.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-secondary p-3 rounded-full">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Phone Support
                      </h3>
                      <p className="text-foreground">+1 (800) 123-4567</p>
                      <p className="text-muted-foreground text-sm">
                        Monday - Friday, 8am - 8pm
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-secondary p-3 rounded-full">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Email
                      </h3>
                      <p className="text-foreground">support@modernsacco.com</p>
                      <p className="text-muted-foreground text-sm">
                        We respond within 24 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-secondary p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Office
                      </h3>
                      <p className="text-foreground">
                        123 Financial Street, Suite 100
                      </p>
                      <p className="text-muted-foreground text-sm">
                        New York, NY 10001
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card p-8 rounded-lg shadow-md border border-border">
                <h3 className="text-2xl font-semibold mb-6 text-foreground">
                  Send us a message
                </h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full p-3 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      className="w-full p-3 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    ></textarea>
                  </div>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground pt-20 pb-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <Building className="h-8 w-8 text-accent" />
                <span className="text-2xl font-bold text-primary-foreground">
                  ModernSACCO
                </span>
              </div>
              <p className="text-primary-foreground/80 mb-6">
                Your trusted partner in financial growth since 2018. Providing
                innovative financial solutions for a brighter future.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-4 text-primary-foreground/80">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Press
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    News & Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Products</h3>
              <ul className="space-y-4 text-primary-foreground/80">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Savings Accounts
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Loan Products
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Investment Options
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Insurance Services
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Financial Planning
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-4 text-primary-foreground/80">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    FAQs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-primary-foreground/20 text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-primary-foreground/70 text-sm">
              © 2025 ModernSACCO. All rights reserved.
            </p>
            <div className="mt-4 sm:mt-0">
              <ul className="flex flex-wrap justify-center sm:justify-end space-x-6 text-sm text-primary-foreground/70">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Cookies
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Sitemap
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Welcome;
