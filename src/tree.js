// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Skill data structured for sunburst
    const skillData = {
        name: "All Skills",
        color: "#3498db",
        description: "My complete creative skill set across multiple disciplines",
        children: [
            {
                name: "Web Design",
                color: "#1abc9c",
                description: "Creating visually appealing and functional web interfaces",
                children: [
                    { 
                        name: "Figma", 
                        color: "#9b59b6",
                        description: "UI/UX design and prototyping tool",
                        value: 20,
                        children: [
                            { name: "Prototyping", value: 10, color: "#8e44ad", description: "Creating interactive prototypes" },
                            { name: "Design Systems", value: 10, color: "#8e44ad", description: "Building consistent design frameworks" }
                        ]
                    },
                    { 
                        name: "Webflow", 
                        color: "#3498db",
                        description: "No-code website builder with CMS",
                        value: 20,
                        children: [
                            { name: "CMS Collections", value: 10, color: "#2980b9", description: "Structuring and managing content" },
                            { name: "Animations", value: 10, color: "#2980b9", description: "Creating engaging interactions" }
                        ]
                    },
                    { 
                        name: "HTML/CSS/JS", 
                        color: "#e74c3c",
                        description: "Front-end web development",
                        value: 20,
                        children: [
                            { name: "Responsive Layouts", value: 20, color: "#c0392b", description: "Creating adaptable designs for all devices" }
                        ]
                    }
                ]
            },
            {
                name: "UX/UI",
                color: "#f39c12",
                description: "Designing user-centered interfaces and experiences",
                children: [
                    { name: "User Research", value: 15, color: "#e67e22", description: "Understanding user needs and behaviors" },
                    { name: "Journey Mapping", value: 15, color: "#e67e22", description: "Visualizing user interactions with products" },
                    { name: "Wireframing", value: 15, color: "#e67e22", description: "Creating structural layouts for interfaces" },
                    { name: "Persona Creation", value: 15, color: "#e67e22", description: "Developing user archetypes for design focus" }
                ]
            },
            {
                name: "Graphic Design",
                color: "#2ecc71",
                description: "Developing visual concepts and communication materials",
                children: [
                    { 
                        name: "Procreate", 
                        color: "#e74c3c",
                        description: "Digital illustration on iPad",
                        value: 20,
                        children: [
                            { name: "Digital Painting", value: 10, color: "#c0392b", description: "Creating artwork with digital tools" },
                            { name: "Illustration", value: 10, color: "#c0392b", description: "Producing custom illustrations" }
                        ]
                    },
                    { 
                        name: "Adobe Illustrator", 
                        color: "#f39c12",
                        description: "Vector graphics and logo design",
                        value: 20,
                        children: [
                            { name: "Vector Graphics", value: 10, color: "#e67e22", description: "Creating scalable graphic elements" },
                            { name: "Logo Design", value: 10, color: "#e67e22", description: "Designing brand identities" }
                        ]
                    },
                    { 
                        name: "Adobe Photoshop", 
                        color: "#3498db",
                        description: "Image editing and manipulation",
                        value: 20,
                        children: [
                            { name: "Photo Manipulation", value: 20, color: "#2980b9", description: "Editing and enhancing photographs" }
                        ]
                    }
                ]
            },
            {
                name: "3D & Animation",
                color: "#9b59b6",
                description: "Creating three-dimensional models and animations",
                children: [
                    { 
                        name: "Autodesk Maya", 
                        color: "#1abc9c",
                        description: "3D modeling and animation software",
                        value: 20,
                        children: [
                            { name: "3D Modeling", value: 10, color: "#16a085", description: "Creating three-dimensional objects" },
                            { name: "Character Rigging", value: 10, color: "#16a085", description: "Preparing models for animation" }
                        ]
                    },
                    { 
                        name: "Blender", 
                        color: "#e74c3c",
                        description: "Open-source 3D creation suite",
                        value: 20,
                        children: [
                            { name: "Sculpting", value: 10, color: "#c0392b", description: "Digital clay modeling" },
                            { name: "Eevee Rendering", value: 10, color: "#c0392b", description: "Real-time rendering engine" }
                        ]
                    },
                    { 
                        name: "After Effects", 
                        color: "#f39c12",
                        description: "Motion graphics and visual effects",
                        value: 20,
                        children: [
                            { name: "Motion Graphics", value: 20, color: "#e67e22", description: "Creating animated graphic design" }
                        ]
                    }
                ]
            }
        ]
    };

    // Function to initialize the visualization
    function initializeVisualization() {
        // Clear any existing SVG
        d3.select("#tree").select("svg").remove();
        
        // Get the tree container - use fixed size or container dimensions
        const treeContainer = document.getElementById('tree');
        const containerWidth = treeContainer.clientWidth || 500;
        const containerHeight = treeContainer.clientHeight || 500;
        
        console.log("Container dimensions:", containerWidth, containerHeight); // Debug log
        
        // Set up dimensions - use fixed size to ensure visibility
        const size = Math.min(containerWidth, containerHeight);
        const width = size;
        const height = size;
        const radius = Math.min(width, height) / 2 - 10; // Add some padding

        // Create SVG inside the tree section
        const svg = d3.select("#tree")
            .append("svg")
            .attr("width", containerWidth)
            .attr("height", containerHeight)
            .style("background", "#f8f9fa") // Add background to see the SVG
            .style("border-radius", "8px")
            .append("g")
            .attr("transform", `translate(${containerWidth/2},${containerHeight/2})`);

        // Create tooltip
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background", "rgba(0,0,0,0.8)")
            .style("color", "white")
            .style("padding", "8px")
            .style("border-radius", "4px")
            .style("font-size", "12px")
            .style("pointer-events", "none");

        // Create hierarchy and calculate values
        const root = d3.hierarchy(skillData)
            .sum(d => d.value ? d.value : 0)
            .sort((a, b) => b.value - a.value);

        // Create partition layout
        const partition = d3.partition()
            .size([2 * Math.PI, radius]);

        // Apply partition layout
        partition(root);

        // Create arc generator
        const arc = d3.arc()
            .startAngle(d => d.x0)
            .endAngle(d => d.x1)
            .innerRadius(d => d.y0)
            .outerRadius(d => d.y1);

        // Color scale
        const color = d3.scaleOrdinal()
            .domain(root.descendants().map(d => d.data.name))
            .range(root.descendants().map(d => d.data.color || "#999"));

        // Draw the sunburst
        const path = svg.selectAll("path")
            .data(root.descendants().filter(d => d.depth))
            .enter()
            .append("path")
            .attr("d", arc)
            .style("fill", d => color(d.data.name))
            .style("opacity", 0.8)
            .style("stroke", "#fff")
            .style("stroke-width", "1px")
            .style("cursor", "pointer")
            .on("mouseover", function(event, d) {
                // Highlight the skill path
                highlightPath(d);
                
                // Show tooltip
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`
                    <strong>${d.data.name}</strong><br/>
                    ${d.data.description || "Skill category"}
                `)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
                
                // Update info panel
                updateInfoPanel(d);
                updateBreadcrumb(d);
            })
            .on("mouseout", function() {
                // Reset highlight
                resetHighlight();
                
                // Hide tooltip
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // Add text labels
        const text = svg.selectAll("text")
            .data(root.descendants().filter(d => d.depth && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03))
            .enter()
            .append("text")
            .attr("transform", function(d) {
                const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
                const y = (d.y0 + d.y1) / 2;
                return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
            })
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .attr("pointer-events", "none")
            .text(d => d.data.name)
            .style("font-size", "10px")
            .style("font-weight", "bold")
            .style("fill", "white")
            .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.5)");

        // Highlight path function
        function highlightPath(d) {
            // Reset all first
            resetHighlight();
            
            // Get path to root
            const sequence = getAncestors(d);
            
            // Highlight the path
            sequence.forEach(node => {
                d3.selectAll(`path`).filter(path => 
                    path.data.name === node.data.name
                ).style("opacity", 1)
                .style("stroke-width", "2px");
            });
        }

        // Reset highlight
        function resetHighlight() {
            svg.selectAll("path")
                .style("opacity", 0.8)
                .style("stroke-width", "1px");
        }

        // Get ancestors of a node
        function getAncestors(node) {
            const path = [];
            let current = node;
            while (current.parent) {
                path.unshift(current);
                current = current.parent;
            }
            return path;
        }

        // Update info panel with skill details
        function updateInfoPanel(d) {
            const skillDetails = d3.select("#skill-details");
            const currentPath = d3.select("#current-path");
            
            // Clear previous content
            skillDetails.html("");
            currentPath.html("");
            
            // Add path information
            const sequence = getAncestors(d);
            const skillPath = sequence.map(node => node.data.name).join(" → ");
            
            currentPath.append("p")
                .text(`Skill Path: ${skillPath}`)
                .style("margin-bottom", "15px")
                .style("font-weight", "bold")
                .style("color", "#ffcc00");
            
            // Add skill description based on the selected node
            let description = d.data.description || "Specialized skill within my creative toolkit.";
            let level = Math.min(5, Math.max(1, Math.floor(d.depth * 1.5)));
            
            // Adjust level based on skill category
            if (d.data.name === "Web Design" || d.depth === 1 && d.parent.data.name === "Web Design") {
                level = 4;
            } else if (d.data.name === "Graphic Design" || d.depth === 1 && d.parent.data.name === "Graphic Design") {
                level = 5;
            } else if (d.data.name === "3D & Animation" || d.depth === 1 && d.parent.data.name === "3D & Animation") {
                level = 3;
            } else if (d.data.name === "UX/UI" || d.depth === 1 && d.parent.data.name === "UX/UI") {
                level = 4;
            }
            
            skillDetails.append("div")
                .attr("class", "skill-item")
                .html(`
                    <div class="skill-header">
                        <span class="skill-name">${d.data.name}</span>
                        <div class="skill-level">
                            ${Array.from({length: 5}, (_, i) => 
                                `<div class="level-dot ${i < level ? 'active' : ''}"></div>`
                            ).join('')}
                        </div>
                    </div>
                    <p class="skill-description">${description}</p>
                `);
            
            // Add children if any
            if (d.children) {
                d.children.forEach(child => {
                    skillDetails.append("div")
                        .attr("class", "skill-item")
                        .html(`
                            <div class="skill-header">
                                <span class="skill-name">${child.data.name}</span>
                                <div class="skill-level">
                                    ${Array.from({length: 5}, (_, i) => 
                                        `<div class="level-dot ${i < Math.min(5, level-1) ? 'active' : ''}"></div>`
                                    ).join('')}
                                </div>
                            </div>
                            <p class="skill-description">${child.data.description || "Specialized sub-skill"}</p>
                        `);
                });
            }
        }

        // Update breadcrumb
        function updateBreadcrumb(d) {
            const breadcrumb = d3.select("#breadcrumb");
            breadcrumb.html("");
            
            const sequence = getAncestors(d);
            
            // Add root
            breadcrumb.append("span")
                .text("All Skills");
            
            // Add path items
            sequence.forEach((node, i) => {
                breadcrumb.append("span")
                    .html(" &gt; ");
                
                breadcrumb.append("span")
                    .text(node.data.name);
            });
        }

        // Create legend
        function createLegend() {
            const legend = d3.select("#legend");
            legend.html(""); // Clear existing legend
            
            const categories = ["Web Design", "UX/UI", "Graphic Design", "3D & Animation"];
            const colors = ["#1abc9c", "#f39c12", "#2ecc71", "#9b59b6"];
            
            categories.forEach((category, i) => {
                legend.append("div")
                    .attr("class", "legend-item")
                    .html(`
                        <div class="legend-color" style="background-color: ${colors[i]}"></div>
                        <span>${category}</span>
                    `);
            });
        }

        // Initialize
        createLegend();
    }

    // Initialize the visualization
    initializeVisualization();

    // Reinitialize on window resize
    window.addEventListener('resize', function() {
        setTimeout(initializeVisualization, 100);
    });
});