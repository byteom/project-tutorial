import type { Project } from "./types";

export const initialProjects: Project[] = [
  {
    id: "build-a-personal-portfolio-website",
    title: "Build a Personal Portfolio Website",
    description: "Create a stunning personal portfolio to showcase your skills and projects using React and Tailwind CSS.",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "portfolio website",
    steps: [
      { id: "step-1", title: "Setup Your Development Environment", content: "Install Node.js, create a new Next.js app, and setup Tailwind CSS.", completed: false },
      { id: "step-2", title: "Create the Header and Footer", content: "Build the main navigation and footer components for your site.", completed: false },
      { id: "step-3", title: "Design the Hero Section", content: "Craft a compelling hero section to grab visitors' attention.", completed: false },
      { id: "step-4", title: "Showcase Your Projects", content: "Create a dedicated section to display your best work with images and descriptions.", completed: false },
      { id: "step-5", title: "Deploy to the Web", content: "Deploy your finished portfolio to a hosting service like Vercel or Netlify.", completed: false },
    ],
  },
  {
    id: "create-a-weather-app",
    title: "Create a Weather App",
    description: "A hands-on project to build a weather application that fetches and displays real-time weather data from an API.",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "weather app",
    steps: [
      { id: "step-1", title: "Get API Key", content: "Sign up for a free weather API key from a provider like OpenWeatherMap.", completed: false },
      { id: "step-2", title: "Design the UI", content: "Design a clean and intuitive user interface to display weather information.", completed: false },
      { id: "step-3", title: "Fetch Weather Data", content: "Write the logic to fetch data from the weather API based on user input.", completed: false },
      { id: "step-4", title: "Display Weather Data", content: "Populate the UI with the fetched data, including temperature, humidity, and wind speed.", completed: false },
      { id: "step-5", title: "Add Geolocation", content: "Enhance the app by adding a feature to get weather for the user's current location.", completed: false },
    ],
  },
    {
    id: "task-management-app",
    title: "Task Management App",
    description: "Build a full-featured task management application with features like adding, editing, and deleting tasks.",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "task list",
    steps: [
      { id: "step-1", title: "Project Setup", content: "Initialize a new project with your favorite framework and set up necessary dependencies.", completed: false },
      { id: "step-2", title: "Create Task Component", content: "Develop a reusable component to display individual tasks.", completed: false },
      { id: "step-3", title: "Implement State Management", content: "Set up state management to handle the list of tasks.", completed: false },
      { id: "step-4", title: "Add CRUD Functionality", content: "Implement Create, Read, Update, and Delete functionality for tasks.", completed: false },
      { id: "step-5", title: "Persist Data", content: "Use local storage or a backend service to save tasks.", completed: false },
    ],
  },
];
