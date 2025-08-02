import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { logo } from "../assets";
import useDepressionPredction from '../hooks/useDepression.js';

const DepressionModel = () => {
  const { predictDepression, loading, error, result, reset } = useDepressionPredction();
  
  const [formData, setFormData] = useState({
    anxiety: 0,
    benzodiazepine_use: 0,
    tobacco_use: 0,
    unemployed: 0,
    rural: 0,
    low_education: 0,
    average_income: 50000,
    is_school_dropout: 0,
    was_child_married: 0,
    has_chronic_disease: 0,
    exposed_to_domestic_violence: 0,
    aware_of_mental_health: 1,
    has_been_a_crime_victim: 0,
    can_access_healthcare: 1,
    has_mental_health_facility_access: 1,
    has_internet: 1,
    orphan: 0,
    individual_married: 0,
    individual_employed: 1,
    family_liability: 0,
    has_bank_loan: 0,
    gender_encoded: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await predictDepression(formData);
    } catch (err) {
      console.error('Prediction failed:', err);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const CheckboxField = ({ name, label, checked, onChange }) => (
    <div className="flex items-center space-x-2 mb-2">
      <input
        type="checkbox"
        checked={checked === 1}
        onChange={(e) => onChange(name, e.target.checked ? 1 : 0)}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <label className="text-xs font-medium text-gray-700 cursor-pointer">
        {label}
      </label>
    </div>
  );

  const NumberField = ({ name, label, value, onChange, min = 0, max = 200000 }) => (
    <div className="flex items-center space-x-3 mb-2">
      <label className="text-xs font-medium text-gray-700 w-32 flex-shrink-0">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        min={min}
        max={max}
        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );

  const SelectField = ({ name, label, value, onChange, options }) => (
    <div className="flex items-center space-x-3 mb-2">
      <label className="text-xs font-medium text-gray-700 w-32 flex-shrink-0">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background grid with lower z-index */}
      <div className="main">
        <div className="gradient" />
      </div>
      
      {/* Navigation */}
      <nav className="relative z-50 flex justify-between items-center w-full mb-10 pt-3 px-20">
        <div className="flex items-center">
          <Link to="/">
            <img 
              src={logo} 
              alt="mentalhealth_logo" 
              className="w-28 object-contain" 
              style={{ clipPath: 'inset(0 70% 0 0)' }} 
            />
          </Link>
        </div>
        
        <div className="flex items-center gap-6">
          <Link 
            to="/"
            className="font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            ← Back to Home
          </Link>
          
          <button
            onClick={() => window.open("https://github.com/mujeebnazir")}
            className="black_btn"
          >
            GitHub
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div className="relative z-40 max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-4 head_text">
            Depression Prediction Model
          </h1>
          <p className="text-lg text-gray-600">
            Complete this comprehensive assessment to predict Depression using our ML model trined on local <span className='blue_gradient'>Kashmiri</span> data.
          </p>
        </div>

        {/* Form container */}
        <div className="relative z-30 bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Demographics Section */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Demographics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <NumberField
                  name="average_income"
                  label="Average Income (₹)"
                  value={formData.average_income}
                  onChange={handleInputChange}
                />
                <SelectField
                  name="gender_encoded"
                  label="Gender"
                  value={formData.gender_encoded}
                  onChange={handleInputChange}
                  options={[
                    { value: 0, label: 'Female' },
                    { value: 1, label: 'Male' }
                  ]}
                />
              </div>
            </div>

            {/* Health Conditions */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Health Conditions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2">
                <CheckboxField
                  name="ptsd"
                  label="Experience palpitations"
                  checked={formData.anxiety}
                  onChange={handleInputChange}
                />
                <CheckboxField
                  name="has_chronic_disease"
                  label="Has chronic disease"
                  checked={formData.has_chronic_disease}
                  onChange={handleInputChange}
                />
                <CheckboxField
                  name="benzodiazepine_use"
                  label="Benzodiazepine use"
                  checked={formData.benzodiazepine_use}
                  onChange={handleInputChange}
                />
                <CheckboxField
                  name="tobacco_use"
                  label="Tobacco use"
                  checked={formData.tobacco_use}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Socioeconomic Factors */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Socioeconomic Factors
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2">
                <CheckboxField
                  name="unemployed"
                  label="Currently unemployed"
                  checked={formData.unemployed}
                  onChange={handleInputChange}
                />
                <CheckboxField
                  name="rural"
                  label="Lives in rural area"
                  checked={formData.rural}
                  onChange={handleInputChange}
                />
                <CheckboxField
                  name="low_education"
                  label="Low education level"
                  checked={formData.low_education}
                  onChange={handleInputChange}
                />
                <CheckboxField
                  name="is_school_dropout"
                  label="School dropout"
                  checked={formData.is_school_dropout}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Personal History */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Personal History
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2">
                <CheckboxField
                  name="was_child_married"
                  label="Was child married"
                  checked={formData.was_child_married}
                  onChange={handleInputChange}
                />
                <CheckboxField
                  name="exposed_to_domestic_violence"
                  label="Exposed to domestic violence"
                  checked={formData.exposed_to_domestic_violence}
                  onChange={handleInputChange}
                />
                <CheckboxField
                  name="has_been_a_crime_victim"
                  label="Been a crime victim"
                  checked={formData.has_been_a_crime_victim}
                  onChange={handleInputChange}
                />
                <CheckboxField
                  name="orphan"
                  label="Orphan"
                  checked={formData.orphan}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Access & Support */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Access & Support
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2">
                <CheckboxField
                  name="can_access_healthcare"
                  label="Can access healthcare"
                  checked={formData.can_access_healthcare}
                  onChange={handleInputChange}
                />
                <CheckboxField
                  name="has_mental_health_facility_access"
                  label="Has mental health facility access"
                  checked={formData.has_mental_health_facility_access}
                  onChange={handleInputChange}
                />
                <CheckboxField
                  name="aware_of_mental_health"
                  label="Aware of mental health"
                  checked={formData.aware_of_mental_health}
                  onChange={handleInputChange}
                />
                <CheckboxField
                  name="has_internet"
                  label="Has internet access"
                  checked={formData.has_internet}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Current Status */}
            <div className="pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Current Status
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2">
                <CheckboxField
                  name="individual_married"
                  label="Currently married"
                  checked={formData.individual_married}
                  onChange={handleInputChange}
                />
                <CheckboxField
                  name="individual_employed"
                  label="Currently employed"
                  checked={formData.individual_employed}
                  onChange={handleInputChange}
                />
                <CheckboxField
                  name="family_liability"
                  label="Has family liability"
                  checked={formData.family_liability}
                  onChange={handleInputChange}
                />
                <CheckboxField
                  name="has_bank_loan"
                  label="Has bank loan"
                  checked={formData.has_bank_loan}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-8 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? 'Predicting...' : 'Predict Depression'}
              </button>
            </div>
          </form>

          {/* Results Section */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                  <button
                    onClick={reset}
                    className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Prediction Result</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded p-4">
                  <p className="text-sm text-gray-600">Anxiety Prediction</p>
                  <p className={`text-2xl font-bold ${result.prediction === 1 ? 'text-red-600' : 'text-green-600'}`}>
                    {result.prediction === 1 ? 'Anxiety Detected' : 'No Anxiety Detected'}
                  </p>
                </div>
                
                {result.probability && (
                  <div className="bg-white rounded p-4">
                    <p className="text-sm text-gray-600">Confidence Level</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {(Math.max(...result.probability) * 100).toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={reset}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded transition-colors"
                >
                  Clear Results
                </button>
                
                <Link
                  to="/"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Take Depression Assessment
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepressionModel;
