import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './Config/connectDB.js';
import { v2 as cloudinary } from 'cloudinary';

import userRoutes from './Routes/userRoutes.js';
import postRoutes from './Routes/postRoutes.js';
import messageRoutes from './Routes/messageRoutes.js';

import { app, server } from './Socket/socket.js';
import path from 'path';

dotenv.config();


connectDB();

const __dirname = path.resolve();

app.use(express.json({limit:'50mb'}));
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))

app.use('/api/users', userRoutes);

app.use('/api/post', postRoutes);

app.use('/api/message', messageRoutes);

const PORT = process.env.PORT || 5000;

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, 'frontend/dist')));
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname, 'frontend/dist/index.html'));
    })
}
server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})