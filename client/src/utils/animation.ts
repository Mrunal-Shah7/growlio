
// Animation utility functions for smooth transitions and interactions

/**
 * Apply staggered animation to a series of elements
 * @param selector CSS selector for the elements
 * @param animation Class to apply
 * @param staggerMs Millisecond delay between each element
 * @param initialDelayMs Initial delay before starting animations
 */
export const applyStaggeredAnimation = (
  selector: string, 
  animation: string, 
  staggerMs = 50, 
  initialDelayMs = 0
) => {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add(animation);
    }, initialDelayMs + (index * staggerMs));
  });
};

/**
 * Apply a smooth fade-in animation to elements as they enter the viewport
 */
export const initInViewAnimations = () => {
  if (typeof IntersectionObserver === 'undefined') return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  const elements = document.querySelectorAll('.animate-on-scroll');
  elements.forEach(el => observer.observe(el));
};

/**
 * Creates a smooth counter animation
 * @param element The element to update
 * @param startValue Starting value
 * @param endValue Target value
 * @param duration Duration in milliseconds
 * @param formatter Function to format the displayed value
 */
export const animateCounter = (
  element: HTMLElement, 
  startValue: number, 
  endValue: number, 
  duration = 1000,
  formatter = (value: number) => value.toLocaleString()
) => {
  const startTime = performance.now();
  const difference = endValue - startValue;
  
  const updateCounter = (currentTime: number) => {
    const elapsedTime = currentTime - startTime;
    
    if (elapsedTime < duration) {
      const percentage = elapsedTime / duration;
      // Using easeOutQuart for a nice slowing effect
      const easing = 1 - Math.pow(1 - percentage, 4);
      const currentValue = startValue + (difference * easing);
      
      element.textContent = formatter(currentValue);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = formatter(endValue);
    }
  };
  
  requestAnimationFrame(updateCounter);
};

/**
 * Apply a pulsing highlight effect to draw attention to an element
 * @param element Element to highlight
 * @param duration Duration in milliseconds
 */
export const pulsingHighlight = (element: HTMLElement, duration = 2000) => {
  element.classList.add('transition-all', 'duration-1000');
  element.classList.add('ring-2', 'ring-primary', 'ring-opacity-100');
  
  setTimeout(() => {
    element.classList.remove('ring-opacity-100');
    element.classList.add('ring-opacity-0');
    
    setTimeout(() => {
      element.classList.remove('ring-2', 'ring-primary', 'ring-opacity-0', 'transition-all', 'duration-1000');
    }, 1000);
  }, duration - 1000);
};

/**
 * Initialize all animations when component mounts
 */
export const initializeAnimations = () => {
  // Apply slide-up animation to cards with a stagger
  applyStaggeredAnimation('.stat-card', 'animate-slide-up', 100, 100);
  applyStaggeredAnimation('.chart-card', 'animate-slide-up', 150, 300);
  
  // Initialize animations for elements entering the viewport
  initInViewAnimations();
};
