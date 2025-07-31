import express from "express"
import { services } from "../db"
import { Service } from "../models/service"

const router = express.Router()

// GET all services
router.get("/", (_req, res) => {
  res.json(services)
})

// GET single service by ID
router.get("/:id", (req, res) => {
  const service = services.find(s => s.id === req.params.id)
  if (!service) return res.status(404).json({ error: "Service not found" })
  res.json(service)
})

// POST create new service
router.post("/", (req, res) => {
  const { name, description, price, duration, category, image, available } = req.body

  const newService: Service = {
    id: Date.now().toString(),
    name,
    description,
    price,
    duration,
    category,
    image,
    available,
  }

  services.push(newService)
  res.status(201).json(newService)
})

// PUT update a service
router.put("/:id", (req, res) => {
  const index = services.findIndex(s => s.id === req.params.id)
  if (index === -1) return res.status(404).json({ error: "Service not found" })

  services[index] = { ...services[index], ...req.body }
  res.json(services[index])
})

// DELETE a service
router.delete("/:id", (req, res) => {
  const index = services.findIndex(s => s.id === req.params.id)
  if (index === -1) return res.status(404).json({ error: "Service not found" })

  const removed = services.splice(index, 1)
  res.json(removed[0])
})

export default router
