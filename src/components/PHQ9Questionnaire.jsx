import React, { useState, useEffect } from 'react';
import TypingRecommendations from './TypingRecommendations';

const PHQ9Questionnaire = ({ healthData }) => {
  const [answers, setAnswers] = useState({
    q1: null, q2: null, q3: null, q4: null,
    q5: null, q6: null, q7: null, q8: null, q9: null
  });
  const [difficulty, setDifficulty] = useState(null);
  const [total, setTotal] = useState(0);
  const [severity, setSeverity] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const questions = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself or that you are a failure or have let yourself or your family down",
    "Trouble concentrating on things, such as reading the newspaper or watching television",
    "Moving or speaking so slowly that other people could have noticed. Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
    "Thoughts that you would be better off dead, or of hurting yourself"
  ];

  const difficultyLevels = [
    "Not difficult at all",
    "Somewhat difficult",
    "Very difficult",
    "Extremely difficult"
  ];

  const calculateSeverity = (score) => {
    if (score <= 4) return 'Minimal depression';
    if (score <= 9) return 'Mild depression';
    if (score <= 14) return 'Moderate depression';
    if (score <= 19) return 'Moderately severe depression';
    return 'Severe depression';
  };

  useEffect(() => {
    const sum = Object.values(answers).reduce((acc, val) => acc + (val || 0), 0);
    setTotal(sum);
    setSeverity(calculateSeverity(sum));
  }, [answers]);

 // Update the fetchAIRecommendations function
const fetchAIRecommendations = async (score, severityLevel) => {
  setLoadingRecommendations(true);
  
  // Construct a prompt based on the depression severity
  const promptText = `Generate 5 personalized recommendations for someone with ${severityLevel} (PHQ-9 score: ${score}). 
  Focus on practical, evidence-based activities that can help improve mental wellbeing.
  Format as a bullet point list using • symbols, with one recommendation per line.
  Keep each recommendation concise (under 15 words).`;
  
  setPrompt(promptText);
  
  try {
    const res = await fetch("http://127.0.0.1:5000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: promptText }),
    });

    const data = await res.json();
    if (data.response) {
      setResponse(data.response);
      
      // Process the response to create a list of recommendations
      // This assumes the AI returns a list that can be split by newlines or bullet points
      const recommendationList = data.response
        .split(/\n|•/)
        .map(item => item.trim())
        .filter(item => item.length > 0);
      
      setAiRecommendations(recommendationList);
    } else {
      setResponse("Error: " + data.error);
      // Fall back to pre-written recommendations if API fails
      setAiRecommendations(getSimulatedRecommendations(score));
    }
  } catch (error) {
    setResponse("Failed to fetch response");
    console.error("Error fetching AI recommendations:", error);
    // Fall back to pre-written recommendations if API fails
    setAiRecommendations(getSimulatedRecommendations(score));
  }
  
  // Make sure to set loading to false when done
  setLoadingRecommendations(false);
};
  
  // Simulated recommendations for demo purposes
  const getSimulatedRecommendations = (score) => {
    if (score <= 4) {
      return [
        "Start a daily 10-minute mindfulness meditation practice",
        "Take a 30-minute walk in nature three times per week",
        "Maintain a regular sleep schedule (aim for 7-8 hours each night)",
        "Keep a gratitude journal and write down three things you're thankful for each day",
        "Schedule time for activities you enjoy, even if brief"
      ];
    } else if (score <= 9) {
      return [
        "Practice 15 minutes of deep breathing exercises daily",
        "Engage in moderate exercise for 30 minutes, 3-4 times per week",
        "Reduce caffeine and alcohol consumption",
        "Connect with at least one friend or family member each day",
        "Try a relaxing bedtime routine to improve sleep quality"
      ];
    } else if (score <= 14) {
      return [
        "Structure your day with a consistent routine",
        "Set small, achievable goals and celebrate completing them",
        "Join a support group (online or in-person)",
        "Practice progressive muscle relaxation before bed",
        "Limit exposure to negative news and social media"
      ];
    } else {
      return [
        "Prioritize self-care activities like taking warm baths or gentle yoga",
        "Reach out to your support network when feeling overwhelmed",
        "Break tasks into very small, manageable steps",
        "Consider light therapy if seasonal factors affect your mood",
        "Practice self-compassion through positive self-talk exercises"
      ];
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(answers).some(val => val === null) || !difficulty) {
      alert('Please answer all questions');
      return;
    }
    setSubmitted(true);
    fetchAIRecommendations(total, severity);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setAnswers({
      q1: null, q2: null, q3: null, q4: null,
      q5: null, q6: null, q7: null, q8: null, q9: null
    });
    setDifficulty(null);
    setTotal(0);
    setSeverity('');
    setSubmitted(false);
    setAiRecommendations([]);
  };

  const renderOptions = (questionIndex) => {
    return (
      <div className="flex flex-wrap gap-4 mt-2">
        {[0, 1, 2, 3].map((value) => (
          <label key={value} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name={`q${questionIndex + 1}`}
              value={value}
              checked={answers[`q${questionIndex + 1}`] === value}
              onChange={(e) => setAnswers({
                ...answers,
                [`q${questionIndex + 1}`]: parseInt(e.target.value)
              })}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="text-sm text-gray-700">
              {value === 0 && "Not at all"}
              {value === 1 && "Several days"}
              {value === 2 && "More than half the days"}
              {value === 3 && "Nearly every day"}
            </span>
          </label>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden mb-12">
      {!submitted ? (
        // Only show the form if results haven't been submitted
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 font-medium mb-4">
              Over the last 2 weeks, how often have you been bothered by any of the following problems?
            </p>
            
            {questions.map((question, index) => (
              <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">{`${index + 1}. ${question}`}</p>
                {renderOptions(index)}
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-50 rounded-lg mb-6">
            <p className="font-medium text-gray-800 mb-3">
              If you checked off any problems, how difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?
            </p>
            <div className="flex flex-wrap gap-4">
              {difficultyLevels.map((level, index) => (
                <label key={index} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="difficulty"
                    value={index}
                    checked={difficulty === index}
                    onChange={(e) => setDifficulty(parseInt(e.target.value))}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">{level}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <button 
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              Submit Assessment
            </button>
          </div>
        </form>
      ) : (
        // Only show the results section after submission
        <div className="p-6 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Results Column */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold text-center mb-4">Your PHQ-9 Assessment Results</h3>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-gray-600">Total Score:</div>
                  <div className="font-bold">{total}</div>
                  
                  <div className="text-gray-600">Depression Severity:</div>
                  <div className="font-bold">{severity}</div>
                  
                  <div className="text-gray-600">Difficulty Level:</div>
                  <div className="font-bold">{difficultyLevels[difficulty]}</div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${
                total <= 4 ? 'bg-green-50 text-green-800 border border-green-200' :
                total <= 9 ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                total <= 14 ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
                'bg-red-50 text-red-800 border border-red-200'
              }`}>
                <h4 className="font-bold mb-2">Interpretation:</h4>
                <p>
                  {total <= 4 && "Your assessment indicates minimal depression symptoms. Continue with self-care practices."}
                  {total > 4 && total <= 9 && "Your assessment indicates mild depression symptoms. Consider talking to a counselor."}
                  {total > 9 && total <= 14 && "Your assessment indicates moderate depression symptoms. We recommend consulting with a mental health professional."}
                  {total > 14 && "Your assessment indicates significant depression symptoms. Please prioritize seeking help from a healthcare provider or mental health professional."}
                </p>
              </div>
              
              {(total > 9 || answers.q9 > 1) && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mt-4 text-red-800">
                  <p className="font-bold">Important:</p>
                  <p>Based on your responses, we strongly recommend speaking with a mental health professional. Help is available.</p>
                  <p className="mt-2">National Suicide Prevention Lifeline: 988 or 1-800-273-8255</p>
                </div>
              )}
              
                {/* Personalized AI Recommendations */}
                <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="font-bold mb-3">Personalized Activity Recommendations</h4>
                  
                  {loadingRecommendations ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2">Generating personalized recommendations...</span>
                    </div>
                  ) : (
                    <>
                      <p className="mb-3 text-sm text-gray-600">
                        Based on your assessment results, here are some activities that may help improve your wellbeing:
                      </p>
                      <TypingRecommendations recommendations={aiRecommendations} typingSpeed={25} />
                    </>
                  )}
                </div>
              
              <div className="mt-6 text-center">
                <button 
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 transition-colors duration-200 mr-4"
                >
                  Print Results
                </button>
                
                <a 
                  href="https://www.who.int/india/health-topics/mental-health" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors duration-200 mr-4"
                >
                  Find Help Resources
                </a>
                
                <button 
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors duration-200"
                >
                  Take Assessment Again
                </button>
              </div>
            </div>
            
            {/* Medical Disclaimer Column */}
            <div className="md:col-span-1">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg sticky top-4">
                <h4 className="font-bold text-yellow-800 mb-2">Important Note</h4>
                <p className="text-yellow-800 text-sm">
                  These recommendations are generated by AI and should not replace professional medical advice. For accurate diagnosis and personalized treatment, please consult with a healthcare provider or mental health professional.
                </p>
                <hr className="my-3 border-yellow-200" />
                <p className="text-yellow-800 text-sm">
                  The PHQ-9 is a screening tool, not a diagnostic instrument. Your healthcare provider can offer a comprehensive evaluation and develop a treatment plan tailored to your specific needs.
                </p>
                <div className="mt-4 p-3 bg-white rounded-lg border border-yellow-200">
                  <p className="font-medium text-gray-800 text-sm">Next steps:</p>
                  <ul className="list-disc pl-4 mt-2 text-sm text-gray-700 space-y-1">
                    <li>Discuss these results with your doctor</li>
                    <li>Keep track of your symptoms over time</li>
                    <li>Consider professional support options</li>
                    <li>Be patient with your progress</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PHQ9Questionnaire;