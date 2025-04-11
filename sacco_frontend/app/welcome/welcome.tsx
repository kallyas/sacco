import {
  ArrowRight,
  ArrowUpRight,
  BarChartIcon as ChartBar,
  Calculator,
  PiggyBank,
  Shield,
  Users,
  Wallet,
} from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

export function Welcome() {
  const features = [
    {
      icon: <Wallet className="w-12 h-12 text-blue-600" />,
      title: "Easy Loan Management",
      description:
        "Quick loan applications with competitive rates and flexible repayment options",
    },
    {
      icon: <PiggyBank className="w-12 h-12 text-green-600" />,
      title: "Smart Savings",
      description:
        "Multiple savings products with attractive interest rates and dividend earnings",
    },
    {
      icon: <Users className="w-12 h-12 text-purple-600" />,
      title: "Member Benefits",
      description:
        "Access to financial education, investment opportunities, and insurance products",
    },
    {
      icon: <Calculator className="w-12 h-12 text-orange-600" />,
      title: "Financial Planning",
      description:
        "Personalized financial advice and retirement planning tools",
    },
    {
      icon: <Shield className="w-12 h-12 text-red-600" />,
      title: "Secure Banking",
      description:
        "State-of-the-art security measures protecting your financial assets",
    },
    {
      icon: <ChartBar className="w-12 h-12 text-indigo-600" />,
      title: "Investment Options",
      description:
        "Diverse investment portfolios and wealth management services",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex justify-between items-center py-8">
            <div className="text-3xl font-bold text-blue-600">ModernSACCO</div>
            <div className="hidden md:flex space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Contact
              </a>
            </div>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <Link to="/login">Get Started</Link>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </nav>

          <div className="mt-20 md:mt-32 max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Banking Reimagined for the Digital Age
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Experience the future of financial services with our innovative
              SACCO platform. Smart savings, instant loans, and seamless
              investments.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 text-lg rounded-full shadow-lg transition-transform hover:scale-105">
                Open Account
                <ArrowUpRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="px-8 py-4 text-lg rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 transition-transform hover:scale-105"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            {[
              { value: "98%", label: "Customer Satisfaction" },
              { value: "$50M+", label: "Loans Disbursed" },
              { value: "15K+", label: "Active Members" },
            ].map((stat, index) => (
              <Card
                key={index}
                className="p-6 bg-white/80 backdrop-blur-lg border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 left-20 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white" id="features">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive financial solutions designed for your growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group rounded-2xl border-0 bg-gradient-to-br from-white to-gray-50"
              >
                <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-6 bg-blue-50 group-hover:bg-blue-100 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-8">
              Ready to transform your finances?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of members already benefiting from our innovative
              financial solutions
            </p>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 rounded-full px-8 py-4 text-lg shadow-lg transition-transform hover:scale-105"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { title: "Company", links: ["About", "Careers", "Press"] },
              { title: "Products", links: ["Savings", "Loans", "Investments"] },
              { title: "Resources", links: ["Blog", "Help Center", "Contact"] },
              { title: "Legal", links: ["Privacy", "Terms", "Cookies"] },
            ].map((section, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2 text-gray-400">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-20 pt-8 border-t border-gray-800 text-center text-gray-400">
            © 2025 ModernSACCO. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
