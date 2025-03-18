
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { useToast } from "@/components/ui/use-toast";
import { getBMIData } from '@/lib/bmiCalculator';

const formSchema = z.object({
  dietPreference: z.enum(["vegetarian", "non-vegetarian", "vegan", "pescatarian"], {
    required_error: "Please select a diet preference",
  }),
  activityLevel: z.enum(["sedentary", "moderate", "active"], {
    required_error: "Please select an activity level",
  }),
  cuisinePreference: z.string().min(2, { message: "Please specify your cuisine preference" }),
  allergies: z.string().optional(),
  favoriteFoods: z.string().min(2, { message: "Please list some of your favorite foods" }),
  dislikedFoods: z.string().optional(),
  hydrationIntake: z.enum(["low", "moderate", "high"], {
    required_error: "Please select your hydration level",
  }),
  breakfast: z.string().min(2, { message: "Please describe your typical breakfast" }),
  lunch: z.string().min(2, { message: "Please describe your typical lunch" }),
  dinner: z.string().min(2, { message: "Please describe your typical dinner" }),
  snacks: z.string().optional(),
  healthGoal: z.enum(["weight_loss", "weight_gain", "maintenance", "muscle_gain", "general_health"], {
    required_error: "Please select a health goal",
  }),
});

interface DietaryPreferences extends z.infer<typeof formSchema> {}

const saveDietaryPreferences = (data: DietaryPreferences): void => {
  localStorage.setItem('dietaryPreferences', JSON.stringify(data));
};

const DietaryPreferences = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const bmiData = getBMIData();

  if (!bmiData) {
    navigate('/bmi-calculator');
    return null;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dietPreference: "non-vegetarian",
      activityLevel: "moderate",
      cuisinePreference: "",
      allergies: "",
      favoriteFoods: "",
      dislikedFoods: "",
      hydrationIntake: "moderate",
      breakfast: "",
      lunch: "",
      dinner: "",
      snacks: "",
      healthGoal: "maintenance",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Save dietary preferences
      saveDietaryPreferences(values);
      
      // Show success toast
      toast({
        title: "Information Submitted",
        description: "We're generating your personalized diet plan",
      });
      
      // Navigate to diet plan page
      setTimeout(() => {
        navigate('/diet-plan');
      }, 1000);
    } catch (error) {
      console.error("Error submitting preferences:", error);
      toast({
        title: "Submission Failed",
        description: "An error occurred while saving your preferences",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gradient-to-b from-blue-50 to-white">
      <div className="container max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Dietary Preferences & Health Goals</h1>
            <p className="text-gray-600 mt-2">
              Help us understand your preferences and goals to create a personalized diet plan.
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Basic Preferences</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="dietPreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Diet Preference</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select diet preference" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="vegetarian">Vegetarian</SelectItem>
                            <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                            <SelectItem value="vegan">Vegan</SelectItem>
                            <SelectItem value="pescatarian">Pescatarian</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="activityLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Activity Level</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select activity level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                            <SelectItem value="moderate">Moderate (exercise 3-5 days/week)</SelectItem>
                            <SelectItem value="active">Active (exercise 6-7 days/week)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="cuisinePreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cuisine Preference</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Italian, Indian, Mediterranean" 
                          className="h-12"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Enter your preferred cuisines or food styles
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Food Preferences & Restrictions</h2>
                
                <FormField
                  control={form.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allergies or Food Intolerances</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List any food allergies or intolerances (leave blank if none)"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="favoriteFoods"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Favorite Foods</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="List foods you particularly enjoy"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dislikedFoods"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Disliked Foods</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="List foods you dislike or avoid (optional)"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="hydrationIntake"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Hydration Intake</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="low" />
                            </FormControl>
                            <FormLabel className="cursor-pointer">Low (less than 4 cups of water per day)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="moderate" />
                            </FormControl>
                            <FormLabel className="cursor-pointer">Moderate (4-6 cups of water per day)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="high" />
                            </FormControl>
                            <FormLabel className="cursor-pointer">High (more than 6 cups of water per day)</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Current Eating Habits</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="breakfast"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Typical Breakfast</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your typical breakfast"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lunch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Typical Lunch</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your typical lunch"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="dinner"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Typical Dinner</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your typical dinner"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="snacks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Typical Snacks</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your typical snacks (optional)"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Health Goals</h2>
                
                <FormField
                  control={form.control}
                  name="healthGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Health Goal</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select your main health goal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="weight_loss">Weight Loss</SelectItem>
                          <SelectItem value="weight_gain">Weight Gain</SelectItem>
                          <SelectItem value="maintenance">Weight Maintenance</SelectItem>
                          <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                          <SelectItem value="general_health">General Health Improvement</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This will help us tailor your diet plan to your specific goals
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full md:w-auto h-12 min-w-[200px] text-base font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span>Generate Diet Plan</span>
                    <ChevronRight className="ml-1 h-5 w-5" />
                  </div>
                )}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
};

export default DietaryPreferences;
