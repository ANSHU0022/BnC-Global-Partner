// Partner Form Handler for Vercel Deployment
class PartnerFormHandler {
    constructor() {
        this.apiUrl = CONFIG.API_BASE_URL + CONFIG.ENDPOINTS.PARTNER_FORM;
        this.currentStep = 1;
        this.totalSteps = 3;
        this.formData = {};
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupCountryCityData();
    }

    bindEvents() {
        // Form popup events
        const openFormBtn = document.getElementById('open-partner-form');
        const closeFormBtn = document.getElementById('close-partner-form');
        const popup = document.getElementById('partner-form-popup');

        if (openFormBtn) {
            openFormBtn.addEventListener('click', () => this.openForm());
        }
        if (closeFormBtn) {
            closeFormBtn.addEventListener('click', () => this.closeForm());
        }

        // Step navigation
        const nextBtn = document.getElementById('next-step');
        const prevBtn = document.getElementById('prev-step');
        const submitBtn = document.getElementById('submit-form');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextStep());
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevStep());
        }
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitForm());
        }

        // Country change event
        const countrySelect = document.getElementById('country-select');
        if (countrySelect) {
            countrySelect.addEventListener('change', () => this.updateCities());
        }
    }

    openForm() {
        const popup = document.getElementById('partner-form-popup');
        if (popup) {
            popup.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    closeForm() {
        const popup = document.getElementById('partner-form-popup');
        if (popup) {
            popup.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            this.saveCurrentStepData();
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.updateStepDisplay();
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
        }
    }

    validateCurrentStep() {
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
        
        for (let input of inputs) {
            if (!input.value.trim()) {
                input.focus();
                this.showError(`Please fill in ${input.previousElementSibling.textContent}`);
                return false;
            }
            
            // Email validation
            if (input.type === 'email' && !CONFIG.VALIDATION.EMAIL_REGEX.test(input.value)) {
                input.focus();
                this.showError('Please enter a valid email address');
                return false;
            }
            
            // Phone validation
            if (input.name === 'phone') {
                const phoneDigits = input.value.replace(/\D/g, '');
                if (phoneDigits.length < CONFIG.VALIDATION.MIN_PHONE_LENGTH) {
                    input.focus();
                    this.showError('Phone number must be at least 12 digits');
                    return false;
                }
            }
            
            // Password validation
            if (input.type === 'password' && input.value.length < CONFIG.VALIDATION.MIN_PASSWORD_LENGTH) {
                input.focus();
                this.showError('Password must be at least 6 characters');
                return false;
            }
        }
        
        return true;
    }

    saveCurrentStepData() {
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        const inputs = currentStepElement.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                this.formData[input.name] = input.checked;
            } else {
                this.formData[input.name] = input.value;
            }
        });
    }

    updateStepDisplay() {
        // Hide all steps
        for (let i = 1; i <= this.totalSteps; i++) {
            const step = document.getElementById(`step-${i}`);
            if (step) {
                step.classList.add('hidden');
            }
        }
        
        // Show current step
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        if (currentStepElement) {
            currentStepElement.classList.remove('hidden');
        }
        
        // Update progress
        const progress = (this.currentStep / this.totalSteps) * 100;
        const progressBar = document.getElementById('progress-bar');
        const stepText = document.getElementById('step-text');
        const progressText = document.getElementById('progress-text');
        
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (stepText) stepText.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
        if (progressText) progressText.textContent = `${Math.round(progress)}%`;
        
        // Update buttons
        const prevBtn = document.getElementById('prev-step');
        const nextBtn = document.getElementById('next-step');
        const submitBtn = document.getElementById('submit-form');
        
        if (prevBtn) {
            prevBtn.classList.toggle('hidden', this.currentStep === 1);
        }
        
        if (nextBtn && submitBtn) {
            if (this.currentStep === this.totalSteps) {
                nextBtn.classList.add('hidden');
                submitBtn.classList.remove('hidden');
            } else {
                nextBtn.classList.remove('hidden');
                submitBtn.classList.add('hidden');
            }
        }
    }

    async submitForm() {
        if (!this.validateCurrentStep()) return;
        
        this.saveCurrentStepData();
        
        try {
            const submitBtn = document.getElementById('submit-form');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Submitting...';
            }
            
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showSuccess(result.message);
                setTimeout(() => {
                    this.closeForm();
                    this.resetForm();
                }, 2000);
            } else {
                this.showError(result.message);
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showError('Network error. Please try again.');
        } finally {
            const submitBtn = document.getElementById('submit-form');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Submit Application <i class="fas fa-check ml-2"></i>';
            }
        }
    }

    setupCountryCityData() {
        this.countryCityData = {
            'India': ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'],
            'USA': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'],
            'UK': ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Sheffield'],
            'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton'],
            'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast'],
            'Germany': ['Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt', 'Stuttgart'],
            'France': ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes'],
            'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Kobe', 'Nagoya'],
            'China': ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Hangzhou'],
            'Singapore': ['Singapore']
        };
    }

    updateCities() {
        const countrySelect = document.getElementById('country-select');
        const citySelect = document.getElementById('city-select');
        
        if (!countrySelect || !citySelect) return;
        
        const selectedCountry = countrySelect.value;
        const cities = this.countryCityData[selectedCountry] || [];
        
        citySelect.innerHTML = '<option value="">Select City / शहर चुनें</option>';
        citySelect.disabled = cities.length === 0;
        
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }

    showError(message) {
        // Create or update error message
        let errorDiv = document.getElementById('form-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'form-error';
            errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4';
            const formContent = document.querySelector('#partner-form-popup .p-6');
            if (formContent) {
                formContent.insertBefore(errorDiv, formContent.firstChild);
            }
        }
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        
        setTimeout(() => {
            errorDiv.classList.add('hidden');
        }, 5000);
    }

    showSuccess(message) {
        // Create or update success message
        let successDiv = document.getElementById('form-success');
        if (!successDiv) {
            successDiv = document.createElement('div');
            successDiv.id = 'form-success';
            successDiv.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4';
            const formContent = document.querySelector('#partner-form-popup .p-6');
            if (formContent) {
                formContent.insertBefore(successDiv, formContent.firstChild);
            }
        }
        successDiv.textContent = message;
        successDiv.classList.remove('hidden');
    }

    resetForm() {
        this.currentStep = 1;
        this.formData = {};
        const form = document.getElementById('multi-step-form');
        if (form) {
            form.reset();
        }
        this.updateStepDisplay();
    }
}

// Initialize form handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.partnerFormHandler = new PartnerFormHandler();
});