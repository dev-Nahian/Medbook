import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const posts = [
  {
    id: 1,
    date: "August 5, 2023",
    title: "The Benefits of Mindfulness Meditation for Stress and Anxiety",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80",
  },
  {
    id: 2,
    date: "August 5, 2023",
    title: "Healthy Eating on a Budget: Tips and Strategies",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80",
  },
  {
    id: 3,
    date: "August 5, 2023",
    title: "The Importance of Regular Cancer Screenings and Early Detection",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&q=80",
  },
];

const FacebookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b0c4d8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b0c4d8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b0c4d8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b0c4d8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const SocialIcons = () => (
  <div className="flex items-center gap-2">
    {[FacebookIcon, LinkedInIcon, InstagramIcon, XIcon].map((Icon, i) => (
      <div
        key={i}
        className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:border-[#4fc3f7] transition-colors duration-200"
        style={{ border: "1.5px solid #d0dde8" }}
      >
        <Icon />
      </div>
    ))}
  </div>
);

// Fixed Variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,   // Fixed with 'as const'
    },
  },
};

export default function BlogPosts() {
  return (
    <section
      className="w-full bg-white py-10 px-6"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <p
          className="text-base text-primary font-bold tracking-widest mb-2"
        >
          BLOG POSTS
        </p>
        <h2
          className="text-[45px] font-extrabold text-secondary"
        >
          Latest Update
        </h2>
      </div>

      {/* Cards Grid */}
      <motion.div
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {posts.map((post) => (
          <motion.div
            key={post.id}
            variants={cardVariants}
            whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(0,0,0,0.10)" }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl overflow-hidden cursor-pointer group"
            style={{
              boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
              border: "1px solid #f0f4f8",
            }}
          >
            {/* Image */}
            <div className="overflow-hidden" style={{ height: 220 }}>
              <motion.img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>

            {/* Content */}
            <div className="px-5 pt-4 pb-6">
              {/* Date + Social */}
              <div className="flex items-center justify-between mb-4 hover:text-black transition-colors duration-200">
                <span className="text-xs text-gray-400" >
                  {post.date}
                </span>
                <SocialIcons />
              </div>

              {/* Title */}
              <h3
                className="text-sm font-bold leading-snug mb-5"
                style={{
                  color: "#1a2e3b",
                  lineHeight: 1.55,
                  minHeight: 52,
                }}
              >
                {post.title}
              </h3>

              {/* Divider */}
              <div className="mb-4" style={{ borderTop: "1px solid #f0f4f8" }} />

              {/* Learn more */}
              <Link
                to={`/blog/${post.id}`}
                className="text-xs font-semibold transition-colors duration-200 text-gray-500 hover:underline hover:text-secondary"
              >
                Learn more
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}