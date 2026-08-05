import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPosts } from '../services/mockService'

function formatTime(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function Community(){
  const [posts,setPosts]=useState<any[]>([])

  useEffect(()=>{
    let mounted = true
    ;(async ()=>{
      try{
        const p = await getPosts()
        if(mounted) setPosts(p)
      }catch(e){}
    })()
    return ()=>{ mounted=false }
  },[])

  return (
    <div>
      <div className="card">
        <h3>Community Updates</h3>
        <p>Latest announcements from ECOSA administration. This page is read-only; only admins publish updates here.</p>
      </div>

      <div style={{marginTop:12}}>
        {posts.length===0 && <div className="card">No updates yet — check back later.</div>}
        {posts.map((post:any)=> (
          <div key={post.id} className="card" style={{marginBottom:12}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div>
                <strong>{post.title || post.content || post.body}</strong>
                <div style={{color:'#6b7280',fontSize:12,marginTop:4}}>{`Admin ${post.author ? `- ${post.author}` : ''}`} · {formatTime(post.createdAt)}</div>
              </div>
              {post.registerUrl && (
                post.registerUrl.startsWith('/') ? (
                  <Link className="btn" to={post.registerUrl} style={{whiteSpace:'nowrap'}}>Register</Link>
                ) : (
                  <a className="btn" href={post.registerUrl} style={{whiteSpace:'nowrap'}}>Register</a>
                )
              )}
            </div>
            {post.content && post.title && <div style={{marginTop:12}}>{post.content}</div>}
            {post.body && post.body !== post.title && <div style={{marginTop:12}}>{post.body}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
