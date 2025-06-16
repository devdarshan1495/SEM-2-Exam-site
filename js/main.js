document.addEventListener('DOMContentLoaded', () => {

    // --- Global Login Status Checker (NEW) ---
    // This function runs on every single page to check if the user is logged in.
    const checkLoginStatus = () => {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            document.body.classList.add('logged-in');
        } else {
            document.body.classList.remove('logged-in');
        }
    };
    checkLoginStatus(); // Run the check as soon as the page loads


    // --- Sign-In Page Logic (NEW) ---
    const signInForm = document.getElementById('signin-form');
    if (signInForm) {
        signInForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent the form from submitting the old way
            // In a real app, you'd verify password here. We'll just simulate success.
            localStorage.setItem('isLoggedIn', 'true');
            // Redirect to the profile page after "logging in"
            window.location.href = './profile.html';
        });
    }

    // --- Logout Button Logic (NEW) ---
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn'); // Clear the login status
            // Redirect to the homepage after logging out
            window.location.href = '../index.html';
        });
    }


    // --- Homepage Carousel ---
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        const slide = document.querySelector('.carousel-slide');
        const images = document.querySelectorAll('.carousel-slide img');
        const dotsContainer = document.querySelector('.carousel-dots');

        if (images.length > 0) {
            let currentIndex = 0;
            const totalImages = images.length;

            images.forEach((_, i) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    goToSlide(i);
                    resetInterval();
                });
                dotsContainer.appendChild(dot);
            });

            const dots = document.querySelectorAll('.carousel-dots .dot');

            const goToSlide = (index) => {
                slide.style.transform = `translateX(-${index * 100}%)`;
                if(dots.length > 0) {
                    dots.forEach(dot => dot.classList.remove('active'));
                    dots[index].classList.add('active');
                }
                currentIndex = index;
            };

            const nextSlide = () => {
                let nextIndex = (currentIndex + 1) % totalImages;
                goToSlide(nextIndex);
            };

            let autoPlayInterval = setInterval(nextSlide, 4000);

            const resetInterval = () => {
                clearInterval(autoPlayInterval);
                autoPlayInterval = setInterval(nextSlide, 4000);
            };
        }
    }

    // --- JS for Movie Page City Selector Modal ---
    const citySelectorInput = document.getElementById('city-selector-input');
    if (citySelectorInput) {
        const cityModal = document.getElementById('city-modal');
        if (cityModal) {
            const closeModalBtn = cityModal.querySelector('.modal-close');
            const cityChips = cityModal.querySelectorAll('.city-chip');
            const citySearchInput = document.getElementById('city-search-input');
            const allCitiesListItems = cityModal.querySelectorAll('#all-cities-list li');
            
            const openModal = () => cityModal.style.display = 'flex';
            const closeModal = () => cityModal.style.display = 'none';

            citySelectorInput.addEventListener('click', openModal);
            closeModalBtn.addEventListener('click', closeModal);
            cityModal.addEventListener('click', (e) => {
                if (e.target === cityModal) closeModal();
            });

            const selectCity = (cityName) => {
                citySelectorInput.value = cityName;
                closeModal();
            };

            cityChips.forEach(chip => chip.addEventListener('click', () => selectCity(chip.textContent)));
            allCitiesListItems.forEach(item => item.addEventListener('click', () => selectCity(item.textContent)));

            citySearchInput.addEventListener('keyup', () => {
                const filter = citySearchInput.value.toUpperCase();
                allCitiesListItems.forEach(item => {
                    const cityName = item.textContent || item.innerText;
                    item.style.display = cityName.toUpperCase().indexOf(filter) > -1 ? "" : "none";
                });
            });
        }
    }
    
    // --- JS for Seat Selection Page ---
    const seatingChart = document.getElementById('seating-chart');
    if (seatingChart) {
        const seatCountEl = document.getElementById('seat-count');
        const totalPriceEl = document.getElementById('total-price');
        const TICKET_PRICE = 250; 

        const updateSummary = () => {
            const selectedSeats = seatingChart.querySelectorAll('.seat.selected');
            const count = selectedSeats.length;
            seatCountEl.innerText = count;
            totalPriceEl.innerText = count * TICKET_PRICE;
        };

        seatingChart.addEventListener('click', (e) => {
            if (e.target.classList.contains('seat') && !e.target.classList.contains('unavailable')) {
                e.target.classList.toggle('selected');
                updateSummary();
            }
        });
        
        updateSummary();
    }
    
    // --- JS for Payment Page Accordion & Modal ---
    const accordion = document.querySelector('.payment-accordion');
    if (accordion) {
        const accordionItems = accordion.querySelectorAll('.accordion-item');
        const paymentButtons = document.querySelectorAll('.accordion-item .btn-primary'); // More specific selector
        const confirmationModal = document.getElementById('confirmation-modal');

        // Accordion logic
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            header.addEventListener('click', () => {
                const isOpen = item.classList.contains('is-open');
                accordionItems.forEach(i => i.classList.remove('is-open'));
                if (!isOpen) {
                    item.classList.add('is-open');
                }
            });
        });

        // Modal logic
        if (confirmationModal) {
            const showModal = () => {
                confirmationModal.style.display = 'flex';
                setTimeout(() => {
                    confirmationModal.classList.add('is-visible');
                }, 10);
            };

            paymentButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault(); 
                    showModal();
                });
            });
        }
    }

    // --- Mobile Navbar Logic ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.getElementById('mobile-menu-close');
    const mobileOverlay = document.getElementById('mobile-menu-overlay');

    if (hamburgerBtn && mobileMenu && closeMenuBtn) {
        const openMobileMenu = () => {
            hamburgerBtn.classList.add('active');
            mobileMenu.classList.add('is-open');
            if (mobileOverlay) mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        };

        const closeMobileMenu = () => {
            hamburgerBtn.classList.remove('active');
            mobileMenu.classList.remove('is-open');
            if (mobileOverlay) mobileOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        };

        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openMobileMenu();
        });

        closeMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeMobileMenu();
        });

        // Close menu when clicking overlay
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', closeMobileMenu);
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburgerBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });
    }

    // --- SIP Calculator Logic (Investments Page) ---
    const sipCalculator = document.querySelector('.sip-calculator');
    if (sipCalculator) {
        const monthlyAmountSlider = document.getElementById('monthlyAmount');
        const investmentPeriodSlider = document.getElementById('investmentPeriod');
        const expectedReturnSlider = document.getElementById('expectedReturn');
        
        const monthlyAmountValue = monthlyAmountSlider?.nextElementSibling;
        const investmentPeriodValue = investmentPeriodSlider?.nextElementSibling;
        const expectedReturnValue = expectedReturnSlider?.nextElementSibling;
        
        const totalInvestmentSpan = document.getElementById('totalInvestment');
        const totalReturnsSpan = document.getElementById('totalReturns');
        const maturityAmountSpan = document.getElementById('maturityAmount');

        // Function to calculate SIP returns
        const calculateSIP = () => {
            if (!monthlyAmountSlider || !investmentPeriodSlider || !expectedReturnSlider) return;
            
            const monthlyAmount = parseInt(monthlyAmountSlider.value);
            const years = parseInt(investmentPeriodSlider.value);
            const annualReturn = parseFloat(expectedReturnSlider.value);
            
            const months = years * 12;
            const monthlyReturn = annualReturn / 12 / 100;
            
            // SIP formula: M = P × (((1 + i)^n - 1) / i) × (1 + i)
            const maturityAmount = monthlyAmount * (((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn) * (1 + monthlyReturn));
            const totalInvestment = monthlyAmount * months;
            const totalReturns = maturityAmount - totalInvestment;
            
            // Update display values
            if (monthlyAmountValue) monthlyAmountValue.textContent = `₹${monthlyAmount.toLocaleString()}`;
            if (investmentPeriodValue) investmentPeriodValue.textContent = `${years} years`;
            if (expectedReturnValue) expectedReturnValue.textContent = `${annualReturn}% p.a.`;
            
            if (totalInvestmentSpan) totalInvestmentSpan.textContent = `₹${totalInvestment.toLocaleString()}`;
            if (totalReturnsSpan) totalReturnsSpan.textContent = `₹${Math.round(totalReturns).toLocaleString()}`;
            if (maturityAmountSpan) maturityAmountSpan.textContent = `₹${Math.round(maturityAmount).toLocaleString()}`;
        };

        // Add event listeners to sliders
        if (monthlyAmountSlider) {
            monthlyAmountSlider.addEventListener('input', calculateSIP);
        }
        if (investmentPeriodSlider) {
            investmentPeriodSlider.addEventListener('input', calculateSIP);
        }
        if (expectedReturnSlider) {
            expectedReturnSlider.addEventListener('input', calculateSIP);
        }

        // Initial calculation
        calculateSIP();
    }

    // --- Investment Cards Animation on Scroll ---
    const investmentCards = document.querySelectorAll('.investment-card');
    if (investmentCards.length > 0) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, observerOptions);

        investmentCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    // --- Portfolio Cards Hover Effects ---
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    portfolioCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // --- Market Updates Real-time Animation ---
    const marketCards = document.querySelectorAll('.market-card');
    if (marketCards.length > 0) {
        // Simulate real-time market updates
        setInterval(() => {
            marketCards.forEach(card => {
                const changeSpan = card.querySelector('.index-change');
                if (changeSpan && Math.random() > 0.7) { // 30% chance to update
                    changeSpan.style.transform = 'scale(1.1)';
                    changeSpan.style.transition = 'transform 0.3s ease';
                    
                    setTimeout(() => {
                        changeSpan.style.transform = 'scale(1)';
                    }, 300);
                }
            });
        }, 5000); // Update every 5 seconds
    }

    // --- Investment Action Buttons ---
    const investmentButtons = document.querySelectorAll('.investment-btn');
    investmentButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Add click animation
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
            
            // Show a simple alert (in a real app, this would navigate to the investment page)
            const investmentType = button.closest('.investment-card').querySelector('h3').textContent;
            alert(`Redirecting to ${investmentType} investment page...`);
        });
    });

    // --- Hero CTA Buttons ---
    const heroButtons = document.querySelectorAll('.hero-btn, .hero-btn-secondary');
    heroButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (button.textContent.includes('Start Investing')) {
                alert('Welcome to your investment journey! 🚀\n\nThis would typically redirect to the investment onboarding process.');
            } else if (button.textContent.includes('Learn More')) {
                alert('📚 Learning Center\n\nThis would open our comprehensive investment education portal.');
            }
        });
    });

    // --- Add Money/Withdraw Quick Actions ---
    const quickActionButtons = document.querySelectorAll('.quick-action-btn');
    quickActionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const action = button.textContent.trim();
            if (action === 'Add Money') {
                alert('💰 Add Money\n\nThis would open the wallet top-up interface.');
            } else if (action === 'Withdraw') {
                alert('🏦 Withdraw Funds\n\nThis would open the withdrawal interface.');
            }
        });
    });

    // --- Portfolio Action Buttons ---
    const portfolioActionButtons = document.querySelectorAll('.portfolio-btn, .add-investment-btn');
    portfolioActionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (button.textContent.includes('View Details')) {
                alert('📊 Portfolio Details\n\nThis would open your detailed portfolio analysis.');
            } else if (button.textContent.includes('Add Investment')) {
                alert('➕ Add New Investment\n\nThis would open the investment selection wizard.');
            }
        });
    });

    // --- Insurance Page Functionality ---
    
    // Insurance Calculator
    const insuranceCalculator = document.querySelector('.insurance-calculator');
    if (insuranceCalculator) {
        const calculateBtn = document.querySelector('.calculate-btn');
        const resultAmount = document.querySelector('.result-amount');
        const insuranceTypeSelect = document.querySelector('.calculator-input[placeholder*="Insurance"]');
        const ageInput = document.querySelector('.calculator-input[placeholder*="Age"]');
        const coverageSelect = document.querySelector('.calculator-input:nth-child(1)');
        const termSelect = document.querySelector('.calculator-input:nth-child(2)');

        if (calculateBtn) {
            calculateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Simple premium calculation logic
                const baseAmounts = {
                    'Health Insurance': 500,
                    'Car Insurance': 2500,
                    'Bike Insurance': 500,
                    'Life Insurance': 400
                };

                const coverageMultipliers = {
                    '₹5 Lakh': 1,
                    '₹10 Lakh': 1.8,
                    '₹25 Lakh': 4,
                    '₹50 Lakh': 7,
                    '₹1 Crore': 12
                };

                const selectedType = insuranceTypeSelect?.value || 'Health Insurance';
                const selectedCoverage = coverageSelect?.value || '₹5 Lakh';
                const age = parseInt(ageInput?.value) || 25;
                
                const baseAmount = baseAmounts[selectedType] || 500;
                const coverageMultiplier = coverageMultipliers[selectedCoverage] || 1;
                const ageMultiplier = age > 40 ? 1.5 : age > 30 ? 1.2 : 1;
                
                const calculatedPremium = Math.round(baseAmount * coverageMultiplier * ageMultiplier);
                
                if (resultAmount) {
                    resultAmount.textContent = `₹ ${calculatedPremium.toLocaleString()}`;
                    
                    // Add animation
                    resultAmount.style.transform = 'scale(1.1)';
                    resultAmount.style.color = '#00b9f5';
                    setTimeout(() => {
                        resultAmount.style.transform = 'scale(1)';
                    }, 300);
                }
                
                // Show success message
                showNotification('Premium calculated successfully! 🎉', 'success');
            });
        }
    }

    // Insurance Card Interactions
    const insuranceCards = document.querySelectorAll('.insurance-card');
    insuranceCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
        
        // Quote button functionality
        const quoteBtn = card.querySelector('.insurance-btn');
        if (quoteBtn) {
            quoteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const insuranceType = card.querySelector('h3').textContent;
                const price = card.querySelector('.price').textContent;
                
                // Add click animation
                quoteBtn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    quoteBtn.style.transform = 'scale(1)';
                }, 150);
                
                showNotification(`Getting quote for ${insuranceType}... 📋`, 'info');
                
                // Simulate quote process
                setTimeout(() => {
                    alert(`🛡️ ${insuranceType} Quote\n\n${price}\n\nFeatures included:\n• Comprehensive coverage\n• 24/7 support\n• Quick claims\n\nThis would redirect to the quote form.`);
                }, 1000);
            });
        }
    });

    // Hero CTA Buttons
    const insuranceHeroButtons = document.querySelectorAll('.insurance-hero .hero-btn, .insurance-hero .hero-btn-secondary');
    insuranceHeroButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (button.textContent.includes('Get Instant Quote')) {
                showNotification('Opening quote wizard... 🚀', 'success');
                setTimeout(() => {
                    alert('🛡️ Insurance Quote Wizard\n\nThis would open our step-by-step quote wizard to help you find the perfect insurance plan.');
                }, 500);
            } else if (button.textContent.includes('Compare Plans')) {
                showNotification('Loading plan comparison... 📊', 'info');
                setTimeout(() => {
                    alert('📊 Plan Comparison Tool\n\nThis would open our comprehensive plan comparison interface.');
                }, 500);
            }
        });
    });

    // Benefit Cards Animation on Scroll
    const benefitCards = document.querySelectorAll('.benefit-card');
    if (benefitCards.length > 0) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, observerOptions);

        benefitCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    // Partner Logos Hover Effects
    const partnerLogos = document.querySelectorAll('.partner-logo');
    partnerLogos.forEach(logo => {
        logo.addEventListener('mouseenter', () => {
            logo.style.transform = 'translateY(-5px) scale(1.05)';
            logo.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        });
        
        logo.addEventListener('mouseleave', () => {
            logo.style.transform = 'translateY(0) scale(1)';
            logo.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        });
    });

    // Notification system for insurance page
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.insurance-notification');
        existingNotifications.forEach(notif => notif.remove());
        
        const notification = document.createElement('div');
        notification.className = `insurance-notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
        });
        
        // Set background color based on type
        const colors = {
            success: '#4caf50',
            info: '#2196f3',
            warning: '#ff9800',
            error: '#f44336'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
});
