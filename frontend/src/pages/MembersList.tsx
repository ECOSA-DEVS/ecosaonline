import React, { useEffect, useState } from 'react'
import { getMembers } from '../services/mockService'
import MemberCard from '../components/MemberCard'

export default function MembersList(){
  const [members,setMembers]=useState<any[]>([])
  const [query,setQuery]=useState('')
  useEffect(()=>{
    let mounted=true
    getMembers().then(m=>{ if(mounted) setMembers(m) }).catch(()=>{})
    return ()=>{ mounted=false }
  },[])
  return (
    <div>
      <h3>Members ({members.length})</h3>
      <div style={{marginBottom:12}}>
        <input placeholder="Search members by name" value={query} onChange={e=>setQuery(e.target.value)} style={{padding:8,width:'100%',maxWidth:480}} />
      </div>
      {members.length===0 && <div className="card">No members yet — invite colleagues to join ECOSA</div>}
      {members.filter(m=> (m.name||'').toLowerCase().includes(query.toLowerCase())).map((m,i)=> <MemberCard key={m.id} member={m} index={i+1} />)}
    </div>
  )
}
