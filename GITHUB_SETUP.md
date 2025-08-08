# 🚀 GitHub Pages Deployment Guide

## Quick Setup (Automated)

1. **Run the deployment script**:
   ```bash
   cd TaxCalc
   ./deploy.sh
   ```

2. **Follow the prompts** to enter your GitHub username

3. **Enable GitHub Pages** (see manual steps below)

## Manual Setup

### Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click the "+" icon → "New repository"
3. Name it: `legendary-tax-calculator`
4. Make it **Public** (required for free GitHub Pages)
5. Don't initialize with README (we already have one)
6. Click "Create repository"

### Step 2: Upload Your Code

**Option A: Using the deployment script**
```bash
cd TaxCalc
./deploy.sh
```

**Option B: Manual git commands**
```bash
cd TaxCalc
git init
git add .
git commit -m "Initial commit: Legendary Tax Calculator"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/legendary-tax-calculator.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository: `https://github.com/YOUR_USERNAME/legendary-tax-calculator`
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **Deploy from a branch**
5. Choose **main** branch
6. Click **Save**

### Step 4: Wait for Deployment

- GitHub will build and deploy your site
- This usually takes 2-5 minutes
- You'll see a green checkmark when it's ready

### Step 5: Access Your Site

Your site will be available at:
```
https://YOUR_USERNAME.github.io/legendary-tax-calculator/
```

## 🔧 Troubleshooting

### Common Issues

**"Repository not found"**
- Make sure the repository name is exactly `legendary-tax-calculator`
- Ensure the repository is public

**"Branch not found"**
- Make sure you're using the `main` branch
- Check that your code was pushed successfully

**"Site not loading"**
- Wait 5-10 minutes for initial deployment
- Check the Actions tab for build status
- Ensure all files are in the root directory

### File Structure Check

Your repository should look like this:
```
legendary-tax-calculator/
├── index.html
├── styles.css
├── script.js
├── README.md
├── deploy.sh
└── GITHUB_SETUP.md
```

## 🎯 Custom Domain (Optional)

If you want a custom domain:

1. Go to repository **Settings** → **Pages**
2. Under **Custom domain**, enter your domain
3. Add a `CNAME` file to your repository with your domain
4. Update your DNS settings

## 📱 Testing

After deployment, test these features:
- ✅ Calculator functionality
- ✅ Saving weeks
- ✅ Loading weeks
- ✅ Tab switching
- ✅ Mobile responsiveness
- ✅ Local storage persistence

## 🔄 Updates

To update your live site:

```bash
git add .
git commit -m "Update description"
git push
```

GitHub Pages will automatically rebuild and deploy your changes.

---

**Your Legendary Tax Calculator is now live on the web! 🌐**
