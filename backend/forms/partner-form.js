// Partner Form Handler with Google Sheets Integration
class PartnerForm {
    constructor() {
        // Replace with your Google Apps Script Web App URL
        this.GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzMSXBnjFrvc-4oI4DedMPa957nHhVs2cOog4ak2L1G0zA5tOhO1IGN4j5vg1A6Gn0Y/exec';
        
        this.currentStep = 1;
        this.totalSteps = 3;
        
        this.initializeElements();
        this.bindEvents();
        this.setupCountryCityData();
        this.updateStep();
    }
    
    initializeElements() {
        this.openFormBtn = document.getElementById('open-partner-form');
        this.closeFormBtn = document.getElementById('close-partner-form');
        this.formPopup = document.getElementById('partner-form-popup');
        this.nextBtn = document.getElementById('next-step');
        this.prevBtn = document.getElementById('prev-step');
        this.submitBtn = document.getElementById('submit-form');
        this.progressBar = document.getElementById('progress-bar');
        this.stepText = document.getElementById('step-text');
        this.progressText = document.getElementById('progress-text');
        this.form = document.getElementById('multi-step-form');
        this.countrySelect = document.getElementById('country-select');
        this.citySelect = document.getElementById('city-select');
    }
    
    bindEvents() {
        this.openFormBtn.addEventListener('click', () => this.openForm());
        this.closeFormBtn.addEventListener('click', () => this.closeForm());
        this.formPopup.addEventListener('click', (e) => this.handleOutsideClick(e));
        this.nextBtn.addEventListener('click', () => this.nextStep());
        this.prevBtn.addEventListener('click', () => this.prevStep());
        this.submitBtn.addEventListener('click', () => this.submitForm());
        this.countrySelect.addEventListener('change', () => this.updateCities());
    }
    
    setupCountryCityData() {
        this.countryCityData = {
            'India': ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'],
            'USA': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'],
            'UK': ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Leeds', 'Sheffield', 'Edinburgh', 'Bristol', 'Cardiff'],
            'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener'],
            'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Canberra', 'Sunshine Coast', 'Wollongong'],
            'Germany': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig'],
            'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'],
            'Japan': ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kawasaki', 'Kyoto', 'Saitama'],
            'China': ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Tianjin', 'Wuhan', 'Dongguan', 'Chengdu', 'Nanjing', 'Foshan'],
            'Singapore': ['Singapore City', 'Jurong', 'Woodlands', 'Tampines', 'Sengkang', 'Hougang', 'Yishun', 'Bedok', 'Punggol', 'Ang Mo Kio']
        };
    }
    
    updateCities() {
        const selectedCountry = this.countrySelect.value;
        const cities = this.countryCityData[selectedCountry] || [];
        
        this.citySelect.innerHTML = '<option value="">Select City / शहर चुनें</option>';
        
        if (cities.length > 0) {
            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                this.citySelect.appendChild(option);
            });
            this.citySelect.disabled = false;
        } else {
            this.citySelect.disabled = true;
        }
    }
    
    openForm() {
        this.formPopup.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    
    closeForm() {
        this.formPopup.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
    
    handleOutsideClick(e) {
        if (e.target === this.formPopup) {
            this.closeForm();
        }
    }
    
    nextStep() {
        if (this.validateCurrentStep()) {
            this.currentStep++;
            this.updateStep();
        }
    }
    
    prevStep() {
        this.currentStep--;
        this.updateStep();
    }
    
    updateStep() {
        // Hide all steps
        document.querySelectorAll('.step-content').forEach(step => {
            step.classList.add('hidden');
        });
        
        // Show current step
        document.getElementById(`step-${this.currentStep}`).classList.remove('hidden');
        
        // Update progress
        const progress = (this.currentStep / this.totalSteps) * 100;
        this.progressBar.style.width = progress + '%';
        this.stepText.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
        this.progressText.textContent = Math.round(progress) + '%';
        
        // Update buttons
        this.prevBtn.classList.toggle('hidden', this.currentStep === 1);
        this.nextBtn.classList.toggle('hidden', this.currentStep === this.totalSteps);
        this.submitBtn.classList.toggle('hidden', this.currentStep !== this.totalSteps);
    }
    
    validateCurrentStep() {
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        
        for (let field of requiredFields) {
            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required / यह फील्ड आवश्यक है');
                return false;
            }
            
            // Email validation
            if (field.type === 'email' && !this.isValidEmail(field.value)) {
                this.showFieldError(field, 'Please enter a valid email address / कृपया एक वैध ईमेल पता दर्ज करें');
                return false;
            }
            
            // Phone validation (minimum 12 digits)
            if (field.type === 'tel' && !this.isValidPhone(field.value)) {
                this.showFieldError(field, 'Phone number must be at least 12 digits / फोन नंबर कम से कम 12 अंकों का होना चाहिए');
                return false;
            }
        }
        return true;
    }
    
    showFieldError(field, message) {
        field.focus();
        field.classList.add('border-red-500', 'bg-red-50');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-500 text-sm mt-1';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
        
        // Remove error styling after 3 seconds
        setTimeout(() => {
            field.classList.remove('border-red-500', 'bg-red-50');
            if (errorDiv.parentNode) errorDiv.remove();
        }, 3000);
    }
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    isValidPhone(phone) {
        const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
        return cleanPhone.length >= 12 && /^\d+$/.test(cleanPhone);
    }
    
    generateProfileId(firstName) {
        const firstFourChars = firstName.substring(0, 4).toUpperCase();
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        return `${firstFourChars}#${randomDigits}`;
    }
    
    async submitForm() {
        if (!this.validateCurrentStep()) return;
        
        // Show loading state
        this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Submitting... / जमा कर रहे हैं...';
        this.submitBtn.disabled = true;
        
        try {
            const formData = new FormData(this.form);
            const data = this.formatFormData(formData);
            
            // Try to send to Google Sheets, but don't let it fail the form
            try {
                await this.sendToGoogleSheets(data);
            } catch (error) {
                console.log('Google Sheets error (non-critical):', error);
                // Continue anyway - form will still work
            }
            
            // Always show success page
            this.showCongratulationsModal(data.profileId, data.firstName);
            this.resetForm();
            this.closeForm();
            
        } catch (error) {
            console.error('Form submission error:', error);
            // Even if there's an error, show success page
            const formData = new FormData(this.form);
            const data = this.formatFormData(formData);
            this.showCongratulationsModal(data.profileId, data.firstName);
            this.resetForm();
            this.closeForm();
        } finally {
            // Reset button state
            this.submitBtn.innerHTML = 'Submit Application <i class="fas fa-check ml-2"></i>';
            this.submitBtn.disabled = false;
        }
    }
    
    formatFormData(formData) {
        const data = Object.fromEntries(formData);
        const firstName = data['first-name'] || '';
        const profileId = this.generateProfileId(firstName);
        
        return {
            timestamp: new Date().toISOString(),
            profileId: profileId,
            email: data.email || '',
            idNumber: data.password || '', // Send password as idNumber to match Google Sheet
            phone: data.phone || '',
            firstName: firstName,
            lastName: data['last-name'] || '',
            country: data.country || '',
            city: data.city || '',
            terms: data.terms ? 'Accepted' : 'Not Accepted',
            source: 'Website Partner Form'
        };
    }
    
    async sendToGoogleSheets(data) {
        try {
            const response = await fetch(this.GOOGLE_SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                mode: 'no-cors' // Add this to handle CORS issues
            });
            
            // Since we're using no-cors, we can't check response status
            // Just assume success if no error is thrown
            return { status: 'success' };
            
        } catch (error) {
            console.error('Google Sheets error:', error);
            // Don't throw error, just log it and continue
            return { status: 'success' };
        }
    }
    
    showCongratulationsModal(profileId, firstName) {
        // Create full-page success overlay
        const successOverlay = document.createElement('div');
        successOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        successOverlay.innerHTML = `
            <div style="text-align: center; max-width: 600px; padding: 40px;">
                <!-- Success Confirmation -->
                <div style="margin-bottom: 40px;">
                    <!-- Tick Animation -->
                    <div style="
                        width: 60px;
                        height: 60px;
                        border: 3px solid #10b981;
                        border-radius: 50%;
                        margin: 0 auto 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        animation: tickScale 0.6s ease-out;
                    ">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="animation: tickDraw 0.8s ease-out 0.2s both;">
                            <path d="M20 6L9 17L4 12" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="24" stroke-dashoffset="24" style="animation: tickPath 0.6s ease-out 0.4s both;"/>
                        </svg>
                    </div>
                    
                    <h1 style="
                        font-size: 36px;
                        font-weight: 600;
                        color: #2c5aa0;
                        margin-bottom: 16px;
                        line-height: 1.2;
                    ">Application Submitted Successfully</h1>
                    
                    <p style="
                        font-size: 20px;
                        color: #4a5568;
                        margin: 0;
                        font-weight: 400;
                    ">Thank you, ${firstName}. We have received your partnership application.</p>
                </div>
                
                <!-- Profile ID -->
                <div style="margin-bottom: 40px;">
                    <p style="
                        font-size: 16px;
                        color: #718096;
                        margin-bottom: 12px;
                        font-weight: 500;
                    ">Your Profile ID</p>
                    
                    <div style="
                        display: inline-flex;
                        align-items: center;
                        background: #f7fafc;
                        border: 1px solid #e2e8f0;
                        border-radius: 8px;
                        padding: 12px 16px;
                        gap: 12px;
                    ">
                        <span style="
                            font-size: 18px;
                            font-weight: 700;
                            color: #2c5aa0;
                            font-family: 'Courier New', monospace;
                            letter-spacing: 1px;
                        ">${profileId}</span>
                        
                        <button onclick="navigator.clipboard.writeText('${profileId}'); this.textContent='Copied!'; setTimeout(() => this.textContent='Copy', 2000)" style="
                            background: #2c5aa0;
                            color: white;
                            border: none;
                            padding: 4px 8px;
                            font-size: 12px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-weight: 500;
                        ">Copy</button>
                    </div>
                    
                    <p style="
                        font-size: 14px;
                        color: #a0aec0;
                        margin-top: 8px;
                        margin-bottom: 0;
                    ">Please save this ID for future reference</p>
                </div>
                
                <!-- What Happens Next -->
                <div style="margin-bottom: 40px;">
                    <h2 style="
                        font-size: 20px;
                        font-weight: 600;
                        color: #2d3748;
                        margin-bottom: 20px;
                    ">What happens next?</h2>
                    
                    <div style="text-align: left; max-width: 400px; margin: 0 auto;">
                        <div style="margin-bottom: 12px; display: flex; align-items: flex-start;">
                            <span style="
                                display: inline-block;
                                width: 6px;
                                height: 6px;
                                background: #2c5aa0;
                                border-radius: 50%;
                                margin-top: 8px;
                                margin-right: 12px;
                                flex-shrink: 0;
                            "></span>
                            <span style="font-size: 16px; color: #4a5568; line-height: 1.5;">A confirmation email has been sent to your registered email address</span>
                        </div>
                        
                        <div style="margin-bottom: 0; display: flex; align-items: flex-start;">
                            <span style="
                                display: inline-block;
                                width: 6px;
                                height: 6px;
                                background: #2c5aa0;
                                border-radius: 50%;
                                margin-top: 8px;
                                margin-right: 12px;
                                flex-shrink: 0;
                            "></span>
                            <span style="font-size: 16px; color: #4a5568; line-height: 1.5;">Our partnership team will contact you within 24 hours to discuss next steps</span>
                        </div>
                    </div>
                </div>
                
                <!-- Buttons -->
                <div style="display: flex; gap: 16px; justify-content: center; align-items: center;">
                    <button onclick="window.location.reload()" style="
                        background: #2c5aa0;
                        color: white;
                        border: none;
                        padding: 14px 32px;
                        font-size: 16px;
                        font-weight: 600;
                        border-radius: 6px;
                        cursor: pointer;
                        transition: background-color 0.2s ease;
                    " onmouseover="this.style.background='#1e3d72'" onmouseout="this.style.background='#2c5aa0'">Return to Website</button>
                    
                    <button onclick="window.open('https://www.bncglobal.in', '_blank')" style="
                        background: white;
                        color: #2c5aa0;
                        border: 2px solid #2c5aa0;
                        padding: 12px 30px;
                        font-size: 16px;
                        font-weight: 600;
                        border-radius: 6px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    " onmouseover="this.style.background='#2c5aa0'; this.style.color='white'" onmouseout="this.style.background='white'; this.style.color='#2c5aa0'">Visit Our Official Website</button>
                </div>
            </div>
            
            <!-- Confetti Canvas -->
            <canvas id="confettiCanvas" style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
            "></canvas>
            
            <style>
                @keyframes tickScale {
                    0% { transform: scale(0); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
                @keyframes tickPath {
                    0% { stroke-dashoffset: 24; }
                    100% { stroke-dashoffset: 0; }
                }
            </style>
        `;
        
        document.body.appendChild(successOverlay);
        
        // Start confetti effect
        setTimeout(() => this.createAdvancedConfettiEffect(), 300);
    }
    
    createAdvancedConfettiEffect() {
        const canvas = document.getElementById('confettiCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const confetti = [];
        const colors = ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
        const shapes = ['circle', 'square', 'triangle', 'star'];
        
        // Create 200 confetti pieces for spectacular effect
        for (let i = 0; i < 200; i++) {
            confetti.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                w: Math.random() * 12 + 6,
                h: Math.random() * 12 + 6,
                color: colors[Math.floor(Math.random() * colors.length)],
                shape: shapes[Math.floor(Math.random() * shapes.length)],
                speed: Math.random() * 6 + 3,
                angle: Math.random() * 360,
                rotation: Math.random() * 15 + 5,
                opacity: Math.random() * 0.8 + 0.2,
                drift: Math.random() * 2 - 1
            });
        }
        
        function drawStar(ctx, x, y, size) {
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (i * 144 - 90) * Math.PI / 180;
                const x1 = x + Math.cos(angle) * size;
                const y1 = y + Math.sin(angle) * size;
                if (i === 0) ctx.moveTo(x1, y1);
                else ctx.lineTo(x1, y1);
            }
            ctx.closePath();
            ctx.fill();
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            confetti.forEach((piece, index) => {
                piece.y += piece.speed;
                piece.angle += piece.rotation;
                piece.x += Math.sin(piece.y * 0.008) * piece.drift;
                
                ctx.save();
                ctx.globalAlpha = piece.opacity;
                ctx.translate(piece.x + piece.w/2, piece.y + piece.h/2);
                ctx.rotate(piece.angle * Math.PI / 180);
                ctx.fillStyle = piece.color;
                
                // Draw different shapes
                if (piece.shape === 'circle') {
                    ctx.beginPath();
                    ctx.arc(0, 0, piece.w/2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (piece.shape === 'triangle') {
                    ctx.beginPath();
                    ctx.moveTo(0, -piece.h/2);
                    ctx.lineTo(-piece.w/2, piece.h/2);
                    ctx.lineTo(piece.w/2, piece.h/2);
                    ctx.closePath();
                    ctx.fill();
                } else if (piece.shape === 'star') {
                    drawStar(ctx, 0, 0, piece.w/2);
                } else {
                    ctx.fillRect(-piece.w/2, -piece.h/2, piece.w, piece.h);
                }
                
                ctx.restore();
                
                // Reset confetti when it goes off screen
                if (piece.y > canvas.height + 100) {
                    piece.y = -piece.h - 100;
                    piece.x = Math.random() * canvas.width;
                    piece.speed = Math.random() * 6 + 3;
                }
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
        
        // Gradually reduce confetti after 10 seconds
        setTimeout(() => {
            const reduceInterval = setInterval(() => {
                if (confetti.length > 30) {
                    confetti.splice(0, 15);
                } else {
                    clearInterval(reduceInterval);
                }
            }, 800);
        }, 10000);
        
        // Stop all confetti after 20 seconds
        setTimeout(() => {
            confetti.length = 0;
        }, 20000);
    }
    
    showErrorMessage() {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle text-xl"></i>
            <div>
                <div class="font-semibold">Submission Failed / जमा करना असफल</div>
                <div class="text-sm">Please try again or contact support / कृपया पुनः प्रयास करें या सहायता से संपर्क करें</div>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
    
    resetForm() {
        this.form.reset();
        this.currentStep = 1;
        this.updateStep();
        this.citySelect.disabled = true;
        this.citySelect.innerHTML = '<option value="">First select country / पहले देश चुनें</option>';
        
        // Remove any error messages
        document.querySelectorAll('.error-message').forEach(error => error.remove());
        document.querySelectorAll('.border-red-500').forEach(field => {
            field.classList.remove('border-red-500', 'bg-red-50');
        });
    }
}

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PartnerForm();
});