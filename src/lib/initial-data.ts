import type { Project } from "./types";

export const initialProjects: Project[] = [
  {
    id: "build-a-personal-portfolio-website",
    title: "Build a Personal Portfolio Website",
    description: "Create a stunning personal portfolio to showcase your skills and projects using React and Tailwind CSS.",
    image: "https://placehold.co/600x400/7c3aed/ffffff.png",
    dataAiHint: "portfolio website",
    steps: [
      {
        id: "step-1",
        title: "Setup Your Development Environment",
        description: "Get your local development environment ready by installing Node.js and creating a new Next.js project.",
        completed: false,
        subTasks: [
          { id: 'sub-1-1', title: 'Install Node.js and npm', completed: false },
          { id: 'sub-1-2', title: 'Create a new Next.js application', completed: false },
          { id: 'sub-1-3', title: 'Navigate into the project directory', completed: false },
        ],
        content: "First, you'll need to install Node.js and npm. Then, create a new Next.js application.\n\n```bash\nnpx create-next-app@latest my-portfolio --typescript --tailwind --eslint\ncd my-portfolio\n```"
      },
      {
        id: "step-2",
        title: "Create the Header and Footer",
        description: "Build the main layout components for your site's navigation and footer information.",
        completed: false,
        subTasks: [
            { id: 'sub-2-1', title: 'Create a components folder', completed: false },
            { id: 'sub-2-2', title: 'Create Header.tsx component', completed: false },
            { id: 'sub-2-3', title: 'Create Footer.tsx component', completed: false },
            { id: 'sub-2-4', title: 'Add components to the main layout', completed: false },
        ],
        content: "Create a `components` folder in `src`. Inside, create `Header.tsx` and `Footer.tsx` files. These will contain your site's navigation and footer information.\n\n**Header.tsx Example:**\n```tsx\nimport Link from 'next/link';\n\nconst Header = () => (\n  <header className=\"bg-gray-800 text-white p-4\">\n    <nav className=\"container mx-auto flex justify-between\">\n      <Link href=\"/\" className=\"font-bold\">My Portfolio</Link>\n      <div>\n        <Link href=\"#projects\" className=\"mr-4\">Projects</Link>\n        <Link href=\"#contact\">Contact</Link>\n      </div>\n    </nav>\n  </header>\n);\n\nexport default Header;\n```",
      },
      {
        id: "step-3",
        title: "Design the Hero Section",
        description: "Create a visually appealing hero section to introduce yourself to visitors.",
        completed: false,
        subTasks: [
            { id: 'sub-3-1', title: 'Add a new section to the homepage', completed: false },
            { id: 'sub-3-2', title: 'Add a heading with your name', completed: false },
            { id: 'sub-3-3', title: 'Add a tagline or short bio', completed: false },
            { id: 'sub-3-4', title: 'Style the section with a background color and text styles', completed: false },
        ],
        content: "In your `src/app/page.tsx`, create a hero section that introduces you to your visitors.\n\n```tsx\nconst HomePage = () => (\n  <main>\n    {/* ... other components ... */}\n    <section className=\"bg-blue-600 text-white text-center p-20\">\n      <h1 className=\"text-5xl font-bold\">Your Name</h1>\n      <p className=\"text-xl mt-4\">A Passionate Web Developer</p>\n    </section>\n    {/* ... other sections ... */}\n  </main>\n);\n\nexport default HomePage;\n```",
      },
      {
        id: "step-4",
        title: "Showcase Your Projects",
        description: "Create a dedicated section to display the projects you've worked on.",
        completed: false,
        subTasks: [
            { id: 'sub-4-1', title: 'Create a ProjectCard.tsx component', completed: false },
            { id: 'sub-4-2', title: 'Add a new section for projects', completed: false },
            { id: 'sub-4-3', title: 'Use the ProjectCard to display at least two projects', completed: false },
        ],
        content: "Create a `ProjectCard.tsx` component and use it on your main page to list your projects. This is a crucial part of your portfolio.\n\n```tsx\nconst ProjectCard = ({ title, description }) => (\n  <div className=\"border rounded-lg p-4\">\n    <h3 className=\"font-bold text-lg\">{title}</h3>\n    <p>{description}</p>\n  </div>\n);\n\n// In your page.tsx:\n<section id=\"projects\" className=\"py-12\">\n  <h2 className=\"text-3xl font-bold text-center\">My Projects</h2>\n  <div className=\"grid md:grid-cols-2 gap-8 mt-8\">\n    <ProjectCard title=\"Project One\" description=\"An awesome project I built.\" />\n    <ProjectCard title=\"Project Two\" description=\"Another great project.\" />\n  </div>\n</section>\n```",
      },
      {
        id: "step-5",
        title: "Deploy to the Web",
        description: "Make your portfolio live for the world to see by deploying it to a hosting service.",
        completed: false,
        subTasks: [
            { id: 'sub-5-1', title: 'Push your code to a GitHub repository', completed: false },
            { id: 'sub-5-2', title: 'Choose a deployment service (Vercel, Netlify)', completed: false },
            { id: 'sub-5-3', title: 'Connect your repository and deploy', completed: false },
        ],
        content: "Deploy your portfolio for the world to see using a service like Vercel or Netlify. Connect your Git repository and follow their instructions.\n\n```bash\n# First, push your code to GitHub\ngit init\ngit add .\ngit commit -m \"Initial portfolio commit\"\n# ... create repo on GitHub and push ...\n\n# Then, deploy with Vercel\nnpm i -g vercel\nvercel\n```",
      },
    ],
  },
  {
    id: "create-a-weather-app",
    title: "Create a Weather App",
    description: "A hands-on project to build a weather application that fetches and displays real-time weather data from an API.",
    image: "https://placehold.co/600x400/34d399/115e59.png",
    dataAiHint: "weather app",
    steps: [
      {
        id: "step-1",
        title: "Get API Key and Setup",
        description: "Sign up for a free API key and set up the basic HTML structure for the weather app.",
        completed: false,
        subTasks: [
          { id: "sub-1-1", title: "Sign up for an OpenWeatherMap API key", completed: false },
          { id: "sub-1-2", title: "Create the basic HTML file with an input and display area", completed: false },
        ],
        content: "Sign up for a free API key from a weather provider like [OpenWeatherMap](https://openweathermap.org/appid). You'll need this to fetch weather data. Then create your `index.html` file.",
      },
      {
        id: "step-2",
        title: "Design the UI",
        description: "Create the user interface with an input field for the city and a display area for the weather information.",
        completed: false,
        subTasks: [
          { id: "sub-2-1", title: "Add an input field for city name", completed: false },
          { id: "sub-2-2", title: "Add a submit button", completed: false },
          { id: "sub-2-3", title: "Create a container to display weather results", completed: false },
        ],
        content: "Create a simple form with an input for the city and a button to submit. Also, create a display area for the weather results.\n\n```tsx\n// In your main component's return statement\n<div>\n  <input \n    type=\"text\"\n    placeholder=\"Enter city\"\n    value={city}\n    onChange={(e) => setCity(e.target.value)}\n  />\n  <button onClick={fetchWeather}>Get Weather</button>\n  {weatherData && <div>...display data here...</div>}\n</div>\n```",
      },
      {
        id: "step-3",
        title: "Fetch Weather Data",
        description: "Use JavaScript to fetch real-time weather data from the API based on user input.",
        completed: false,
        subTasks: [
          { id: "sub-3-1", title: "Write a function to fetch data from the OpenWeatherMap API", completed: false },
          { id: "sub-3-2", title: "Handle the API response and store the data in state", completed: false },
          { id: "sub-3-3", title: "Implement error handling for the API request", completed: false },
        ],
        content: "Use the `fetch` API or a library like `axios` to make a request to the weather API endpoint. Handle the response and store the data in state.\n\n```javascript\nconst fetchWeather = async () => {\n  const apiKey = 'YOUR_API_KEY';\n  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;\n  try {\n    const response = await fetch(url);\n    const data = await response.json();\n    setWeatherData(data);\n  } catch (error) {\n    console.error(\"Failed to fetch weather data\", error);\n  }\n};\n```",
      },
      {
        id: "step-4",
        title: "Display Weather Data",
        description: "Render the fetched weather data dynamically on the page.",
        completed: false,
        subTasks: [
          { id: "sub-4-1", title: "Display the city name", completed: false },
          { id: "sub-4-2", title: "Display the temperature, and weather conditions", completed: false },
        ],
        content: "Once you have the weather data in your component's state, render it in the UI. Display things like temperature, humidity, and conditions.\n\n```tsx\n{weatherData && (\n  <div>\n    <h2>{weatherData.name}</h2>\n    <p>Temp: {weatherData.main.temp}°C</p>\n    <p>Weather: {weatherData.weather[0].description}</p>\n  </div>\n)}\n```",
      },
      {
        id: "step-5",
        title: "Add Geolocation Feature",
        description: "Enhance the app by adding a feature to get the weather for the user's current location.",
        completed: false,
        subTasks: [
          { id: "sub-5-1", title: "Use the browser's Geolocation API to get user coordinates", completed: false },
          { id: "sub-5-2", title: "Fetch and display weather data based on the user's location", completed: false },
        ],
        content: "Use the browser's Geolocation API to get the user's current position and fetch the weather for their location automatically.\n\n```javascript\nnavigator.geolocation.getCurrentPosition(position => {\n  const { latitude, longitude } = position.coords;\n  // Fetch weather using lat and lon\n});\n```",
      },
    ],
  },
  {
    id: "task-management-app",
    title: "Task Management App",
    description: "Build a full-featured task management application with features like adding, editing, and deleting tasks.",
    image: "https://placehold.co/600x400/f87171/881337.png",
    dataAiHint: "task list",
    steps: [
      {
        id: "step-1",
        title: "Project Setup",
        description: "Initialize a new React project and set up the basic file structure for your components.",
        completed: false,
        subTasks: [
            { id: 'sub-1-1', title: 'Initialize a new React project', completed: false },
            { id: 'sub-1-2', title: 'Create a component for the task list', completed: false },
            { id: 'sub-1-3', title: 'Create a component for a single task item', completed: false },
        ],
        content: "Initialize a new React project (or use your framework of choice) and set up your file structure. You'll need a component for the task list and another for individual tasks.\n\n```bash\nnpx create-react-app task-manager\ncd task-manager\n```"
      },
      {
        id: "step-2",
        title: "Create Task Component",
        description: "Build the UI for an individual task, including buttons for interaction.",
        completed: false,
        subTasks: [
            { id: 'sub-2-1', title: 'Display the task title', completed: false },
            { id: 'sub-2-2', title: 'Add a button to mark the task as complete', completed: false },
            { id: 'sub-2-3', title: 'Add a button to delete the task', completed: false },
            { id: 'sub-2-4', title: 'Apply a "line-through" style for completed tasks', completed: false },
        ],
        content: "Create a `Task.tsx` component that takes a task object as a prop and displays its title. Add buttons for completing and deleting the task.\n\n```tsx\nconst Task = ({ task, onComplete, onDelete }) => (\n  <div style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>\n    {task.title}\n    <button onClick={() => onComplete(task.id)}>Complete</button>\n    <button onClick={() => onDelete(task.id)}>Delete</button>\n  </div>\n);\n```"
      },
      {
        id: "step-3",
        title: "Implement State Management",
        description: "Use React's state to manage the list of tasks within the application.",
        completed: false,
        subTasks: [
            { id: 'sub-3-1', title: 'Use the useState hook to hold an array of tasks', completed: false },
            { id: 'sub-3-2', title: 'Initialize the state with some default tasks', completed: false },
        ],
        content: "In your main `App.js` or `TaskList.js` component, use the `useState` hook to manage an array of tasks.\n\n```tsx\nconst [tasks, setTasks] = useState([\n  { id: 1, title: 'Learn React', completed: false },\n  { id: 2, title: 'Build Task App', completed: false },\n]);\n```"
      },
      {
        id: "step-4",
        title: "Add CRUD Functionality",
        description: "Implement the core logic for creating, updating, and deleting tasks.",
        completed: false,
        subTasks: [
            { id: 'sub-4-1', title: 'Create a function to add a new task', completed: false },
            { id: 'sub-4-2', title: 'Create a function to toggle a task\'s completion status', completed: false },
            { id: 'sub-4-3', title: 'Create a function to delete a task', completed: false },
        ],
        content: "Create functions to handle adding new tasks, toggling their completion status, and deleting them. Pass these functions as props to your components.\n\n```javascript\nconst addTask = (title) => {\n  const newTask = { id: Date.now(), title, completed: false };\n  setTasks([...tasks, newTask]);\n};\n\nconst deleteTask = (id) => {\n  setTasks(tasks.filter(task => task.id !== id));\n};\n```"
      },
      {
        id: "step-5",
        title: "Persist Data",
        description: "Save the user's tasks to the browser's local storage so they don't lose their data on refresh.",
        completed: false,
        subTasks: [
            { id: 'sub-5-1', title: 'Use useEffect to save tasks to localStorage on change', completed: false },
            { id: 'sub-5-2', title: 'Use useEffect to load tasks from localStorage on initial render', completed: false },
        ],
        content: "Use the `useEffect` hook to save tasks to the browser's local storage whenever the `tasks` state changes, and another `useEffect` to load them on initial render.\n\n```javascript\nuseEffect(() => {\n  localStorage.setItem('tasks', JSON.stringify(tasks));\n}, [tasks]);\n\nuseEffect(() => {\n  const storedTasks = localStorage.getItem('tasks');\n  if (storedTasks) {\n    setTasks(JSON.parse(storedTasks));\n  }\n}, []);\n```"
      },
    ],
  },
];
