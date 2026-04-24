const mongoose = require('mongoose');
const dotenv = require('dotenv');
const About = require('./models/About');
const Education = require('./models/Education');
const Review = require('./models/Review');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://arwamohamedsalah05_db_user:Arwa%4056789@cluster0.dzf1tgl.mongodb.net/portfolio?retryWrites=true&w=majority';

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Seed About Section
    const existingAbout = await About.findOne();
    if (!existingAbout) {
      const about = new About({
        title: 'About Me',
        description: `A passionate fullstack developer exploring the infinite possibilities of web and mobile technologies. 
I create digital experiences that are not only functional but also beautiful and user-friendly.

My journey in the coding universe started with HTML and CSS, and has evolved to include cutting-edge frameworks like React, Next.js, and React Native. I'm constantly learning and adapting to new technologies to deliver stellar solutions.

I'm a proud graduate of the Information Technology Institute (ITI) from the Frontend & Cross-Platform Development track, where I honed my skills in modern web and mobile development technologies. This intensive program equipped me with the expertise to build comprehensive digital solutions across multiple platforms.`,
        image: 'https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?auto=compress&cs=tinysrgb&w=600',
        stats: [
          { number: '50+', label: 'Projects Completed', icon: 'Code' },
          { number: '3+', label: 'Years Experience', icon: 'Calendar' },
          { number: '15+', label: 'Technologies Mastered', icon: 'Rocket' },
          { number: '100%', label: 'Client Satisfaction', icon: 'Heart' }
        ],
        personalInfo: {
          location: 'Egypt',
          availability: 'Available for work',
          github: 'https://github.com/Arwamohamedsalah',
          linkedin: 'https://www.linkedin.com/in/arwamsalah/',
          khamsat: 'https://khamsat.com/user/arwa_mohamedsalah',
          mostaql: 'https://mostaql.com/u/ArwaMsalah'
        }
      });
      await about.save();
      console.log('✅ About section seeded');
    } else {
      console.log('⚠️ About section already exists');
    }

    // Seed Education Section
    const existingEducation = await Education.findOne();
    if (!existingEducation) {
      const education = new Education({
        institution: 'Information Technology Institute',
        degree: 'Frontend & Cross-Platform Development Graduate',
        duration: '8 Months Intensive Training Program',
        description: 'Completed an intensive 8-month dual-track program at ITI, one of Egypt\'s leading technology institutes. The program provided comprehensive training in software fundamentals and advanced frontend & cross-platform development technologies.',
        tracks: [
          {
            title: 'Software Fundamentals Track',
            duration: '4 Months Scholarship',
            period: 'First Track',
            description: 'Comprehensive foundation in software development principles and core programming concepts.',
            skills: [
              { name: 'Programming Fundamentals', category: 'Core' },
              { name: 'Object-Oriented Programming', category: 'Core' },
              { name: 'Data Structures & Algorithms', category: 'Core' },
              { name: 'HTML', category: 'Web' },
              { name: 'CSS', category: 'Web' },
              { name: 'JavaScript', category: 'Programming' },
              { name: 'Database Fundamentals', category: 'Database' },
              { name: 'Software Engineering Principles', category: 'Core' },
              { name: 'Problem Solving & Logic', category: 'Core' },
              { name: 'Version Control (Git)', category: 'Tools' },
              { name: 'Testing Fundamentals', category: 'Quality' },
              { name: 'WordPress', category: 'CMS' },
              { name: 'PHP', category: 'Backend' }
            ]
          },
          {
            title: 'Frontend & Cross-Platform Mobile Application Track',
            duration: '4 Months Scholarship',
            period: 'Advanced Track',
            description: 'Specialized training in modern frontend frameworks, mobile application development, and cross-platform technologies.',
            skills: [
              { name: 'HTML5', category: 'Web' },
              { name: 'CSS3', category: 'Web' },
              { name: 'SASS', category: 'Web' },
              { name: 'Tailwind CSS', category: 'Styling' },
              { name: 'Responsive Web Design (RWD)', category: 'Web' },
              { name: 'UI/UX Design', category: 'Design' },
              { name: 'JavaScript (ECMAScript)', category: 'Programming' },
              { name: 'TypeScript', category: 'Programming' },
              { name: 'OOP using JavaScript', category: 'Programming' },
              { name: 'React.js', category: 'Frontend' },
              { name: 'Next.js', category: 'Frontend' },
              { name: 'Material UI', category: 'UI Library' },
              { name: 'React Native', category: 'Mobile' },
              { name: 'Flutter', category: 'Mobile' },
              { name: 'Node.js', category: 'Backend' },
              { name: 'Express.js', category: 'Backend' },
              { name: 'MongoDB', category: 'Database' },
              { name: 'Progressive Web Apps (PWA)', category: 'Web' },
              { name: 'Web Development Tools & Management', category: 'Tools' },
              { name: 'JavaScript Unit Testing Frameworks', category: 'Quality' },
              { name: 'JavaScript Packaging & Building Tools', category: 'Tools' },
              { name: 'Version Control', category: 'Tools' },
              { name: 'JS Design Patterns', category: 'Architecture' },
              { name: 'Secure Coding', category: 'Security' },
              { name: 'OS Fundamentals Workshop', category: 'Core' },
              { name: 'Network Fundamentals Workshop', category: 'Core' },
              { name: 'JavaScript Fundamentals', category: 'Programming' },
              { name: 'Advanced JavaScript', category: 'Programming' },
              { name: 'Modern JavaScript (ES6+)', category: 'Programming' },
              { name: 'Database Fundamentals', category: 'Database' }
            ]
          }
        ]
      });
      await education.save();
      console.log('✅ Education section seeded');
    } else {
      console.log('⚠️ Education section already exists');
    }

    // Seed Reviews Section
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      const reviews = [
        {
          name: 'براء عواد',
          role: 'مستشار تسويقي',
          company: 'Khamsat',
          content: 'شكرا لك على العمل الأكثر من رائع وعلى جودة الخدمة وتسليم قبل الوقت المتفق عليه وبإذن الله في تعامل لنا مره ثانيه',
          rating: 5,
          featured: true,
          order: 0
        },
        {
          name: 'محمد الحسن',
          role: 'مشتري جديد',
          company: 'Khamsat',
          content: 'كانت تجربة العمل مع الأستاذة أروى ممتازة. تعاملها راقٍ، وفهمت المطلوب بدقة، وسلمت الصفحة بشكل احترافي ومتجاوبة مع جميع الأجهزة. عندها صبر كبير وتجاوب سريع، وما قصّرت بأي تعديل طلبته. أنصح بالتعامل معها بشدة، وإن شاء الله مش آخر مرة. شكراً أروى!',
          rating: 5,
          featured: true,
          order: 1
        },
        {
          name: 'kafaaalmetmiza',
          role: 'مدخل بيانات',
          company: 'Khamsat',
          content: 'والله العظيم ممتازه جداً واداءها احترافي ججداً انصح بالتعامل معها بقوه وما راح يكون اول تعامل',
          rating: 5,
          featured: true,
          order: 2
        },
        {
          name: 'zaidabuhaq',
          role: 'مشتري VIP',
          company: 'Khamsat',
          content: 'عمل ممتاز ورائع',
          rating: 5,
          featured: false,
          order: 3
        },
        {
          name: 'مصطفى م.',
          role: 'دعم، مساعدة وإدخال بيانات',
          company: 'Mostaql',
          content: 'رائع جداً سرعة في التواصل والتعامل والتسليم',
          rating: 5,
          featured: false,
          order: 4
        }
      ];

      await Review.insertMany(reviews);
      console.log('✅ Reviews section seeded');
    } else {
      console.log('⚠️ Reviews already exist');
    }

    console.log('\n✅ All data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();

