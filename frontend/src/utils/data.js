import Resume1 from "../assets/Resume1.png"
import Resume2 from "../assets/Resume2.png"
import Resume3 from "../assets/Resume3.png"

export const resumeTemplates = [
    {
        id: "01",
        thumbnailImg: Resume1,
        colorPaletteCode: "themeOne"
    },
    {
        id: "02",
        thumbnailImg: Resume2,
        colorPaletteCode: "themeTwo"
    },
    {
        id: "03",
        thumbnailImg: Resume3,
        colorPaletteCode: "themeThree"
    },
]

export const DUMMY_RESUME_DATA = {
    profileInfo: {
        previewUrl: "",
        fullName: "Soumitra Sahoo",
        designation: "Senior Software Developer",
        summary: "Full-stack developer with 5+ years of experience building scalable web applications using modern JavaScript frameworks. Specialized in React, Node.js, and cloud technologies with a strong focus on clean code architecture and performance optimization. Passionate about mentoring junior developers and implementing agile best practices.",
    },
    contactInfo: {
        email: "soumitra.dev@gmail.com",
        phone: "+91 0123456789",
        location: "West Bengal, India",
        linkedin: "https://linkedin.com/in/alexjohnson-dev",
        github: "https://github.com/alexjohnson-code",
        website: "https://alexjohnson.dev",
    },
    education: [
        {
            institution: "College of Engineering",
            degree: "Bachelor of Technology",
            major: "Computer Science",
            minors: "Data Science",
            location: "Kolaghat, Kolkata",
            graduationYear: "2027"
        },
        {
            institution: "University of Calcutta",
            degree: "Bachelor of Science",
            major: "Software Engineering",
            minors: "Mathematics",
            location: "Kolkata, India",
            graduationYear: "2025"
        }
    ],
    workExperience: [
        {
            role: "Senior Software Engineer",
            company: "TCS Digital",
            location: "Bengaluru, India",
            startDate: "2022-06-01",
            endDate: "2027-12-31",
            description: "Led a team of 5 developers in building a SaaS platform serving 50,000+ users.\nArchitected microservices using Node.js and React that improved system performance by 40%.\nImplemented CI/CD pipelines reducing deployment time from 2 hours to 15 minutes.\nMentored junior developers through code reviews and pair programming sessions."
        },
        {
            role: "Software Developer",
            company: "InnovateSoft",
            location: "San Jose, CA",
            startDate: "2018-07-01",
            endDate: "2020-05-31",
            description: "Developed RESTful APIs handling 10,000+ requests per minute with 99.9% uptime.\nRedesigned legacy frontend using React, improving page load speed by 60%.\nCollaborated with UX team to implement responsive designs for mobile users.\nAutomated testing processes increasing test coverage from 65% to 95%."
        }
    ],
    projects: [
        {
            title: "E-commerce Analytics Dashboard",
            startDate: "2022-03-01",
            endDate: "2022-08-31",
            description: "Built a real-time analytics dashboard for e-commerce clients to track sales, inventory, and customer behavior.",
            technologies: ["React", "D3.js", "Node.js", "MongoDB"],
            github: "https://github.com/alexjohnson-code/ecommerce-analytics",
            liveDemo: "https://demo.alexjohnson.dev/analytics"
        },
        {
            title: "AI-Powered Code Review Tool",
            startDate: "2021-01-01",
            endDate: "2021-06-30",
            description: "Developed a machine learning tool that analyzes pull requests and suggests code improvements.",
            technologies: ["Python", "TensorFlow", "Flask", "GitHub API"],
            github: "https://github.com/alexjohnson-code/ai-code-review"
        }
    ],
    skills: [
        { name: "JavaScript" },
        { name: "TypeScript" },
        { name: "React" },
        { name: "Node.js" },
        { name: "Python" },
        { name: "Git" },
        { name: "Github" },
        { name: "Java" },
        { name: "GraphQL" },
        { name: "MongoDB" },
        { name: "PostgreSQL" },
        { name: "Express.js" },
        { name: "Angular" },
        { name: "Vue" },
        { name: "Go" }
    ],
    certifications: [
        {
            title: "Full Stack Developer",
            year: "2025"
        },
        {
            title: "Professional Software Devlopment",
            year: "2024"
        },
        {
            title: "Certified DevOps Master",
            year: "2025"
        }
    ],
    interests: [
        "Open Source Contributions",
        "Machine Learning",
        "Blockchain Technology",
        "Hiking",
        "Photography"
    ]
};

//In this file you will have dummay data for your resume. You can replace it with your actual resume data.