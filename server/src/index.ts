import express from "express"
import cors from 'cors'
import servicesRouter from "./routes/services"
import bookingsRouter from "./routes/bookings"

const app = express()
const PORT = 4000

app.use(cors())
app.use(express.json())

app.use('/api/services', servicesRouter)
app.use('/api/bookings', bookingsRouter)

app.get("/", (_req, res) => {
  res.send("Booking API running!")
})

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
