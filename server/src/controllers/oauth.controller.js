import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import crypto from "crypto";
import { google } from "../config/oauth.js";


// ================= GOOGLE LOGIN =================
export const googleAuth = async (req, res) => {
  const state = crypto.randomUUID();
  const codeVerifier = crypto.randomBytes(32).toString("base64url");

  const url = google.createAuthorizationURL(
    state,
    codeVerifier,
    ["openid", "email", "profile"]
  );

  res.cookie("google_oauth_state", state, { httpOnly: true });
  res.cookie("google_code_verifier", codeVerifier, { httpOnly: true });

  res.redirect(url.toString());
};


// ================= GOOGLE CALLBACK =================
export const googleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    const storedState = req.cookies.google_oauth_state;
    const codeVerifier = req.cookies.google_code_verifier;

    if (!storedState || storedState !== state) {
      return res.status(400).json({ message: "Invalid OAuth state" });
    }

    const tokens = await google.validateAuthorizationCode(
      code,
      codeVerifier
    );

    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken()}`
        }
      }
    );

    const profile = await response.json();

    let user = await User.findOne({ email: profile.email });

    if (!user) {
      user = new User({
        name: profile.name,
        email: profile.email,
        googleId: profile.sub,
        avatar: profile.picture,
        providers: [
          {
            provider: "google",
            providerId: profile.sub
          }
        ],
        lastLoginProvider: "google"
      });

      await user.save();
    }

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    user.lastLoginProvider = "google";
    await user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    res.redirect(`${process.env.DEVELOPMENT_FRONTEND_URL}/dashboard`);

  } catch (err) {
    res.status(500).json({
      message: "Google OAuth failed",
      error: err.message
    });
  }
};