import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMembers } from '../services/mockService'

export default function MemberLink({ name }: { name: string }){
  const [id, setId] = useState<string|undefined>(undefined)
  useEffect(()=>{
    let mounted = true
    if(!name) return
    getMembers().then(list=>{
      if(!mounted) return
      const m = (list||[]).find((x:any)=> (x.name||'').toLowerCase() === (name||'').toLowerCase())
      if(m) setId(m.id)
    }).catch(()=>{})
    return ()=>{ mounted=false }
  },[name])

  if(!name) return null
  if(id) return <Link to={`/members/${encodeURIComponent(id)}`}>{name}</Link>
  return <span>{name}</span>
}
