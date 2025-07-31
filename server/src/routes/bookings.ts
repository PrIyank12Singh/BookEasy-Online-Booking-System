import express from "express"
import { bookings, services } from "../db"
import { Booking } from "../models/booking"

const router = express.Router()

// GET all bookings
router.get("/", (_req, res) => {
  res.json(bookings)
})

// GET single booking by ID
router.get("/:id", (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id)
  if (!booking) return res.status(404).json({ error: "Booking not found" })
  res.json(booking)
})

// POST create new booking
router.post("/", (req, res) => {
  const {
    serviceId,
    serviceName,
    date,
    time,
    customerName,
    customerEmail,
    customerPhone,
    status,
  } = req.body

  const newBooking: Booking = {
    id: Date.now().toString(),
    serviceId,
    serviceName,
    date,
    time,
    customerName,
    customerEmail,
    customerPhone,
    status: status ?? "pending",
    createdAt: new Date().toISOString(),
  }

  bookings.push(newBooking)
  res.status(201).json(newBooking)
})

// PUT update booking
router.put("/:id", (req, res) => {
  const index = bookings.findIndex(b => b.id === req.params.id)
  if (index === -1) return res.status(404).json({ error: "Booking not found" })

  bookings[index] = { ...bookings[index], ...req.body }
  res.json(bookings[index])
})

export default router
