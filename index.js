const express = require('express');
const cors=require('cors');
var app = express();

const PORT=process.env.PORT || 3002;

const server =app.listen( PORT, () => {
    console.log(`Server started on ${PORT}`)
})
const io= require('socket.io')(server,{
    cors:{
        origin: "https://master--deluxe-sable-a44c90.netlify.app",
    }
})
app.get('/',(req,res)=>{
    res.write(`SOcket started on ${PORT}`);
    res.send();
})
let users=[];

const addUser =(userId,user_name,profileImage,socketId)=>{
    if(userId){
    !users.some(user=>user.userId===userId) && 
    users.push({userId,user_name,profileImage,socketId});}
}

const removeUser=(socketId)=>{
    users=users.filter(user=>user.socketId!==socketId)
}

const getUser=(userId)=>{
    return users.find(user=>user.userId===userId)
}

io.on('connection', socket=>{
    console.log("New User COnnected.")
    io.emit("welcome","hello this is socket server!");

    socket.on("addUser",(userId,user_name,profileImage)=>{
        addUser(userId,user_name,profileImage,socket.id);
        console.log(users)
         io.emit("getUsers",users);
    })

    socket.on("sendMessage",({senderId,receiverId,text})=>{
        console.log(senderId,receiverId,text)
        const user=getUser(receiverId)
        console.log(users)
        user?io.to(user.socketId).emit("getMessage",{
            senderId,
            text,
        }):""
    })

    socket.on("disconnect",()=>{
        console.log("a user disconnected");
        removeUser(socket.id)
        io.emit("getUsers",users)
    }) 
} )

