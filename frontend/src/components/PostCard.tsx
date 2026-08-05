import React, { useEffect, useState } from 'react'
import { addPollVote, getPollVotes, getSession, addComment, toggleLike, sharePost, addRsvp } from '../services/mockService'
import { Link } from 'react-router-dom'
import MemberLink from './MemberLink'

function formatTime(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  const diff = (Date.now() - d.getTime()) / 1000
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff/60)}m`
  if (diff < 86400) return `${Math.floor(diff/3600)}h`
  if (diff < 604800) return `${Math.floor(diff/86400)}d`
  return d.toLocaleString()
}

export default function PostCard({post,refresh}:{post:any,refresh?:()=>void}){
  const [selected,setSelected]=useState<number|undefined>(undefined)
  const [votes,setVotes]=useState<any[]>([])
  const session = getSession()

  useEffect(()=>{
    let mounted = true
    getPollVotes().then(v=>{ if(mounted) setVotes(v) }).catch(()=>{})
    return ()=>{ mounted=false }
  },[post.id])

  const hasVoted = () => votes.some((v:any)=>v.pollId===post.id && v.voterEmail===session?.email)
  const counts = () => {
    const c = new Array((post.options||[]).length).fill(0)
    votes.filter((v:any)=>v.pollId===post.id).forEach((v:any)=>{ c[v.optionIndex] = (c[v.optionIndex]||0)+1 })
    return c
  }

  const submitVote = async ()=>{
    if(!session) return alert('Login to vote')
    if(selected===undefined) return alert('Select an option')
    try{
      await addPollVote(post.id,selected,session.email)
      alert('Vote recorded')
      const v = await getPollVotes()
      setVotes(v)
      refresh && refresh()
    }catch(e:any){ alert(e?.message || 'Vote failed') }
  }

  const [commentText,setCommentText]=useState('')
  const postLikes = post.likes || []
  const likedByUser = !!(session && postLikes.includes(session.name || session?.email))
  const postRsvps = post.rsvps || []
  const userRsvp = session ? (postRsvps.find((r:any)=>r.user=== (session.name || session.email))?.status) : undefined

  const countRsvp = (s:'interested'|'going') => postRsvps.filter((r:any)=>r.status===s).length

  const submitComment = async ()=>{
    if(!session) return alert('Login to comment')
    if(!commentText.trim()) return
    await addComment(post.id, session.name || session.email, commentText.trim())
    setCommentText('')
    refresh && refresh()
  }

  const handleLike = async ()=>{
    if(!session) return alert('Login to like')
    await toggleLike(post.id, session.name || session.email)
    refresh && refresh()
  }

  const handleShare = async ()=>{
    if(!session) return alert('Login to share')
    await sharePost(post.id, session.name || session.email)
    refresh && refresh()
    alert('Post shared to community')
  }

  const setRsvp = async (status:'interested'|'going')=>{
    if(!session) return alert('Login to RSVP')
    await addRsvp(post.id, session.name || session.email, status)
    refresh && refresh()
  }

  return (
    <div className="card" style={{marginBottom:12}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontWeight:700}}><MemberLink name={post.author} /></div>
          <div style={{color:'#6b7280',fontSize:12}}>{formatTime(post.createdAt)}</div>
        </div>
      </div>
      <div style={{marginTop:8}}>{post.content || post.body || post.title}</div>
      {post.media && (
        <div style={{display:'flex',gap:8,marginTop:8,flexWrap:'wrap'}}>
          {typeof post.media === 'string' && (
            <div style={{maxWidth:400}}>
              <img src={post.media} style={{width:'100%',borderRadius:6}} alt="post media" />
            </div>
          )}
          {Array.isArray(post.media) && post.media.length>0 && post.media.map((m:any,idx:number)=> (
            <div key={idx} style={{maxWidth:200}}>
              {m.type && m.type.startsWith && m.type.startsWith('image/') ? <img src={m.data} style={{width:'100%',borderRadius:6}} alt="post media"/> : (m.data ? <video src={m.data} style={{width:'100%'}} controls /> : null)}
            </div>
          ))}
          {typeof post.media === 'object' && !Array.isArray(post.media) && post.media !== null && (
            // single media object with {type,data} or just a url
            (post.media.data || post.media.url) ? (
              <div style={{maxWidth:400}}>
                <img src={post.media.data || post.media.url} style={{width:'100%',borderRadius:6}} alt="post media" />
              </div>
            ) : null
          )}
        </div>
      )}

      <div style={{display:'flex',gap:8,marginTop:8,alignItems:'center'}}>
        <button className="btn" onClick={handleLike}>{likedByUser ? 'Unlike' : 'Like'} ({(post.likes||[]).length})</button>
        <button className="btn" onClick={()=>setRsvp('interested')}>Interested ({countRsvp('interested')})</button>
        <button className="btn" onClick={()=>setRsvp('going')}>Going ({countRsvp('going')})</button>
        {post.registerUrl ? (
          post.registerUrl.startsWith('/') ? (
            <Link className="btn" to={post.registerUrl}>Register</Link>
          ) : (
            <a className="btn" style={{textDecoration:'none'}} href={post.registerUrl} target="_blank" rel="noreferrer">Register</a>
          )
        ) : null}
        <button className="btn" onClick={handleShare}>Share</button>
      </div>

      {post.type==='poll' && (
        <div style={{marginTop:12}}>
          {hasVoted() ? <div style={{color:'green'}}>You have voted in this poll</div> : (
            <div>
              {post.options.map((opt:string,i:number)=> (
                <div key={i}>
                  <label><input type="radio" name={post.id} checked={selected===i} onChange={()=>setSelected(i)} /> {opt} <small style={{color:'#6b7280',marginLeft:8}}>{counts()[i]||0} votes</small></label>
                </div>
              ))}
              <div className="actions"><button className="btn" onClick={submitVote}>Vote</button></div>
            </div>
          )}
        </div>
      )}

      {/* Comments */}
      <div style={{marginTop:12}}>
        <h4 style={{marginBottom:8}}>Comments ({(post.comments||[]).length})</h4>
        {(post.comments||[]).map((c:any)=>(
          <div key={c.id} style={{marginBottom:6}}>
            <div style={{fontWeight:700}}><MemberLink name={c.commenter} /></div>
            <div style={{color:'#6b7280',fontSize:12}}>{c.text}</div>
          </div>
        ))}
        <div style={{marginTop:8}}>
          <input placeholder="Add a comment" value={commentText} onChange={e=>setCommentText(e.target.value)} style={{width:'100%',maxWidth:480,padding:8}} />
          <div className="actions" style={{marginTop:8}}><button className="btn" onClick={submitComment}>Comment</button></div>
        </div>
      </div>
    </div>
  )
}
