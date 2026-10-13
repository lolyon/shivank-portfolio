/* =====================================================================
   EDIT THIS FILE ONLY — all your text, images and links live here.
   Put your images in the /images folder and change the file names below.
   If an image file is missing, a coloured placeholder is shown instead.
   ===================================================================== */

const SITE = {
  name: "Shivank",
  tagline: "2nd year Computer Engineering Student at",
  school: "McMaster University",
  schoolUrl: "https://www.mcmaster.ca",
  schoolTip: "Visit McMaster University's official page",


  intro:
    "Passionate about combining hardware design, software development," +  "and problem-solving to build practical engineering solutions." +
    "Driven by continuous learning and teamwork, I am currently seeking co-op opportunities to apply my skills to real-world projects.",

  profileImage: "images/Profile.jpg",          // your circular photo

  // One background image per page. Dimness is controlled in style.css (--dim).
  backgrounds: {
    hero:       "images/JHE_Pic.jpg",          // e.g. a McMaster campus photo
    current:    "images/bg-current.jpg",
    experience: "images/bg-experience.jpg",
    skills:     "images/bg-current.jpg",
    awards:     "images/bg-awards.jpg",
    thanks:     "images/bg-thanks.jpg",
    detail:     "images/bg-detail.jpg"         // behind the opened experience/award pages
  },

  // PAGE 2 — two wide rectangles
  current: [
    {
      title: "Computer Engineering 2nd Year",
      text:  "McMaster University, Hamilton, Ontario, expected graduation: 2029. <br>"+"GPA: 3.5/4.0, Relevant courses: Data Structures, Digital Logic Design, Computer Architecture, Embedded Systems, and Robotics."
    }, 
    { 
      club21: "Mac RoboMaster",
      club21Url: "https://macrobomaster.com/index.html",
      clubTip21: "Visit RoboMaster's official page",
      title: "Mac RoboMaster Autonomy Team",
      text:  "Developing autonomous navigation, target tracking, and computer vision pipelines using Python, C++, and ROS/ROS2 for multi-robot tactical arenas."
    }
  ],

  thanks: {
    title: "Thank you for stopping by",
    text:  "I hope you enjoyed going through my journey. If you would like to chat, collaborate, or just say hi, reach out below.",
    contacts: [
      { label: "Email 1",    value: "shivanksunil@gmail.com",              href: "mailto:shivanksunil@gmail.com" },
      { label: "Email 2",    value: "nambis2@mcmaster.ca",              href: "mailto:nambis2@mcmaster.ca" },
      { label: "LinkedIn", value: "linkedin.com/in/shivank-sunil-nambiar", href: "https://www.linkedin.com/in/shivank-sunil/?isSelfProfile=true" },
      { label: "GitHub",   value: "github.com/your-username",     href: "https://github.com/your-username" }
    ]
  }
};

/* ---------- PAGE 3: EXPERIENCES (shown as a 4 x 2 grid of squares) ----------
   Click a square -> opens its own page with description, images, skills learned. */
const EXPERIENCES = [
  {
    id: "MacRoboMaster",
    title: "Mac RoboMaster",
    role: "Team member",
    date: "2025 – Present",
    short: "Autonomy Team Member   ",
    cover: "images/logo_master.jpg",
    description: "MAC RoboMaster is a multidisciplinary student team at McMaster University. Every season, we design and build a fleet of remote-controlled and autonomous battle robots from the ground up—then take them to compete with universities from around the world. We are engineers, programmers, designers, operators, and organizers united by a love of ambitious problems and hands-on learning.",
    did: [
      "Created and optimized computer vision pipelines for a robot to navigate through obstacles using python and OpenCV.",
      "Develop and learn more about designing a sentry robot for the competition that can autonomously detect and track targets using ROS2 and C++.",
    ],
    images: [
      { src: "images/SentryRobot.jpg", caption: "RoboMaster Competition" },
      { src: "images/robomaster-2.jpg", caption: "Add a caption" },
      { src: "images/robomaster-3.jpg", caption: "Add a caption" }
    ],
    skills: ["Teamwork", "Robotics", "C++", "Python", "Computer vision"]
  },
  { 
    id: "Robotic_Arm",
    title: "Robotic Arm Project", 
    role: "Study Expert",
    date: "September 2025 – December 2025",
    short: "Designed an Interface.",
    cover: "images/exp-robotic-arm.jpg",
    description: "Designed and programmed a robotic arm to pick and place customer-selected objects using an end-effector, incorporating user authentication, barcode-based ordering, object retrieval, basket placement, and automated receipt printing. Project modulated with 5 students and duration of 8 weeks.",
    did: ["Created a user-friendly interface for the robotic arm. ","Created an end-effector for the robotic arm.","Created a database to store user information and preferences.", "Tested the interface with users and gathered feedback to refine the design."],
    images: [
      { src: "images/robotic-arm-1.jpg", caption: "Add a caption" },
      { src: "images/robotic-arm-2.jpg", caption: "Add a caption" }
    ],
    skills: ["Communication", "Python", "Microsoft Excel", "Database Management", "CAD", "Teamwork" , "Research"]
  },
  {
    id: "Waste_Water_Treatment_Plant",
    title: "Waste Water Treatment Plant",
    role: "Researcher/Admninistrator",
    date: "January 2026 – April 2026",
    short: "Researching waste water treatment methods.",
    cover: "images/exp-waste-water.jpg",
    description: "Researched wastewater treatment strategies for controlling toxic cyanobacteria levels in a water treatment plant in Tampakan, Philippines, with a focus on monitoring methods and potential filtration approaches. The project was conducted over a period of 4 months and involved collaboration with a team of researchers and engineers.",
    did: ["Conducted literature review on wastewater treatment technologies.", "Analyzed water quality data from the treatment plant."],
    images: [
      { src: "images/waste-water-1.jpg", caption: "" },
      { src: "images/waste-water-2.jpg", caption: "Add a caption" }
    ],
    skills: ["Research", "Analysis", "Report Writing" ,"Teamwork", "Presentation"]
  },
  {
    id: "Foldable_Desk",
    title: "Foldable Desk",
    role: "Coordinator/Designer",
    date: "January 2026 – April 2026",
    short: "Designed a foldable desk for wheelchair users.",
    cover: "images/exp-foldable-desk.jpg",
    description: "Collaborated with a 5-member team to design a foldable desk for a wheelchair, tailored to our client’s physical needs, applying user-centred design principles while balancing functionality, usability, and physical constraints. ",
    did: ["Replace me", "Replace me"],
    images: [
      { src: "images/foldable-desk-1.jpg", caption: "Add a caption" },
      { src: "images/foldable-desk-2.jpg", caption: "Add a caption" }
    ],
    skills: ["Collaboration", "Event planning"]
  },
  {
    id: "tigertech",
    title: "Tiger Tech Team",
    role: "Team member",
    date: "Dates here",
    short: "Tech team supporting school events and systems.",
    cover: "images/exp-tigertech.jpg",
    description: "Write what Tiger Tech does and your part in it.",
    did: ["Replace me", "Replace me"],
    images: [
      { src: "images/tigertech-1.jpg", caption: "Add a caption" },
      { src: "images/tigertech-2.jpg", caption: "Add a caption" }
    ],
    skills: ["Troubleshooting", "A/V setup", "Teamwork"]
  },
  {
    id: "chess",
    title: "Chess Instructor",
    role: "Instructor",
    date: "Dates here",
    short: "Teaching chess strategy to younger students.",
    cover: "images/exp-chess.jpg",
    description: "Write about who you taught, how you structured lessons, and what you learned.",
    did: ["Replace me", "Replace me"],
    images: [
      { src: "images/chess-1.jpg", caption: "Add a caption" },
      { src: "images/chess-2.jpg", caption: "Add a caption" }
    ],
    skills: ["Leadership", "Lesson planning", "Strategic thinking"]
  },
  {
    id: "library",
    title: "Library Management",
    role: "Library assistant",
    date: "Dates here",
    short: "Helping run and organize the school library.",
    cover: "images/exp-library.jpg",
    description: "Write about your responsibilities in the library.",
    did: ["Replace me", "Replace me"],
    images: [
      { src: "images/library-1.jpg", caption: "Add a caption" },
      { src: "images/library-2.jpg", caption: "Add a caption" }
    ],
    skills: ["Organization", "Responsibility", "Customer service"]
  },
  {
    // 8th slot so the grid is a full 4 x 2. Replace it with a real experience, or delete it.
    id: "more",
    title: "Next experience",
    role: "Coming soon",
    date: "Dates here",
    short: "Something new is on the way.",
    cover: "images/exp-more.jpg",
    description: "Replace this with your 8th experience (internship, project, volunteering...).",
    did: ["Replace me"],
    images: [{ src: "images/more-1.jpg", caption: "Add a caption" }],
    skills: ["Add skills here"]
  }
];

/* ---------- PAGE 4: SKILLS ----------
   Fill from your resume. Add a "story" to any box to make it clickable
   (that is where you get to talk about it). */
const SKILLS = [
  { title: "Programming languages", items: ["Python", "C / C++", "Java", "JavaScript", "Verilog"],
    story: "Talk about how and where you used these: projects, coursework, the autonomy team." },
  { title: "Robotics & embedded", items: ["ROS", "Arduino / STM32", "Sensors & control", "PCB basics"],
    story: "Talk about the robots you worked on and the problems you solved." },
  { title: "Software & tools", items: ["Git / GitHub", "Linux", "VS Code", "SolidWorks"] },
  { title: "Web", items: ["HTML", "CSS", "JavaScript"] },
  { title: "Engineering fundamentals", items: ["Circuits", "Data structures", "Digital logic", "Calculus"] },
  { title: "Soft skills", items: ["Leadership", "Communication", "Teamwork", "Time management"],
    story: "Give a real example: tutoring, instructing chess, being a parade marshal..." }
];

/* ---------- PAGE 5: AWARDS (6 boxes) ---------- */
const AWARDS = [
  { id: "mcmaster-entrance", title: "McMaster Entrance Award", date: "Year", org: "McMaster University",
    image: "images/award-mcmaster.jpg", short: "Awarded on admission to McMaster University.",
    details: "Write the full story: what it is for, how you earned it, what it meant to you." },
  { id: "broadridge", title: "Broadridge Canada Scholarship", date: "Year", org: "Broadridge Canada",
    image: "images/award-broadridge.jpg", short: "Scholarship from Broadridge Canada.",
    details: "Write about the scholarship, the selection process, and what it supports." },
  { id: "badminton-intramurals", title: "Badminton Intramurals — 2nd Place", date: "Year", org: "School intramurals",
    image: "images/award-intramurals.jpg", short: "Runner-up in the school badminton intramurals.",
    details: "Write about the tournament and your matches." },
  { id: "tdssa", title: "TDSSA Badminton — 2nd Place, Championship", date: "Year", org: "TDSSA",
    image: "images/award-tdssa.jpg", short: "Runner-up at the TDSSA badminton championship.",
    details: "Write about the championship and what it took to get there." },
  { id: "championship-trophy", title: "Championship Trophy", date: "Year", org: "School",
    image: "images/award-trophy.jpg", short: "Recognized for excellence in both academics and sports.",
    details: "Write about why you received this trophy." },
  { id: "parade-marshal", title: "Parade Marshal", date: "Year", org: "School",
    image: "images/award-marshal.jpg", short: "Selected to lead as parade marshal.",
    details: "Write about the event and your responsibilities." }
];
