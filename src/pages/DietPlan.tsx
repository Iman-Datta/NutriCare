import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Printer, Share2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useToast } from "@/components/ui/use-toast";
import { getBMIData } from '@/lib/bmiCalculator';
import { fetchDietPlan, MealPlan } from '@/services/dietPlanService';
import { isDietApiConfigured } from '@/lib/env';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const generateWeeks = (): string[] => {
  return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
};

const generateDays = (): string[] => {
  return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
};

const DietPlan = () => {
  const [dietPlan, setDietPlan] = useState<MealPlan | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeWeek, setActiveWeek] = useState('Week 1');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isMounted = useRef(true);
  
  const bmiData = getBMIData();
  const dietaryPreferences = localStorage.getItem('dietaryPreferences') 
    ? JSON.parse(localStorage.getItem('dietaryPreferences') || '{}')
    : null;

  useEffect(() => {
    if (dietPlan !== null) {
      return;
    }
    
    if (!bmiData || !dietaryPreferences) {
      navigate('/bmi-calculator');
      return;
    }

    const generateDietPlan = async () => {
      setError(null);
      setIsLoading(true);
      
      try {
        console.log("Starting diet plan fetch...");
        const { mealPlan, recommendations } = await fetchDietPlan(bmiData, dietaryPreferences);
        console.log("Diet plan fetch completed successfully");
        
        if (isMounted.current) {
          setDietPlan(mealPlan);
          setRecommendations(recommendations);
          setIsLoading(false);
          
          if (!isDietApiConfigured()) {
            toast({
              title: "Using Demo Mode",
              description: "Set up VITE_DIET_API_KEY in your .env file to enable real API integration",
            });
          }
        }
      } catch (error) {
        console.error("Error in diet plan component:", error);
        
        if (isMounted.current) {
          setError("Failed to generate your diet plan. Please try again later.");
          setIsLoading(false);
          
          toast({
            title: "Generation Failed",
            description: "An error occurred while generating your diet plan",
            variant: "destructive",
          });
        }
      }
    };

    generateDietPlan();
    
    return () => {
      console.log("DietPlan component unmounting");
      isMounted.current = false;
    };
  }, [navigate, toast]);

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your diet plan is being downloaded as a PDF",
    });
    // This would normally trigger a PDF download
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    toast({
      title: "Share Link Created",
      description: "A shareable link has been copied to your clipboard",
    });
    // This would normally create a shareable link
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Generating Your Personalized Diet Plan</h2>
          <p className="text-gray-500 mt-2">This may take a moment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-md w-full mx-auto px-4">
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button 
            onClick={() => navigate('/dietary-preferences')} 
            className="w-full"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!dietPlan) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Something went wrong</h2>
          <p className="text-gray-500 mt-2">Unable to generate diet plan</p>
          <Button 
            onClick={() => navigate('/dietary-preferences')} 
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gradient-to-b from-blue-50 to-white">
      <div className="container max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full mb-2">
                Your Personalized Plan
              </div>
              <h1 className="text-2xl font-bold">Monthly Diet Plan</h1>
              <p className="text-gray-600 mt-1">
                Based on your BMI ({bmiData?.bmi}) and dietary preferences
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleDownload} className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
              </Button>
              <Button variant="outline" onClick={handlePrint} className="flex items-center">
                <Printer className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Print</span>
              </Button>
              <Button variant="outline" onClick={handleShare} className="flex items-center">
                <Share2 className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Diet Plan Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-blue-600">Health Goal</p>
                <p className="text-gray-800">
                  {dietaryPreferences.healthGoal === 'weight_loss' && 'Weight Loss'}
                  {dietaryPreferences.healthGoal === 'weight_gain' && 'Weight Gain'}
                  {dietaryPreferences.healthGoal === 'maintenance' && 'Weight Maintenance'}
                  {dietaryPreferences.healthGoal === 'muscle_gain' && 'Muscle Gain'}
                  {dietaryPreferences.healthGoal === 'general_health' && 'General Health Improvement'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">Diet Preference</p>
                <p className="text-gray-800 capitalize">{dietaryPreferences.dietPreference}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">Activity Level</p>
                <p className="text-gray-800 capitalize">{dietaryPreferences.activityLevel}</p>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="Week 1" onValueChange={setActiveWeek}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
              {generateWeeks().map((week) => (
                <TabsTrigger key={week} value={week} className="text-sm">
                  {week}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {Object.keys(dietPlan).map((week) => (
              <TabsContent key={week} value={week} className="space-y-4">
                <Accordion type="single" collapsible className="w-full">
                  {Object.keys(dietPlan[week]).map((day) => (
                    <AccordionItem key={`${week}-${day}`} value={day}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                          <span className="font-medium">{day}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-8">
                        <div className="space-y-6 py-2">
                          <div>
                            <h4 className="text-sm font-semibold text-blue-600 mb-2">Breakfast</h4>
                            <p className="text-gray-700">{dietPlan[week][day].breakfast}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold text-blue-600 mb-2">Lunch</h4>
                            <p className="text-gray-700">{dietPlan[week][day].lunch}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold text-blue-600 mb-2">Dinner</h4>
                            <p className="text-gray-700">{dietPlan[week][day].dinner}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold text-blue-600 mb-2">Snacks</h4>
                            <p className="text-gray-700">{dietPlan[week][day].snacks}</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="bg-blue-50 rounded-xl p-6 mt-8">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Recommendations</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DietPlan;
