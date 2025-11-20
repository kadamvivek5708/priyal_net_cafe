import dotenv from "dotenv"
import connectDB from "./db/index.js"
import {app} from "./app.js"
import { startPostCleanupJob } from "../../frontend/src/jobs/postCleanup.job.js"

dotenv.config({
    path: './.env'
})

connectDB()
    .then(() => {
        // cleanup of expired posts
        startPostCleanupJob();

        app.on("error", (error) => {
            console.log("ERR0R: ", error);
            throw error
        })
        app.listen(process.env.PORT || 8000 , () => {  
            console.log("server is running at ", process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(`mongodb connection failed ${error}`)
    })