"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Heart,
  Building,
  BookOpen,
  Shield,
  Activity,
  ArrowLeft,
  Github,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  ClipboardList,
} from "lucide-react"
import AIRecommendations from "./AIRecommendations"
import { Link } from "react-router-dom"
const formSections = [
  {
    id: "demographics",
    title: "Demographics",
    icon: User,
    color: "text-blue-600",
    fields: ["average_income", "gender_encoded"],
  },
  {
    id: "health",
    title: "Health Conditions",
    icon: Heart,
    color: "text-red-600",
    fields: ["anxiety", "ptsd", "has_chronic_disease", "benzodiazepine_use", "tobacco_use"],
  },
  {
    id: "socioeconomic",
    title: "Socioeconomic Factors",
    icon: Building,
    color: "text-green-600",
    fields: ["unemployed", "rural", "low_education", "is_school_dropout"],
  },
  {
    id: "personal",
    title: "Personal History",
    icon: BookOpen,
    color: "text-orange-600",
    fields: ["was_child_married", "exposed_to_domestic_violence", "has_been_a_crime_victim", "orphan"],
  },
  {
    id: "access",
    title: "Access & Support",
    icon: Shield,
    color: "text-indigo-600",
    fields: ["can_access_healthcare", "has_mental_health_facility_access", "aware_of_mental_health", "has_internet"],
  },
  {
    id: "status",
    title: "Current Status",
    icon: Activity,
    color: "text-purple-600",
    fields: ["individual_married", "individual_employed", "family_liability", "has_bank_loan"],
  },
]

const fieldLabels = {
  average_income: "Average Income (₹)",
  gender_encoded: "Gender",
  anxiety: "Experience palpitations",
  ptsd: "Experience palpitations",
  has_chronic_disease: "Has chronic disease",
  benzodiazepine_use: "Benzodiazepine use",
  tobacco_use: "Tobacco use",
  unemployed: "Currently unemployed",
  rural: "Lives in rural area",
  low_education: "Low education level",
  is_school_dropout: "School dropout",
  was_child_married: "Was child married",
  exposed_to_domestic_violence: "Exposed to domestic violence",
  has_been_a_crime_victim: "Been a crime victim",
  orphan: "Orphan",
  can_access_healthcare: "Can access healthcare",
  has_mental_health_facility_access: "Has mental health facility access",
  aware_of_mental_health: "Aware of mental health",
  has_internet: "Has internet access",
  individual_married: "Currently married",
  individual_employed: "Currently employed",
  family_liability: "Has family liability",
  has_bank_loan: "Has bank loan",
}

export default function MentalHealthAssessment({ type, onPredict, loading, error, result, onReset }) {
  const [formData, setFormData] = useState({
    [type === "anxiety" ? "ptsd" : "anxiety"]: 0,
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
    gender_encoded: 0,
  })

  const [currentSection, setCurrentSection] = useState(0)
  const [completedSections, setCompletedSections] = useState(new Set())

  const [recommendations, setRecommendations] = useState(null)
  const [recommendationsLoading, setRecommendationsLoading] = useState(false)
  const [recommendationsError, setRecommendationsError] = useState(null)

  const handleInputChange = useCallback((name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  const generateRecommendations = async (predictionResult) => {
    setRecommendationsLoading(true)
    setRecommendationsError(null)

    try {
      // Calculate severity level based on prediction and confidence
      const confidence = predictionResult.probability ? Math.max(...predictionResult.probability) * 100 : 50
      let severityLevel = "mild"

      if (predictionResult.prediction === 1) {
        if (confidence >= 80) severityLevel = "severe"
        else if (confidence >= 60) severityLevel = "moderate"
        else severityLevel = "mild"
      } else {
        severityLevel = "minimal"
      }

      // Construct prompt based on assessment type and severity
      const conditionType = type === "anxiety" ? "anxiety" : "depression"
      const promptText = `Generate 5 personalized recommendations for someone with ${severityLevel} ${conditionType} (confidence: ${confidence.toFixed(1)}%).
      Focus on practical, evidence-based activities that can help improve mental wellbeing.
      Format as a bullet point list using • symbols, with one recommendation per line.
      Keep each recommendation concise (under 15 words).
      Include a mix of immediate coping strategies and long-term wellness practices.`

      const response = await fetch("http://127.0.0.1:5000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate recommendations")
      }

      const data = await response.json()
      setRecommendations({
        text: data.response || data.text || data.recommendations,
        severity: severityLevel,
        confidence: confidence,
      })
    } catch (error) {
      console.error("Error generating recommendations:", error)
      setRecommendationsError("Unable to generate recommendations. Please try again.")
    } finally {
      setRecommendationsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await onPredict(formData)

    // Generate AI recommendations after prediction
    if (result && !error) {
      await generateRecommendations(result)
    }
  }

  const progress = ((currentSection + 1) / formSections.length) * 100

  const CheckboxField = ({ name, label, checked, onChange }) => (
    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
      <Checkbox id={name} checked={checked === 1} onCheckedChange={(checked) => onChange(name, checked ? 1 : 0)} />
      <Label htmlFor={name} className="text-sm font-medium cursor-pointer flex-1">
        {label}
      </Label>
    </div>
  )

  const NumberField = ({ name, label, value, onChange }) => (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>
      <Input
        id={name}
        type="number"
        value={value}
        onChange={(e) => onChange(name, Number(e.target.value))}
        min={0}
        max={200000}
        className="w-full"
      />
    </div>
  )

  const SelectField = ({ name, label, value, onChange, options }) => (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>
      <Select value={value.toString()} onValueChange={(val) => onChange(name, Number(val))}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )

  const renderSection = (sectionIndex) => {
    const section = formSections[sectionIndex]
    const Icon = section.icon

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Icon className={`w-6 h-6 ${section.color}`} />
            {section.title}
          </CardTitle>
          <CardDescription>Complete this section to continue with your assessment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {section.fields.map((field) => {
            if (!fieldLabels[field]) return null

            if (field === "average_income") {
              return (
                <NumberField
                  key={field}
                  name={field}
                  label={fieldLabels[field]}
                  value={formData[field]}
                  onChange={handleInputChange}
                />
              )
            }

            if (field === "gender_encoded") {
              return (
                <SelectField
                  key={field}
                  name={field}
                  label={fieldLabels[field]}
                  value={formData[field]}
                  onChange={handleInputChange}
                  options={[
                    { value: 0, label: "Female" },
                    { value: 1, label: "Male" },
                  ]}
                />
              )
            }

            // Skip anxiety field for depression form and ptsd field for anxiety form
            if ((type === "depression" && field === "ptsd") || (type === "anxiety" && field === "anxiety")) {
              return null
            }

            return (
              <CheckboxField
                key={field}
                name={field}
                label={fieldLabels[field]}
                checked={formData[field]}
                onChange={handleInputChange}
              />
            )
          })}
        </CardContent>
      </Card>
    )
  }

  const handleReset = () => {
    setRecommendations(null)
    setRecommendationsError(null)
    onReset()
  }

  // Results Sidebar Component
  const ResultsSidebar = () => (
    <div className="space-y-6">
      {/* Placeholder when no results */}
      {!result && !loading && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-500">
              <ClipboardList className="w-5 h-5" />
              Results will appear here
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Complete the assessment to see your prediction results and personalized AI recommendations.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading state */}
      {loading && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing Assessment...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700">Analyzing your responses and generating predictions...</p>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button variant="link" size="sm" onClick={handleReset} className="ml-2 p-0 h-auto">
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {result && (
        <>
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.prediction === 1 ? (
                  <XCircle className="w-6 h-6 text-red-600" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
                Prediction Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 rounded-lg border bg-gray-50">
                  <p className="text-sm text-gray-600 mb-2">
                    {type === "anxiety" ? "Anxiety" : "Depression"} Prediction
                  </p>
                  <Badge
                    variant={result.prediction === 1 ? "destructive" : "secondary"}
                    className="text-base py-1 px-3"
                  >
                    {result.prediction === 1
                      ? `${type === "anxiety" ? "Anxiety" : "Depression"} Detected`
                      : `No ${type === "anxiety" ? "Anxiety" : "Depression"} Detected`}
                  </Badge>
                </div>

                {result.probability && (
                  <div className="p-4 rounded-lg border bg-gray-50">
                    <p className="text-sm text-gray-600 mb-2">Confidence Level</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {(Math.max(...result.probability) * 100).toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <Button variant="outline" onClick={handleReset} className="w-full bg-transparent">
                  Clear Results
                </Button>
                <Button className="w-full">Take {type === "anxiety" ? "Depression" : "Anxiety"} Assessment</Button>
              </div>
            </CardContent>
          </Card>


        </>
      )}
    </div>
  )

  return (
    <div className="min-h-screen">
      <div className="main -z-10">
        <div className="gradient" />
      </div>

      {/* Navigation */}
      <nav className="flex justify-between items-center w-full p-6 bg-white/80 backdrop-blur-sm border-b">
        <div className="flex items-center gap-4">
            <Link to="/">
            
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
            </Link>
        </div>

        <Button variant="outline" size="sm" className="black_btn">
        
          GitHub
        </Button>
      </nav>

      {/* Main Content with Sidebar Layout */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {type === "anxiety" ? "Anxiety" : "Depression"} Assessment
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete this comprehensive assessment to predict {type} using our ML model trained on local{" "}
            <span className="text-blue-600 font-semibold">Kashmiri</span> data.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Section {currentSection + 1} of {formSections.length}
                </span>
                <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Section Navigation */}
            <div className="flex flex-wrap gap-2">
              {formSections.map((section, index) => {
                const Icon = section.icon
                const isCompleted = completedSections.has(index)
                const isCurrent = index === currentSection

                return (
                  <Button
                    key={section.id}
                    variant={isCurrent ? "default" : isCompleted ? "secondary" : "outline"}
                    size="sm"
                    className="gap-2"
                    onClick={() => setCurrentSection(index)}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{section.title}</span>
                    {isCompleted && <CheckCircle className="w-4 h-4" />}
                  </Button>
                )
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Current Section */}
              {renderSection(currentSection)}

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                  disabled={currentSection === 0}
                >
                  Previous
                </Button>

                {currentSection < formSections.length - 1 ? (
                  <Button
                    type="button"
                    onClick={() => {
                      setCompletedSections((prev) => new Set([...prev, currentSection]))
                      setCurrentSection(currentSection + 1)
                    }}
                  >
                    Next Section
                  </Button>
                ) : (
                  <Button type="submit" disabled={loading} className="gap-2">
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? "Predicting..." : `Predict ${type === "anxiety" ? "Anxiety" : "Depression"}`}
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Right Column - Results Sidebar */}
          <div className="lg:col-span-1 flex flex-col justify-center">
         
              <ResultsSidebar />

          </div>


        </div>
        <div className="w-full ">
                              {/* AI Recommendations in Sidebar */}
          <AIRecommendations
            recommendations={recommendations}
            loading={recommendationsLoading}
            error={recommendationsError}
            onRegenerate={() => generateRecommendations(result)}
            assessmentType={type}
          />

          </div>
      </div>
    </div>
  )
}
