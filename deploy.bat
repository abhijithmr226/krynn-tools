@echo off
echo.
echo ===================================================
echo 🚀 Krynn Tools One-Click Deployment Automation
echo ===================================================
echo.
echo 📦 Staging changes...
git add .
echo.
echo ✍️ Committing changes...
git commit -m "update: automated deployment %date% %time%"
echo.
echo 📤 Pushing to GitHub...
git push origin main
echo.
echo ⚡ Deploying to Vercel...
npx vercel --prod --yes
echo.
echo 🎉 Deployment complete!
echo ===================================================
pause
