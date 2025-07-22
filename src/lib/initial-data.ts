import type { Project } from "./types";

export const initialProjects: Project[] = [
  {
    id: "build-a-personal-portfolio-website",
    title: "Build a Personal Portfolio Website",
    description: "Create a stunning personal portfolio to showcase your skills and projects using React and Tailwind CSS.",
    image: "https://placehold.co/600x400/3F51B5/ffffff.png",
    dataAiHint: "portfolio website",
    steps: [
      {
        id: "step-1-setup",
        title: "Project Setup & Skeleton",
        description: "Set up the project environment and create the basic application skeleton, including the main layout and navigation.",
        completed: false,
        content: "This step covers the initial setup of your Next.js application and creating the reusable components that will form the structure of your portfolio website.",
        subTasks: [
          { id: 'sub-1-1', title: 'Initialize Next.js Project', description: "Use `create-next-app` to start a new project with TypeScript and Tailwind CSS.", completed: false },
          { id: 'sub-1-2', title: 'Create Header Component', description: "Build a responsive header with navigation links.", completed: false },
          { id: 'sub-1-3', title: 'Create Footer Component', description: "Build a simple footer with your contact information.", completed: false },
          { id: 'sub-1-4', title: 'Integrate Layout', description: "Add the Header and Footer to the main application layout.", completed: false },
        ],
      },
      {
        id: "step-2-content",
        title: "Content & Styling",
        description: "Design and implement the core sections of your portfolio: the Hero, Projects, and Contact sections.",
        completed: false,
        content: "With the main layout in place, this step focuses on building out the key content areas of your portfolio to showcase your work and provide ways for visitors to contact you.",
        subTasks: [
            { id: 'sub-2-1', title: 'Design the Hero Section', description: "Create a visually appealing hero section to introduce yourself.", completed: false },
            { id: 'sub-2-2', title: 'Create Project Showcase', description: "Build a grid to display your projects with images and descriptions.", completed: false },
            { id: 'sub-2-3', title: 'Implement Contact Form', description: "Add a simple, functional contact form.", completed: false },
            { id: 'sub-2-4', title: 'Apply Global Styles', description: "Use Tailwind CSS to apply a consistent design across the site.", completed: false },
        ],
      },
    ],
  },
  {
    id: "create-a-weather-app",
    title: "Create a Weather App",
    description: "A hands-on project to build a weather application that fetches and displays real-time weather data from an API.",
    image: "https://placehold.co/600x400/4DB6AC/ffffff.png",
    dataAiHint: "weather app",
    steps: [
      {
        id: "step-1-api",
        title: "API Integration & Basic UI",
        description: "Sign up for a free weather API, get your API key, and set up the basic HTML structure for the weather app.",
        completed: false,
        content: "This step focuses on getting the necessary credentials to fetch live weather data and building the initial user interface.",
        subTasks: [
          { id: "sub-1-1", title: "Get OpenWeatherMap API Key", description: "Sign up and retrieve a free API key to access weather data.", completed: false },
          { id: "sub-1-2", title: "Design the UI", description: "Create an input field for a city and a display area for results.", completed: false },
        ],
      },
      {
        id: "step-2-logic",
        title: "Core Application Logic",
        description: "Implement the JavaScript logic to fetch and display weather data based on user input.",
        completed: false,
        content: "This step involves writing the client-side code to interact with the weather API and dynamically update the user interface with the fetched data.",
        subTasks: [
          { id: "sub-2-1", title: "Fetch Weather Data", description: "Write a function to fetch data from the API using the user's input.", completed: false },
          { id: "sub-2-2", title: "Display Weather Data", description: "Render the fetched weather data (temperature, conditions) on the page.", completed: false },
          { id: "sub-2-3", title: "Add Geolocation Feature", description: "Get weather for the user's current location as a bonus feature.", completed: false },
        ],
      },
    ],
  },
];
