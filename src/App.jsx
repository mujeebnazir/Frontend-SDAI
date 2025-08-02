// import React, { useState, useRef } from "react";
// import Hero from "./components/Hero";
// import "./App.css";
// import PHQ9Questionnaire from "./components/PHQ9Questionnaire";
// import StudentHealthForm from "./components/StudentHealthForm";
// import DialogBox from "./components/DialogBox";

// const App = () => {
//   const [healthFormSubmitted, setHealthFormSubmitted] = useState(false);
//   const [showPHQ9, setShowPHQ9] = useState(false);
//   const [healthAssessmentData, setHealthAssessmentData] = useState(null);
//   const [atRiskForDepression, setAtRiskForDepression] = useState(false);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const formRef = useRef(null);

//   const handleHealthFormSubmit = (data) => {
//     setHealthFormSubmitted(true);
//     setHealthAssessmentData(data);
//     setAtRiskForDepression(data.prediction === 1);
//     setIsDialogOpen(true); // Open the modal on submit
//   };

//   const handleContinueToPHQ9 = () => {
//     setShowPHQ9(true);
//     setIsDialogOpen(false); // Close the modal when continuing

//     if (formRef.current && typeof formRef.current.resetForm === "function") {
//       formRef.current.resetForm();
//     }
//   };

//   return (
//     <main className="w-full">
//       <div className="main">
//         <div className="gradient" />
//       </div>
//       <div className="app">
//         <Hero />

//         {!showPHQ9 && (
//           <div className="my-8">
//             <StudentHealthForm onSubmit={handleHealthFormSubmit} ref={formRef} />

//             <DialogBox isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
//               {healthFormSubmitted && atRiskForDepression ? (
//                 <div className="text-center">
//                   <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
//                     <p className="text-yellow-800">
//                       Based on your responses, we recommend completing a depression screening assessment.
//                     </p>
//                   </div>
//                   <button
//                     onClick={handleContinueToPHQ9}
//                     className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 animate-pulse"
//                   >
//                     Continue to Depression Screening →
//                   </button>
//                 </div>
//               ) : (
//                 <div className="text-center">
//                   <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//                     <p className="text-green-800 font-medium">
//                       Thank you for completing the health assessment.
//                     </p>
//                     <p className="text-green-700 mt-2">
//                       Based on your responses, no further screening is recommended at this time.
//                     </p>
//                     <button
//                       onClick={handleContinueToPHQ9}
//                       className="mt-4 text-black hover:text-gray-800 underline"
//                     >
//                       Take depression screening anyway
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </DialogBox>
//           </div>
//         )}

//         {showPHQ9 && (
//           <div>
//             <div className="max-w-md mx-auto my-6">
//               <button
//                 onClick={() => setShowPHQ9(false)}
//                 className="flex items-center mx-auto bg-black text-white py-2 px-4 rounded-md hover:text-white mb-4"
//               >
//                 ← Back to Health Assessment
//               </button>
//               <h2 className="text-xl font-bold text-center mb-4">Depression Screening (PHQ-9)</h2>
//               <p className="text-gray-600 mb-6 text-center">
//                 Please complete this brief questionnaire to assess depression symptoms.
//               </p>
//             </div>
//             <PHQ9Questionnaire healthData={healthAssessmentData} />
//           </div>
//         )}
//       </div>
//     </main>
//   );
// };

// export default App;
import React, { useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import "./App.css";
import PHQ9Questionnaire from "./components/PHQ9Questionnaire";
import StudentHealthForm from "./components/StudentHealthForm";
import DialogBox from "./components/DialogBox";
import MentalHealthLocal from "./components/MentalHealthLocal";
import HomeLocal from "./components/HomeLocal";
import useAnxietyPrediction from "./hooks/useAnxiety";
import useDepressionPrediction from "./hooks/useDepression";
import NewsCarousel from "./components/news-carosal";

const App = () => {
  const { predictAnxiety, loading, error, result, reset } = useAnxietyPrediction();
  const {predictDepression, loading: loadingDepression, error: errorDepression, result: resultDepression, reset: resetDepression} = useDepressionPrediction();
  const [healthFormSubmitted, setHealthFormSubmitted] = useState(false);
  const [showPHQ9, setShowPHQ9] = useState(false);
  const [healthAssessmentData, setHealthAssessmentData] = useState(null);
  const [atRiskForDepression, setAtRiskForDepression] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const formRef = useRef(null);

  const handleHealthFormSubmit = (data) => {
    setHealthFormSubmitted(true);
    setHealthAssessmentData(data);
    setAtRiskForDepression(data.prediction === 1);
    setIsDialogOpen(true);
  };

  const handleContinueToPHQ9 = () => {
    setShowPHQ9(true);
    setIsDialogOpen(false);

    if (formRef.current && typeof formRef.current.resetForm === "function") {
      formRef.current.resetForm();
    }
  };


  const StudentDM = () => (
      <main className="w-full">

      <div className="main">
        <div className="gradient" />
      </div>
      <div className="app">
        <Hero />

        <div >
            <h1 className="head_text">
        Predict Student Depression with
        <br className="max-md:hidden" />
        <span className="blue_gradient"> AI Insights</span>
      </h1>

      <h2 className="desc">
        Empower your mental health journey through early detection, 
        personalized recommendations, and supportive resources for students
      </h2>
      </div>

        {!showPHQ9 && (
          <div className="my-8">
            <StudentHealthForm onSubmit={handleHealthFormSubmit} ref={formRef} />

            <DialogBox isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
              {healthFormSubmitted && atRiskForDepression ? (
                <div className="text-center">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-yellow-800">
                      Based on your responses, we recommend completing a depression screening assessment.
                    </p>
                  </div>
                  <button
                    onClick={handleContinueToPHQ9}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 animate-pulse"
                  >
                    Continue to Depression Screening →
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">
                      Thank you for completing the health assessment.
                    </p>
                    <p className="text-green-700 mt-2">
                      Based on your responses, no further screening is recommended at this time.
                    </p>
                    <button
                      onClick={handleContinueToPHQ9}
                      className="mt-4 text-black hover:text-gray-800 underline"
                    >
                      Take depression screening anyway
                    </button>
                  </div>
                </div>
              )}
            </DialogBox>
          </div>
        )}

        {showPHQ9 && (
          <div>
            <div className="max-w-md mx-auto my-6">
              <button
                onClick={() => setShowPHQ9(false)}
                className="flex items-center mx-auto bg-black text-white py-2 px-4 rounded-md hover:text-white mb-4"
              >
                ← Back to Health Assessment
              </button>
              <h2 className="text-xl font-bold text-center mb-4">Depression Screening (PHQ-9)</h2>
              <p className="text-gray-600 mb-6 text-center">
                Please complete this brief questionnaire to assess depression symptoms.
              </p>
            </div>
            <PHQ9Questionnaire healthData={healthAssessmentData} />
          </div>
        )}
      </div>
    </main>
  )

  // Main Home Page Component
  const HomePage = () => (
    <main className="w-full">
      <div className="main">
        <div className="gradient" />
      </div>
      <div className="app">
        <Hero />
     
      <div className="w-full mx-auto p-6 relative z-10 ">
        <NewsCarousel />
         </div>
      </div>
    </main>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about-model" element={<HomeLocal />} />
        <Route path="/anxiety" element={
          <MentalHealthLocal       
        
        type="anxiety"
        onPredict={predictAnxiety}
        loading={loading}
        error={error}
        result={result}
        onReset={reset} 

        />} />
        <Route path="/depression" element={
          <MentalHealthLocal 
                type="depression"
                onPredict={predictDepression}
                loading={loadingDepression}
                error={errorDepression}
                result={resultDepression}
                onReset={resetDepression}
        />} />

        <Route path="/student-depression" element={<StudentDM />} />
      </Routes>
    </Router>
  );
};

export default App;
