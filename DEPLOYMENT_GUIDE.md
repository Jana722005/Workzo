# Backend Deployment Guide (Render.com)

Since Vercel is for frontend only, you need a separate service for your Node.js backend. Render is a good free option.

## Step 1: Push Changes to GitHub
I have already updated your code to be ready for deployment.
1.  **Commit & Push** the latest changes (I will do this for you in the next step).

## Step 2: Create Account on Render
1.  Go to [render.com](https://render.com).
2.  Sign up with your **GitHub** account.

## Step 3: Create Web Service
1.  In the Render Dashboard, click **New +** and select **Web Service**.
2.  Select "Build and deploy from a Git repository".
3.  Connect your `Workzo` repository.

## Step 4: Configure the Service
Here are the critical settings you must enter:

| Setting | Value |
| :--- | :--- |
| **Name** | `workzo-backend` (or similar) |
| **Region** | Closest to you (e.g., Singapore, Frankfurt) |
| **Branch** | `main` |
| **Root Directory** | `backend` (IMPORTANT!) |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

## Step 5: Add Environment Variables
Scroll down to the "Environment Variables" section and add the following keys from your local `.env` file:

| Key | Value |
| :--- | :--- |
| `MONGO_URI` | `mongodb+srv://...` (Copy your full connection string from your local .env) |
| `JWT_SECRET` | `your_secret_key` |
| `PORT` | `5000` |
| `CLOUDINARY_CLOUD_NAME` | `...` |
| `CLOUDINARY_API_KEY` | `...` |
| `CLOUDINARY_API_SECRET` | `...` |
| `EMAIL_USER` | `...` |
| `EMAIL_PASS` | `...` |

*(Copy the actual values from your local computer's `backend/.env` file).*

## Step 6: Deploy & Get URL
1.  Click **Create Web Service**.
2.  Wait for the deployment to finish. It might take a few minutes.
3.  Once valid, you will see a URL at the top left, something like: `https://workzo-backend.onrender.com`.

## Step 7: Connect Frontend (Vercel)
1.  Copy that new Render URL.
2.  Add `/api` to the end: `https://workzo-backend.onrender.com/api`
3.  Go to **Vercel Dashboard > Settings > Environment Variables**.
4.  Add `VITE_API_BASE_URL` with that value.
5.  **Redeploy** your frontend on Vercel.

🎉 **Done!** Your app is now fully live.
