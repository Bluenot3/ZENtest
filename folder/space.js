"use client"

import { useEffect, useRef } from "react"

export default function ZenVisualization() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Add the HTML structure
    containerRef.current.innerHTML = `
      <!-- Simulation Section -->
      <div id="canvas-container">
        <div id="container"></div>
      </div>
      
      <!-- Fixed Menu Buttons -->
      <div id="menu-container">
        <a class="curved-button" id="left-button" href="https://www.zenai.world/blog" target="_blank">Quantum Times</a>
        <a class="curved-button" id="center-button" href="https://www.zenai.world/zenaccount/my/my-accountinto" target="_blank">My Account</a>
        <a class="curved-button" id="right-button" href="https://www.zenai.world/zenx" target="_blank">ZenX</a>
      </div>
      
      <!-- Navigation Arrows -->
      <div class="scroll-arrow" id="bottom-arrow">&#x2193;</div>
      <div class="scroll-arrow" id="left-arrow">&#x2193;</div>
      
      <!-- Tooltip -->
      <div id="tooltip">Double-click to interact with ZEN</div>
    `

    // Add the styles
    const style = document.createElement("style")
    style.textContent = `
      /* Ensure the design fits entirely in the viewport with no scrollbars */
      html, body {
        margin: 0;
        padding: 0;
        overflow: hidden;
        font-family: 'Quantum', sans-serif;
        background: #000;
      }
      
      /* Canvas container acts as the simulation section */
      #canvas-container {
        position: relative;
        width: 100%;
        height: 100vh;
      }
      /* On desktop, reduce simulation section height slightly */
      @media (min-width: 1024px) {
        #canvas-container {
          height: 80vh;
        }
      }
      /* Inner container for Three.js canvas */
      #container { 
        width: 100%; 
        height: 100%; 
        cursor: pointer;
      }
      canvas { 
        display: block; 
        filter: blur(0.5px) brightness(1.2) contrast(1.1);
      }
      
      /* Menu container for curved buttons (fixed over simulation) */
      #menu-container {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 300px;
        pointer-events: auto;
        z-index: 10000;
      }
      .curved-button {
        position: absolute;
        background: linear-gradient(45deg, #ff0099, #493240, #00ffff);
        background-size: 200% 200%;
        animation: gradientAnimation 5s ease infinite;
        padding: 16px 32px;
        color: #fff;
        text-decoration: none;
        font-size: 1.5em;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transition: transform 0.3s;
      }
      .curved-button:hover { transform: scale(1.1); }
      #center-button { left: 50%; bottom: 20px; transform: translateX(-50%); }
      #left-button { left: 5%; bottom: 120px; }
      #right-button { right: 5%; bottom: 120px; }
      @keyframes gradientAnimation {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      /* Animated gradient arrows for navigation */
      .scroll-arrow {
        position: fixed;
        font-size: 3.5em;
        cursor: pointer;
        animation: bounce 2s infinite;
        background: linear-gradient(45deg, #00ffff, #ff00ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        z-index: 10000;
      }
      #bottom-arrow { bottom: 320px; left: 50%; transform: translateX(-50%); }
      #left-arrow { bottom: 320px; left: 5%; }
      @keyframes bounce {
        0%,20%,50%,80%,100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
      }
      
      /* Tooltip for double-click instruction */
      #tooltip {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.7);
        color: #00ffff;
        padding: 10px 20px;
        border-radius: 20px;
        font-size: 1.2em;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.5s;
        pointer-events: none;
      }
      
      /* Mobile adjustments: override fixed dimensions and absolute positions */
      @media (max-width: 600px) {
        #menu-container {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: auto;
          padding: 10px 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-around;
        }
        .curved-button {
          position: static;
          width: 30%;
          margin: 0;
          font-size: 0.9em;
          text-align: center;
          box-sizing: border-box;
          padding: 8px 0;
        }
        /* Override id styles so buttons are not positioned absolutely */
        #center-button,
        #left-button,
        #right-button {
          left: auto !important;
          bottom: auto !important;
          transform: none !important;
        }
      }
    `
    document.head.appendChild(style)

    // Required libraries
    const requiredLibraries = [
      { name: "three.js", url: "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" },
      {
        name: "OrbitControls",
        url: "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js",
      },
      { name: "GLTFLoader", url: "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js" },
      { name: "Tween.js", url: "https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.6.4/tween.umd.js" },
      {
        name: "EffectComposer",
        url: "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/EffectComposer.js",
      },
      {
        name: "RenderPass",
        url: "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/RenderPass.js",
      },
      {
        name: "UnrealBloomPass",
        url: "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/UnrealBloomPass.js",
      },
      {
        name: "ShaderPass",
        url: "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/ShaderPass.js",
      },
      { name: "CopyShader", url: "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/CopyShader.js" },
      {
        name: "LuminosityHighPassShader",
        url: "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/LuminosityHighPassShader.js",
      },
      { name: "cannon.js", url: "https://cdnjs.cloudflare.com/ajax/libs/cannon.js/0.6.2/cannon.min.js" },
      { name: "plotly.js", url: "https://cdn.plot.ly/plotly-2.26.2.min.js" },
      { name: "math.js", url: "https://cdnjs.cloudflare.com/ajax/libs/mathjs/9.5.0/math.js" },
    ]

    // Load scripts sequentially to ensure dependencies are loaded in the correct order
    const loadScripts = async () => {
      try {
        for (const lib of requiredLibraries) {
          try {
            await new Promise((resolve, reject) => {
              const script = document.createElement("script")
              script.src = lib.url
              script.onload = resolve
              script.onerror = (e) => {
                console.warn(`Failed to load ${lib.name}: ${lib.url}`, e)
                // Resolve anyway to continue loading other scripts
                resolve(null)
              }
              document.head.appendChild(script)
            })
            console.log(`Loaded ${lib.name}`)
          } catch (err) {
            console.warn(`Error loading ${lib.name}`, err)
          }
        }

        // After all libraries are loaded, initialize the visualization
        initializeVisualization()
      } catch (err) {
        console.error("Error in script loading process:", err)
        showErrorMessage("Failed to load required libraries")
      }
    }

    // Show error message to user
    const showErrorMessage = (message) => {
      const errorDiv = document.createElement("div")
      errorDiv.style.position = "fixed"
      errorDiv.style.top = "50%"
      errorDiv.style.left = "50%"
      errorDiv.style.transform = "translate(-50%, -50%)"
      errorDiv.style.background = "rgba(0, 0, 0, 0.8)"
      errorDiv.style.color = "#ff0055"
      errorDiv.style.padding = "20px"
      errorDiv.style.borderRadius = "10px"
      errorDiv.style.zIndex = "20000"
      errorDiv.style.maxWidth = "80%"
      errorDiv.style.textAlign = "center"
      errorDiv.innerHTML = `<p>${message}</p>`
      document.body.appendChild(errorDiv)
    }

    // Initialize the visualization
    const initializeVisualization = () => {
      // Show loading message
      const tooltip = document.getElementById("tooltip")
      if (tooltip) {
        tooltip.textContent = "Loading ZEN visualization..."
        tooltip.style.opacity = "1"
      }

      // Create the main script
      const mainScript = document.createElement("script")
      mainScript.textContent = `
        // Global variables
        let scene, camera, renderer, composer, controls, world, clock;
        let fileManager, windowManager, taskbar;
        let physicsBodies = [];
        let neuralNetwork, circuitDiagram;
        let quantumParticles = [];
        let multiversalPortals = [];
        let realityDistortionField;
        let cosmicWeb;
        let dimensionalRift;
        let timelineManager;
        let consciousnessField;
        let zenText;
        let zenParticles; // Halo for ZEN text
        let zenMorphTargets = []; // Array to store morph targets for ZEN text
        let zenColorCycle = 0; // Color cycle counter for ZEN text
        let zenTextEffects = []; // Additional effects for ZEN text
        let zenTextureCanvas; // Canvas for dynamic texture generation
        let zenTextureContext; // Context for dynamic texture generation
        let zenDynamicTexture; // Dynamic texture for ZEN text
        let zenGlowIntensity = 0; // Glow intensity for pulsating effect
        let cosmicElements; // Group for planets, stars, and other cosmic objects

        // Variables for mobile pinch zoom
        let initialPinchDistance = null;
        let initialCameraZoom = null;

        // Variables for ZEN interaction mode (toggled via double-click)
        let zenInteractive = false;
        let zenAnimationSpeed = 1;
        let zenAnimationIntensity = 1;
        
        // Show tooltip after a short delay
        setTimeout(() => {
          const tooltip = document.getElementById('tooltip');
          if (tooltip) {
            tooltip.style.opacity = 1;
            setTimeout(() => {
              tooltip.style.opacity = 0;
            }, 5000);
          }
        }, 2000);

        // Initialize the scene
        function init() {
          try {
            // Create scene
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x000000);
            
            // Create camera with wider field of view and greater far plane
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
            camera.position.set(0, 5, 10);
            
            // Create renderer
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            
            // Add renderer to DOM
            const container = document.getElementById("container");
            if (container) {
              container.appendChild(renderer.domElement);
            } else {
              console.error("Container element not found");
              return;
            }
            
            // Create clock
            clock = new THREE.Clock();

            // Create physics world
            world = new CANNON.World();
            world.gravity.set(0, 0, 0);
            world.broadphase = new CANNON.SAPBroadphase(world);
            world.solver.iterations = 50;
            world.solver.tolerance = 0.00001;

            // Update camera z-position based on scroll
            window.addEventListener("scroll", () => {
              camera.position.z = 10 + window.scrollY * 0.01;
              camera.updateProjectionMatrix();
            });

            // Setup OrbitControls
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.target.set(0, 0, 0);
            controls.update();
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.enableZoom = false;
            controls.enableRotate = false;
            controls.enabled = false;

            // Add lighting
            const ambientLight = new THREE.AmbientLight(0x00ffff, 0.5);
            scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(5, 10, 7.5);
            directionalLight.castShadow = true;
            directionalLight.shadow.mapSize.width = 4096;
            directionalLight.shadow.mapSize.height = 4096;
            scene.add(directionalLight);

            // Setup post-processing
            const renderScene = new THREE.RenderPass(scene, camera);
            const bloomPass = new THREE.UnrealBloomPass(
              new THREE.Vector2(window.innerWidth, window.innerHeight),
              1.5, 0.4, 0.85
            );
            bloomPass.threshold = 0.2;
            bloomPass.strength = 1.5;
            bloomPass.radius = 0.8;
            
            composer = new THREE.EffectComposer(renderer);
            composer.addPass(renderScene);
            composer.addPass(bloomPass);

            // Create scene elements
            createZenText();
            createBackgroundFeatures();
            createQuantumEnvironment();
            createCosmicRealm();

            // Add event listeners
            window.addEventListener("resize", onWindowResize, false);
            
            // Double-click toggles ZEN interaction mode
            const containerElement = document.getElementById("container");
            if (containerElement) {
              containerElement.addEventListener("dblclick", toggleZenInteraction);
            }
            
            // Mobile touch events
            window.addEventListener("touchstart", onTouchStart, { passive: false });
            window.addEventListener("touchmove", onTouchMove, { passive: false });
            window.addEventListener("touchend", onTouchEnd, { passive: false });
            
            // Add click handlers to arrows
            const bottomArrow = document.getElementById("bottom-arrow");
            const leftArrow = document.getElementById("left-arrow");
            if (bottomArrow) bottomArrow.addEventListener("click", scrollDown);
            if (leftArrow) leftArrow.addEventListener("click", scrollDown);

            // Start animation loop
            animate();
            
            // Update tooltip
            const tooltip = document.getElementById('tooltip');
            if (tooltip) {
              tooltip.textContent = "Double-click to interact with ZEN";
            }
          } catch (error) {
            console.error("Error initializing scene:", error);
            showErrorMessage("Failed to initialize visualization");
          }
        }

        // Scroll down one viewport height
        function scrollDown() {
          window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
        }

        // Toggle ZEN interaction mode (via double-click)
        function toggleZenInteraction() {
          zenInteractive = !zenInteractive;
          
          const tooltip = document.getElementById('tooltip');
          if (!tooltip) return;
          
          if (zenInteractive) {
            controls.enabled = true;
            controls.enableRotate = true;
            controls.enableZoom = true;
            controls.maxDistance = 1000; // Allow zooming out much further
            controls.minDistance = 5;    // Don't allow zooming in too close
            tooltip.textContent = "ZEN interaction mode enabled - Explore the cosmos";
            tooltip.style.opacity = 1;
            setTimeout(() => { tooltip.style.opacity = 0; }, 2000);
            zenAnimationSpeed = 2;
            zenAnimationIntensity = 2;
            
            // Reveal the cosmic elements by making them visible
            if (cosmicElements) {
              cosmicElements.visible = true;
            }
          } else {
            controls.enabled = false;
            controls.enableRotate = false;
            controls.enableZoom = false;
            camera.position.set(0, 5, 10 + window.scrollY * 0.01);
            camera.lookAt(0, 0, 0);
            tooltip.textContent = "ZEN interaction mode disabled";
            tooltip.style.opacity = 1;
            setTimeout(() => { tooltip.style.opacity = 0; }, 2000);
            zenAnimationSpeed = 1;
            zenAnimationIntensity = 1;
            
            // Hide the cosmic elements when not in interactive mode
            if (cosmicElements) {
              cosmicElements.visible = false;
            }
          }
        }

        // Handle touch events for mobile
        function onTouchStart(e) {
          if (e.touches.length === 2) {
            initialPinchDistance = Math.hypot(
              e.touches[0].pageX - e.touches[1].pageX,
              e.touches[0].pageY - e.touches[1].pageY
            );
            initialCameraZoom = camera.zoom;
            e.preventDefault();
          }
        }

        function onTouchMove(e) {
          if (e.touches.length === 2 && initialPinchDistance !== null) {
            let currentDistance = Math.hypot(
              e.touches[0].pageX - e.touches[1].pageX,
              e.touches[0].pageY - e.touches[1].pageY
            );
            let verticalMovement = Math.abs(
              (e.touches[0].pageY + e.touches[1].pageY)/2 - 
              (e.touches[0].clientY + e.touches[1].clientY)/2
            );
            if (verticalMovement > 20) {
              e.preventDefault();
              return;
            }
            if (zenInteractive) {
              let delta = currentDistance / initialPinchDistance;
              camera.zoom = initialCameraZoom * delta;
              camera.zoom = Math.max(0.5, Math.min(5, camera.zoom));
              camera.updateProjectionMatrix();
              e.preventDefault();
            }
          }
        }

        function onTouchEnd(e) {
          if (e.touches.length < 2) {
            initialPinchDistance = null;
            initialCameraZoom = null;
          }
        }

        // Handle window resize
        function onWindowResize() {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
          composer.setSize(window.innerWidth, window.innerHeight);
        }

        // Animation loop
        function animate() {
          requestAnimationFrame(animate);
          const delta = clock.getDelta();
          const elapsedTime = clock.getElapsedTime();
          
          // Update physics
          if (world) world.step(1/60);
          
          // Update particles
          if (quantumParticles) {
            quantumParticles.forEach((particle, index) => {
              if (particle && particle.userData && particle.userData.velocity) {
                particle.position.add(particle.userData.velocity.clone().multiplyScalar(delta));
                if (particle.position.length() > 10) {
                  particle.position.set((Math.random()-0.5)*20, (Math.random()-0.5)*20, (Math.random()-0.5)*20);
                }
                let scale = 1 + 0.2 * Math.sin(elapsedTime * 3 + index);
                particle.scale.set(scale, scale, scale);
              }
            });
          }
          
          // Update ZEN text
          if (zenText) {
            // More dynamic movement with multiple oscillations
            zenText.rotation.y = Math.sin(elapsedTime * 0.5) * 0.2;
            zenText.rotation.x = Math.sin(elapsedTime * 0.3) * 0.05;
            zenText.rotation.z = Math.sin(elapsedTime * 0.2) * 0.03;
            zenText.position.y = 3 + Math.sin(elapsedTime) * 0.2;
            
            // Subtle scale pulsing
            const scaleFactor = 1 + 0.05 * Math.sin(elapsedTime * 1.5);
            zenText.scale.set(scaleFactor, scaleFactor, scaleFactor);
            
            // Update the dynamic texture if it exists
            if (zenTextureContext && zenDynamicTexture) {
              updateZenTexture(elapsedTime);
              zenDynamicTexture.needsUpdate = true;
            }
            
            // Update the shader uniforms for the ZEN text with more dramatic color cycling
            if (zenText.material && zenText.material.uniforms) {
              zenText.material.uniforms.time.value = elapsedTime;
              zenText.material.uniforms.colorCycle.value = (zenColorCycle += 0.008 * zenAnimationSpeed);
              zenText.material.uniforms.intensity.value = 0.5 + 0.5 * Math.sin(elapsedTime * 2);
            }
            
            // More dramatic animation for the ZEN text effects
            if (zenTextEffects) {
              zenTextEffects.forEach((effect, index) => {
                if (effect && effect.material && effect.material.uniforms) {
                  effect.rotation.z += 0.01 * zenAnimationSpeed;
                  effect.rotation.x = Math.sin(elapsedTime * 0.2 + index) * 0.05;
                  effect.material.uniforms.time.value = elapsedTime;
                  
                  // More dramatic scaling
                  const effectScale = 1 + 0.15 * Math.sin(elapsedTime * 2 + index * 0.5);
                  effect.scale.setScalar(effectScale);
                }
              });
            }
          }
          
          // Animate cosmic elements
          if (cosmicElements && cosmicElements.visible) {
            // Animate planets
            cosmicElements.children.forEach(element => {
              if (element.userData.orbit) {
                // Update planet position in orbit
                element.userData.orbit.angle += element.userData.orbit.speed * delta;
                element.position.x = Math.cos(element.userData.orbit.angle) * element.userData.orbit.distance;
                element.position.z = Math.sin(element.userData.orbit.angle) * element.userData.orbit.distance;
                
                // Rotate planet
                element.rotation.y += element.userData.orbit.rotationSpeed;
                
                // Animate planet's moons
                element.children.forEach(child => {
                  if (child.userData.orbitSpeed) {
                    child.rotation.y += child.userData.orbitSpeed * delta;
                  }
                  
                  // Update shader uniforms if present
                  if (child.material && child.material.uniforms && child.material.uniforms.time) {
                    child.material.uniforms.time.value = elapsedTime;
                  }
                });
                
                // Update shader uniforms if present
                if (element.material && element.material.uniforms && element.material.uniforms.time) {
                  element.material.uniforms.time.value = elapsedTime;
                }
              }
              
              // Animate nebulae and other elements
              if (element.userData.rotationSpeed) {
                if (typeof element.userData.rotationSpeed === 'object') {
                  element.rotation.x += element.userData.rotationSpeed.x;
                  element.rotation.y += element.userData.rotationSpeed.y;
                  element.rotation.z += element.userData.rotationSpeed.z;
                } else {
                  element.rotation.y += element.userData.rotationSpeed;
                }
                
                // Update shader uniforms if present
                if (element.material && element.material.uniforms && element.material.uniforms.time) {
                  element.material.uniforms.time.value = elapsedTime;
                }
              }
            });
          }
          
          // Update controls and render
          if (controls) controls.update();
          if (composer) composer.render();
        }
        
        // Function to update the dynamic texture for ZEN text
        function updateZenTexture(time) {
          if (!zenTextureContext || !zenTextureCanvas) return;
          
          const width = zenTextureCanvas.width;
          const height = zenTextureCanvas.height;
          
          // Clear the canvas
          zenTextureContext.clearRect(0, 0, width, height);
          
          // Determine which style to use based on time
          const styleIndex = Math.floor((time * 0.2) % 5); // Cycle through 5 different styles
          
          switch(styleIndex) {
            case 0: // Gradient style
              createGradientStyle(time, width, height);
              break;
            case 1: // Geometric pattern style
              createGeometricStyle(time, width, height);
              break;
            case 2: // Fractal style
              createFractalStyle(time, width, height);
              break;
            case 3: // Circuit board style
              createCircuitStyle(time, width, height);
              break;
            case 4: // Cosmic style
              createCosmicStyle(time, width, height);
              break;
          }
        }

        // Create a flowing gradient style
        function createGradientStyle(time, width, height) {
          // Create a gradient background that shifts over time
          const gradient = zenTextureContext.createLinearGradient(0, 0, width, height);
          
          // Cycle through colors based on time
          gradient.addColorStop(0, 'hsl(' + ((time * 20) % 360) + ', 100%, 50%)');
          gradient.addColorStop(0.5, 'hsl(' + ((time * 20 + 120) % 360) + ', 100%, 50%)');
          gradient.addColorStop(1, 'hsl(' + ((time * 20 + 240) % 360) + ', 100%, 50%)');
          
          zenTextureContext.fillStyle = gradient;
          zenTextureContext.fillRect(0, 0, width, height);
          
          // Add flowing wave patterns
          zenTextureContext.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          zenTextureContext.lineWidth = 2;
          
          // Draw multiple wave patterns
          for (let j = 0; j < 3; j++) {
            zenTextureContext.beginPath();
            for (let x = 0; x < width; x += 5) {
              const y = height * (0.3 + j * 0.2) + Math.sin(x * 0.02 + time * 3 + j) * 20;
              if (x === 0) {
                zenTextureContext.moveTo(x, y);
              } else {
                zenTextureContext.lineTo(x, y);
              }
            }
            zenTextureContext.stroke();
          }
        }

        // Create a geometric pattern style
        function createGeometricStyle(time, width, height) {
          // Background
          zenTextureContext.fillStyle = 'black';
          zenTextureContext.fillRect(0, 0, width, height);
          
          // Draw geometric patterns
          const size = 40;
          const offset = time * 10 % size;
          
          for (let x = -size; x < width + size; x += size) {
            for (let y = -size; y < height + size; y += size) {
              // Alternate between different shapes
              const shapeType = Math.floor((x + y + time * 50) / size) % 3;
              
              zenTextureContext.fillStyle = \`hsl(\${(x + y + time * 30) % 360}, 100%, 50%)\`;
              
              switch(shapeType) {
                case 0: // Squares
                  zenTextureContext.fillRect(x + offset, y + offset, size/2, size/2);
                  break;
                case 1: // Circles
                  zenTextureContext.beginPath();
                  zenTextureContext.arc(x + offset + size/4, y + offset + size/4, size/4, 0, Math.PI * 2);
                  zenTextureContext.fill();
                  break;
                case 2: // Triangles
                  zenTextureContext.beginPath();
                  zenTextureContext.moveTo(x + offset, y + offset);
                  zenTextureContext.lineTo(x + offset + size/2, y + offset);
                  zenTextureContext.lineTo(x + offset + size/4, y + offset + size/2);
                  zenTextureContext.closePath();
                  zenTextureContext.fill();
                  break;
              }
            }
          }
        }

        // Create a fractal-like pattern
        function createFractalStyle(time, width, height) {
          // Background
          const gradient = zenTextureContext.createRadialGradient(
            width/2, height/2, 0,
            width/2, height/2, width/2
          );
          gradient.addColorStop(0, \`hsl(\${(time * 30) % 360}, 100%, 20%)\`);
          gradient.addColorStop(1, \`hsl(\${(time * 30 + 60) % 360}, 100%, 5%)\`);
          
          zenTextureContext.fillStyle = gradient;
          zenTextureContext.fillRect(0, 0, width, height);
          
          // Draw fractal-like patterns
          const iterations = 5;
          const scale = 100;
          
          for (let i = 0; i < iterations; i++) {
            const size = scale * (1 - i/iterations);
            const hue = (time * 50 + i * 30) % 360;
            
            zenTextureContext.strokeStyle = \`hsla(\${hue}, 100%, 50%, 0.5)\`;
            zenTextureContext.lineWidth = 2 * (1 - i/iterations);
            
            // Draw spiraling patterns
            zenTextureContext.beginPath();
            for (let angle = 0; angle < Math.PI * 10; angle += 0.1) {
              const radius = size * (1 - angle / (Math.PI * 10)) * (0.5 + 0.5 * Math.sin(time + i));
              const x = width/2 + Math.cos(angle + time + i) * radius;
              const y = height/2 + Math.sin(angle + time + i) * radius;
              
              if (angle === 0) {
                zenTextureContext.moveTo(x, y);
              } else {
                zenTextureContext.lineTo(x, y);
              }
            }
            zenTextureContext.stroke();
          }
        }

        // Create a circuit board style
        function createCircuitStyle(time, width, height) {
          // Background
          zenTextureContext.fillStyle = \`rgb(0, \${20 + Math.sin(time) * 10}, \${50 + Math.sin(time * 0.5) * 20})\`;
          zenTextureContext.fillRect(0, 0, width, height);
          
          // Draw circuit-like patterns
          zenTextureContext.strokeStyle = \`rgba(0, \${150 + Math.sin(time * 2) * 50}, \${200 + Math.sin(time) * 55}, 0.8)\`;
          zenTextureContext.lineWidth = 2;
          
          const gridSize = 30;
          const nodeSize = 4;
          
          // Draw grid
          for (let x = 0; x < width; x += gridSize) {
            for (let y = 0; y < height; y += gridSize) {
              // Random decision to draw horizontal or vertical lines
              if (Math.sin(x * y * 0.001 + time) > 0) {
                // Horizontal line
                zenTextureContext.beginPath();
                zenTextureContext.moveTo(x, y);
                zenTextureContext.lineTo(x + gridSize, y);
                zenTextureContext.stroke();
              } else {
                // Vertical line
                zenTextureContext.beginPath();
                zenTextureContext.moveTo(x, y);
                zenTextureContext.lineTo(x, y + gridSize);
                zenTextureContext.stroke();
              }
              
              // Draw nodes at intersections
              if (Math.sin(x * 0.1 + y * 0.1 + time * 2) > 0.7) {
                zenTextureContext.fillStyle = \`rgba(0, \${200 + Math.sin(time * 3 + x * y * 0.001) * 55}, 255, 0.8)\`;
                zenTextureContext.beginPath();
                zenTextureContext.arc(x, y, nodeSize, 0, Math.PI * 2);
                zenTextureContext.fill();
                
                // Occasional pulsing node
                if (Math.sin(x * 0.2 + y * 0.2 + time * 3) > 0.9) {
                  zenTextureContext.fillStyle = 'rgba(255, 255, 255, 0.8)';
                  zenTextureContext.beginPath();
                  zenTextureContext.arc(x, y, nodeSize * (1 + Math.sin(time * 5) * 0.5), 0, Math.PI * 2);
                  zenTextureContext.fill();
                }
              }
            }
          }
        }

        // Create a cosmic/nebula style
        function createCosmicStyle(time, width, height) {
          // Create starfield background
          zenTextureContext.fillStyle = 'black';
          zenTextureContext.fillRect(0, 0, width, height);
          
          // Draw stars
          for (let i = 0; i < 200; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 2 + 0.5;
            const brightness = Math.random() * 0.5 + 0.5;
            
            zenTextureContext.fillStyle = \`rgba(255, 255, 255, \${brightness})\`;
            zenTextureContext.beginPath();
            zenTextureContext.arc(x, y, size, 0, Math.PI * 2);
            zenTextureContext.fill();
          }
          
          // Draw nebula clouds
          for (let i = 0; i < 5; i++) {
            const centerX = width * (0.2 + 0.6 * Math.sin(time * 0.1 + i));
            const centerY = height * (0.2 + 0.6 * Math.cos(time * 0.1 + i));
            const radius = 100 + 50 * Math.sin(time * 0.2 + i);
            
            const gradient = zenTextureContext.createRadialGradient(
              centerX, centerY, 0,
              centerX, centerY, radius
            );
            
            const hue1 = (time * 20 + i * 60) % 360;
            const hue2 = (hue1 + 30) % 360;
            
            gradient.addColorStop(0, \`hsla(\${hue1}, 100%, 50%, 0.3)\`);
            gradient.addColorStop(0.5, \`hsla(\${hue2}, 100%, 30%, 0.1)\`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            zenTextureContext.fillStyle = gradient;
            zenTextureContext.beginPath();
            zenTextureContext.arc(centerX, centerY, radius, 0, Math.PI * 2);
            zenTextureContext.fill();
          }
        }
        
        // Create ZEN text with evolving colors and textures
        function createZenText() {
          const loader = new THREE.FontLoader();
          loader.load("https://threejs.org/examples/fonts/helvetiker_bold.typeface.json", function(font) {
            // Create a canvas for dynamic texture generation
            zenTextureCanvas = document.createElement('canvas');
            zenTextureCanvas.width = 512;
            zenTextureCanvas.height = 512;
            zenTextureContext = zenTextureCanvas.getContext('2d');
            
            // Create the dynamic texture
            zenDynamicTexture = new THREE.CanvasTexture(zenTextureCanvas);
            
            // ZEN text geometry with more detail for better visual effects
            const textGeometry = new THREE.TextGeometry("ZEN", {
              font: font,
              size: 6,
              height: 2,
              curveSegments: 32,
              bevelEnabled: true,
              bevelThickness: 0.3,
              bevelSize: 0.2,
              bevelOffset: 0,
              bevelSegments: 16
            });
            textGeometry.center();
            
            // Advanced shader material with multiple effects
            const textMaterial = new THREE.ShaderMaterial({
              uniforms: { 
                time: { value: 0 },
                colorCycle: { value: 0 },
                intensity: { value: 1.0 },
                texture: { value: zenDynamicTexture }
              },
              vertexShader: \`
                varying vec3 vPosition;
                varying vec2 vUv;
                varying vec3 vNormal;
                
                void main() {
                  vPosition = position;
                  vUv = uv;
                  vNormal = normal;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
              \`,
              fragmentShader: \`
                uniform float time;
                uniform float colorCycle;
                uniform float intensity;
                uniform sampler2D texture;
                
                varying vec3 vPosition;
                varying vec2 vUv;
                varying vec3 vNormal;
                
                // Function to convert HSL to RGB
                vec3 hsl2rgb(vec3 c) {
                  vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0);
                  return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
                }
                
                // Noise function for more organic patterns
                float noise(vec3 p) {
                  return fract(sin(dot(p, vec3(12.9898, 78.233, 45.5432))) * 43758.5453);
                }
                
                void main() {
                  // Dynamic color cycling based on position and time
                  float hue = mod(colorCycle + vPosition.x * 0.05 + vPosition.y * 0.05, 1.0);
                  float sat = 0.8 + 0.2 * sin(time * 2.0 + vPosition.y);
                  float light = 0.6 + 0.2 * cos(time * 3.0 + vPosition.x);
                  
                  // Create base color from HSL
                  vec3 baseColor = hsl2rgb(vec3(hue, sat, light));
                  
                  // Add texture detail with more influence
                  vec4 texColor = texture2D(texture, vUv);
                  
                  // Add iridescent effect based on viewing angle
                  float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
                  vec3 iridescence = hsl2rgb(vec3(mod(fresnel * 0.5 + time * 0.1, 1.0), 1.0, 0.5));
                  
                  // Add pulsating glow with more variation
                  float glow = 0.5 + 0.5 * sin(time * 3.0 + vPosition.z);
                  
                  // Add noise-based distortion
                  float noiseVal = noise(vPosition * 5.0 + time * 0.5);
                  
                  // Combine all effects with more dramatic mixing
                  vec3 finalColor = mix(baseColor, texColor.rgb, 0.5) + 
                                    iridescence * fresnel * 0.7 + 
                                    glow * 0.3 + 
                                    noiseVal * 0.2;
                  
                  // Apply intensity
                  finalColor *= intensity;
                  
                  // Add occasional sparkle effects
                  if (noiseVal > 0.95) {
                    finalColor += vec3(1.0) * 0.5;
                  }
                  
                  gl_FragColor = vec4(finalColor, 1.0);
                }
              \`
            });
            
            // Create the ZEN text mesh
            zenText = new THREE.Mesh(textGeometry, textMaterial);
            zenText.position.set(0, 3, -5);
            scene.add(zenText);
            
            // Create multiple layers of glowing effects around the ZEN text
            for (let i = 0; i < 3; i++) {
              const glowGeometry = new THREE.TextGeometry("ZEN", {
                font: font,
                size: 6.1 + i * 0.2,
                height: 2.1 + i * 0.1,
                curveSegments: 32,
                bevelEnabled: true,
                bevelThickness: 0.2,
                bevelSize: 0.15,
                bevelOffset: 0,
                bevelSegments: 12
              });
              glowGeometry.center();
              
              const glowMaterial = new THREE.ShaderMaterial({
                uniforms: { 
                  time: { value: 0 },
                  colorOffset: { value: i * 0.33 }
                },
                vertexShader: \`
                  varying vec3 vNormal;
                  varying vec3 vPosition;
                  
                  void main() {
                    vNormal = normal;
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                  }
                \`,
                fragmentShader: \`
                  uniform float time;
                  uniform float colorOffset;
                  varying vec3 vNormal;
                  varying vec3 vPosition;
                  
                  vec3 hsl2rgb(vec3 c) {
                    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0);
                    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
                  }
                  
                  void main() {
                    // Create a pulsating intensity
                    float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
                    
                    // Cycle through colors
                    float hue = mod(time * 0.1 + colorOffset, 1.0);
                    vec3 color = hsl2rgb(vec3(hue, 1.0, 0.5));
                    
                    // Add pulsating effect
                    float pulse = 0.5 + 0.5 * sin(time * 3.0 + colorOffset * 10.0);
                    
                    gl_FragColor = vec4(color, intensity * pulse);
                  }
                \`,
                transparent: true,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide
              });
              
              const glowText = new THREE.Mesh(glowGeometry, glowMaterial);
              glowText.position.set(0, 3, -5);
              scene.add(glowText);
              zenTextEffects.push(glowText);
            }
            
            // Create particle halo around ZEN text
            const particleCount = 500;
            const haloGeometry = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            const sizes = new Float32Array(particleCount);
            
            for (let i = 0; i < particleCount; i++) {
              // Create particles in a torus shape around the text
              const angle = Math.random() * Math.PI * 2;
              const radius = 8 + (Math.random() - 0.5) * 3;
              const height = (Math.random() - 0.5) * 5;
              
              positions[i*3] = Math.cos(angle) * radius;
              positions[i*3+1] = height + 3; // Center at text y-position
              positions[i*3+2] = Math.sin(angle) * radius - 5; // Center at text z-position
              
              // Random colors for particles
              colors[i*3] = Math.random();
              colors[i*3+1] = Math.random();
              colors[i*3+2] = Math.random();
              
              // Random sizes
              sizes[i] = Math.random() * 0.5 + 0.1;
            }
            
            haloGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            haloGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            haloGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
            
            const haloMaterial = new THREE.ShaderMaterial({
              uniforms: {
                time: { value: 0 },
                pointTexture: { value: new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/spark1.png') }
              },
              vertexShader: \`
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                  vColor = color;
                  
                  // Animate particles
                  vec3 pos = position;
                  pos.x += sin(time * 2.0 + position.z) * 0.3;
                  pos.y += cos(time * 2.0 + position.x) * 0.3;
                  pos.z += sin(time * 2.0 + position.y) * 0.3;
                  
                  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                  gl_PointSize = size * (300.0 / -mvPosition.z);
                  gl_Position = projectionMatrix * mvPosition;
                }
              \`,
              fragmentShader: \`
                uniform sampler2D pointTexture;
                varying vec3 vColor;
                
                void main() {
                  gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
                }
              \`,
              blending: THREE.AdditiveBlending,
              depthTest: false,
              transparent: true,
              vertexColors: true
            });
            
            zenParticles = new THREE.Points(haloGeometry, haloMaterial);
            scene.add(zenParticles);
          });
        }
        
        // Create background features
        function createBackgroundFeatures() {
          // Create starfield
          const bgParticleCount = 5000;
          const bgGeometry = new THREE.BufferGeometry();
          const bgPositions = new Float32Array(bgParticleCount * 3);
          
          for (let i = 0; i < bgParticleCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = 300 + Math.random() * 200;
            
            bgPositions[i*3] = radius * Math.sin(phi) * Math.cos(theta);
            bgPositions[i*3+1] = radius * Math.sin(phi) * Math.sin(theta);
            bgPositions[i*3+2] = radius * Math.cos(phi);
          }
          
          bgGeometry.setAttribute("position", new THREE.BufferAttribute(bgPositions, 3));
          
          const bgMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 1.5,
            transparent: true,
            opacity: 0.6
          });
          
          const bgParticles = new THREE.Points(bgGeometry, bgMaterial);
          scene.add(bgParticles);
          
          // Animate background
          (function animateBackground() {
            bgParticles.rotation.y += 0.0005;
            requestAnimationFrame(animateBackground);
          })();
          
          // Create nebula background
          const nebulaBgMaterial = new THREE.ShaderMaterial({
            uniforms: { 
              time: { value: 0 }, 
              resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) } 
            },
            vertexShader: \`
              varying vec2 vUv;
              void main() { 
                vUv = uv; 
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
              }
            \`,
            fragmentShader: \`
              uniform float time;
              uniform vec2 resolution;
              varying vec2 vUv;
              void main() {
                vec2 uv = vUv;
                float brightness = 0.5 + 0.5 * sin(time + uv.x * 10.0);
                gl_FragColor = vec4(uv.x, uv.y, 1.0, brightness * 0.3);
              }
            \`,
            transparent: true,
            side: THREE.DoubleSide
          });
          
          const nebulaBgGeometry = new THREE.PlaneGeometry(600, 600);
          const nebulaBgMesh = new THREE.Mesh(nebulaBgGeometry, nebulaBgMaterial);
          nebulaBgMesh.position.z = -400;
          scene.add(nebulaBgMesh);
          
          // Animate nebula
          (function animateNebulaBg() {
            nebulaBgMaterial.uniforms.time.value += 0.005;
            nebulaBgMesh.rotation.z += 0.0005;
            requestAnimationFrame(animateNebulaBg);
          })();
        }
        
        // Create quantum environment
        function createQuantumEnvironment() {
          // Create quantum particles
          const particleGeometry = new THREE.SphereGeometry(0.05, 32, 32);
          const particleMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ffff, 
            emissive: 0x00ffff, 
            emissiveIntensity: 0.5,
            transparent: true, 
            opacity: 0.8
          });
          
          for (let i = 0; i < 100; i++) {
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.set(
              (Math.random()-0.5)*20, 
              (Math.random()-0.5)*20, 
              (Math.random()-0.5)*20
            );
            particle.userData.velocity = new THREE.Vector3(
              (Math.random()-0.5)*0.02, 
              (Math.random()-0.5)*0.02, 
              (Math.random()-0.5)*0.02
            );
            scene.add(particle);
            quantumParticles.push(particle);
          }
        }

        // Create cosmic realm with planets and space elements
        function createCosmicRealm() {
          // Create a group to hold all cosmic elements
          cosmicElements = new THREE.Group();
          scene.add(cosmicElements);
          
          // Initially hide cosmic elements until interaction mode is enabled
          cosmicElements.visible = false;
          
          // Create several planets of different sizes and colors
          const planetCount = 8;
          const planetTextures = [
            { color: 0x4287f5, emissive: 0x1a3c7d }, // Blue gas giant
            { color: 0xf54242, emissive: 0x7d1a1a }, // Red planet
            { color: 0xf5a742, emissive: 0x7d5a1a }, // Orange/Saturn-like
            { color: 0x42f554, emissive: 0x1a7d23 }, // Green planet
            { color: 0xf542f2, emissive: 0x7d1a7b }, // Purple planet
            { color: 0xf5f542, emissive: 0x7d7d1a }, // Yellow planet
            { color: 0x42f5f5, emissive: 0x1a7d7d }, // Cyan planet
            { color: 0xffffff, emissive: 0x7d7d7d }  // White/ice planet
          ];
          
          for (let i = 0; i < planetCount; i++) {
            // Create planet with random size
            const radius = 5 + Math.random() * 15;
            const segments = 32;
            const planetGeometry = new THREE.SphereGeometry(radius, segments, segments);
            
            // Use different materials for variety
            let planetMaterial;
            
            if (Math.random() > 0.5) {
              // Standard material for some planets
              planetMaterial = new THREE.MeshStandardMaterial({
                color: planetTextures[i].color,
                emissive: planetTextures[i].emissive,
                emissiveIntensity: 0.2,
                roughness: 0.7,
                metalness: 0.2
              });
            } else {
              // Shader material for more interesting planets
              planetMaterial = new THREE.ShaderMaterial({
                uniforms: {
                  time: { value: 0 },
                  baseColor: { value: new THREE.Color(planetTextures[i].color) }
                },
                vertexShader: \`
                  varying vec3 vNormal;
                  varying vec2 vUv;
                  
                  void main() {
                    vNormal = normal;
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                  }
                \`,
                fragmentShader: \`
                  uniform float time;
                  uniform vec3 baseColor;
                  varying vec3 vNormal;
                  varying vec2 vUv;
                  
                  float noise(vec2 p) {
                    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
                  }
                  
                  void main() {
                    // Create bands or swirls on the planet
                    float bands = sin(vUv.y * 20.0 + time * 0.5) * 0.5 + 0.5;
                    float spots = noise(vUv * 10.0 + time * 0.1) * 0.5;
                    
                    // Mix the base color with the patterns
                    vec3 finalColor = mix(baseColor, baseColor * 0.5, bands * spots);
                    
                    // Add atmosphere at the edges
                    float atmosphere = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
                    finalColor += vec3(0.5, 0.7, 1.0) * atmosphere * 0.5;
                    
                    gl_FragColor = vec4(finalColor, 1.0);
                  }
                \`
              });
            }
            
            const planet = new THREE.Mesh(planetGeometry, planetMaterial);
            
            // Position planets in a wide orbit around the center
            const distance = 100 + i * 50 + Math.random() * 100;
            const angle = Math.random() * Math.PI * 2;
            const height = (Math.random() - 0.5) * 100;
            
            planet.position.set(
              Math.cos(angle) * distance,
              height,
              Math.sin(angle) * distance
            );
            
            // Add random rotation
            planet.rotation.x = Math.random() * Math.PI;
            planet.rotation.y = Math.random() * Math.PI;
            
            // Store orbit data for animation
            planet.userData.orbit = {
              distance: distance,
              speed: 0.05 + Math.random() * 0.1,
              angle: angle,
              height: height,
              rotationSpeed: 0.005 + Math.random() * 0.01
            };
            
            // Add rings to some planets
            if (Math.random() > 0.6) {
              const ringGeometry = new THREE.RingGeometry(radius * 1.5, radius * 2.5, 32);
              const ringMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.5
              });
              const ring = new THREE.Mesh(ringGeometry, ringMaterial);
              ring.rotation.x = Math.PI / 2;
              planet.add(ring);
            }
            
            // Add moons to some planets
            if (Math.random() > 0.5) {
              const moonCount = Math.floor(Math.random() * 3) + 1;
              for (let j = 0; j < moonCount; j++) {
                const moonRadius = radius * 0.2;
                const moonGeometry = new THREE.SphereGeometry(moonRadius, 16, 16);
                const moonMaterial = new THREE.MeshStandardMaterial({
                  color: 0xcccccc,
                  roughness: 0.8
                });
                const moon = new THREE.Mesh(moonGeometry, moonMaterial);
                
                // Position moon in orbit around planet
                const moonDistance = radius * 3 + j * radius;
                const moonAngle = Math.random() * Math.PI * 2;
                
                // Create a pivot for the moon to orbit around
                const moonPivot = new THREE.Object3D();
                moonPivot.rotation.x = Math.random() * Math.PI;
                moonPivot.rotation.y = Math.random() * Math.PI;
                
                moon.position.set(moonDistance, 0, 0);
                moonPivot.add(moon);
                
                // Store orbit data for animation
                moonPivot.userData.orbitSpeed = 0.02 + Math.random() * 0.05;
                
                planet.add(moonPivot);
              }
            }
            
            cosmicElements.add(planet);
          }
          
          // Add distant stars and nebulae
          createDistantCosmos();
        }

        // Create distant stars, galaxies and nebulae
        function createDistantCosmos() {
          // Create several nebulae at random positions
          for (let i = 0; i < 5; i++) {
            const size = 200 + Math.random() * 300;
            const nebulaMaterial = new THREE.ShaderMaterial({
              uniforms: {
                time: { value: 0 },
                color1: { value: new THREE.Color(Math.random(), Math.random(), Math.random()) },
                color2: { value: new THREE.Color(Math.random(), Math.random(), Math.random()) }
              },
              vertexShader: \`
                varying vec2 vUv;
                void main() {
                  vUv = uv;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
              \`,
              fragmentShader: \`
                uniform float time;
                uniform vec3 color1;
                uniform vec3 color2;
                varying vec2 vUv;
                
                float noise(vec2 p) {
                  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
                }
                
                float fbm(vec2 p) {
                  float f = 0.0;
                  float w = 0.5;
                  for (int i = 0; i < 5; i++) {
                    f += w * noise(p);
                    p *= 2.0;
                    w *= 0.5;
                  }
                  return f;
                }
                
                void main() {
                  vec2 uv = vUv;
                  
                  // Create nebula pattern
                  float pattern = fbm(uv * 5.0 + time * 0.05);
                  pattern = smoothstep(0.2, 0.8, pattern);
                  
                  // Mix colors based on pattern
                  vec3 color = mix(color1, color2, pattern);
                  
                  // Add stars
                  if (noise(uv * 500.0) > 0.98) {
                    color += vec3(1.0) * 0.5;
                  }
                  
                  // Fade at edges
                  float edge = length(uv - 0.5) * 2.0;
                  float alpha = smoothstep(1.0, 0.6, edge);
                  
                  gl_FragColor = vec4(color, alpha * 0.3);
                }
              \`,
              transparent: true,
              side: THREE.DoubleSide
            });
            
            const nebulaGeometry = new THREE.PlaneGeometry(size, size);
            const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
            
            // Position nebulae at random distant locations
            const distance = 500 + Math.random() * 500;
            const angle = Math.random() * Math.PI * 2;
            const height = (Math.random() - 0.5) * 400;
            
            nebula.position.set(
              Math.cos(angle) * distance,
              height,
              Math.sin(angle) * distance
            );
            
            // Random rotation
            nebula.rotation.x = Math.random() * Math.PI;
            nebula.rotation.y = Math.random() * Math.PI;
            nebula.rotation.z = Math.random() * Math.PI;
            
            // Store animation data
            nebula.userData.rotationSpeed = {
              x: (Math.random() - 0.5) * 0.001,
              y: (Math.random() - 0.5) * 0.001,
              z: (Math.random() - 0.5) * 0.001
            };
            
            cosmicElements.add(nebula);
          }
          
          // Add distant galaxy
          const galaxyParticleCount = 10000;
          const galaxyGeometry = new THREE.BufferGeometry();
          const galaxyPositions = new Float32Array(galaxyParticleCount * 3);
          const galaxyColors = new Float32Array(galaxyParticleCount * 3);
          
          for (let i = 0; i < galaxyParticleCount; i++) {
            // Create spiral galaxy pattern
            const arm = Math.floor(Math.random() * 3);
            const angle = arm * (Math.PI * 2 / 3) + Math.random() * 0.5;
            const distance = 5 + Math.pow(Math.random(), 0.5) * 200;
            const height = (Math.random() - 0.5) * 20;
            
            galaxyPositions[i * 3] = Math.cos(angle + distance * 0.01) * distance;
            galaxyPositions[i * 3 + 1] = height;
            galaxyPositions[i * 3 + 2] = Math.sin(angle + distance * 0.01) * distance;
            
            // Color based on distance from center
            const colorFactor = distance / 200;
            galaxyColors[i * 3] = 0.5 + colorFactor * 0.5; // Red
            galaxyColors[i * 3 + 1] = 0.2 + colorFactor * 0.8; // Green
            galaxyColors[i * 3 + 2] = 1.0 - colorFactor * 0.5; // Blue
          }
          
          galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(galaxyPositions, 3));
          galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3));
          
          const galaxyMaterial = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  });
  
  const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
  
  // Position galaxy at a distant location
  galaxy.position.set(600, 200, -400);
  galaxy.rotation.x = Math.PI / 4;
  
  // Store animation data
  galaxy.userData.rotationSpeed = 0.0005;
  
  cosmicElements.add(galaxy);
}
        
        // Show error message
        function showErrorMessage(message) {
          const errorDiv = document.createElement("div");
          errorDiv.style.position = "fixed";
          errorDiv.style.top = "50%";
          errorDiv.style.left = "50%";
          errorDiv.style.transform = "translate(-50%, -50%)";
          errorDiv.style.background = "rgba(0, 0, 0, 0.8)";
          errorDiv.style.color = "#ff0055";
          errorDiv.style.padding = "20px";
          errorDiv.style.borderRadius = "10px";
          errorDiv.style.zIndex = "20000";
          errorDiv.style.maxWidth = "80%";
          errorDiv.style.textAlign = "center";
          errorDiv.innerHTML = \`<p>\${message}</p>\`;
          document.body.appendChild(errorDiv);
        }
        
        // Start the visualization
        init();
      `

      try {
        document.head.appendChild(mainScript)
      } catch (error) {
        console.error("Error adding main script:", error)
        showErrorMessage("Failed to initialize visualization")
      }
    }

    // Start loading scripts
    loadScripts().catch((err) => {
      console.error("Uncaught error in loadScripts:", err)
      showErrorMessage("Failed to load required libraries")
    })

    return () => {
      // Cleanup
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [])

  return (
    <div className="w-full h-screen">
      <div ref={containerRef} className="w-full h-full"></div>
    </div>
  )
}
