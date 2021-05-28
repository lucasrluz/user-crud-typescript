import express from 'express'
import { userRoute } from './routes/userRoute'

const app = express()
app.use(userRoute)
app.listen(3333)