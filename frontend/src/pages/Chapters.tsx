import React from 'react'

const chapters = [
  {
    name: 'Kampala',
    chairperson: 'TBA',
    members: 0,
    description: 'The Kampala Chapter brings together ECOSA members living and working in Kampala and the surrounding areas.'
  },
  {
    name: 'Ibanda',
    chairperson: 'TBA',
    members: 0,
    description: 'The Ibanda Chapter serves members residing in Ibanda District and neighboring areas.'
  },
  {
    name: 'Mbarara',
    chairperson: 'TBA',
    members: 0,
    description: 'The Mbarara Chapter connects alumni living and working in Western Uganda.'
  },
  {
    name: 'Fort Portal',
    chairperson: 'TBA',
    members: 0,
    description: 'The Fort Portal Chapter promotes networking and collaboration among alumni in the Tooro region.'
  },
  {
    name: 'Gulu',
    chairperson: 'TBA',
    members: 0,
    description: 'The Gulu Chapter brings together alumni living in Northern Uganda.'
  },
  {
    name: 'Jinja',
    chairperson: 'TBA',
    members: 0,
    description: 'The Jinja Chapter supports alumni in Busoga and Eastern Uganda.'
  },
  {
    name: 'Kabale',
    chairperson: 'TBA',
    members: 0,
    description: 'The Kabale Chapter represents alumni living in the Kigezi region.'
  },
  {
    name: 'UAE',
    chairperson: 'TBA',
    members: 0,
    description: 'The UAE Chapter brings together ECOSA members living and working in the United Arab Emirates.'
  },
  {
    name: 'USA',
    chairperson: 'TBA',
    members: 0,
    description: 'The USA Chapter connects ECOSA members across the United States.'
  }
]

export default function Chapters() {
  return (
    <div>
      <div className="card">
        <h2>ECOSA Chapters</h2>
        <p>
          ECOSA Chapters provide opportunities for alumni to network,
          mentor one another, organize community activities, and support
          the objectives of the Association.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}
      >
        {chapters.map((chapter) => (
          <div key={chapter.name} className="card">
            <h3>{chapter.name} Chapter</h3>

            <p>{chapter.description}</p>

            <hr />

            <p>
              <strong>Chairperson:</strong> {chapter.chairperson}
            </p>

            <p>
              <strong>Registered Members:</strong> {chapter.members}
            </p>

            <button className="btn" disabled>
              Coming Soon
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
