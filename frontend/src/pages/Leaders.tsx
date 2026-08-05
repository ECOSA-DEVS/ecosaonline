import React, { useEffect, useState } from 'react'
import { getLeaders } from '../services/mockService'

export default function Leaders(){
  const [leaders,setLeaders]=useState<any[]>([])
  const [regime,setRegime]=useState<string>('current')
  const [search,setSearch]=useState<string>('')
  const [availableRegimes,setAvailableRegimes]=useState<string[]>(['current'])

  useEffect(()=>{
    let mounted = true
    ;(async ()=>{
      try{
        const all = await getLeaders()
        if(!mounted) return
        const regs = new Set<string>(['current'])
        all.forEach((l:any)=> regs.add(l.regime||'current'))
        setAvailableRegimes(Array.from(regs))
      }catch(e){}
    })()
    return ()=>{ mounted = false }
  },[])

  useEffect(()=>{
    let mounted = true
    ;(async ()=>{
      try{
        const l = await getLeaders(regime)
        if(mounted) setLeaders(l)
      }catch(e){}
    })()
    return ()=>{ mounted = false }
  },[regime])

  const filtered = leaders.filter(l=> l.name.toLowerCase().includes(search.toLowerCase()) || (l.role||'').toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <h3>ECOSA Leaders</h3>
      <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:12}}>
        <div>
          <label>Regime</label>
          <select value={regime} onChange={e=>setRegime(e.target.value)}>
            {availableRegimes.map(r=> <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label>Search</label>
          <input placeholder="Search name or role" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
      </div>

      {filtered.map(l=> (
        <div key={l.id} className="card" style={{marginBottom:8}}>
          <div>
            <div style={{fontWeight:700}}>{l.name}</div>
            <div style={{color:'#6b7280'}}>{l.role}</div>
            <div style={{marginTop:8}}>{l.bio}</div>
            {l.regime && <div style={{fontSize:12,color:'#9ca3af',marginTop:6}}>Regime: {l.regime}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}
