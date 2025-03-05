import { logo } from "../assets";

const Hero = () => {
  return (
    <div className="w-full flex justify-center items-center flex-col">
      <nav className="flex justify-between items-center w-full mb-10 pt-3">
        <div className="flex items-center">
          <img src={logo} alt="mentalhealth_logo" className="w-28 object-contain" style={{ clipPath: 'inset(0 70% 0 0)' }} />
        </div>
        
        <div className="flex items-center gap-6">
          <a 
            href="/about-model"
            className="font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Our Model
          </a>
          
          <a 
            href="/about-phq9"
            className="font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            About PHQ-9
          </a>
          
          <button
            onClick={() => window.open("https://github.com/mujeebnazir")}
            className="black_btn"
          >
            GitHub
          </button>
        </div>
      </nav>

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
  );
};

export default Hero;