import cors from "cors";

export const corsConfig = cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'PUT', 'POST'],
    allowedHeaders:['Content-Type', 'Authorization'] ,
    credentials: true 

})

