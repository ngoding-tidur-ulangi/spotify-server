import express from 'express'
import passport from 'passport'
import dotenv from "dotenv"
import cors from "cors"
import authRouter from './routes/auth'
import mongoose from 'mongoose'
import User from './models/user'
import artistRouter from './routes/artist'
import songRouter from './routes/song'
import globalRouter from './routes/global'
import jwt from 'jsonwebtoken'
import authentication from './middlewares/authentication'
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
app.use(express.json())

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    scope: ["profile", "email"]
}, async (accessToken, refreshToken, profile, done) => {
    console.log(`google: `)
    console.log(profile)
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
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    return done(null, { user, token });
}))

app.get("/", (_, res) => res.send("Hello World"))
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/google/callback", passport.authenticate("google", { session: false }), (req, res) => {
    const { token } = (req.user as any);
    const clientUrl = `${process.env.CLIENT_URL}?token=${token}`;
    res.redirect(clientUrl);
})

app.use("/global", globalRouter)
app.use(authentication)
app.use("/song", songRouter)
app.use("/artist", artistRouter)
app.use("/auth", authRouter)

app.listen(process.env.PORT || 8080, () => {
    console.log(`server start at 8080 no 8080`)
})
