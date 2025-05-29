import dotenv from "dotenv";

dotenv.config();

export const config = {
    db: {
        URI:process.env.DB_URI
    },

    server: {
        PORT:process.env.PORT
    },
     JWT: {

        secret: process.env.JWT_SECRET,
        expires: process.env.JWT_EXPIRES

    },
    cloudinary: {
        cloud_name: process.env.CLOUD_NAME,
        cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
        cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET
    }


}