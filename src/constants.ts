import { PortfolioData } from "./services/geminiService";

export const mockPortfolioData: PortfolioData = {
  personalInfo: {
    name: "Sachin Shekhar",
    title: "Software Developer & Cyber Security Enthusiast",
    about: "Passionate Software Developer with a 9.6 CGPA in B.E. CSE (Cyber Security). I have a unique obsession with the intersection of logic and aesthetics—having solved 300+ LeetCode problems while simultaneously obsessing over UI/UX design and creative digital experiences. I specialize in building AI-powered solutions and secure web architectures that are as beautiful as they are bulletproof.",
    email: "sachinshekhar7550@gmail.com",
    github: "https://github.com/Sachinshekhar82",
    linkedin: "https://linkedin.com/in/sachin-shekhar-ba0209295",
    location: "Bengaluru, India"
  },
  education: [
    {
      degree: "Bachelor of Engineering, CSE (Cyber Security)",
      institution: "Dayananda Sagar Academy of Tech. & Management",
      year: "2023 - 2027",
      description: "Currently maintaining a 9.6 CGPA. Focused on Computer Science and Engineering with a specialization in Cyber Security."
    },
    {
      degree: "12th Standard (PCM)",
      institution: "Lord Buddha Public School",
      year: "2020 - 2022",
      description: "Completed with 87% marks."
    }
  ],
  projects: [
    {
      title: "FinAI Cashbook",
      description: "AI-Powered Financial Intelligence & Bank Statement Analyzer using OCR and structured data extraction.",
      image: "https://images.unsplash.com/photo-1611974714608-66d2360fd779?auto=format&fit=crop&w=1200&q=80&sat=20",
      githubUrl: "https://github.com/Sachinshekhar82",
      tags: ["React 19", "GenAI", "Tailwind CSS"]
    },
    {
      title: "Safe Commute",
      description: "Real-time safety layer for public transit with live location sharing and SOS alerts via WhatsApp/Twilio.",
      image: "https://images.unsplash.com/photo-1557333610-90ee4a951ecf?auto=format&fit=crop&w=1200&q=80&sat=20",
      githubUrl: "https://github.com/Sachinshekhar82",
      tags: ["Firebase", "Google Maps API", "Node.js"]
    },
    {
      title: "MedAI",
      description: "Medical Assistant GenAI Web Application providing expert-level diagnostic guidance using Gemini API.",
      image: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&w=1200&q=80&sat=20",
      githubUrl: "https://github.com/Sachinshekhar82",
      tags: ["Python", "Flask", "Gemini API"]
    },
    {
      title: "Gramin Shiksha Attendance",
      description: "Automated Rural School Management system featuring facial recognition and offline-first architecture.",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80&sat=20",
      githubUrl: "https://github.com/Sachinshekhar82",
      tags: ["React 18", "face-api.js", "D3.js"]
    },
    {
      title: "Cash Dash",
      description: "Cash Delivery platform supporting citizens during tax-driven UPI disruptions, restoring confidence that emergency cash was always accessible on-demand.",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80&sat=20",
      githubUrl: "https://github.com/Sachinshekhar82",
      tags: ["React.js", "Python", "Flask"]
    },
    {
      title: "Library Management System",
      description: "PHP-based system for efficiently managing books, students, and transactions with due date tracking and automatic fine calculation.",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80&sat=20",
      githubUrl: "https://github.com/Sachinshekhar82",
      tags: ["PHP", "MySQL", "XAMPP"]
    },
    {
      title: "University Voting System",
      description: "Robust online election platform with OTP verification and role-based access control.",
      image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80&sat=20",
      githubUrl: "https://github.com/Sachinshekhar82",
      tags: ["Django", "MySQL", "Security"]
    }
  ],
  certifications: [
    {
      name: "OCI 2025 Certified Generative AI Professional",
      issuer: "Oracle",
      year: "2025"
    },
    {
      name: "Agentblazer Champion for Agentic AI",
      issuer: "Salesforce",
      year: "2025"
    },
    {
      name: "Artificial Intelligence Fundamentals",
      issuer: "IBM",
      year: "2024"
    },
    {
      name: "Project Management Fundamentals",
      issuer: "IBM",
      year: "2024"
    },
    {
      name: "Databases and SQL for Data Science with Python",
      issuer: "IBM",
      year: "2024"
    },
    {
      name: "Java Programming Fundamentals",
      issuer: "Infosys Springboard",
      year: "2024"
    },
    {
      name: "Certified Ethical Hacker",
      issuer: "EC-Council",
      year: "2024"
    },
    {
      name: "Introduction to Cyber Security",
      issuer: "Cisco",
      year: "2023"
    }
  ],
  skills: ["React.js", "TypeScript", "Python", "GenAI", "Cyber Security", "Docker", "Kubernetes", "MySQL", "C++", "Java", "Agile Methodology", "AI/ML", "UI/UX Design", "App Development", "HTML5 & CSS3", "JavaScript (ES6+)"]
};
