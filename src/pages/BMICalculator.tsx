
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from 'framer-motion';
import { Calculator, ChevronRight, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { useToast } from "@/components/ui/use-toast";
import { 
  calculateBMI, 
  getBMICategory, 
  saveBMIData, 
  type BMIData 
} from '@/lib/bmiCalculator';

const formSchema = z.object({
  weight: z.coerce.number()
    .min(20, { message: "Weight must be at least 20 kg" })
    .max(300, { message: "Weight must be less than 300 kg" }),
  height: z.coerce.number()
    .min(100, { message: "Height must be at least 100 cm" })
    .max(250, { message: "Height must be less than 250 cm" }),
  age: z.coerce.number()
    .min(18, { message: "You must be at least 18 years old" })
    .max(120, { message: "Age must be less than 120 years" }),
  gender: z.enum(["male", "female"], {
    required_error: "Please select a gender",
  }),
});

const BMICalculator = () => {
  const [bmiResult, setBmiResult] = useState<BMIData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: 0,
      height: 0,
      age: 0,
      gender: "male",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsCalculating(true);
    
    try {
      // Calculate BMI
      const bmi = calculateBMI(values.weight, values.height);
      
      // Get BMI category and health status
      const { category, healthStatus } = getBMICategory(bmi);
      
      // Create BMI data object - explicitly set all required properties to satisfy the BMIData type
      const bmiData: BMIData = {
        weight: values.weight,
        height: values.height,
        age: values.age,
        gender: values.gender,
        bmi,
        category,
        healthStatus,
      };
      
      // Save BMI data
      saveBMIData(bmiData);
      
      // Set BMI result
      setBmiResult(bmiData);
      
      // Show success toast
      toast({
        title: "BMI Calculated Successfully",
        description: `Your BMI is ${bmi} (${category})`,
      });
    } catch (error) {
      console.error("Error calculating BMI:", error);
      toast({
        title: "Calculation Failed",
        description: "An error occurred while calculating your BMI",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleContinue = () => {
    navigate('/dietary-preferences');
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
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Calculator className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold">Calculate Your BMI</h1>
          </div>
          
          <p className="text-gray-600 mb-8">
            Enter your details below to calculate your Body Mass Index (BMI) and assess your health status.
          </p>
          
          {!bmiResult ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter your weight in kg" 
                            className="h-12"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter your height in cm" 
                            className="h-12"
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
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter your age" 
                            className="h-12"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="male" />
                              </FormControl>
                              <FormLabel className="cursor-pointer">Male</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="female" />
                              </FormControl>
                              <FormLabel className="cursor-pointer">Female</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full md:w-auto h-12 min-w-[200px] text-base font-medium"
                  disabled={isCalculating}
                >
                  {isCalculating ? (
                    <div className="flex items-center justify-center">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Calculating...
                    </div>
                  ) : (
                    "Calculate BMI"
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="p-6 rounded-xl bg-blue-50 border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-blue-800">Your BMI Results</h2>
                  <div className="bg-white p-2 rounded-full">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-blue-600 font-medium mb-1">BMI Value</div>
                    <div className="text-4xl font-bold text-blue-900 mb-1">{bmiResult.bmi}</div>
                    <div className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full inline-block">
                      {bmiResult.category}
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center">
                    <div className="text-sm text-blue-600 font-medium mb-2">Health Assessment</div>
                    <p className="text-blue-800">{bmiResult.healthStatus}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600">
                  BMI is a useful measurement for most people over 18 years old. But it's not the only indicator of health. 
                  For a more comprehensive assessment, let's gather some information about your dietary preferences and health goals.
                </p>
                
                <Button 
                  onClick={handleContinue} 
                  className="h-12 min-w-[200px] text-base font-medium"
                >
                  <span>Continue to Dietary Preferences</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BMICalculator;

