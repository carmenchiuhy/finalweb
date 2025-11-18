 // Sample project data with labels
        const projects = [
            {
                id: 1,
                title: "E-commerce Platform Redesign",
                label: "UI/UX Design",
                description: "Complete redesign of a responsive e-commerce platform with improved user experience and conversion optimization.",
                image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
            },
            {
                id: 2,
                title: "Healthcare Dashboard",
                label: "Data Visualization",
                description: "Interactive dashboard for healthcare providers to track patient metrics and treatment outcomes.",
                image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
            },
            {
                id: 3,
                title: "Mobile Banking App",
                label: "Fintech Development",
                description: "Secure and intuitive mobile banking application with biometric authentication and budgeting tools.",
                image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
            },
            {
                id: 4,
                title: "Travel Planning Platform",
                label: "Full Stack Development",
                description: "All-in-one travel planning platform with itinerary builder, booking integration, and local recommendations.",
                image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
            }
        ];

        // Use D3.js to create project cards
        const container = d3.select("#projects-container");

        const projectCards = container.selectAll(".project-card")
            .data(projects)
            .enter()
            .append("div")
            .attr("class", "project-card");

        // Add project images in rounded rectangle containers
        projectCards.append("div")
            .attr("class", "project-image")
            .append("img")
            .attr("src", d => d.image)
            .attr("alt", d => d.title);

        // Add project content
        const projectContent = projectCards.append("div")
            .attr("class", "project-content");

        projectContent.append("h3")
            .attr("class", "project-title")
            .text(d => d.title);

        // Add project labels
        projectContent.append("span")
            .attr("class", "project-label")
            .text(d => d.label);

        projectContent.append("p")
            .attr("class", "project-description")
            .text(d => d.description);