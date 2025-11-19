<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/13e13WBwLXwhSK4xUYBq9hCwGBQ0E4Lqr

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Deploy to GitHub Pages

### Automatic Deployment (GitHub Actions)

The project includes a GitHub Actions workflow that automatically builds and deploys your app to GitHub Pages on every push to the `main` branch.

**Setup Instructions:**

1. Add your Gemini API key to GitHub Secrets:
   - Go to Settings → Secrets and Variables → Actions
   - Click "New repository secret"
   - Name: `GEMINI_API_KEY`
   - Value: Your Google Gemini API key from [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

2. The workflow will automatically:
   - Install dependencies
   - Build the project
   - Deploy to GitHub Pages

### View Your Site

Once deployed, your site will be available at: `https://Danielbarber11.github.io/DB/`

### Test Locally Before Pushing

1. Create a `.env.local` file (copy from `.env.example`)
2. Add your `GEMINI_API_KEY` value
3. Run `npm run dev`
4. Visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` folder.
