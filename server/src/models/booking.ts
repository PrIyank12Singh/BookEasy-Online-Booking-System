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
