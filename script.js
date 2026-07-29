/* 
========================================================================
   PORTFOLIO LOGIC & INTERACTION
   Pasupuleti Ganesh Naga Thirumala Naidu - Portfolio Javascript
========================================================================
*/

// =====================================================================
// GLOBAL CONFIGURATION
// Modify these URLs to update links throughout the entire portfolio.
// =====================================================================
const SOCIAL_LINKS = {
    linkedin: "https://www.linkedin.com/in/ganesh-pasupuleti/",
    github: "https://github.com/GANESH80-HUB"
};

const PROJECT_LINKS = {
    evidenceReview: {
        github: "#", // Add GitHub URL when ready
        demo: "#"    // Add Live Demo URL when ready
    },
    emailGenerator: {
        github: "#",
        demo: "#"
    },
    safnex: {
        github: "#",
        demo: "#"
    }
};

function initPortfolio() {
    
    // =================================================================
    // 0. BIND CONFIGURABLE SOCIAL & PROJECT LINKS
    // =================================================================
    // Map Social URLs
    document.querySelectorAll('.social-link-linkedin').forEach(el => {
        el.setAttribute('href', SOCIAL_LINKS.linkedin);
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
    });

    document.querySelectorAll('.social-link-github').forEach(el => {
        el.setAttribute('href', SOCIAL_LINKS.github);
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
    });

    // Map Project URLs
    document.querySelectorAll('.project-card').forEach(card => {
        const projectKey = card.getAttribute('data-project-key');
        if (projectKey && PROJECT_LINKS[projectKey]) {
            const config = PROJECT_LINKS[projectKey];
            const githubBtn = card.querySelector('.btn-github');
            const demoBtn = card.querySelector('.btn-demo');
            
            if (githubBtn && config.github) {
                githubBtn.setAttribute('href', config.github);
            }
            if (demoBtn && config.demo) {
                demoBtn.setAttribute('href', config.demo);
            }
        }
    });

    // =================================================================
    // 1. PROJECT LINKS FILTERING
    // =================================================================
    // Automatically hide project buttons if their URL is empty, "#", or missing.
    const projectButtons = document.querySelectorAll('.btn-project');
    projectButtons.forEach(btn => {
        // Skip case study details buttons as they are interactive trigger buttons
        if (btn.classList.contains('btn-details')) return;

        const href = btn.getAttribute('href');
        if (!href || href === '#' || href === '') {
            btn.style.display = 'none';
        }
    });

    // =================================================================
    // 2. MOBILE MENU NAVIGATION
    // =================================================================
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when a nav link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // =================================================================
    // 2.5 SMOOTH SCROLL WITH HEADER OFFSET
    // =================================================================
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Ignore empty anchor tags
            
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight || 72;
                const elementPosition = targetEl.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight + 5;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =================================================================
    // 3. STICKY HEADER & BACK-TO-TOP BUTTON
    // =================================================================
    const header = document.querySelector('.header');
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    window.addEventListener('scroll', () => {
        // Sticky Header scroll styling
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to Top button visibility
        if (window.scrollY > 600) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    // Back to top scroll execution
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // =================================================================
    // 4. TYPING TEXT CAROUSEL
    // =================================================================
    const typingTarget = document.getElementById('typing-target');
    const skills = [
        "Generative AI",
        "Frontend Development",
        "Vision-Language Models",
        "Cloud Computing",
        "AWS Cloud Operations"
    ];
    let skillIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentSkill = skills[skillIndex];
        
        if (isDeleting) {
            // Delete characters
            typingTarget.textContent = currentSkill.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deleting is faster
        } else {
            // Write characters
            typingTarget.textContent = currentSkill.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // Normal typing speed
        }

        // State switching logic
        if (!isDeleting && charIndex === currentSkill.length) {
            // Pause at the end of the word
            isDeleting = true;
            typingSpeed = 2000; 
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            // Move to next word in cycle
            skillIndex = (skillIndex + 1) % skills.length;
            typingSpeed = 500; 
        }

        setTimeout(typeEffect, typingSpeed);
    }
    
    // Start the typing loop
    if (typingTarget) {
        typeEffect();
    }

    // =================================================================
    // 5. INTERSECTION OBSERVER FOR ACTIVE NAVBAR LINKS & SCROLL REVEALS
    // =================================================================
    const sections = document.querySelectorAll('section');
    
    // Active Link Observer Options
    const navObserverOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies center screen
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // Scroll Reveal Observer (Animate sections into view)
    const revealItems = document.querySelectorAll('.scroll-reveal');
    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger animation once
            }
        });
    }, revealObserverOptions);

    revealItems.forEach(item => {
        revealObserver.observe(item);
    });

    // =================================================================
    // 6. VANILLA JS 3D CARD TILT EFFECT
    // =================================================================
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // Mouse x position relative to card
            const y = e.clientY - rect.top;  // Mouse y position relative to card
            
            const cardWidth = rect.width;
            const cardHeight = rect.height;
            
            // Calculate percentage from center of card
            const rotateX = -((y - cardHeight / 2) / (cardHeight / 2)) * 10; // Max rotation 10 deg
            const rotateY = ((x - cardWidth / 2) / (cardWidth / 2)) * 10;
            
            // Apply transformation
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        // Reset transformation when mouse leaves card
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // =================================================================
    // 6.2 CASE STUDY MODAL DIALOGS
    // =================================================================
    const modalButtons = document.querySelectorAll('.btn-details');
    const closeButtons = document.querySelectorAll('.modal-close');
    const modalOverlays = document.querySelectorAll('.modal-overlay');

    modalButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-modal-target');
            const targetModal = document.getElementById(targetId);
            if (targetModal) {
                targetModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Stop background scroll
                
                // Focus closer for keyboard tab loops
                const closeBtn = targetModal.querySelector('.modal-close');
                if (closeBtn) closeBtn.focus();
            }
        });
    });

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scroll
    }

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(btn.closest('.modal-overlay'));
        });
    });

    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay);
            }
        });
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modalOverlays.forEach(overlay => {
                if (overlay.classList.contains('active')) {
                    closeModal(overlay);
                }
            });
        }
    });

    // =================================================================
    // 6.5 DEVELOPER TERMINAL SIMULATOR
    // =================================================================
    const termInput = document.getElementById('terminal-input');
    const termHistory = document.getElementById('terminal-history');
    const termBody = document.getElementById('terminal-body');

    if (termInput) {
        // Auto focus input when clicking terminal body
        termBody.addEventListener('click', () => {
            termInput.focus();
        });

        termInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = termInput.value.trim().toLowerCase();
                termInput.value = ''; // Reset input text

                // Write command into console history
                const promptLine = document.createElement('div');
                promptLine.className = 'terminal-line';
                promptLine.innerHTML = `<span class="terminal-prompt">ganesh@portfolio:~$</span> <span class="output-line">${escapeHTML(command)}</span>`;
                termHistory.appendChild(promptLine);

                if (command !== '') {
                    executeTerminalCommand(command);
                }

                // Smooth scroll to bottom
                termBody.scrollTop = termBody.scrollHeight;
            }
        });
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    function executeTerminalCommand(cmd) {
        let outputHTML = '';
        let isError = false;

        switch (cmd) {
            case 'help':
                outputHTML = 'Available commands:<br><span class="highlight-cmd">whoami</span> - Display profile overview<br><span class="highlight-cmd">skills</span> - Display tech stack categories<br><span class="highlight-cmd">projects</span> - List current projects featured<br><span class="highlight-cmd">learning</span> - Show active courses in progress<br><span class="highlight-cmd">contact</span> - Show social configs and direct email links<br><span class="highlight-cmd">clear</span> - Wipes terminal line history';
                break;
            case 'whoami':
                outputHTML = 'Ganesh<br>Computer Science & AI Student';
                break;
            case 'skills':
                outputHTML = 'Python, Java, JavaScript, Generative AI, Prompt Engineering, VLM, SQL, HTML, CSS';
                break;
            case 'projects':
                outputHTML = '1. Multi-Modal Evidence Review System<br>2. AI Email Generator<br>3. SAFNEX';
                break;
            case 'learning':
                outputHTML = 'AWS Cloud Operations<br>Certification course currently in progress.';
                break;
            case 'contact':
                outputHTML = `Email: <a href="mailto:ganesh242468@gmail.com" class="output-line" style="text-decoration: underline;">ganesh242468@gmail.com</a><br>LinkedIn: <a href="${SOCIAL_LINKS.linkedin}" target="_blank" rel="noopener noreferrer" class="output-line" style="text-decoration: underline;">linkedin.com/in/ganesh-pasupuleti/</a><br>GitHub: <a href="${SOCIAL_LINKS.github}" target="_blank" rel="noopener noreferrer" class="output-line" style="text-decoration: underline;">github.com/GANESH80-HUB</a>`;
                break;
            case 'clear':
                termHistory.innerHTML = '';
                return;
            case 'hello':
                outputHTML = 'Hello! 👋<br>Welcome to Ganesh\'s portfolio.';
                break;
            case 'coffee':
                outputHTML = 'Turning coffee into code... ☕ → &lt;/&gt;';
                break;
            default:
                outputHTML = `Command not found: <span class="error-line">${escapeHTML(cmd)}</span>. Type <span class="highlight-cmd">help</span> for assistance.`;
                isError = true;
                break;
        }

        const outLine = document.createElement('div');
        outLine.className = isError ? 'terminal-line error-line' : 'terminal-line output-line';
        outLine.innerHTML = outputHTML;
        termHistory.appendChild(outLine);
    }

    // =================================================================
    // 7. THREE.JS 3D INTERACTIVE HERO
    // =================================================================
    const canvas = document.getElementById('hero-canvas');
    if (canvas && typeof THREE !== 'undefined') {
        initThreeJS(canvas);
    } else {
        console.warn("Three.js not loaded or canvas missing. Falling back gracefully.");
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
    initPortfolio();
}

/**
 * Initializes Three.js 3D sphere node particle mesh
 */
function initThreeJS(canvasElement) {
    const parent = canvasElement.parentElement;
    let width = parent.clientWidth || window.innerWidth / 2;
    let height = parent.clientHeight || window.innerHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 4.5;

    // 3. Renderer setup (set transparent background)
    const renderer = new THREE.WebGLRenderer({
        canvas: canvasElement,
        antialias: true,
        alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Create Group to hold all mesh parts (simplifies rotations)
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    // 5. Build Outer Particle Node Cloud
    const particleGeometry = new THREE.SphereGeometry(1.6, 20, 20);
    const particleCount = particleGeometry.attributes.position.count;
    
    // Custom particle texture (a simple glowing dot)
    // Generating dot programmatically using canvas texture to avoid image assets loading dependencies
    const canvasTexture = document.createElement('canvas');
    canvasTexture.width = 16;
    canvasTexture.height = 16;
    const ctx = canvasTexture.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(6, 182, 212, 0.8)'); // Cyan glow
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    
    const dotTexture = new THREE.CanvasTexture(canvasTexture);

    const pointsMaterial = new THREE.PointsMaterial({
        color: 0x06b6d4, // Cyan
        size: 0.12,
        map: dotTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const nodeCloud = new THREE.Points(particleGeometry, pointsMaterial);
    heroGroup.add(nodeCloud);

    // 6. Build Inner Technology Wireframe Mesh (Icosahedron)
    const wireframeGeometry = new THREE.IcosahedronGeometry(1.58, 2);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x6366f1, // Indigo
        wireframe: true,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending
    });
    
    const innerWireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    heroGroup.add(innerWireframe);

    // 7. Mouse movements tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    // 6.1 Build Technology Nodes
    const TECH_NODES_CONFIG = [
        { name: "Python", target: "#skills" },
        { name: "Java", target: "#skills" },
        { name: "JavaScript", target: "#skills" },
        { name: "Generative AI", target: "#projects" },
        { name: "Gemini", target: "#projects" },
        { name: "VLM", target: "#projects" },
        { name: "SQL", target: "#skills" },
        { name: "HTML", target: "#skills" },
        { name: "CSS", target: "#skills" },
        { name: "Git", target: "#skills" },
        { name: "Figma", target: "#projects" },
        { name: "AWS", status: "Currently Learning", target: "#building-learning" }
    ];

    const nodeCount = TECH_NODES_CONFIG.length;
    const R = 1.6;
    const interactiveMeshes = [];

    for (let i = 0; i < nodeCount; i++) {
        const config = TECH_NODES_CONFIG[i];
        // Fibonacci spiral coordinate layout on sphere
        const theta = Math.acos(1 - 2 * (i + 0.5) / nodeCount);
        const phi = Math.PI * (1 + Math.sqrt(5)) * i;

        const x = R * Math.cos(phi) * Math.sin(theta);
        const y = R * Math.sin(phi) * Math.sin(theta);
        const z = R * Math.cos(theta);

        // Nodes visual representation
        const nodeColor = (config.name === "AWS") ? 0xf59e0b : 0x06b6d4; // Amber for AWS, Cyan for others
        const nodeGeom = new THREE.SphereGeometry(0.065, 16, 16);
        const nodeMat = new THREE.MeshBasicMaterial({
            color: nodeColor,
            transparent: true,
            opacity: 0.85
        });
        
        const nodeMesh = new THREE.Mesh(nodeGeom, nodeMat);
        nodeMesh.position.set(x, y, z);
        nodeMesh.userData = { config: config, originalColor: nodeColor };
        
        heroGroup.add(nodeMesh);
        interactiveMeshes.push(nodeMesh);
    }


    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const tooltip = document.getElementById('three-tooltip');
    let hoveredNode = null;

    // Track mouse coordinates for standard sphere tilt + raycaster intersection
    window.addEventListener('mousemove', (e) => {
        const canvasRect = canvasElement.getBoundingClientRect();
        mouse.x = ((e.clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
        mouse.y = -((e.clientY - canvasRect.top) / canvasRect.height) * 2 + 1;
        
        // Standard global mouse coordinates (for auto-spin damping, keep mouseX/mouseY)
        targetMouseX = (e.clientX / window.innerWidth) - 0.5;
        targetMouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    // Handle clicks on key technology nodes
    canvasElement.addEventListener('click', (e) => {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactiveMeshes);
        
        if (intersects.length > 0) {
            const node = intersects[0].object;
            const config = node.userData.config;
            if (config && config.target) {
                const targetEl = document.querySelector(config.target);
                if (targetEl) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.header').offsetHeight || 72;
                    const elementPosition = targetEl.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight + 5;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        }
    });

    // 8. Auto-Rotation offsets
    let rotationTimeX = 0;
    let rotationTimeY = 0;

    // Page Visibility API tracking to pause ThreeJS when tab inactive
    let isTabVisible = true;
    document.addEventListener('visibilitychange', () => {
        isTabVisible = (document.visibilityState === 'visible');
    });

    // 9. Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        // Pause loop if tab is backgrounded
        if (!isTabVisible) return;

        // Auto slow rot
        rotationTimeX += 0.0012;
        rotationTimeY += 0.0018;

        // Smooth mouse dampening (Lerp)
        currentMouseX += (targetMouseX - currentMouseX) * 0.05;
        currentMouseY += (targetMouseY - currentMouseY) * 0.05;

        // Apply combine rotation (Auto Spin + Mouse interactive coordinates tilt)
        heroGroup.rotation.y = rotationTimeY + (currentMouseX * 0.7);
        heroGroup.rotation.x = rotationTimeX + (currentMouseY * 0.7);

        // Pulsating glowing mesh effect
        const scaleVal = 1.0 + Math.sin(rotationTimeY * 2) * 0.03;
        innerWireframe.scale.set(scaleVal, scaleVal, scaleVal);

        // Raycasting & tooltip mapping (Only run on desktop screen sizes)
        const isMobile = window.innerWidth < 768;
        if (!isMobile) {
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(interactiveMeshes);

            if (intersects.length > 0) {
                const node = intersects[0].object;
                
                if (hoveredNode !== node) {
                    if (hoveredNode) {
                        hoveredNode.material.color.setHex(hoveredNode.userData.originalColor);
                        hoveredNode.scale.set(1, 1, 1);
                    }
                    hoveredNode = node;
                    node.material.color.setHex(0xffffff); // Glowing highlight white
                    node.scale.set(1.4, 1.4, 1.4);
                    
                    // Trigger cursor changes
                    canvasElement.style.cursor = 'pointer';
                }

                // Show tooltip overlay
                const config = node.userData.config;
                let labelText = config.name;
                if (config.status) {
                    labelText += `\n(${config.status})`;
                }
                tooltip.textContent = labelText;

                // Project world 3D position to 2D coordinates on window viewport
                const tempV = new THREE.Vector3();
                node.getWorldPosition(tempV);
                tempV.project(camera);

                const canvasRect = canvasElement.getBoundingClientRect();
                const x = (tempV.x * 0.5 + 0.5) * canvasRect.width + canvasRect.left;
                const y = -(tempV.y * 0.5 - 0.5) * canvasRect.height + canvasRect.top;

                tooltip.style.left = `${x}px`;
                tooltip.style.top = `${y}px`;
                tooltip.classList.add('visible');
            } else {
                if (hoveredNode) {
                    hoveredNode.material.color.setHex(hoveredNode.userData.originalColor);
                    hoveredNode.scale.set(1, 1, 1);
                    hoveredNode = null;
                    canvasElement.style.cursor = 'default';
                }
                tooltip.classList.remove('visible');
            }
        } else {
            // Keep cursor default and tooltip hidden on mobile
            if (hoveredNode) {
                hoveredNode.material.color.setHex(hoveredNode.userData.originalColor);
                hoveredNode.scale.set(1, 1, 1);
                hoveredNode = null;
            }
            tooltip.classList.remove('visible');
        }

        renderer.render(scene, camera);
    }

    animate();

    // 10. Handle window resizing responsive triggers
    window.addEventListener('resize', () => {
        const newWidth = parent.clientWidth || window.innerWidth / 2;
        const newHeight = parent.clientHeight || window.innerHeight;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(newWidth, newHeight);
    });
}
