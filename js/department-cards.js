// Modern Department Cards JavaScript Effects
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.department-card-glow');
    
    // Add modern interactive effects to each card
    cards.forEach(card => {
        // 3D tilt effect on mouse move
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        // Reset transform on mouse leave
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
        
        // Add ripple effect on click
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');
            
            card.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Floating animation
        const randomDelay = Math.random() * 2000;
        setTimeout(() => {
            card.classList.add('floating');
        }, randomDelay);
        
        // Parallax effect for icons
        const icon = card.querySelector('.department-icon-glow');
        if (icon) {
            card.addEventListener('mousemove', function(e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const moveX = (x - centerX) / 20;
                const moveY = (y - centerY) / 20;
                
                icon.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
            });
            
            card.addEventListener('mouseleave', function() {
                icon.style.transform = 'translate(0px, 0px) scale(1)';
            });
        }
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    cards.forEach(card => {
        observer.observe(card);
    });
    
    // Add magnetic effect
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const siblings = Array.from(card.parentElement.parentElement.children);
            siblings.forEach(sibling => {
                const siblingCard = sibling.querySelector('.department-card-glow');
                if (siblingCard && siblingCard !== card) {
                    siblingCard.style.transform = 'scale(0.95)';
                    siblingCard.style.opacity = '0.7';
                }
            });
        });
        
        card.addEventListener('mouseleave', function() {
            const siblings = Array.from(card.parentElement.parentElement.children);
            siblings.forEach(sibling => {
                const siblingCard = sibling.querySelector('.department-card-glow');
                if (siblingCard && siblingCard !== card) {
                    siblingCard.style.transform = 'scale(1)';
                    siblingCard.style.opacity = '1';
                }
            });
        });
    });
});

// Add smooth scroll to section when card is clicked
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.department-card-glow');
    
    cards.forEach(card => {
        card.addEventListener('click', function() {
            // You can add navigation logic here based on the card
            // const cardTitle = card.querySelector('.card-title').textContent.toLowerCase();
        });
    });
});