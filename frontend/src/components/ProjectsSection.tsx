import React from 'react'

type Project = {
  title: string
  description: string
  status: string
  featured?: boolean
}

const featuredProjects: Project[] = [
  {
    title: 'ECOSA SACCO',
    description: 'A member-owned savings and credit cooperative helping alumni save, access loans, and build financial security together.',
    status: 'Ongoing',
    featured: true,
  },
  {
    title: 'ECOSA Medical Insurance',
    description: 'Affordable group medical cover for alumni and their families, providing access to quality healthcare when it matters most.',
    status: 'Ongoing',
    featured: true,
  },
]

const allProjects: Project[] = [
  ...featuredProjects,
  {
    title: 'Alumni Scholarship Fund',
    description: 'Support current students with tuition, mentorship, and career coaching.',
    status: 'Ongoing',
  },
  {
    title: 'Community Health Drive',
    description: 'Fund medical camps, clean water projects and health education for alumni families.',
    status: 'Ongoing',
  },
  {
    title: 'Library Renovation',
    description: 'Upgrade the college library with new books, furniture and study spaces.',
    status: 'Planned',
  },
  {
    title: 'Entrepreneurship Bootcamp',
    description: 'Run a skills accelerator for alumni-led startups and small businesses.',
    status: 'Planned',
  },
  {
    title: 'Sports & Wellness Hub',
    description: 'Create a wellness program and equipment fund for students and alumni.',
    status: 'Ongoing',
  },
]

export default function ProjectsSection({
  onContribute,
  onDonate,
}: {
  onContribute?: () => void
  onDonate?: () => void
}) {
  return (
    <section className="card" style={{ marginTop: 24 }}>
      <h3>Projects</h3>
      <p>Explore featured ongoing work and all current ECOSA projects. Support the cause by contributing your pay or donating directly.</p>

      <div style={{ display: 'grid', gap: 20 }}>
        <div>
          <h4>Featured Ongoing Projects</h4>
          <div style={{ display: 'grid', gap: 12 }}>
            {featuredProjects.map((project) => (
              <div key={project.title} style={{ padding: 14, background: '#fafafa', borderRadius: 12, border: '1px solid rgba(0,0,0,.08)' }}>
                <strong>{project.title}</strong>
                <p style={{ margin: '6px 0 0', color: '#4b5563' }}>{project.description}</p>
                <small style={{ color: '#6b7280' }}>{project.status}</small>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4>All Projects</h4>
          <div style={{ display: 'grid', gap: 12 }}>
            {allProjects.map((project) => (
              <div key={project.title} style={{ padding: 14, background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,.06)' }}>
                <strong>{project.title}</strong>
                <p style={{ margin: '6px 0 0', color: '#4b5563' }}>{project.description}</p>
                <small style={{ color: '#6b7280' }}>{project.status}</small>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 18, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button type="button" className="btn" onClick={onContribute}>
          Contribute your pay
        </button>
        <button type="button" className="btn" onClick={onDonate}>
          Donate
        </button>
      </div>
    </section>
  )
}
