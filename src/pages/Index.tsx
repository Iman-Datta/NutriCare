
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const aboutSectionRef = useRef<HTMLDivElement>(null);

  const scrollToAbout = () => {
    aboutSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const navigateToNextPage = () => {
    if (isAuthenticated) {
      navigate('/bmi-calculator');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-blue-100/40 to-transparent"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/20 rounded-full filter blur-3xl animate-spin-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/10 rounded-full filter blur-3xl animate-spin-slow"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="z-10 max-w-4xl mx-auto"
        >
          <div className="mb-4 inline-block">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
              Your Personal Nutrition Guide
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
            FitNavi
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover your ideal health journey with personalized nutrition plans 
            tailored to your body's unique needs.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg"
              className="hero-button bg-blue-600 text-white hover:bg-blue-700 min-w-[180px]"
              onClick={navigateToNextPage}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="hero-button bg-white hover:bg-gray-50 min-w-[180px]"
              onClick={scrollToAbout}
            >
              Learn More
            </Button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={scrollToAbout}
        >
          <div className="animate-bounce p-2 bg-white rounded-full shadow-lg">
            <ArrowDown className="h-6 w-6 text-blue-600" />
          </div>
        </motion.div>
      </section>

      {/* About Section (Simplified version) */}
      <section ref={aboutSectionRef} className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full mb-4">
              About FitNavi
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Your Personal Health Companion
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              FitNavi combines advanced BMI analysis with AI-powered personalized 
              nutrition planning to help you achieve your health goals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="glass-card p-6"
            >
              <div className="bg-blue-100 rounded-lg p-3 inline-block mb-4">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">BMI Assessment</h3>
              <p className="text-gray-600">
                Calculate your Body Mass Index and receive a personalized health 
                status assessment based on your results.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="glass-card p-6"
            >
              <div className="bg-blue-100 rounded-lg p-3 inline-block mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Personalized Diet Plans</h3>
              <p className="text-gray-600">
                Get a customized monthly diet plan based on your dietary preferences, 
                health goals, and lifestyle.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="glass-card p-6"
            >
              <div className="bg-blue-100 rounded-lg p-3 inline-block mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Guidance</h3>
              <p className="text-gray-600">
                Our advanced AI analyzes your data to provide recommendations that 
                are specifically tailored to your unique health profile.
              </p>
            </motion.div>
          </div>
          
          <div className="text-center mt-16">
            <Button 
              size="lg"
              className="hero-button bg-blue-600 text-white hover:bg-blue-700"
              onClick={navigateToNextPage}
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
