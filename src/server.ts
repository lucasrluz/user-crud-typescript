import express, { json } from 'express'
import { userRoute } from './routes/userRoute'

const app = express()

app.use(json())
app.use(userRoute)
app.listen(3333)