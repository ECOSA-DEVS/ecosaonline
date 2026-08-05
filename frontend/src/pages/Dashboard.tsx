import React, { useEffect, useState } from 'react'
import { getMembers, getPayments, getPosts, getResources, addPost } from '../services/mockService'

function formatDate(value?: string) {
  if (!value) return 'Unknown'
  const date = new Date(value)
  return isNaN(date.getTime()) ? 'Unknown' : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function Dashboard(){
  const [members,setMembers]=useState<any[]>([])
  const [payments,setPayments]=useState<any[]>([])
  const [posts,setPosts]=useState<any[]>([])
  const [resources,setResources]=useState<any[]>([])
  const [title,setTitle]=useState('')
  const [body,setBody]=useState('')

  useEffect(()=>{
    let mounted=true
    const load = async ()=>{
      const [m,p,postsData,resourcesData] = await Promise.all([
        getMembers(),
        getPayments(),
        getPosts(),
        getResources(),
      ])
      if(mounted){
        setMembers(m || [])
        setPayments(p || [])
        setPosts(postsData || [])
        setResources(resourcesData || [])
      }
    }
    load()
    return ()=>{ mounted=false }
  },[])

  const submit = async (e:React.FormEvent)=>{
    e.preventDefault()
    if(!title||!body) return alert('Enter title and body for the update')

    await addPost({
      id: Date.now().toString(),
      title,
      content: body,
      author: 'ECOSA Admin',
      createdAt: new Date().toISOString(),
      registerUrl: '/register'
    })

    setTitle('')
    setBody('')

    const [m,p,postsData] = await Promise.all([
      getMembers(),
      getPayments(),
      getPosts(),
    ])

    setMembers(m || [])
    setPayments(p || [])
    setPosts(postsData || [])

    alert('Update published')
  }

  const chapterCount = 9

  return (
    <div className="dashboard-grid">
      <div className="card dashboard-hero">
        <div>
          <h3>ECOSA Admin Workspace</h3>
          <p>Manage member approvals, payment records, chapter content, and community announcements from one creator-focused control center.</p>
        </div>
        <div className="dashboard-hero-actions">
          <a href="#members-panel" className="btn">Review members</a>
          <a href="#payments-panel" className="btn">Confirm payments</a>
          <a href="#chapters-panel" className="btn">Manage chapters</a>
          <a href="#resources-panel" className="btn">Manage resources</a>
          <a href="#updates-panel" className="btn">Publish update</a>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="card dashboard-stat">
          <span>{members.length}</span>
          <div>Active Members</div>
        </div>
        <div className="card dashboard-stat">
          <span>{payments.length}</span>
          <div>Payment Records</div>
        </div>
        <div className="card dashboard-stat">
          <span>{posts.length}</span>
          <div>Published Updates</div>
        </div>
        <div className="card dashboard-stat">
          <span>{resources.length}</span>
          <div>Shared Resources</div>
        </div>
        <div className="card dashboard-stat">
          <span>{chapterCount}</span>
          <div>Chapters</div>
        </div>
      </div>
    </div>
  )
}
