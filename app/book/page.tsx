"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useBooking } from "@/lib/booking-context"
import { format } from "date-fns"
import { CalendarIcon, Clock, DollarSign, User, Mail, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
]

export default function BookingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const { services, addBooking } = useBooking()

  const [selectedServiceId, setSelectedServiceId] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedService = services.find((s) => s.id === selectedServiceId)

  useEffect(() => {
    const serviceId = searchParams.get("service")
    if (serviceId && services.find((s) => s.id === serviceId)) {
      setSelectedServiceId(serviceId)
    }
  }, [searchParams, services])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedService || !selectedDate || !selectedTime || !customerName || !customerEmail || !customerPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      addBooking({
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        customerName,
        customerEmail,
        customerPhone,
        status: "confirmed",
      })

      toast({
        title: "Booking Confirmed!",
        description: "Your appointment has been successfully booked.",
      })

      // Redirect to confirmation page
      router.push(
        `/confirmation?service=${selectedService.name}&date=${format(selectedDate, "yyyy-MM-dd")}&time=${selectedTime}`,
      )
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Service</h1>
          <p className="text-lg text-gray-600">Fill in the details below to complete your booking</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Service Selection */}
                <div className="space-y-2">
                  <Label htmlFor="service">Select Service *</Label>
                  <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services
                        .filter((s) => s.available)
                        .map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} - ${service.price}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                  <Label>Select Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <Label htmlFor="time">Select Time *</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Customer Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Your Information</h3>

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Confirm Booking"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedService ? (
                <div className="space-y-4">
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={selectedService.image || "/placeholder.svg"}
                      alt={selectedService.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2">{selectedService.name}</h3>
                    <p className="text-gray-600 mb-4">{selectedService.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          Duration
                        </span>
                        <span>{selectedService.duration} minutes</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center text-gray-600">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Price
                        </span>
                        <span className="text-xl font-bold">${selectedService.price}</span>
                      </div>

                      {selectedDate && (
                        <div className="flex items-center justify-between">
                          <span className="flex items-center text-gray-600">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            Date
                          </span>
                          <span>{format(selectedDate, "PPP")}</span>
                        </div>
                      )}

                      {selectedTime && (
                        <div className="flex items-center justify-between">
                          <span className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            Time
                          </span>
                          <span>{selectedTime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Select a service to see booking details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
