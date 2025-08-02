"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, ExternalLink, Calendar, User, Newspaper } from "lucide-react"

export default function NewsCarousel() {
  const [articles, setArticles] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filter articles to only show mental health related content
  const filterMentalHealthArticles = (articles) => {
    const mentalHealthKeywords = [
      "mental health",
      "depression",
      "anxiety",
      "therapy",
      "psychological",
      "psychiatry",
      "wellness",
      "stress",
      "trauma",
      "counseling",
      "mindfulness",
      "suicide",
      "bipolar",
      "schizophrenia",
      "ptsd",
      "eating disorder",
      "addiction",
      "self-care",
      "meditation",
      "emotional",
      "behavioral",
      "cognitive",
    ]

    return articles.filter((article) => {
      const searchText = `${article.title} ${article.description}`.toLowerCase()
      return mentalHealthKeywords.some((keyword) => searchText.includes(keyword))
    })
  }

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        // Replace with your actual API endpoint
        const response = await fetch("https://newsapi.org/v2/everything?q=mental%20health%20OR%20anxiety%20OR%20depression&language=en&sortBy=publishedAt&apiKey=1e8b527ad91547178221c81a48434673") // You'll need to create this endpoint

        if (!response.ok) {
          throw new Error("Failed to fetch news")
        }

        const data = await response.json()
        const filteredArticles = filterMentalHealthArticles(data.articles || [])
        setArticles(filteredArticles.slice(0, 10)) // Limit to 10 articles
      } catch (err) {
        console.error("Error fetching news:", err)
        setError("Failed to load news articles")

        // Fallback to sample data for demo
        const sampleData = {
          articles: [
            {
              source: { name: "Psychology Today" },
              author: "Allan E. Barsky PhD, MSW, JD",
              title: "End-of-Life Discussions and Planning for a Good Death",
              description:
                'For many people, the topic of death brings up a lot of "bad stuff." But what if there was a way to discuss death in a good way. What would that conversation look like?',
              url: "https://www.psychologytoday.com/us/blog/agens-scientiam/202508/end-of-life-discussions-and-planning-for-a-good-death",
              urlToImage:
                "https://cdn2.psychologytoday.com/assets/styles/manual_crop_1_91_1_1528x800/public/teaser_image/blog_entry/2025-08/pexels-kampus-7551677%20%281%29.jpg?itok=c63SiRwj",
              publishedAt: "2025-08-01T20:55:25Z",
            },
            {
              source: { name: "Medical Daily" },
              author: "Matt Emma",
              title: "The Mental Health Impact Of Major Life Transitions",
              description:
                "Life has its fair share of challenges. Even the happiest moments of life — celebrating a new job or becoming a parent — can be difficult.",
              url: "https://www.medicaldaily.com/mental-health-impact-major-life-transitions-473730",
              urlToImage: "https://d.medicaldaily.com/en/full/480487/mental-health.jpg",
              publishedAt: "2025-08-01T19:52:27Z",
            },
            {
              source: { name: "GMA" },
              author: "Yi-jin Yu",
              title: "Illinois becomes 1st state to require student mental health screenings",
              description:
                "Students in Illinois will soon have to get mental health screenings alongside annual vision and hearing exams.",
              url: "https://www.goodmorningamerica.com/wellness/story/illinois-1st-state-require-student-mental-health-screenings-124275407",
              urlToImage:
                "https://i.abcnewsfe.com/a/e5572e31-8d0e-4839-b5be-9924ce0a726d/student-classroom-gty-jef-250801_1754057196235_hpMain_16x9.jpg?w=992",
              publishedAt: "2025-08-01T18:40:53Z",
            },
          ],
        }
        const filteredArticles = filterMentalHealthArticles(sampleData.articles)
        setArticles(filteredArticles)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === articles.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? articles.length - 1 : prevIndex - 1))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text
    return text.substr(0, maxLength) + "..."
  }

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Mental Health News</h2>
          <p className="text-gray-600">Stay informed with the latest developments in mental health</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error || articles.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="text-center">
          <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Mental Health News</h2>
          <p className="text-gray-600">{error || "No mental health articles available at the moment."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Mental Health News</h2>
        <p className="text-gray-600">
          Stay informed with the latest developments in mental health research and awareness
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
          onClick={prevSlide}
          disabled={articles.length <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
          onClick={nextSlide}
          disabled={articles.length <= 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Carousel Content */}
        <div className="overflow-hidden rounded-xl">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {articles.map((article, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <Card className="mx-2 h-full border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
                  <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                    {/* Image Section */}
                    <div className="relative">
                      {article.urlToImage ? (
                        <img
                          src={article.urlToImage || "/placeholder.svg"}
                          alt={article.title}
                          className="w-full h-64 lg:h-full object-cover rounded-l-xl"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg?height=400&width=600&text=Mental+Health+News"
                          }}
                        />
                      ) : (
                        <div className="w-full h-64 lg:h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center rounded-l-xl">
                          <Newspaper className="w-16 h-16 text-blue-400" />
                        </div>
                      )}

                      {/* Source Badge */}
                      <Badge className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700">
                        {article.source.name}
                      </Badge>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 flex flex-col justify-between">
                      <div>
                        <CardHeader className="p-0 mb-4">
                          <CardTitle className="text-2xl font-bold text-gray-900 leading-tight mb-3">
                            {truncateText(article.title, 100)}
                          </CardTitle>

                          {/* Meta Information */}
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            {article.author && (
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span>{truncateText(article.author, 30)}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(article.publishedAt)}</span>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="p-0">
                          <p className="text-gray-600 leading-relaxed mb-6">{truncateText(article.description, 200)}</p>
                        </CardContent>
                      </div>

                      {/* Read More Button */}
                      <div className="mt-auto">
                        <Button
                          className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
                          onClick={() => window.open(article.url, "_blank")}
                        >
                          Read Full Article
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-6 space-x-2">
          {articles.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? "bg-blue-600" : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Auto-play indicator */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-500">
          Showing {currentIndex + 1} of {articles.length} articles
        </p>
      </div>
    </div>
  )
}
