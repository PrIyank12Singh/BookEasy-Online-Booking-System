"use client"

import { useSearchParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle, Calendar, Clock, ArrowRight, Home } from "lucide-react"

export default function ConfirmationPage() {
  const searchParams = useSearchParams()

  const serviceName = searchParams.get("service")
  const date = searchParams.get("date")
  const time = searchParams.get("time")

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="text-center">
          <CardHeader className="pb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Booking Confirmed!</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="text-lg text-gray-600">
              Your appointment has been successfully booked. We've sent a confirmation email with all the details.
            </p>

            {serviceName && date && time && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Booking Details</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium">{serviceName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Date:
                    </span>
                    <span className="font-medium">{new Date(date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      Time:
                    </span>
                    <span className="font-medium">{time}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">What's Next?</h4>
              <ul className="text-sm text-blue-800 space-y-1 text-left">
                <li>• You'll receive a confirmation email shortly</li>
                <li>• We'll send you a reminder 24 hours before your appointment</li>
                <li>• If you need to reschedule, please contact us at least 24 hours in advance</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild className="flex-1">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/services">
                  Book Another Service
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
