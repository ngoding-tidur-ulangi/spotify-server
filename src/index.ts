import express from 'express'
import passport from 'passport'
import session from 'express-session'
import dotenv from "dotenv"
import cors from "cors"
import authRouter from './routes/auth'
import mongoose from 'mongoose'
import User from './models/user'
import artistRouter from './routes/artist'
import songRouter from './routes/song'
import globalRouter from './routes/global'
import sessionValidation from './middlewares/sessionValidation'
const GoogleStrategy = require('passport-google-oauth20').Strategy

dotenv.config()

const mongoURI = process.env.MONGO_URI

mongoose.connect(mongoURI).then(() => {
    console.log('Connected to MongoDB')
}).catch((error) => {
    console.error('MongoDB connection error:', error)
})

const app = express()

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: "GET,POST,PUT,DELETE,OPTIONS",
        credentials: true,
    }),
)
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    scope: ["profile", "email"]
}, async (accessToken, refreshToken, profile, done) => {
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
        user = new User({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            favorites: [],
            histories: []
        });
        await user.save();
    }
    return done(null, user);
}))

passport.serializeUser((user, done) => done(null, (user as any).id))
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
})
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }))
app.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: `${process.env.CLIENT_URL}/error`
}))
app.use(sessionValidation)
app.use("/song", songRouter)
app.use("/auth", authRouter)
app.use("/global", globalRouter)
app.use("/artist", artistRouter)

app.listen(3000, () => {
    console.log(`server start at 3000 no 3000`)
})
