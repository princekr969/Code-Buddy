import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;


// Global error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// mongodb connection
mongoose.connect(process.env.MONGODB_CONNECTION).then(()=>
{
    server.listen(PORT, ()=>
    {
        console.log(`Server is live on port ${PORT}!`);
    })
})
.catch((err)=>
{
    console.log(err);
})