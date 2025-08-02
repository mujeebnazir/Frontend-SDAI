import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Heart, ArrowRight, ArrowLeft } from "lucide-react" // Added ArrowLeft import
import { Link } from "react-router-dom"

export default function HomeLocal() {
  return (
    <div className="min-h-screen flex flex-col justify-start">
      
      {/* Fixed navbar with proper styling and positioning */}
      <nav className="relative z-50 flex justify-between items-center w-full px-6 py-4 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="black_btn"
          onClick={() => window.open("https://github.com/mujeebnazir")}
        >
          GitHub
        </Button>
      </nav>

      {/* Background gradient */}
      <div className="main fixed inset-0 -z-10">
        <div className="gradient" />
      </div>
 
      <div className="max-w-4xl mx-auto p-6 relative z-10">
        <div className="text-center mb-12 pt-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Mental Health Assessment</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Take our comprehensive mental health assessments powered by machine learning models trained on local
            Kashmiri data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Brain className="w-8 h-8 text-blue-600" />
                Anxiety Assessment
              </CardTitle>
              <CardDescription>
                Comprehensive evaluation to predict anxiety levels using advanced ML algorithms.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/anxiety"> {/* Changed from href to to */}
                <Button className="w-full gap-2">
                  Start Anxiety Assessment
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-600" />
                Depression Assessment
              </CardTitle>
              <CardDescription>
                Detailed screening to identify potential depression indicators through data analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/depression"> {/* Changed from href to to */}
                <Button className="w-full gap-2">
                  Start Depression Assessment
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            These assessments are for informational purposes only and should not replace professional medical advice.
          </p>
        </div>
      </div>
    </div>
  )
}
