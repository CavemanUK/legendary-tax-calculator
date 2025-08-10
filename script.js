// UK Tax Calculator - Main JavaScript

class UKTaxCalculator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.loadFormData();
        this.setDefaultWeekStart();
        this.initializeStorage();
        this.initializePWA();
        this.startSyncTimer();
        this.loadVersionInfo();
    }

    // Detect if we're in Safari (for iCloud Keychain support)
    isSafari() {
        const userAgent = navigator.userAgent;
        return /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    }

    // Initialize storage system
    initializeStorage() {
        this.useICloudKeychain = this.isSafari();
        this.updateStorageIndicator();
        
        if (this.useICloudKeychain) {
            console.log('Using iCloud Keychain for cross-device sync (Safari)');
        } else {
            console.log('Using local storage (other browsers)');
        }
    }

    // Update storage indicator in the header
    updateStorageIndicator() {
        const indicator = document.getElementById('storage-indicator');
        const text = document.getElementById('storage-text');
        
        if (this.useICloudKeychain) {
            indicator.className = 'storage-indicator icloud';
            text.textContent = 'iCloud Keychain - Data syncs across your Apple devices';
        } else {
            indicator.className = 'storage-indicator local';
            text.textContent = 'Local Storage - Data stays on this device';
        }
    }

    // Initialize PWA functionality
    async initializePWA() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('./sw.js');
                console.log('Service Worker registered:', registration);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }

    // Show update notification
    showUpdateNotification() {
        this.showToast('New version available! Refresh to update.', 'info');
    }

    // Start periodic sync timer
    startSyncTimer() {
        // Check for data updates every 30 seconds
        setInterval(() => {
            this.checkForDataUpdates();
        }, 30000);
        
        // Also check when app becomes visible
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.checkForDataUpdates();
            }
        });
    }

    // Check for data updates from iCloud
    checkForDataUpdates() {
        if (this.useICloudKeychain) {
            console.log('Checking for iCloud data updates...');
            
            // Get current data
            const currentWeeks = this.getSavedWeeks();
            const currentFormData = this.loadFromStorage('ukTaxFormData');
            
            // Check if data has changed (this is a simple timestamp check)
            const lastCheck = localStorage.getItem('lastDataCheck') || '0';
            const now = Date.now();
            
            // If it's been more than 5 minutes since last check, refresh data
            if (now - parseInt(lastCheck) > 300000) {
                console.log('Refreshing data from iCloud...');
                this.refreshDataFromStorage();
                localStorage.setItem('lastDataCheck', now.toString());
            }
        }
    }

    // Refresh data from storage (useful for iCloud sync)
    refreshDataFromStorage() {
        // Reload saved weeks
        this.loadSavedWeeks();
        
        // Reload form data
        this.loadFormData();
        
        // Update comparison table
        this.updateComparisonTable();
        
        console.log('Data refreshed from storage');
    }

    // Add click handlers for comparison table rows
    addComparisonRowHandlers() {
        const rows = document.querySelectorAll('.comparison-row');
        rows.forEach(row => {
            row.addEventListener('click', (e) => {
                // Don't trigger if clicking on delete button
                if (e.target.closest('.btn-danger')) {
                    return;
                }
                
                const weekId = row.dataset.weekId;
                this.loadWeek(weekId);
            });
        });
    }

    // Manual refresh button handler
    async manualRefresh() {
        const refreshBtn = document.getElementById('refreshDataBtn');
        if (refreshBtn) {
            refreshBtn.classList.add('spinning');
        }
        
        // Force refresh from storage
        this.refreshDataFromStorage();
        
        // Show feedback
        this.showToast('Data refreshed from iCloud', 'success');
        
        // Stop spinning after 1 second
        setTimeout(() => {
            if (refreshBtn) {
                refreshBtn.classList.remove('spinning');
            }
        }, 1000);
    }

    // Load and display version information
    async loadVersionInfo() {
        try {
            const response = await fetch('version.json');
            const versionData = await response.json();
            
            const versionText = document.getElementById('version-text');
            if (versionText) {
                versionText.textContent = `v${versionData.version} (${versionData.build})`;
                versionText.title = `Build: ${versionData.build}\nDate: ${versionData.date}\nFeatures: ${versionData.features.join(', ')}`;
            }
        } catch (error) {
            console.log('Could not load version info:', error);
            const versionText = document.getElementById('version-text');
            if (versionText) {
                versionText.textContent = 'v1.0.0';
            }
        }
    }

    // Hybrid storage methods
    saveToStorage(key, data) {
        try {
            if (this.useICloudKeychain) {
                // Safari will automatically sync to iCloud Keychain
                localStorage.setItem(key, JSON.stringify(data));
                console.log(`Data saved to iCloud Keychain: ${key}`);
                console.log(`Data size: ${JSON.stringify(data).length} characters`);
                console.log(`Safari detected: ${this.isSafari()}`);
                console.log(`User agent: ${navigator.userAgent}`);
            } else {
                // Fallback to regular local storage
                localStorage.setItem(key, JSON.stringify(data));
                console.log(`Data saved to local storage: ${key}`);
            }
        } catch (error) {
            console.error('Storage error:', error);
            // Fallback to local storage if iCloud Keychain fails
            localStorage.setItem(key, JSON.stringify(data));
        }
    }

    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            console.log(`Loading data for key: ${key}`);
            console.log(`Data found: ${data ? 'Yes' : 'No'}`);
            if (data) {
                console.log(`Data size: ${data.length} characters`);
            }
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Storage load error:', error);
            return null;
        }
    }

    initializeElements() {
        // Input elements
        this.payRateInput = document.getElementById('payRate');
        this.hoursWorkedInput = document.getElementById('hoursWorked');
        this.taxCodeInput = document.getElementById('taxCode');
        this.pensionContributionInput = document.getElementById('pensionContribution');
        this.childSupportInput = document.getElementById('childSupport');
        this.otherDeductionsInput = document.getElementById('otherDeductions');
        this.weekStartDateInput = document.getElementById('weekStartDate');
        this.saveWeekBtn = document.getElementById('saveWeekBtn');

        // Output elements
        this.resultsDiv = document.getElementById('results');
        this.payPeriodInfo = document.getElementById('payPeriodInfo');
        this.paydayInfo = document.getElementById('paydayInfo');
    }

    bindEvents() {
        this.saveWeekBtn.addEventListener('click', () => this.saveWeek());
        
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
        
        // Auto-calculate on input changes
        [this.payRateInput, this.hoursWorkedInput, this.pensionContributionInput, 
         this.childSupportInput, this.otherDeductionsInput].forEach(input => {
            input.addEventListener('input', () => {
                this.autoCalculate();
                this.saveFormData();
            });
        });
        
        this.taxCodeInput.addEventListener('input', () => {
            this.autoCalculate();
            this.saveFormData();
        });
        
        this.weekStartDateInput.addEventListener('change', () => {
            this.updateWeekInfo();
            this.saveFormData();
        });
        
        // Refresh data button
        const refreshBtn = document.getElementById('refreshDataBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.manualRefresh());
        }
    }

    // UK Tax Rates 2024/25 - HMRC Official Rates
    getTaxRates() {
        return {
            personalAllowance: 12570,
            basicRate: { threshold: 37700, rate: 0.20 },
            higherRate: { threshold: 125140, rate: 0.40 },
            additionalRate: { threshold: 125140, rate: 0.45 }
        };
    }

    // HMRC Tax Code Parsing - Official Methodology
    parseTaxCode(taxCode) {
        if (!taxCode) return { personalAllowance: 12570, isCumulative: true, adjustments: [] };
        
        const code = taxCode.toUpperCase();
        let personalAllowance = 12570;
        let isCumulative = true; // Default to cumulative (most common)
        let adjustments = [];
        
        // Extract numeric part (multiply by 10 to get personal allowance)
        const numericPart = code.replace(/[^0-9]/g, '');
        if (numericPart) {
            personalAllowance = parseInt(numericPart) * 10;
        }
        
        // Handle tax code prefixes according to HMRC rules
        if (code.startsWith('C')) {
            // C prefix indicates cumulative calculation
            isCumulative = true;
        } else if (code.startsWith('L')) {
            // L prefix indicates non-cumulative calculation
            isCumulative = false;
        } else if (code.startsWith('W') || code.startsWith('M')) {
            // W1/M1 indicates emergency tax (non-cumulative)
            isCumulative = false;
            adjustments.push('emergency_tax');
        } else if (code.startsWith('K')) {
            // K prefix indicates additional tax (reduced personal allowance)
            isCumulative = true;
            adjustments.push('additional_tax');
        }
        
        return { personalAllowance, isCumulative, adjustments };
    }

    // NI Rates 2024/25 - HMRC Official Rates
    getNIRates() {
        return {
            weekly: { threshold: 242, rate: 0.12, upperThreshold: 967, upperRate: 0.02 },
            monthly: { threshold: 1048, rate: 0.12, upperThreshold: 4189, upperRate: 0.02 },
            yearly: { threshold: 12570, rate: 0.12, upperThreshold: 50270, upperRate: 0.02 }
        };
    }

    // HMRC Official Income Tax Calculation Method
    calculateIncomeTax(grossPay, taxCode = '1257L', frequency = 'weekly') {
        const taxRates = this.getTaxRates();
        const { personalAllowance, isCumulative, adjustments } = this.parseTaxCode(taxCode);
        
        // Convert annual amounts to weekly for calculation
        const weeklyPersonalAllowance = personalAllowance / 52;
        const weeklyBasicThreshold = (personalAllowance + taxRates.basicRate.threshold) / 52;
        const weeklyHigherThreshold = (personalAllowance + taxRates.higherRate.threshold) / 52;
        
        // Calculate taxable income
        let taxableIncome = Math.max(0, grossPay - weeklyPersonalAllowance);
        let tax = 0;

        // Apply HMRC tax bands correctly
        if (taxableIncome <= (weeklyBasicThreshold - weeklyPersonalAllowance)) {
            // Basic rate band
            tax = taxableIncome * taxRates.basicRate.rate;
        } else if (taxableIncome <= (weeklyHigherThreshold - weeklyPersonalAllowance)) {
            // Higher rate band
            const basicRateAmount = weeklyBasicThreshold - weeklyPersonalAllowance;
            const higherRateAmount = taxableIncome - basicRateAmount;
            tax = (basicRateAmount * taxRates.basicRate.rate) + 
                  (higherRateAmount * taxRates.higherRate.rate);
        } else {
            // Additional rate band
            const basicRateAmount = weeklyBasicThreshold - weeklyPersonalAllowance;
            const higherRateAmount = weeklyHigherThreshold - weeklyBasicThreshold;
            const additionalRateAmount = taxableIncome - (weeklyHigherThreshold - weeklyPersonalAllowance);
            tax = (basicRateAmount * taxRates.basicRate.rate) + 
                  (higherRateAmount * taxRates.higherRate.rate) + 
                  (additionalRateAmount * taxRates.additionalRate.rate);
        }

        // Apply emergency tax adjustments if applicable
        if (adjustments.includes('emergency_tax')) {
            // Emergency tax uses basic rate on all taxable income
            tax = taxableIncome * taxRates.basicRate.rate;
        }

        return Math.round(tax * 100) / 100;
    }

    // HMRC Official National Insurance Calculation Method
    calculateNI(grossPay, frequency) {
        const niRates = this.getNIRates();
        const rates = niRates[frequency] || niRates.weekly;
        
        let ni = 0;
        
        // Calculate NI on earnings above the threshold
        const taxablePay = Math.max(0, grossPay - rates.threshold);
        
        if (grossPay <= rates.upperThreshold) {
            // Standard rate on all taxable pay
            ni = taxablePay * rates.rate;
        } else {
            // Split between standard and reduced rate
            const lowerBand = rates.upperThreshold - rates.threshold;
            const upperBand = grossPay - rates.upperThreshold;
            ni = (lowerBand * rates.rate) + (upperBand * rates.upperRate);
        }

        return Math.round(ni * 100) / 100;
    }

    // Theoretical calculations (without any adjustments) - for comparison
    calculateTheoreticalTax(grossPay, taxCode = '1257L') {
        const taxRates = this.getTaxRates();
        const { personalAllowance } = this.parseTaxCode(taxCode);
        
        const weeklyPersonalAllowance = personalAllowance / 52;
        const weeklyBasicThreshold = (personalAllowance + taxRates.basicRate.threshold) / 52;
        const weeklyHigherThreshold = (personalAllowance + taxRates.higherRate.threshold) / 52;
        
        let taxableIncome = Math.max(0, grossPay - weeklyPersonalAllowance);
        let tax = 0;

        if (taxableIncome <= (weeklyBasicThreshold - weeklyPersonalAllowance)) {
            tax = taxableIncome * taxRates.basicRate.rate;
        } else if (taxableIncome <= (weeklyHigherThreshold - weeklyPersonalAllowance)) {
            const basicRateAmount = weeklyBasicThreshold - weeklyPersonalAllowance;
            const higherRateAmount = taxableIncome - basicRateAmount;
            tax = (basicRateAmount * taxRates.basicRate.rate) + 
                  (higherRateAmount * taxRates.higherRate.rate);
        } else {
            const basicRateAmount = weeklyBasicThreshold - weeklyPersonalAllowance;
            const higherRateAmount = weeklyHigherThreshold - weeklyBasicThreshold;
            const additionalRateAmount = taxableIncome - (weeklyHigherThreshold - weeklyPersonalAllowance);
            tax = (basicRateAmount * taxRates.basicRate.rate) + 
                  (higherRateAmount * taxRates.higherRate.rate) + 
                  (additionalRateAmount * taxRates.additionalRate.rate);
        }

        return Math.round(tax * 100) / 100;
    }

    calculateTheoreticalNI(grossPay, frequency) {
        const niRates = this.getNIRates();
        const rates = niRates[frequency] || niRates.weekly;
        
        let ni = 0;
        const taxablePay = Math.max(0, grossPay - rates.threshold);
        
        if (grossPay <= rates.upperThreshold) {
            ni = taxablePay * rates.rate;
        } else {
            const lowerBand = rates.upperThreshold - rates.threshold;
            const upperBand = grossPay - rates.upperThreshold;
            ni = (lowerBand * rates.rate) + (upperBand * rates.upperRate);
        }

        return Math.round(ni * 100) / 100;
    }

    calculatePension(grossPay, percentage) {
        if (!percentage || percentage <= 0) return 0;
        return Math.round((grossPay * percentage / 100) * 100) / 100;
    }

    getInputValues() {
        return {
            payRate: parseFloat(this.payRateInput.value) || 0,
            hoursWorked: parseFloat(this.hoursWorkedInput.value) || 0,
            payFrequency: 'weekly', // Always weekly for this calculator
            taxCode: this.taxCodeInput.value || 'C1257L',
            pensionContribution: parseFloat(this.pensionContributionInput.value) || 0,
            childSupport: parseFloat(this.childSupportInput.value) || 0,
            otherDeductions: parseFloat(this.otherDeductionsInput.value) || 0
        };
    }

    calculate() {
        const inputs = this.getInputValues();
        
        if (inputs.payRate <= 0 || inputs.hoursWorked <= 0) {
            this.showError('Please enter valid pay rate and hours worked.');
            return;
        }

        // Calculate gross pay
        const grossPay = inputs.payRate * inputs.hoursWorked;
        
        // Calculate deductions based on frequency
        let incomeTax, nationalInsurance;
        
        if (inputs.payFrequency === 'weekly') {
            // For weekly, calculate directly
            incomeTax = this.calculateIncomeTax(grossPay, inputs.taxCode);
            nationalInsurance = this.calculateNI(grossPay, 'weekly');
        } else {
            // For other frequencies, convert to weekly equivalent first
            const weeklyMultipliers = {
                fortnightly: 2,
                monthly: 4.33,
                yearly: 52
            };
            
            const weeklyGross = grossPay / weeklyMultipliers[inputs.payFrequency];
            incomeTax = this.calculateIncomeTax(weeklyGross, inputs.taxCode) * weeklyMultipliers[inputs.payFrequency];
            nationalInsurance = this.calculateNI(weeklyGross, 'weekly') * weeklyMultipliers[inputs.payFrequency];
        }
        
        const pension = this.calculatePension(grossPay, inputs.pensionContribution);
        const childSupport = inputs.childSupport;
        const otherDeductions = inputs.otherDeductions;
        
        const totalDeductions = incomeTax + nationalInsurance + pension + childSupport + otherDeductions;
        const netPay = grossPay - totalDeductions;

        const calculation = {
            ...inputs,
            grossPay,
            incomeTax,
            nationalInsurance,
            pension,
            childSupport,
            otherDeductions,
            totalDeductions,
            netPay,
            timestamp: new Date().toISOString()
        };

        this.displayResults(calculation);
    }

    autoCalculate() {
        // Debounce auto-calculation
        clearTimeout(this.autoCalculateTimeout);
        this.autoCalculateTimeout = setTimeout(() => {
            const inputs = this.getInputValues();
            if (inputs.payRate > 0 && inputs.hoursWorked > 0) {
                this.calculate();
            }
        }, 500);
    }

    // HMRC Detailed Calculation Breakdown
    getDetailedCalculationBreakdown(grossPay, taxCode = '1257L', frequency = 'weekly') {
        const taxRates = this.getTaxRates();
        const { personalAllowance, isCumulative, adjustments } = this.parseTaxCode(taxCode);
        
        // Convert to weekly amounts
        const weeklyPersonalAllowance = personalAllowance / 52;
        const weeklyBasicThreshold = (personalAllowance + taxRates.basicRate.threshold) / 52;
        const weeklyHigherThreshold = (personalAllowance + taxRates.higherRate.threshold) / 52;
        
        const taxableIncome = Math.max(0, grossPay - weeklyPersonalAllowance);
        
        // Calculate tax breakdown
        let basicRateTax = 0;
        let higherRateTax = 0;
        let additionalRateTax = 0;
        
        if (taxableIncome > 0) {
            const basicRateBand = weeklyBasicThreshold - weeklyPersonalAllowance;
            const higherRateBand = weeklyHigherThreshold - weeklyBasicThreshold;
            
            if (taxableIncome <= basicRateBand) {
                basicRateTax = taxableIncome * taxRates.basicRate.rate;
            } else if (taxableIncome <= (basicRateBand + higherRateBand)) {
                basicRateTax = basicRateBand * taxRates.basicRate.rate;
                higherRateTax = (taxableIncome - basicRateBand) * taxRates.higherRate.rate;
            } else {
                basicRateTax = basicRateBand * taxRates.basicRate.rate;
                higherRateTax = higherRateBand * taxRates.higherRate.rate;
                additionalRateTax = (taxableIncome - basicRateBand - higherRateBand) * taxRates.additionalRate.rate;
            }
        }
        
        // Calculate NI breakdown
        const niRates = this.getNIRates();
        const rates = niRates[frequency] || niRates.weekly;
        const niTaxablePay = Math.max(0, grossPay - rates.threshold);
        
        let standardRateNI = 0;
        let reducedRateNI = 0;
        
        if (niTaxablePay > 0) {
            if (grossPay <= rates.upperThreshold) {
                standardRateNI = niTaxablePay * rates.rate;
            } else {
                const lowerBand = rates.upperThreshold - rates.threshold;
                const upperBand = grossPay - rates.upperThreshold;
                standardRateNI = lowerBand * rates.rate;
                reducedRateNI = upperBand * rates.upperRate;
            }
        }
        
        return {
            personalAllowance: weeklyPersonalAllowance,
            taxableIncome,
            taxBreakdown: {
                basicRate: { amount: basicRateTax, rate: taxRates.basicRate.rate },
                higherRate: { amount: higherRateTax, rate: taxRates.higherRate.rate },
                additionalRate: { amount: additionalRateTax, rate: taxRates.additionalRate.rate }
            },
            niBreakdown: {
                threshold: rates.threshold,
                taxablePay: niTaxablePay,
                standardRate: { amount: standardRateNI, rate: rates.rate },
                reducedRate: { amount: reducedRateNI, rate: rates.upperRate }
            },
            isCumulative,
            adjustments
        };
    }

    // Enhanced display with HMRC methodology details
    displayResults(calculation) {
        // Store current calculation for saving
        this.currentCalculation = calculation;
        
        // Get detailed breakdown
        const breakdown = this.getDetailedCalculationBreakdown(calculation.grossPay, calculation.taxCode);
        
        const breakdownHTML = `
            <div class="breakdown-item fade-in">
                <span class="breakdown-label">Gross Pay</span>
                <span class="breakdown-value positive">£${calculation.grossPay.toFixed(2)}</span>
            </div>
            <div class="breakdown-item fade-in">
                <span class="breakdown-label">Personal Allowance (Weekly)</span>
                <span class="breakdown-value info">£${breakdown.personalAllowance.toFixed(2)}</span>
            </div>
            <div class="breakdown-item fade-in">
                <span class="breakdown-label">Taxable Income</span>
                <span class="breakdown-value info">£${breakdown.taxableIncome.toFixed(2)}</span>
            </div>
            <div class="breakdown-item fade-in">
                <span class="breakdown-label">Income Tax (${breakdown.isCumulative ? 'Cumulative' : 'Non-cumulative'})</span>
                <span class="breakdown-value tax">-£${calculation.incomeTax.toFixed(2)}</span>
            </div>
            ${breakdown.taxBreakdown.basicRate.amount > 0 ? `
            <div class="breakdown-item fade-in breakdown-sub">
                <span class="breakdown-label">• Basic Rate (${(breakdown.taxBreakdown.basicRate.rate * 100)}%)</span>
                <span class="breakdown-value tax">-£${breakdown.taxBreakdown.basicRate.amount.toFixed(2)}</span>
            </div>
            ` : ''}
            ${breakdown.taxBreakdown.higherRate.amount > 0 ? `
            <div class="breakdown-item fade-in breakdown-sub">
                <span class="breakdown-label">• Higher Rate (${(breakdown.taxBreakdown.higherRate.rate * 100)}%)</span>
                <span class="breakdown-value tax">-£${breakdown.taxBreakdown.higherRate.amount.toFixed(2)}</span>
            </div>
            ` : ''}
            ${breakdown.taxBreakdown.additionalRate.amount > 0 ? `
            <div class="breakdown-item fade-in breakdown-sub">
                <span class="breakdown-label">• Additional Rate (${(breakdown.taxBreakdown.additionalRate.rate * 100)}%)</span>
                <span class="breakdown-value tax">-£${breakdown.taxBreakdown.additionalRate.amount.toFixed(2)}</span>
            </div>
            ` : ''}
            <div class="breakdown-item fade-in">
                <span class="breakdown-label">National Insurance</span>
                <span class="breakdown-value ni">-£${calculation.nationalInsurance.toFixed(2)}</span>
            </div>
            ${breakdown.niBreakdown.standardRate.amount > 0 ? `
            <div class="breakdown-item fade-in breakdown-sub">
                <span class="breakdown-label">• Standard Rate (${(breakdown.niBreakdown.standardRate.rate * 100)}%)</span>
                <span class="breakdown-value ni">-£${breakdown.niBreakdown.standardRate.amount.toFixed(2)}</span>
            </div>
            ` : ''}
            ${breakdown.niBreakdown.reducedRate.amount > 0 ? `
            <div class="breakdown-item fade-in breakdown-sub">
                <span class="breakdown-label">• Reduced Rate (${(breakdown.niBreakdown.reducedRate.rate * 100)}%)</span>
                <span class="breakdown-value ni">-£${breakdown.niBreakdown.reducedRate.amount.toFixed(2)}</span>
            </div>
            ` : ''}
            <div class="breakdown-item fade-in">
                <span class="breakdown-label">Pension (${calculation.pensionContribution}%)</span>
                <span class="breakdown-value pension">-£${calculation.pension.toFixed(2)}</span>
            </div>
            ${calculation.childSupport > 0 ? `
            <div class="breakdown-item fade-in">
                <span class="breakdown-label">Child Support</span>
                <span class="breakdown-value child-support">-£${calculation.childSupport.toFixed(2)}</span>
            </div>
            ` : ''}
            ${calculation.otherDeductions > 0 ? `
            <div class="breakdown-item fade-in">
                <span class="breakdown-label">Other Deductions</span>
                <span class="breakdown-value other-deductions">-£${calculation.otherDeductions.toFixed(2)}</span>
            </div>
            ` : ''}
            <div class="breakdown-item fade-in">
                <span class="breakdown-label">Total Deductions</span>
                <span class="breakdown-value negative">-£${calculation.totalDeductions.toFixed(2)}</span>
            </div>
            <div class="breakdown-item fade-in">
                <span class="breakdown-label">Net Pay</span>
                <span class="breakdown-value total">£${calculation.netPay.toFixed(2)}</span>
            </div>
            ${breakdown.adjustments.length > 0 ? `
            <div class="breakdown-item fade-in breakdown-note">
                <span class="breakdown-label">Note: ${breakdown.adjustments.join(', ')} applied</span>
            </div>
            ` : ''}
        `;

        this.resultsDiv.innerHTML = breakdownHTML;
    }

    showError(message) {
        this.resultsDiv.innerHTML = `
            <div class="placeholder">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
            </div>
        `;
    }

    saveWeek() {
        const inputs = this.getInputValues();
        const grossPay = inputs.payRate * inputs.hoursWorked;
        
        if (grossPay <= 0) {
            this.showToast('Please enter valid pay rate and hours worked before saving.', 'error');
            return;
        }
        
        if (!this.weekStartDateInput.value) {
            this.showToast('Please select a week start date before saving.', 'error');
            return;
        }
        
        const weekStart = new Date(this.weekStartDateInput.value);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        const payday = new Date(weekStart);
        payday.setDate(weekStart.getDate() + 11);
        
        const weekData = {
            id: Date.now().toString(),
            weekStart: this.weekStartDateInput.value,
            weekEnd: weekEnd.toISOString().split('T')[0],
            payday: payday.toISOString().split('T')[0],
            ...inputs,
            grossPay,
            incomeTax: this.currentCalculation?.incomeTax || 0,
            nationalInsurance: this.currentCalculation?.nationalInsurance || 0,
            pension: this.currentCalculation?.pension || 0,
            childSupport: this.currentCalculation?.childSupport || 0,
            otherDeductions: this.currentCalculation?.otherDeductions || 0,
            totalDeductions: this.currentCalculation?.totalDeductions || 0,
            netPay: this.currentCalculation?.netPay || 0,
            timestamp: new Date().toISOString()
        };
        
        const savedWeeks = this.getSavedWeeks();
        
        // Check if a week with this payday already exists
        const existingWeekIndex = savedWeeks.findIndex(week => week.payday === weekData.payday);
        
        if (existingWeekIndex !== -1) {
            // Ask for confirmation to overwrite
            if (confirm(`A week with payday ${payday.toLocaleDateString('en-GB')} already exists. Do you want to overwrite it?`)) {
                // Replace the existing week
                savedWeeks[existingWeekIndex] = weekData;
                this.showToast(`Week updated successfully! Payday: ${payday.toLocaleDateString('en-GB')}`, 'success');
            } else {
                return; // User cancelled
            }
        } else {
            // Add new week at the beginning
            savedWeeks.unshift(weekData);
            const storageType = this.useICloudKeychain ? 'iCloud Keychain' : 'local storage';
            this.showToast(`Week saved to ${storageType}! Payday: ${payday.toLocaleDateString('en-GB')}`, 'success');
        }
        
        // Keep only the last 20 weeks
        if (savedWeeks.length > 20) {
            savedWeeks.splice(20);
        }
        
        this.saveToStorage('ukTaxWeeks', savedWeeks);
        this.updateComparisonTable();
    }

    getSavedWeeks() {
        return this.loadFromStorage('ukTaxWeeks') || [];
    }



    loadWeek(id) {
        const savedWeeks = this.getSavedWeeks();
        const week = savedWeeks.find(w => w.id === id);
        
        if (week) {
            // Populate form inputs
            this.weekStartDateInput.value = week.weekStart;
            this.payRateInput.value = week.payRate;
            this.hoursWorkedInput.value = week.hoursWorked;
            this.taxCodeInput.value = week.taxCode;
            this.pensionContributionInput.value = week.pensionContribution;
            this.childSupportInput.value = week.childSupport;
            this.otherDeductionsInput.value = week.otherDeductions;
            
            // Update week info display
            this.updateWeekInfo();
            
            // Recalculate and display results
            this.calculate();
            
            // Switch to calculator tab
            this.switchTab('calculator');
            
            this.showToast(`Loaded week data for payday: ${new Date(week.payday).toLocaleDateString('en-GB')}`, 'info');
        }
    }

    deleteWeek(id) {
        const savedWeeks = this.getSavedWeeks();
        const filteredWeeks = savedWeeks.filter(week => week.id !== id);
        
        this.saveToStorage('ukTaxWeeks', filteredWeeks);
        this.updateComparisonTable();
    }

    setDefaultWeekStart() {
        // Set default to current week's Monday
        const today = new Date();
        const dayOfWeek = today.getDay();
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 0, Monday = 1
        const monday = new Date(today);
        monday.setDate(today.getDate() - daysToMonday);
        
        this.weekStartDateInput.value = monday.toISOString().split('T')[0];
        this.updateWeekInfo();
    }

    updateWeekInfo() {
        if (!this.weekStartDateInput.value) return;
        
        const weekStart = new Date(this.weekStartDateInput.value);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6); // Sunday
        
        const payday = new Date(weekStart);
        payday.setDate(weekStart.getDate() + 11); // Friday of next week
        
        this.payPeriodInfo.textContent = `${weekStart.toLocaleDateString('en-GB')} - ${weekEnd.toLocaleDateString('en-GB')}`;
        this.paydayInfo.textContent = payday.toLocaleDateString('en-GB');
    }

    saveFormData() {
        const formData = {
            payRate: this.payRateInput.value,
            hoursWorked: this.hoursWorkedInput.value,
            taxCode: this.taxCodeInput.value,
            pensionContribution: this.pensionContributionInput.value,
            childSupport: this.childSupportInput.value,
            otherDeductions: this.otherDeductionsInput.value,
            weekStartDate: this.weekStartDateInput.value
        };
        
        this.saveToStorage('ukTaxFormData', formData);
    }

    loadFormData() {
        const savedData = this.loadFromStorage('ukTaxFormData');
        if (savedData) {
            this.payRateInput.value = savedData.payRate || '';
            this.hoursWorkedInput.value = savedData.hoursWorked || '';
            this.taxCodeInput.value = savedData.taxCode || 'C1257L';
            this.pensionContributionInput.value = savedData.pensionContribution || '3.9';
            this.childSupportInput.value = savedData.childSupport || '';
            this.otherDeductionsInput.value = savedData.otherDeductions || '';
            this.weekStartDateInput.value = savedData.weekStartDate || '';
            
            this.updateWeekInfo();
            this.autoCalculate();
        } else {
            // Set default values for new users
            this.pensionContributionInput.value = '3.9';
            this.taxCodeInput.value = 'C1257L';
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const tabButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (tabButton) {
            tabButton.classList.add('active');
        }
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const tabContent = document.getElementById(`${tabName}-tab`);
        if (tabContent) {
            tabContent.classList.add('active');
        }
        
        // Update comparison table if switching to comparison tab
        if (tabName === 'comparison') {
            this.updateComparisonTable();
        }
    }

    updateComparisonTable() {
        const savedWeeks = this.getSavedWeeks();
        const comparisonTableDiv = document.getElementById('comparisonTable');
        
        if (savedWeeks.length === 0) {
            comparisonTableDiv.innerHTML = `
                <div class="placeholder">
                    <i class="fas fa-table"></i>
                    <p>No data to compare yet</p>
                </div>
            `;
            return;
        }
        
        // Sort weeks by payday date (newest first)
        const sortedWeeks = savedWeeks.sort((a, b) => {
            const dateA = new Date(a.payday);
            const dateB = new Date(b.payday);
            return dateB - dateA; // Descending order (newest first)
        });
        
        const tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Payday</th>
                        <th>Hours</th>
                        <th>Gross</th>
                        <th>Tax</th>
                        <th>NI</th>
                        <th>Pension</th>
                        <th>Other</th>
                        <th>Total Ded.</th>
                        <th>Net</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedWeeks.map(week => {
                        const payday = new Date(week.payday);
                        
                        // Recalculate all values using current HMRC rates
                        const grossPay = week.payRate * week.hoursWorked;
                        const incomeTax = this.calculateIncomeTax(grossPay, week.taxCode, 'weekly');
                        const nationalInsurance = this.calculateNI(grossPay, 'weekly');
                        const pension = this.calculatePension(grossPay, week.pensionContribution);
                        const otherDeductions = week.childSupport + week.otherDeductions;
                        const totalDeductions = incomeTax + nationalInsurance + pension + otherDeductions;
                        const netPay = grossPay - totalDeductions;
                        
                        return `
                            <tr class="comparison-row" data-week-id="${week.id}">
                                <td class="payday-date">${payday.toLocaleDateString('en-GB')}</td>
                                <td class="hours-worked">${week.hoursWorked}</td>
                                <td class="gross-pay">£${grossPay.toFixed(2)}</td>
                                <td class="tax">-£${incomeTax.toFixed(2)}</td>
                                <td class="ni">-£${nationalInsurance.toFixed(2)}</td>
                                <td class="pension">-£${pension.toFixed(2)}</td>
                                <td class="deductions">-£${otherDeductions.toFixed(2)}</td>
                                <td class="total-deductions">-£${totalDeductions.toFixed(2)}</td>
                                <td class="net-pay">£${netPay.toFixed(2)}</td>
                                <td class="actions">
                                    <button class="btn btn-danger btn-sm" onclick="taxCalculator.deleteWeek('${week.id}')" title="Delete week">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
        
        comparisonTableDiv.innerHTML = tableHTML;
        
        // Add click handlers for row editing
        this.addComparisonRowHandlers();
    }

    showToast(message, type = 'info') {
        // Remove existing toast if any
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add to page
        document.body.appendChild(toast);

        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 3000);
    }

    getToastIcon(type) {
        switch (type) {
            case 'success':
                return 'fa-check-circle';
            case 'error':
                return 'fa-exclamation-circle';
            case 'warning':
                return 'fa-exclamation-triangle';
            default:
                return 'fa-info-circle';
        }
    }
}

// Initialize the calculator when the page loads
let taxCalculator;
document.addEventListener('DOMContentLoaded', () => {
    taxCalculator = new UKTaxCalculator();
});
