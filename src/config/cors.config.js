import cors from "cors";

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'PUT', 'POST'],
    allowedHeaders:['Content-Type', 'Authorization'] ,
    credentials: true 
}));

