
import React from 'react';
import { motion } from 'framer-motion';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AboutUs: React.FC = () => {
  return (
    <AnimatedTransition className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-primary">About FitNavi</CardTitle>
              <CardDescription className="text-lg">
                Your personalized journey to a healthier lifestyle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-xl text-primary mb-2">Our Mission</h3>
                <p className="text-gray-700">
                  At FitNavi, we believe that everyone deserves a personalized approach to health and nutrition. 
                  Our mission is to provide you with tailored dietary plans based on your unique body composition, 
                  preferences, and health goals.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-xl text-primary mb-2">How It Works</h3>
                <p className="text-gray-700">
                  FitNavi uses advanced algorithms and AI to analyze your BMI, dietary preferences, 
                  and lifestyle factors to create a customized monthly diet plan. Our approach is 
                  scientific yet practical, ensuring that you receive advice that fits seamlessly 
                  into your daily routine.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-xl text-primary mb-2">Our Values</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  <li><span className="font-medium">Personalization:</span> We believe one size does not fit all when it comes to nutrition.</li>
                  <li><span className="font-medium">Accessibility:</span> Health advice should be accessible to everyone.</li>
                  <li><span className="font-medium">Sustainability:</span> We focus on long-term lifestyle changes, not quick fixes.</li>
                  <li><span className="font-medium">Education:</span> We empower you with knowledge about your body and nutritional needs.</li>
                </ul>
              </div>
              
              <div className="pt-4">
                <p className="text-gray-700 italic text-center">
                  "FitNavi is not just about losing weight – it's about finding the right balance for your body 
                  and developing a healthy relationship with food."
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatedTransition>
  );
};

export default AboutUs;
