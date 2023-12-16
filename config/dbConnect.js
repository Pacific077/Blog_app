import mongoose from "mongoose";

const dbConnect = async ()=>{
    try{
        
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected to database succefully")
    }catch(er){
        console.log(`Database connectivity error ${er.message}`)

    }
}
export default dbConnect;

//username
//rahmanfaisal516
//pass
//R3lQNrheMHor07FQ