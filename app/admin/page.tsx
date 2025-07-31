"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useBooking } from "@/lib/booking-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, DollarSign, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function AdminDashboard() {
  const { services, bookings } = useBooking()

  const totalRevenue = bookings
    .filter((booking) => booking.status === "confirmed")
    .reduce((sum, booking) => {
      const service = services.find((s) => s.id === booking.serviceId)
      return sum + (service?.price || 0)
    }, 0)

  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length
  const pendingBookings = bookings.filter((b) => b.status === "pending").length
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled").length

  const recentBookings = bookings
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-lg text-gray-600">Manage your bookings and services</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue}</div>
              <p className="text-xs text-muted-foreground">From confirmed bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
              <p className="text-xs text-muted-foreground">All time bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Services</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{services.filter((s) => s.available).length}</div>
              <p className="text-xs text-muted-foreground">Available services</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingBookings}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{booking.serviceName}</h4>
                        <Badge
                          variant={
                            booking.status === "confirmed"
                              ? "default"
                              : booking.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{booking.customerName}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {booking.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {booking.time}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {booking.status === "confirmed" && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {booking.status === "pending" && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                      {booking.status === "cancelled" && <XCircle className="h-5 w-5 text-red-500" />}
                    </div>
                  </div>
                ))}
                {recentBookings.length === 0 && <p className="text-center text-gray-500 py-8">No bookings yet</p>}
              </div>
            </CardContent>
          </Card>

          {/* Booking Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-900">Confirmed</h3>
                      <p className="text-sm text-green-700">Successfully booked</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{confirmedBookings}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-8 w-8 text-yellow-600" />
                    <div>
                      <h3 className="font-semibold text-yellow-900">Pending</h3>
                      <p className="text-sm text-yellow-700">Awaiting confirmation</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-yellow-600">{pendingBookings}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <XCircle className="h-8 w-8 text-red-600" />
                    <div>
                      <h3 className="font-semibold text-red-900">Cancelled</h3>
                      <p className="text-sm text-red-700">Booking cancelled</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-red-600">{cancelledBookings}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-auto p-6 flex flex-col items-center gap-2">
                <Calendar className="h-8 w-8" />
                <span>View All Bookings</span>
              </Button>
              <Button variant="outline" className="h-auto p-6 flex flex-col items-center gap-2 bg-transparent">
                <Users className="h-8 w-8" />
                <span>Manage Services</span>
              </Button>
              <Button variant="outline" className="h-auto p-6 flex flex-col items-center gap-2 bg-transparent">
                <TrendingUp className="h-8 w-8" />
                <span>View Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
