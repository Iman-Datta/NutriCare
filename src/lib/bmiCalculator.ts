
export interface BMIData {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  bmi: number;
  category: string;
  healthStatus: string;
}

export const calculateBMI = (weight: number, height: number): number => {
  // Convert height from cm to meters
  const heightInMeters = height / 100;
  
  // Calculate BMI: weight (kg) / (height (m) × height (m))
  const bmi = weight / (heightInMeters * heightInMeters);
  
  // Round to one decimal place
  return Math.round(bmi * 10) / 10;
};

export const getBMICategory = (bmi: number): { category: string; healthStatus: string } => {
  if (bmi < 18.5) {
    return { 
      category: 'Underweight', 
      healthStatus: 'You may need to gain some weight. Consider consulting with a healthcare professional.'
    };
  } else if (bmi >= 18.5 && bmi < 25) {
    return { 
      category: 'Normal weight', 
      healthStatus: 'You have a healthy weight. Maintain your current habits.'
    };
  } else if (bmi >= 25 && bmi < 30) {
    return { 
      category: 'Overweight', 
      healthStatus: 'You may need to lose some weight. Focus on a balanced diet and regular exercise.'
    };
  } else {
    return { 
      category: 'Obese', 
      healthStatus: 'Your weight may pose health risks. Consider consulting with a healthcare professional.'
    };
  }
};

export const saveBMIData = (data: BMIData): void => {
  localStorage.setItem('bmiData', JSON.stringify(data));
};

export const getBMIData = (): BMIData | null => {
  const data = localStorage.getItem('bmiData');
  return data ? JSON.parse(data) : null;
};
