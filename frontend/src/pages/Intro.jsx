import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Intro() {
  const navigate = useNavigate();

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-gradient-to-br from-[#0a0f1f] via-[#0f172a] to-black text-white">
      
      {/* ================= NAV ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-400">WORKZO</h1>

          <div className="space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-gray-300 hover:text-white"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-semibold"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <SnapSection>
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">
          
          {/* COPY */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-5xl font-extrabold leading-tight">
              Work that builds  
              <br />
              <span className="text-blue-400">real trust</span>.
            </h2>

            <p className="text-lg text-gray-300 max-w-xl">
              WORKZO is a transparent job platform where work progress,
              completion, and ratings are automatically tracked — no claims,
              no manipulation.
            </p>

            <div className="flex gap-4 pt-4">
              <PrimaryBtn onClick={() => navigate("/register")}>
                Create Account
              </PrimaryBtn>
              <SecondaryBtn onClick={() => navigate("/login")}>
                Sign In
              </SecondaryBtn>
            </div>
          </motion.div>

          {/* GLASS CARD */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-3xl" />
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl space-y-6">
              <GlassStat label="Job Tracking" value="Live & Verified" />
              <GlassStat label="Completion Records" value="Automatic" />
              <GlassStat label="Ratings" value="After Real Work" />
              <GlassStat label="Profiles" value="Trust-Based" />
            </div>
          </motion.div>
        </div>
      </SnapSection>

      {/* ================= STORY 1 ================= */}
      <Story
        title="Post work with clarity"
        text="Employers post jobs, track progress in real time, and close work with confidence."
      />

      {/* ================= STORY 2 ================= */}
      <Story
        title="Build reputation by working"
        text="Workers earn ratings only after completed jobs — experience that can’t be faked."
        reverse
      />

      {/* ================= STORY 3 ================= */}
      <Story
        title="Trust is system-driven"
        text="Ratings, job counts, and profiles update automatically — not manually edited."
      />

      {/* ================= ROLES ================= */}
      <SnapSection>
        <div className="max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-10">
          <RoleCard
            title="Employers"
            points={[
              "Post & manage jobs",
              "Track job progress",
              "Mark work completed",
              "Rate workers fairly",
            ]}
          />
          <RoleCard
            title="Workers"
            points={[
              "Apply for jobs",
              "Track accepted work",
              "Earn verified ratings",
              "Build a trusted profile",
            ]}
          />
        </div>
      </SnapSection>

      {/* ================= FINAL CTA ================= */}
      <SnapSection>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto px-8 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12 shadow-2xl text-center"
        >
          <h3 className="text-3xl font-bold mb-4">
            Start working with transparency
          </h3>
          <p className="text-gray-300 mb-8">
            WORKZO replaces assumptions with verified work history.
          </p>
          <PrimaryBtn onClick={() => navigate("/register")}>
            Get Started
          </PrimaryBtn>
        </motion.div>
      </SnapSection>
    </div>
  );
}

/* ================== COMPONENTS ================== */

function SnapSection({ children }) {
  return (
    <section className="min-h-screen snap-start flex items-center">
      {children}
    </section>
  );
}

function GlassStat({ label, value }) {
  return (
    <div className="flex justify-between border-b border-white/20 pb-3">
      <span className="text-gray-300">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function Story({ title, text, reverse }) {
  return (
    <SnapSection>
      <div
        className={`max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center ${
          reverse ? "md:flex-row-reverse" : ""
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h3 className="text-3xl font-bold">{title}</h3>
          <p className="text-gray-300 text-lg">{text}</p>
        </motion.div>

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 shadow-xl">
          <p className="text-sm text-gray-400">
            Designed to remove uncertainty from every job.
          </p>
        </div>
      </div>
    </SnapSection>
  );
}

function RoleCard({ title, points }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-xl"
    >
      <h4 className="text-xl font-semibold mb-4">{title}</h4>
      <ul className="space-y-2 text-gray-300">
        {points.map((p, i) => (
          <li key={i}>• {p}</li>
        ))}
      </ul>
    </motion.div>
  );
}

function PrimaryBtn({ children, ...props }) {
  return (
    <button
      {...props}
      className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition"
    >
      {children}
    </button>
  );
}

function SecondaryBtn({ children, ...props }) {
  return (
    <button
      {...props}
      className="px-8 py-3 border border-white/30 rounded-xl font-semibold text-gray-300 hover:bg-white/10 transition"
    >
      {children}
    </button>
  );
}
