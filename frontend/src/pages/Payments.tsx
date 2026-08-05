import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { addPayment } from '../services/mockService'

const purposeOptions = ['Membership', 'Insurance', 'Sacco', 'Project Donation', 'Event Ticket'] as const
type Purpose = typeof purposeOptions[number]

export default function Payments(){
  const [searchParams] = useSearchParams()
  const requestedPurpose = searchParams.get('purpose')
  const initialPurpose: Purpose = purposeOptions.includes(requestedPurpose as Purpose) ? (requestedPurpose as Purpose) : 'Membership'
  const initialAmount = searchParams.get('amount') || '20000'

  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [phone,setPhone]=useState('')
  const [years,setYears]=useState('')
  const [amount,setAmount]=useState(initialAmount)
  const [purpose,setPurpose]=useState<Purpose>(initialPurpose)
  const [method,setMethod]=useState<'mobile'|'card'>('mobile')

  const submit = async (e:React.FormEvent)=>{
    e.preventDefault()
    if(!name||!email||!amount) return alert('Provide name, email and amount')
    if(method==='mobile' && !phone) return alert('Enter phone number')

    const payment = {
      memberName: name,
      email,
      phone,
      purpose,
      amount: Number(amount),
      currency: 'UGX',
      method,
      status: 'pending',
    }

    await addPayment(payment)

    if(method === 'card'){
      try {
        const res = await fetch('http://localhost:4000/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: Math.round(Number(amount)), currency: 'ugx' }),
        })
        const data = await res.json()
        if (data?.url) {
          window.location.href = data.url
          return
        }
      } catch (err) {
        console.warn('Card checkout initiation failed', err)
      }
    }

    alert(method === 'mobile'
      ? 'Mobile money initiated. Please complete payment on your phone. Your membership will be confirmed after payment success.'
      : 'Card payment initiated. Please complete the checkout. Your membership will be confirmed after payment success.')

    setAmount('20000')
    setPhone('')
    setYears('')
  }

  return (
    <>
      <div className="card">
        <p>Pay your ECOSA membership fee or donate to support alumni initiatives. Members are listed automatically only after payment confirmation.</p>

        <form onSubmit={submit}>
          <label>Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} />
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} />
          <label>Phone</label>
          <input value={phone} onChange={e=>setPhone(e.target.value)} />
          <label>Years at ECI</label>
          <input value={years} onChange={e=>setYears(e.target.value)} placeholder="e.g. 2008-2012" />
          <label>Payment purpose</label>
          <select value={purpose} onChange={e=>setPurpose(e.target.value as any)}>
            <option value="Membership">Membership</option>
            <option value="Insurance">Insurance</option>
            <option value="Sacco">Sacco</option>
            <option value="Project Donation">Project Donation</option>
            <option value="Event Ticket">Event Ticket</option>
          </select>
          <label>Amount (UGX)</label>
          <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="20000" />

          <label style={{marginTop:8}}>Select payment method</label>
          <div className="payment-options">
            <button type="button" className={`field-btn payment-option${method==='mobile' ? ' active' : ''}`} onClick={()=>setMethod('mobile')}>
              <img className="payment-option-logo" src="/mtn-or-airtel.JPG" alt="MTN or Airtel" />
            </button>
            <button type="button" className={`field-btn payment-option${method==='card' ? ' active' : ''}`} onClick={()=>setMethod('card')}>
              <img className="payment-option-logo" src="/visa-or-mastercard.JPG" alt="Visa or Mastercard" />
            </button>
          </div>

          {method==='mobile' && (
            <div>
              <label>Phone (international format, e.g. 2567xxxxxxx)</label>
              <input value={phone} onChange={e=>setPhone(e.target.value)} />
            </div>
          )}

          <div className="actions"><button className="btn">{method==='card' ? 'Pay with Card' : `Pay with ${method.toUpperCase()}`}</button></div>
        </form>
        <p style={{color:'#6b7280',marginTop:12}}>Payments will record your membership and update the members list automatically.</p>
      </div>
    </>
  )
}
