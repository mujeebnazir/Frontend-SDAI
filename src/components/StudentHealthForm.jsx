import { loader } from '@/assets';
import React, { useState, forwardRef, useImperativeHandle } from 'react';

const StudentHealthForm = forwardRef(({ onSubmit }, ref) => {
  const initialFormState = {
    Age: '',
    Academic_Pressure: 0,
    Cgpa: '',
    Study_Satisfaction: 0,
    Dietary_Habits: '',
    Suicidal_Thoughts: '',
    WrkStdy_Hours: '',
    Financial_Stress: 0
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Expose resetForm method to parent component
  useImperativeHandle(ref, () => ({
    resetForm: () => {
      setFormData(initialFormState);
      setErrors({});
      setSubmitted(false);
    }
  }));
  
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'range' ? parseInt(value) : value
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Age validation
    if (!formData.Age) {
      newErrors.Age = 'Age is required';
    } else if (isNaN(parseInt(formData.Age)) || parseInt(formData.Age) < 16 || parseInt(formData.Age) > 100) {
      newErrors.Age = 'Please enter a valid age between 16 and 100';
    }

    // CGPA validation
    if (!formData.Cgpa) {
      newErrors.Cgpa = 'CGPA is required';
    } else if (isNaN(parseFloat(formData.Cgpa)) || parseFloat(formData.Cgpa) < 0 || parseFloat(formData.Cgpa) > 10) {
      newErrors.Cgpa = 'Please enter a valid CGPA between 0.0 and 10.0';
    }

    // Work/Study Hours validation
    if (!formData.WrkStdy_Hours) {
      newErrors.WrkStdy_Hours = 'Weekly work/study hours is required';
    } else if (isNaN(parseInt(formData.WrkStdy_Hours)) || parseInt(formData.WrkStdy_Hours) < 0 || parseInt(formData.WrkStdy_Hours) > 168) {
      newErrors.WrkStdy_Hours = 'Please enter valid hours between 0 and 168';
    }

    // Dietary Habits validation
    if (formData.Dietary_Habits === '') {
      newErrors.Dietary_Habits = 'Please select your dietary habits';
    }

    // Suicidal Thoughts validation
    if (formData.Suicidal_Thoughts === '') {
      newErrors.Suicidal_Thoughts = 'This field is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (validateForm()) {
      // Convert to appropriate types for submission
      const processedData = {
        Age: parseInt(formData.Age),
        Academic_Pressure: formData.Academic_Pressure,
        Cgpa: parseFloat(formData.Cgpa),
        Study_Satisfaction: formData.Study_Satisfaction,
        Dietary_Habits: parseInt(formData.Dietary_Habits),
        Suicidal_Thoughts: parseInt(formData.Suicidal_Thoughts),
        WrkStdy_Hours: parseInt(formData.WrkStdy_Hours),
        Financial_Stress: formData.Financial_Stress
      };
      
      console.log('Form submitted:', processedData);
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(processedData)
      });
      const data = await response.json();
      console.log(data.prediction);  // 1 is depression 0 is not depression
      setSubmitted(true);
      
      // Call the parent component's onSubmit function
      if (onSubmit) {
        onSubmit(data);
      }
    }
    setLoading(false);
  };

  // Render a form field with horizontal layout
  const renderFormField = (label, inputElement, errorMessage) => {
    return (
      <div className="mb-4 flex flex-wrap md:items-center">
        <div className="w-full md:w-1/3">
          <label className="block text-gray-700 mb-2 md:mb-0">{label}</label>
        </div>
        <div className="w-full md:w-2/3">
          {inputElement}
          {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-center">Student Health Assessment</h2>
      
      {submitted ? (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded mb-6">
          Form submitted successfully. Thank you for your participation.
        </div>
      ) : null}
      
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="grid md:grid-cols-2 gap-x-6">
          {/* Left Column */}
          <div>
            {/* Age Field */}
            {renderFormField(
              "Age",
              <input
                type="number"
                name="Age"
                value={formData.Age}
                onChange={handleChange}
                className={`w-full p-2 border ${errors.Age ? 'border-red-500' : 'border-gray-300'} rounded`}
              />,
              errors.Age
            )}
            
            {/* CGPA Field */}
            {renderFormField(
              "CGPA (0.0-10.0)",
              <input
                type="number"
                name="Cgpa"
                step="0.01"
                min="0"
                max="10"
                value={formData.Cgpa}
                onChange={handleChange}
                className={`w-full p-2 border ${errors.Cgpa ? 'border-red-500' : 'border-gray-300'} rounded`}
              />,
              errors.Cgpa
            )}
            
            {/* Work/Study Hours Field */}
            {renderFormField(
              "Daily Work/Study Hours",
              <input
                type="number"
                name="WrkStdy_Hours"
                value={formData.WrkStdy_Hours}
                onChange={handleChange}
                className={`w-full p-2 border ${errors.WrkStdy_Hours ? 'border-red-500' : 'border-gray-300'} rounded`}
              />,
              errors.WrkStdy_Hours
            )}
            
            {/* Dietary Habits Field */}
            {renderFormField(
              "Dietary Habits",
              <select
                name="Dietary_Habits"
                value={formData.Dietary_Habits}
                onChange={handleChange}
                className={`w-full p-2 border ${errors.Dietary_Habits ? 'border-red-500' : 'border-gray-300'} rounded`}
              >
                <option value="">Select an option</option>
                <option value="0">Unhealthy</option>
                <option value="1">Moderate</option>
                <option value="2">Healthy</option>
              </select>,
              errors.Dietary_Habits
            )}
          </div>
          
          {/* Right Column */}
          <div>
            {/* Academic Pressure Field */}
            {renderFormField(
              `Academic Pressure Level: ${formData.Academic_Pressure}`,
              <div>
                <input
                  type="range"
                  name="Academic_Pressure"
                  min="0"
                  max="5"
                  value={formData.Academic_Pressure}
                  onChange={handleChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Low (0)</span>
                  <span>High (5)</span>
                </div>
              </div>,
              null
            )}
            
            {/* Study Satisfaction Field */}
            {renderFormField(
              `Study Satisfaction: ${formData.Study_Satisfaction}`,
              <div>
                <input
                  type="range"
                  name="Study_Satisfaction"
                  min="0"
                  max="5"
                  value={formData.Study_Satisfaction}
                  onChange={handleChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Not Satisfied (0)</span>
                  <span>Very Satisfied (5)</span>
                </div>
              </div>,
              null
            )}
            
            {/* Financial Stress Field */}
            {renderFormField(
              `Financial Stress Level: ${formData.Financial_Stress}`,
              <div>
                <input
                  type="range"
                  name="Financial_Stress"
                  min="0"
                  max="5"
                  value={formData.Financial_Stress}
                  onChange={handleChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>No Stress (0)</span>
                  <span>High Stress (5)</span>
                </div>
              </div>,
              null
            )}
            
            {/* Suicidal Thoughts Field */}
            {renderFormField(
              "Have you experienced suicidal thoughts?",
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="Suicidal_Thoughts"
                    value="0"
                    checked={formData.Suicidal_Thoughts === "0"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  No
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="Suicidal_Thoughts"
                    value="1"
                    checked={formData.Suicidal_Thoughts === "1"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Yes
                </label>
              </div>,
              errors.Suicidal_Thoughts
            )}
          </div>
        </div>
        
        {/* Crisis Resources for those who indicate suicidal thoughts */}
        {formData.Suicidal_Thoughts === "1" && (
          <div className="my-6 p-4 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
            <p className="font-bold">Important:</p>
            <p>If you're experiencing suicidal thoughts, please reach out for help:</p>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center">
                <span className="font-medium mr-2">•</span>
                <span>National Suicide Prevention Lifeline: 988 or 1-800-273-8255</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">•</span>
                <span>Crisis Text Line: Text HOME to 741741</span>
              </div>
            </div>
            <p className="mt-2 font-medium">Help is available 24/7. You're not alone.</p>
          </div>
        )}
        
        {/* Submit Button */}
        <div className="text-center mt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <img src={loader} alt="loading" className="w-5 h-5 mr-2 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              "Submit Assessment"
            )}
          </button>
        </div>
      </form>
    </div>
  );
});

export default StudentHealthForm;