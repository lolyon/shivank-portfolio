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
    "Passionate about combining hardware design, software development, " +
    "and problem-solving to build practical engineering solutions. " +
    "Driven by continuous learning and teamwork, I am currently seeking co-op opportunities to apply my skills to real-world projects.",

  profileImage: "images/Profile.jpg",          // your circular photo

  // Small tags under your intro on the About page (edit or delete any of them)
  interests: ["Robotics", "Guitar", "Photography"],

  // Only the About page uses a photo. Every other page is plain.
  // To give another page a photo, add a line here, e.g.  thanks: "images/my-pic.jpg"
  backgrounds: {
    hero: "images/JHE_Pic.jpg"
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
      { label: "GitHub",   value: "github.com/lolyon",     href: "https://github.com/lolyon" }
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
    date: "September 2026 – Present",
    short: "Autonomy Team Member   ",
    cover: "images/SentryRobot.jpg",
    description: "MAC RoboMaster is a multidisciplinary student team at McMaster University. Every season, we design and build a fleet of remote-controlled and autonomous battle robots from the ground up—then take them to compete with universities from around the world. We are engineers, programmers, designers, operators, and organizers united by a love of ambitious problems and hands-on learning.",
    did: [
      "Created and optimized computer vision pipelines for a robot to navigate through obstacles using python and OpenCV.",
      "Develop and learn more about designing a sentry robot for the competition that can autonomously detect and track targets using ROS2 and C++.",
    ],
    images: [
      { src: "images/SentryRobot.jpg", caption: "RoboMaster Competition - North America" },
      { src: "images/logo_master.jpg", caption: "Robomaster Competition - China" }
    ],
    video: { src: "Videos/robomaster.mp4", caption: "Testing the scan function of the robot" },
    skills: ["Teamwork", "Robotics", "C++", "Python", "Computer vision"]
  },
  { 
    id: "Robotic_Arm",
    title: "Robotic Q Arm Project", 
    role: "Study Expert",
    date: "September 2025 – December 2025",
    short: "Designed an Interface.",
    cover: "images/QArm.jpg",
    description: "During my time at university, I worked with a team of five students over eight weeks to design and build an automated robotic retail system. I designed the end-effector in Autodesk Inventor and programmed the robotic arm to pick and place customer-selected items. The system covered the full customer journey: user authentication, barcode-based ordering, object retrieval, basket placement, and automated receipt printing.<br>The project taught me how to bring mechanical design, software, and hardware integration together into one working product. Because we split the system into modules, I learned to coordinate with teammates, define clear interfaces between components, and keep to a tight deadline. I’m excited to bring this combination of hands-on engineering and collaborative problem-solving as a studyexpert.",
    did: ["Created a user-friendly interface for the robotic   arm. ","Created an end-effector for the robotic arm.","Created a database to store user information and preferences.", "Tested the interface with users and gathered feedback to refine the design.", "Used Autodesk Inventor to design the end-effector for the robotic arm."],
    images: [
      { src: "images/QArm(1).jpg", caption: "Robotic Q-Arm" },
      { src: "images/endeffector.jpg", caption: "End-Effector of the Robotic Arm" }
    ],
    report: "images/q-arm-report.pdf", // add your report PDF to images/ using this filename
    skills: ["Communication", "Python", "Microsoft Excel", "Database Management", "CAD", "Teamwork" , "Research"]
  }, 
  {
    id: "F1_Car",
    title: "F1 Car Design",
    role: "Design Engineer",
    date: "September 2025 – December 2025",
    short: "Designed and tested an F1 car prototype.",
    cover: "images/f1car.jpg",
    description: "This project sparked a genuine passion for CAD and product design. Working in Autodesk Inventor, I learned to model gears, apply the dimensional constraints needed for 3D printing, and translate an idea in my head into a precise, buildable part. That process of seeing a concept take shape on screen and then in my hands is what I enjoy most about engineering. Eager to keep developing these skills, I spent my winter break designing and building a model of an F1 car, a goal I had held since childhood. Applying what I had learned to a project of my own choosing showed me how much I enjoy design work and made me want to pursue it further in a professional setting.",
    did: ["Designed and tested an F1 car prototype.", "Created detailed CAD models using Autodesk Inventor.", "Presented the design to peers and faculty for feedback."],
    images: [
      { src: "images/f1car.jpg", caption: "F1 Car Prototype" },
      { src: "images/f1car2.jpg", caption: "Inspired design" }
    ],
    skills: ["Research", "Analysis", "Design`", "Autodesk Inventor" , "Presentation"]
  },
  {
    id: "Waste_Water_Treatment_Plant",
    title: "Waste Water Treatment Plant",
    role: "Researcher/Admninistrator",
    date: "January 2026 – April 2026",
    short: "Researching waste water treatment methods at Philippines.",
    cover: "images/wastewater1.jpg",
    description: "Researched wastewater treatment strategies for controlling toxic cyanobacteria levels in a water treatment plant in Tampakan, Philippines, with a focus on monitoring methods and potential filtration approaches. The project was conducted over a period of 4 months and involved collaboration with a team of researchers and engineers. We determined and presented our findings to the plant management, providing recommendations for improving water quality and reducing the risk of harmful algal blooms. This was done using scientofic tools to analyze water quality data and develop formulas to determine the best filtration method for the plant.",
    did: ["Conducted literature review on wastewater treatment technologies.", "Analyzed water quality data from the treatment plant.", "Developed formulas on porosity and permeability of different materials to determine the best filtration method."],
    images: [
      { src: "images/wastewater1.jpg", caption: "Waste Water Treatment Plant in Tampakan, Philippines" },
      { src: "images/waste2.jpg", caption: "Properties chart we created to decide on materials" }
    ],
    report: "images/wastewater-report.pdf", // add your report PDF to images/ using this filename
    skills: ["Research", "Analysis", "Report Writing" ,"Teamwork", "Presentation"]
  },
  {
    id: "Foldable_Desk",
    title: "Foldable Desk",
    role: "Coordinator/Designer",
    date: "January 2026 – April 2026",
    short: "Designed a foldable desk for wheelchair users.",
    cover: "images/p3image2.jpg",
    description: "Collaborated with a 5-member team to design a foldable desk for a wheelchair, tailored to our client’s physical needs, applying user-centred design principles while balancing functionality, usability, and physical constraints. ",
    did: ["Coordinated team meetings and planned agendas.", "Helped with the design and prototyping of the foldable desk.", "Conducted user testing and gathered feedback to improve the design.", "Conducted research on materials and manufacturing processes for the desk."],
    images: [
      { src: "images/p3image3.jpg", caption: "Foldable Desk Test on a Chair with the same dimensions as the wheelchair" },
      { src: "images/p3image1.jpg", caption: "Book/iPad Holder for the Foldable Desk" }
    ],
    skills: ["Collaboration", "Event planning", "CAD", "Prototyping", "User testing", "Research"]
  }  
];

/* ---------- PAGE 4: SKILLS ----------
   TOP HALF: scrolling icons (icon files live in images/icons/).
   To swap in an official logo, just replace the file with the same name. */
const TOOLS = [
  { name: "Python",             icon: "images/icons/python.svg" },
  { name: "C / C++",            icon: "images/icons/cpp.svg" },
  { name: "Java",               icon: "images/icons/java.svg" },
  { name: "HTML",               icon: "images/icons/html.svg" },
  { name: "SQL",                icon: "images/icons/sql.svg" },
  { name: "AutoCAD",            icon: "images/icons/autocad.svg" },
  { name: "Autodesk Inventor",  icon: "images/icons/inventor.svg" },
  { name: "SolidWorks",         icon: "images/icons/solidworks.svg" },
  { name: "GitHub",             icon: "images/icons/github.svg" },
  { name: "Linux",              icon: "images/icons/linux.svg" }
];

/* BOTTOM HALF: soft skills. On hover each one lists the experiences that use it.
   - match: any skill name in an experience's "skills" list that counts for this soft skill
   - ids:   experience ids to add by hand (the "id" values in EXPERIENCES)
   - extra: plain text entries to add (for example an award) */
const SOFT_SKILLS = [
  { name: "Teamwork",             match: ["Teamwork", "Collaboration"] },
  { name: "Communication",        match: ["Communication", "Presentation", "Report Writing"] },
  { name: "Leadership",           ids: ["Foldable_Desk"], extra: ["Parade Marshal (award)"] },
  { name: "Research",             match: ["Research"] },
  { name: "Problem-solving",      match: ["Problem-solving", "Troubleshooting"] },
  { name: "Analytical thinking",  match: ["Analysis", "Data analysis", "Strategic thinking"] },
  { name: "Organization & planning", match: ["Organization", "Event planning", "Responsibility"] }
];

/* ---------- PAGE 5: AWARDS (6 boxes) ---------- */
const AWARDS = [
  { id: "mcmaster-entrance", title: "McMaster Entrance Award", date: "2025-2026", org: "McMaster University",
    image: "images/award1.jpg", short: "Awarded on admission to McMaster University.",
    details: "My commitment to academic excellence is reflected in receiving the McMaster Entrance Award scholarship, earned by achieving a near-perfect 98.2% overall average. Driven by a 99% standing in advanced mathematics and science, this achievement underscores my strong analytical capabilities, dedication to mastering complex concepts, and proven track record of top-tier performance." },
  { id: "HarbordScholarship", title: "Harbord Wolfsted Award Scholarship", date: "2025", org: "Harbord Collegiate Institute",
    image: "images/award5.jpg", short: "Awarded for academic excellence at Harbord Collegiate Institute.",
    details: "Honored to share that I have received the Lily Wolfstod Rebick Award for Academic Excellence from Harbord Collegiate Institute! This award recognizes high academic achievement and dedication to scholastic excellence. I’m deeply grateful to my teachers, peers, and mentors who supported me along the way, and I look forward to carrying this momentum into my continued studies in engineering and design!" },
  { id: "broadridge", title: "Broadridge Canada Scholarship", date: "2025-2029", org: "Broadridge Canada",
    image: "images/award2.jpg", short: "Scholarship from Broadridge Canada.",
    details: "My dedication to both academic excellence and community impact is demonstrated through earning the McMaster Entrance Award for a 98.2% overall average—driven by 99% standing in math and science—as well as the Broadridge Canada Scholarship. Supported by exceptional teacher endorsements, the Broadridge scholarship recognizes my leadership and community engagement in mentoring others through math tutoring and coaching badminton, reflecting my commitment to bringing drive, accountability, and strong interpersonal skills to the workplace." },
  { id: "badminton-intramurals", title: "Badminton Intramurals — 2nd Place", date: "Spring 2026", org: "School intramurals",
    image: "images/award3.jpg", short: "Runner-up in the school badminton intramurals.",
    details: "Beyond my scholastic honors, I demonstrate strong drive and adaptability through competitive athletics. Most recently, I secured 2nd place in the intramural badminton championship despite facing a high-caliber bracket that included provincial and national players. This tournament provided an incredible opportunity to challenge myself against elite competition, learn from experienced peers, and foster meaningful connections within the athletic community." },
  { id: "tdssa", title: "TDSSA Badminton — 2nd Place, Championship", date: "2025", org: "TDSSA",
    image: "images/award4.jpg", images: ["images/tdssa2.jpg"], // add your second TDSSA photo as images/tdssa2.jpg
    short: "Runner-up at the TDSSA badminton championship.",
    details: "My commitment to athletic and personal excellence is demonstrated through a strong track record in competitive sports. Building on my high school achievement as Runner-up at the TDSSA Badminton Championship, I continued competing at a high level at McMaster, placing 2nd in the university intramural tournament against provincial and national-caliber athletes. These experiences have instilled in me deep strategic discipline, composure under pressure, and a passion for continuous skill development." },
  { id: "championship-trophy", title: "Championship Trophy", date: "2023", org: "School",
    image: "images/championship.jpg", images: ["images/championship1.jpg"], short: "Awarded the championship trophy for leading the school to top performance across academics, sports, and discipline.",
    details: "Beyond quantitative rigor, my leadership capabilities are grounded in executive student governance. As elected High School Captain (2022–23) and recognized as the Best Member of the Student Council, I directed school-wide strategy that led our team to top the charts across all evaluated categories—academic performance, sports, and overall discipline. From commanding the Independence Day Parade to fostering school spirit and cross-functional accountability, I have consistently driven teams toward top-tier performance." },

];

/* ---------- PHOTOGRAPHY PAGE ----------
   Put your photos in  images/photography/  and use those file names below.
   (Until a file exists, a soft placeholder is shown.) */
const PHOTOGRAPHY = {
  url: "https://lolyon.github.io/shivank-photography/",
  lead: "Toronto from the sidewalk: towers, airplanes and the odd flower, caught in passing light.",
  paragraphs: [
    "I photograph the city I walk through every day. Most frames start with looking up: a tower between two brick walls, a glass facade catching the last of the sun, a street still wet from rain.",
    "I shoot handheld, favour natural light, and edit lightly so a place still looks like itself. Airplanes crossing a clean sky and a flower on the way home are just as welcome as the skyline. The full gallery lives on my photography website."
  ],
  facts: [
    { label: "Based in", value: "Toronto, Ontario" },
    { label: "Focus",    value: "Street & architecture" },
    { label: "Style",    value: "Handheld, natural light" }
  ],
  tiles: [
    { label: "CN Tower",    src: "images/photo-10.jpg" },
    { label: "Airplanes", src: "images/photo-25.jpg" },
    { label: "Flowers",   src: "images/photo-02.jpg" }
  ]
};