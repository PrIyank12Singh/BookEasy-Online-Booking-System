"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useRef,
} from "react"
import AddServiceModal from "@/components/AddServiceModal"

export interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: string
  image: string
  available: boolean
}

export interface Booking {
  id: string
  serviceId: string
  serviceName: string
  date: string
  time: string
  customerName: string
  customerEmail: string
  customerPhone: string
  status: "confirmed" | "pending" | "cancelled"
  createdAt: string
}

interface BookingContextType {
  services: Service[]
  bookings: Booking[]
  addService: (service: Omit<Service, "id">) => void
  updateService: (id: string, service: Partial<Service>) => void
  deleteService: (id: string) => void
  addBooking: (booking: Omit<Booking, "id" | "createdAt">) => void
  updateBooking: (id: string, booking: Partial<Booking>) => void
  openAddModal: () => void
  closeAddModal: () => void
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const openAddModal = () => setIsAddModalOpen(true)
  const closeAddModal = () => setIsAddModalOpen(false)

  const API_URL = useRef<string>(
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
  ).current

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_URL}/api/services`)
        if (!res.ok) throw new Error("Service fetch failed")
        const data = await res.json()
        setServices(data)
      } catch (err) {
        console.error("Failed to fetch services", err)
      }
    }

    const fetchBookings = async () => {
      try {
        const res = await fetch(`${API_URL}/api/bookings`)
        if (!res.ok) throw new Error("Booking fetch failed")
        const data = await res.json()
        setBookings(data)
      } catch (err) {
        console.error("Failed to fetch bookings", err)
      }
    }

    fetchServices()
    fetchBookings()
  }, [API_URL])

  const addService = async (service: Omit<Service, "id">) => {
    try {
      const res = await fetch(`${API_URL}/api/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(service),
      })
      if (!res.ok) throw new Error("Failed to add service")
      const newService = await res.json()
      setServices((prev) => [...prev, newService])
    } catch (err) {
      console.error("Failed to add service", err)
    }
  }

  const updateService = async (id: string, updatedService: Partial<Service>) => {
    try {
      await fetch(`${API_URL}/api/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedService),
      })
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updatedService } : s))
      )
    } catch (err) {
      console.error("Failed to update service", err)
    }
  }

  const deleteService = async (id: string) => {
    try {
      await fetch(`${API_URL}/api/services/${id}`, {
        method: "DELETE",
      })
      setServices((prev) => prev.filter((s) => s.id !== id))
    } catch (err) {
      console.error("Failed to delete service", err)
    }
  }

  const addBooking = async (booking: Omit<Booking, "id" | "createdAt">) => {
    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      })
      if (!res.ok) throw new Error("Failed to add booking")
      const newBooking = await res.json()
      setBookings((prev) => [...prev, newBooking])
    } catch (err) {
      console.error("Failed to add booking", err)
    }
  }

  const updateBooking = async (id: string, updatedBooking: Partial<Booking>) => {
    try {
      await fetch(`${API_URL}/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBooking),
      })
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...updatedBooking } : b))
      )
    } catch (err) {
      console.error("Failed to update booking", err)
    }
  }

  return (
    <BookingContext.Provider
      value={{
        services,
        bookings,
        addService,
        updateService,
        deleteService,
        addBooking,
        updateBooking,
        openAddModal,
        closeAddModal,
      }}
    >
      {children}
      <AddServiceModal isOpen={isAddModalOpen} onClose={closeAddModal} />
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider")
  }
  return context
}
