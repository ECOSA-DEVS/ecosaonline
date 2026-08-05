import React from 'react'
import { useNavigate } from 'react-router-dom'
import ProjectsSection from '../components/ProjectsSection'

export default function Projects(){
  const navigate = useNavigate()

  return (
    <div>
      <div className="card">
        <h3>Projects</h3>
        <p>Featured and active ECOSA initiatives. Use the buttons below to contribute or donate.</p>
      </div>
      <ProjectsSection
        onContribute={() => navigate('/payments?purpose=Project+Donation')}
        onDonate={() => navigate('/payments?purpose=Project+Donation')}
      />
    </div>
  )
}
