
import { toast } from "@/components/ui/use-toast";
import { getDietApiKey, isDietApiConfigured } from "@/lib/env";
import { BMIData } from "@/lib/bmiCalculator";

interface ApiDietPlan {
  weeks: {
    [key: string]: {
      [key: string]: {
        breakfast: string;
        lunch: string;
        dinner: string;
        snacks: string;
      };
    };
  };
  recommendations: string[];
}

export interface MealPlan {
  [key: string]: {
    [key: string]: {
      breakfast: string;
      lunch: string;
      dinner: string;
      snacks: string;
    };
  };
}

// Function to craft a prompt for OpenAI based on user data
const createOpenAIPrompt = (bmiData: BMIData, dietaryPreferences: any): string => {
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const dietPreference = dietaryPreferences.dietPreference || 'normal';
  const healthGoal = dietaryPreferences.healthGoal || 'maintenance';
  const activityLevel = dietaryPreferences.activityLevel || 'moderate';
  const allergies = dietaryPreferences.allergies || 'none';
  const cuisinePreference = dietaryPreferences.cuisinePreference || 'none';
  
  return `Create a detailed 4-week diet plan for a person with the following characteristics:
- BMI: ${bmiData.bmi} (Category: ${bmiData.category})
- Weight: ${bmiData.weight} kg
- Height: ${bmiData.height} cm
- Age: ${bmiData.age}
- Gender: ${bmiData.gender}
- Dietary preference: ${dietPreference}
- Health goal: ${healthGoal}
- Activity level: ${activityLevel}
- Allergies or food restrictions: ${allergies}
- Cuisine preference: ${cuisinePreference}

For each day across all 4 weeks, provide specific meal recommendations including:
1. Breakfast
2. Lunch
3. Dinner
4. Snacks

Also include 5 general nutrition and lifestyle recommendations based on their health profile.

Format your response as a JSON object with this exact structure:
{
  "weeks": {
    "Week 1": {
      "Monday": {
        "breakfast": "Detailed breakfast recommendation",
        "lunch": "Detailed lunch recommendation",
        "dinner": "Detailed dinner recommendation",
        "snacks": "Detailed snacks recommendation"
      },
      "Tuesday": {
        "breakfast": "...",
        "lunch": "...",
        "dinner": "...",
        "snacks": "..."
      },
      // ... and so on for all days of the week
    },
    // ... and so on for all 4 weeks
  },
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2",
    "Recommendation 3",
    "Recommendation 4",
    "Recommendation 5"
  ]
}

Ensure the meals are diverse, nutritionally balanced, and aligned with the specified dietary preferences and health goals. Keep portion sizes appropriate for the individual's characteristics.`;
};

export const fetchDietPlan = async (
  bmiData: BMIData, 
  dietaryPreferences: any
): Promise<{ mealPlan: MealPlan; recommendations: string[] }> => {
  if (!isDietApiConfigured()) {
    console.warn("OpenAI API key not configured. Using mock data instead.");
    return generateMockDietPlan(bmiData, dietaryPreferences);
  }

  try {
    const apiKey = getDietApiKey();
    const prompt = createOpenAIPrompt(bmiData, dietaryPreferences);
    
    console.log("Sending request to OpenAI API...");
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    console.log("Received response from OpenAI API, status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API request failed with status ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Successfully parsed response JSON");
    
    // Extract the content from the OpenAI response
    const content = responseData.choices[0].message.content;
    console.log("Content extracted from response");
    
    // Parse the JSON string returned by OpenAI
    let data: ApiDietPlan;
    try {
      // Remove any markdown code blocks if present
      const jsonString = content.replace(/```json|```/g, '').trim();
      console.log("Attempting to parse JSON from:", jsonString.substring(0, 100) + "...");
      data = JSON.parse(jsonString);
      console.log("Successfully parsed diet plan JSON");
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      console.log("Raw response content:", content);
      throw new Error("Failed to parse the diet plan from OpenAI");
    }
    
    // Validate the structure of the response before returning
    if (!data.weeks || !data.recommendations) {
      console.error("Invalid response structure from OpenAI");
      throw new Error("The response from OpenAI did not contain the expected data structure");
    }
    
    return {
      mealPlan: data.weeks,
      recommendations: data.recommendations
    };
  } catch (error) {
    console.error("Error fetching diet plan from OpenAI:", error);
    
    // Show toast only once
    toast({
      title: "OpenAI Request Failed",
      description: "Failed to fetch your diet plan. Using default recommendations instead.",
      variant: "destructive",
    });
    
    // Fallback to mock data if API fails
    return generateMockDietPlan(bmiData, dietaryPreferences);
  }
};

// This function generates a mock diet plan when API key is not provided
// This preserves the original functionality as a fallback
const generateMockDietPlan = (
  bmiData: BMIData,
  dietaryPreferences: any
): Promise<{ mealPlan: MealPlan; recommendations: string[] }> => {
  const isVegetarian = dietaryPreferences.dietPreference === 'vegetarian' || dietaryPreferences.dietPreference === 'vegan';
  const healthGoal = dietaryPreferences.healthGoal || 'maintenance';
  
  // Mock diet plan generation
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const mealPlan: MealPlan = {};
  
  weeks.forEach((week) => {
    mealPlan[week] = {};
    
    days.forEach((day) => {
      let breakfast, lunch, dinner, snacks;
      
      // Very simplified meal planning logic
      if (isVegetarian) {
        breakfast = 'Oatmeal with fruits and nuts, green tea';
        lunch = 'Quinoa salad with mixed vegetables and avocado';
        dinner = 'Lentil soup with whole grain bread and side salad';
        snacks = 'Mixed nuts, fruit smoothie';
      } else {
        breakfast = 'Scrambled eggs with whole grain toast, fresh fruit';
        lunch = 'Grilled chicken salad with olive oil dressing';
        dinner = 'Baked salmon with roasted vegetables and quinoa';
        snacks = 'Greek yogurt with berries, protein bar';
      }
      
      // Adjust based on health goal
      if (healthGoal === 'weight_loss') {
        breakfast += ' (reduced portion)';
        lunch += ' (high protein, low carb)';
        dinner += ' (lean protein focus)';
        snacks = 'Low-calorie options: cucumber slices, celery sticks with hummus';
      } else if (healthGoal === 'weight_gain') {
        breakfast += ' + protein shake';
        lunch += ' with additional healthy fats like avocado';
        dinner += ' with extra portion of complex carbs';
        snacks = 'Protein-rich snacks: nuts, seeds, protein bars';
      } else if (healthGoal === 'muscle_gain') {
        breakfast += ' + protein shake';
        lunch += ' with lean protein';
        dinner += ' with extra protein portion';
        snacks = 'High protein snacks: boiled eggs, Greek yogurt, protein bars';
      }
      
      mealPlan[week][day] = {
        breakfast,
        lunch,
        dinner,
        snacks,
      };
    });
  });
  
  // Mock recommendations
  const recommendations = [
    'Stay hydrated by drinking at least 8 glasses of water daily',
    'Try to eat at regular intervals to maintain energy levels',
    'Include a variety of colorful vegetables and fruits in your diet',
    'Limit processed foods and added sugars',
    'Adjust portion sizes based on your hunger and fullness cues'
  ];
  
  // Simulate API delay
  return new Promise(resolve => 
    setTimeout(() => resolve({ mealPlan, recommendations }), 1000)
  );
};
