"use client"

import { useState } from "react"
import { useBooking } from "@/lib/booking-context"

interface AddServiceModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddServiceModal({ isOpen, onClose }: AddServiceModalProps) {
  const { addService } = useBooking()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState(0)
  const [duration, setDuration] = useState(60)
  const [category, setCategory] = useState("")
  const [available, setAvailable] = useState(true)

  const resetForm = () => {
    setName("")
    setDescription("")
    setPrice(0)
    setDuration(60)
    setCategory("")
    setAvailable(true)
  }

  const handleSubmit = async () => {
    if (!name || !description || !category || price < 0 || duration <= 0) {
      alert("Please fill all required fields correctly.")
      return
    }

    await addService({
      name,
      description,
      price,
      duration,
      category,
      available,
      image: "", // assuming image isn't handled yet
    })

    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add New Service</h2>

        <label className="block mb-2 font-medium">Service Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter service name"
          className="w-full p-2 mb-4 border rounded"
        />

        <label className="block mb-2 font-medium">Description *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter service description"
          className="w-full p-2 mb-4 border rounded"
        />

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-2 font-medium">Price ($) *</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full p-2 mb-4 border rounded"
              min={0}
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-medium">Duration (minutes) *</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full p-2 mb-4 border rounded"
              min={1}
            />
          </div>
        </div>

        <label className="block mb-2 font-medium">Category *</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g., Beauty, Wellness"
          className="w-full p-2 mb-4 border rounded"
        />

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm">Service Available</span>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-400 text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800"
          >
            Add Service
          </button>
        </div>
      </div>
    </div>
  )
}
