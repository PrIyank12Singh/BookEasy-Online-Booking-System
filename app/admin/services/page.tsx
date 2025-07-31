"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useBooking, type Service } from "@/lib/booking-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, DollarSign, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminServicesPage() {
  const { services, addService, updateService, deleteService } = useBooking()
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    category: "",
    image: "/placeholder.svg?height=200&width=300",
    available: true,
  })

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "",
      category: "",
      image: "/placeholder.svg?height=200&width=300",
      available: true,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.description || !formData.price || !formData.duration || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const serviceData = {
      name: formData.name,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      duration: Number.parseInt(formData.duration),
      category: formData.category,
      image: formData.image,
      available: formData.available,
    }

    if (editingService) {
      updateService(editingService.id, serviceData)
      toast({
        title: "Service Updated",
        description: "The service has been successfully updated.",
      })
      setEditingService(null)
    } else {
      addService(serviceData)
      toast({
        title: "Service Added",
        description: "The new service has been successfully added.",
      })
      setIsAddDialogOpen(false)
    }

    resetForm()
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration.toString(),
      category: service.category,
      image: service.image,
      available: service.available,
    })
  }

  const handleDelete = (serviceId: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      deleteService(serviceId)
      toast({
        title: "Service Deleted",
        description: "The service has been successfully deleted.",
      })
    }
  }

  const ServiceForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Service Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Enter service name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Enter service description"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price ($) *</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes) *</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            value={formData.duration}
            onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
            placeholder="60"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
          placeholder="e.g., Beauty, Wellness, Fitness"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="available"
          checked={formData.available}
          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, available: checked }))}
        />
        <Label htmlFor="available">Service Available</Label>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {editingService ? "Update Service" : "Add Service"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            resetForm()
            setEditingService(null)
            setIsAddDialogOpen(false)
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Services</h1>
            <p className="text-lg text-gray-600">Add, edit, and manage your service offerings</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
              </DialogHeader>
              <ServiceForm />
            </DialogContent>
          </Dialog>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              <div className="aspect-video bg-gray-200">
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{service.name}</h3>
                  <Badge variant={service.available ? "default" : "secondary"}>
                    {service.available ? "Available" : "Unavailable"}
                  </Badge>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{service.duration} min</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="text-lg font-bold text-gray-900">${service.price}</span>
                  </div>
                </div>

                <Badge variant="outline" className="mb-4">
                  {service.category}
                </Badge>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleEdit(service)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(service.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No services yet</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first service</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Service
            </Button>
          </div>
        )}

        {/* Edit Service Dialog */}
        <Dialog open={!!editingService} onOpenChange={(open) => !open && setEditingService(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Service</DialogTitle>
            </DialogHeader>
            <ServiceForm />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
