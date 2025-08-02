"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Lightbulb, RefreshCw, Loader2, AlertCircle, Sparkles } from "lucide-react"

export default function AIRecommendations({ recommendations, loading, error, onRegenerate, assessmentType }) {
  const formatRecommendations = (text) => {
    if (!text) return []

    // Split by bullet points or line breaks and clean up
    const lines = text.split(/[•\n]/).filter((line) => line.trim().length > 0)
    return lines.map((line) => line.trim()).filter((line) => line.length > 0)
  }

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "minimal":
        return "bg-green-100 text-green-800 border-green-200"
      case "mild":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "moderate":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "severe":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <Card className="mt-6 border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating Personalized Recommendations...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-2">
              <Sparkles className="w-8 h-8 text-blue-600 mx-auto animate-pulse" />
              <p className="text-sm text-blue-700">
                Our AI is analyzing your assessment to provide tailored wellness suggestions...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={onRegenerate} className="ml-4 bg-transparent">
            <RefreshCw className="w-4 h-4 mr-1" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!recommendations) return null

  const recommendationsList = formatRecommendations(recommendations.text)

  return (
    <Card className="mt-6 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            AI-Powered Wellness Recommendations
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onRegenerate} className="gap-1 bg-transparent">
            <RefreshCw className="w-4 h-4" />
            Regenerate
          </Button>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Badge className={getSeverityColor(recommendations.severity)}>
            {recommendations.severity} {assessmentType}
          </Badge>
          <Badge variant="secondary">{recommendations.confidence?.toFixed(1)}% Confidence</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Based on your assessment results, here are personalized recommendations to support your mental wellbeing:
        </p>

        <Separator />

        <div className="space-y-3">
          {recommendationsList.map((recommendation, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-white/70 border border-purple-100 hover:bg-white/90 transition-colors"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-sm font-medium mt-0.5">
                {index + 1}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{recommendation}</p>
            </div>
          ))}
        </div>

        <Separator />

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 mb-1">Important Note</p>
              <p className="text-amber-700">
                These recommendations are AI-generated suggestions for general wellness. They are not a substitute for
                professional medical advice, diagnosis, or treatment. If you're experiencing severe symptoms, please
                consult with a healthcare professional.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
