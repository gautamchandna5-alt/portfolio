import { useEffect, useRef, useState } from 'react'

const SKILL_CATEGORIES = [
  {
    title: 'Frontend',
    skills: ['React', 'TypeScript', 'Next.js', 'Three.js / R3F', 'Tailwind CSS', 'HTML5 / CSS3']
  },
  {
    title: 'Backend',
    skills: ['Node.js', 'Express', 'Python', 'REST APIs', 'GraphQL', 'PostgreSQL', 'MongoDB']
  },
  {
    title: 'Tools & DevOps',
    skills: ['Git & GitHub', 'Docker', 'AWS', 'Vite', 'Linux', 'CI/CD']
  }
]

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const lastStepRef = useRef(0)
  const [activeMobileStep, setActiveMobileStep] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current
      if (!el || window.innerWidth >= 768) return

      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const scrollableDistance = Math.max(1, rect.height - vh)
      const progress = Math.min(1, Math.max(0, -rect.top / scrollableDistance))
      const step = Math.min(3, Math.floor(progress * 4))

      // Only trigger a React state update when the step index actually changes (0, 1, 2, or 3)
      if (step !== lastStepRef.current) {
        lastStepRef.current = step
        setActiveMobileStep(step)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full h-[280vh] md:h-auto md:min-h-screen"
    >
      {/* MOBILE VIEW: Top 60% = 3D Character, Bottom 40% = Paragraph then Cards one by one */}
      <div className="sticky top-0 h-screen w-full flex flex-col md:hidden overflow-hidden">
        <div className="w-full h-[60vh] shrink-0 pointer-events-none" />

        <div className="relative z-20 w-full h-[40vh] shrink-0 px-5 pb-6 flex flex-col justify-between">
          <div className="relative w-full flex-1 flex items-center justify-center">
            {/* Step 0: About Me Paragraph */}
            <div
              className={`w-full p-5 rounded-2xl bg-white/75 backdrop-blur-md border border-white/80 shadow-sm transition-all duration-300 ${
                activeMobileStep === 0
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-3 pointer-events-none absolute inset-x-0'
              }`}
            >
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">About Me</h2>
              <p className="mt-2 text-sm text-gray-800 leading-relaxed">
                I’m a passionate Fullstack Developer who loves building interactive, performant web
                applications and immersive 3D digital experiences. From crafting responsive user
                interfaces to architecting scalable backends, I enjoy turning complex ideas into
                polished products.
              </p>
            </div>

            {/* Steps 1..3: Skills Cards one by one */}
            {SKILL_CATEGORIES.map((category, idx) => {
              const isVisible = activeMobileStep === idx + 1
              return (
                <div
                  key={category.title}
                  className={`w-full p-5 rounded-2xl bg-white/75 backdrop-blur-md border border-white/80 shadow-sm transition-all duration-300 ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-3 pointer-events-none absolute inset-x-0'
                  }`}
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Skills ({idx + 1}/{SKILL_CATEGORIES.length})
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mt-1 mb-3">{category.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-white/90 text-gray-800 shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            {[0, 1, 2, 3].map((stepIdx) => (
              <span
                key={stepIdx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeMobileStep === stepIdx ? 'w-6 bg-gray-900' : 'w-2 bg-gray-400/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* DESKTOP VIEW: Left 5/12 = Standing Character, Right 7/12 = About Me + Skills */}
      <div className="hidden md:flex w-full min-h-screen items-center justify-between px-20 py-24">
        <div className="w-5/12 min-h-[75vh] shrink-0 pointer-events-none" />

        <div className="relative z-20 w-7/12 flex flex-col justify-center space-y-8">
          <div>
            <h2 className="text-5xl font-bold tracking-tight text-gray-900">About Me</h2>
            <p className="mt-4 text-lg text-gray-800 leading-relaxed max-w-2xl">
              I’m a passionate Fullstack Developer who loves building interactive, performant web
              applications and immersive 3D digital experiences. From crafting responsive user
              interfaces to architecting scalable backends, I enjoy turning complex ideas into
              polished products.
            </p>
          </div>

          <div className="space-y-5">
            <h3 className="text-2xl font-bold text-gray-900">Skills &amp; Technologies</h3>
            <div className="grid grid-cols-2 gap-4">
              {SKILL_CATEGORIES.map((category) => (
                <div
                  key={category.title}
                  className="p-5 rounded-2xl bg-white/45 backdrop-blur-md border border-white/60 shadow-sm"
                >
                  <h4 className="text-base font-semibold text-gray-900 mb-3">{category.title}</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 text-sm font-medium rounded-full bg-white/80 text-gray-800 shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}