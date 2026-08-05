import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getMembers } from '../services/mockService'

export default function MemberProfile(){
  const { id } = useParams()
  const [member,setMember] = useState<any>(null)

  useEffect(()=>{
    let mounted = true
    if(!id) return
    getMembers().then(list=>{
      if(!mounted) return
      const m = (list||[]).find((x:any)=> x.id === id || x.membershipNumber === id)
      setMember(m)
    }).catch(()=>{})
    return ()=>{ mounted=false }
  },[id])

  if(!member) return <div className="card">Member not found</div>

  const business = member.hasBusiness && member.businessName
    ? `${member.businessName}${member.businessDescription ? ` - ${member.businessDescription}` : ''}`
    : member.business || 'Not provided'

  const details = [
    ['Membership number', member.membershipNumber || member.id],
    ['Phone', member.phone || 'Not provided'],
    ['Email', member.email || 'Not provided'],
    ['Career', member.employment || 'Not provided'],
    ['Business', business],
    ['Years at ECI', member.yearsAtECI || 'Not provided'],
  ]

  return (
    <div className="card">
      <h3>{member.name}</h3>
      <div style={{display:'grid',gap:10,marginTop:12}}>
        {details.map(([label, value])=>(
          <div key={label} style={{display:'grid',gridTemplateColumns:'minmax(140px, 220px) 1fr',gap:12}}>
            <div style={{color:'#6b7280'}}>{label}</div>
            <div>{value}</div>
          </div>
        ))}
        {member.location && (
          <div style={{display:'grid',gridTemplateColumns:'minmax(140px, 220px) 1fr',gap:12}}>
            <div style={{color:'#6b7280'}}>Location</div>
            <div>{member.location}</div>
          </div>
        )}
      </div>
    </div>
  )
}
