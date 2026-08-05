import React from 'react'
import { Link } from 'react-router-dom'

export default function MemberCard({member, index}:{member:any, index?:number}){
  return (
    <div className="card" style={{marginBottom:12}}>
      <div style={{display:'flex',justifyContent:'space-between'}}>
        <div>
          <div style={{fontWeight:700, display:'flex', alignItems:'center', gap:8}}>
            {typeof index === 'number' && <div style={{color:'#6b7280', minWidth:28, textAlign:'right'}}>{index}.</div>}
            <div><Link to={`/members/${encodeURIComponent(member.id)}`}>{member.name}</Link></div>
          </div>
          {member.employment && <div style={{color:'#6b7280'}}>{member.employment}</div>}
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:12,color:'#6b7280'}}>{member.location || 'Location N/A'}</div>
        </div>
      </div>
    </div>
  )
}
