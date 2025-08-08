# Legendary Tax Calculator

A modern, mobile-first web application for calculating UK tax, National Insurance, pension, and other deductions. Built with vanilla JavaScript, HTML, and CSS.

## 🌟 Features

- **Accurate UK Tax Calculations**: Based on 2024/25 HMRC rates with adjustment factors for real-world accuracy
- **Week-based Tracking**: Save and manage weekly pay periods with automatic payday calculation
- **Modern Dark Theme**: Beautiful glass morphism design with responsive layout
- **Mobile-First Design**: Optimized for mobile devices with touch-friendly interface
- **Local Storage**: Persistently saves your data locally
- **Comparison Tools**: Compare multiple weeks in an easy-to-read table
- **Toast Notifications**: Modern feedback system for user actions

## 🚀 Live Demo

[View the live application here](https://[your-username].github.io/legendary-tax-calculator/)

## 📱 Screenshots

- **Calculator Tab**: Main calculation interface with form inputs and results
- **History Tab**: View and manage saved weekly calculations
- **Comparison Tab**: Compare multiple weeks in a color-coded table

## 🛠️ Technology Stack

- **HTML5**: Semantic markup and modern structure
- **CSS3**: Flexbox, Grid, animations, and responsive design
- **Vanilla JavaScript**: ES6+ features, classes, and modern APIs
- **Local Storage**: Client-side data persistence
- **Font Awesome**: Icons for enhanced UI

## 📋 UK Tax Features

### Tax Calculation
- Personal Allowance: £12,570 (2024/25)
- Basic Rate (20%): £12,571 - £50,270
- Higher Rate (40%): £50,271 - £125,140
- Additional Rate (45%): Over £125,140

### National Insurance
- Weekly thresholds and rates for 2024/25
- Automatic calculation based on gross pay

### Tax Codes
- Support for various tax codes (C1257L, W1/M1, K codes)
- Cumulative and emergency tax calculations

## 🎯 Key Features

### Calculator
- **Week Selection**: Choose week start date (Monday)
- **Automatic Payday**: Calculates payday (following Friday)
- **Real-time Calculation**: Updates as you type
- **Deductions Support**: Pension, child support, other deductions

### History Management
- **Save Weeks**: Store up to 20 weekly calculations
- **Load for Editing**: Click load to populate calculator
- **Overwrite Protection**: Confirms before overwriting existing weeks
- **Delete Function**: Remove unwanted entries

### Comparison Table
- **Color-coded Columns**: Easy visual identification
- **Mobile-friendly**: Horizontal scrolling on small screens
- **Comprehensive Data**: Gross, tax, NI, pension, deductions, net pay

## 🚀 Getting Started

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/[your-username]/legendary-tax-calculator.git
   cd legendary-tax-calculator
   ```

2. **Open in browser**:
   ```bash
   open index.html
   ```
   Or simply double-click the `index.html` file.

### GitHub Pages Deployment

1. **Create a new repository** on GitHub named `legendary-tax-calculator`

2. **Push your code**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Legendary Tax Calculator"
   git branch -M main
   git remote add origin https://github.com/[your-username]/legendary-tax-calculator.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click "Settings" tab
   - Scroll down to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch
   - Click "Save"

4. **Your site will be available at**:
   `https://[your-username].github.io/legendary-tax-calculator/`

## 📁 File Structure

```
legendary-tax-calculator/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript logic and calculations
└── README.md           # This file
```

## 🎨 Design Features

- **Dark Theme**: Modern dark color scheme with glass morphism
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Smooth Animations**: CSS transitions and keyframe animations
- **Accessibility**: Proper contrast ratios and semantic HTML
- **Touch-friendly**: Optimized for mobile interaction

## 🔧 Customization

### Changing Default Values
Edit the `loadFormData()` method in `script.js`:
```javascript
// Default values for new users
this.pensionContributionInput.value = '3.9';
this.taxCodeInput.value = 'C1257L';
```

### Modifying Tax Rates
Update the `getTaxRates()` and `getNIRates()` methods for new tax years.

## 📊 Data Storage

All data is stored locally in your browser using Local Storage:
- **Form Data**: Input values persist between sessions
- **Saved Weeks**: Up to 20 weekly calculations
- **Privacy**: No data is sent to external servers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- UK HMRC for tax rate information
- Font Awesome for icons
- Modern CSS techniques and responsive design principles

## 📞 Support

If you have any questions or issues:
- Open an issue on GitHub
- Check the browser console for error messages
- Ensure your browser supports ES6+ features

---

**Built with ❤️ for accurate UK tax calculations**
# Test comment
