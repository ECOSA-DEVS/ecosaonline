import React, { useEffect, useState } from 'react'
import {
  getResources,
  addResource,
  deleteResource,
  getMembers,
} from '../services/mockService'

export default function Resources() {
  const [resources, setResources] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [type, setType] = useState('constitution')
  const [file, setFile] = useState<File | null>(null)
  const [, setMembers] = useState<any[]>([])

  const session = JSON.parse(
    localStorage.getItem('ecosa_session') || 'null'
  )
  const isAdmin = session?.isAdmin === true

  useEffect(() => {
    let mounted = true

    getResources()
      .then((r) => {
        if (mounted) setResources(r || [])
      })
      .catch(() => {})

    getMembers()
      .then((m) => {
        if (mounted) setMembers(m || [])
      })
      .catch(() => {})

    return () => {
      mounted = false
    }
  }, [])

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()

    if (!isAdmin) {
      alert('Only administrators can upload documents.')
      return
    }

    if (!file) {
      alert('Choose a file')
      return
    }

    const reader = new FileReader()

    reader.onload = async () => {
      const content = reader.result

      const uploaderName =
        session?.name || session?.email || 'Administrator'

      const resource = {
        id: `res_${Date.now()}`,
        name: title || file.name,
        filename: file.name,
        mime: file.type,
        type,
        content,
        uploadedAt: new Date().toISOString(),
        uploadedBy: uploaderName,
      }

      await addResource(resource)

      setResources((prev) => [resource, ...prev])

      setTitle('')
      setType('constitution')
      setFile(null)
    }

    reader.readAsDataURL(file)
  }

  async function handleDelete(id: string) {
    if (!isAdmin) return

    if (!confirm('Delete this document?')) return

    await deleteResource(id)

    setResources((prev) =>
      prev.filter((resource) => resource.id !== id)
    )
  }

  const expectedDocuments = [
    { type: 'constitution', label: 'Constitution' },
    {
      type: 'registration',
      label: 'Registration Certificate',
    },
    {
      type: 'bank',
      label: 'Bank Account Details',
    },
    {
      type: 'handover',
      label: 'Handover Files',
    },
    {
      type: 'other',
      label: 'Other Documents',
    },
  ]

  return (
    <div>
      <h3>ECOSA Resources</h3>

      <p className="muted">
        Upload legal and handover documents such as the
        constitution, registration certificate, bank
        account details and other official files.
      </p>

      {!isAdmin ? (
        <div style={{ marginBottom: 20 }}>
          <div
            className="card"
            style={{ marginBottom: 12 }}
          >
            <strong>
              Documents (Upload restricted to
              administrators)
            </strong>
          </div>

          {expectedDocuments.map((doc) => {
            const found = resources.find(
              (r) => r.type === doc.type
            )

            return (
              <div
                key={doc.type}
                className="card"
                style={{
                  marginBottom: 10,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {doc.label}
                  </div>

                  <div
                    style={{
                      color: '#6b7280',
                      fontSize: 12,
                    }}
                  >
                    {found
                      ? `Uploaded ${new Date(
                          found.uploadedAt
                        ).toLocaleString()}`
                      : 'Not yet uploaded'}
                  </div>
                </div>

                {found ? (
                  <a
                    href={found.content}
                    download={found.filename}
                    className="btn"
                  >
                    Download
                  </a>
                ) : (
                  <button
                    className="btn secondary"
                    onClick={() =>
                      alert(
                        `${doc.label} has not yet been uploaded.`
                      )
                    }
                  >
                    Not Uploaded
                  </button>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <form
          onSubmit={handleUpload}
          style={{ marginBottom: 20 }}
        >
          <input
            placeholder="Document title (optional)"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            style={{
              width: '100%',
              maxWidth: 500,
              marginBottom: 10,
            }}
          />

          <div
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
            >
              <option value="constitution">
                Constitution
              </option>

              <option value="registration">
                Registration Certificate
              </option>

              <option value="bank">
                Bank Account Details
              </option>

              <option value="handover">
                Handover Files
              </option>

              <option value="other">
                Other Documents
              </option>
            </select>

            <input
              type="file"
              onChange={(e) =>
                setFile(
                  e.target.files?.[0] || null
                )
              }
            />

            <button
              type="submit"
              className="btn"
            >
              Upload
            </button>
          </div>
        </form>
      )}

      {resources.length === 0 && (
        <div className="card">
          No documents uploaded yet.
        </div>
      )}

      {resources.map((resource) => (
        <div
          key={resource.id}
          className="card"
          style={{ marginBottom: 10 }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>
                {resource.name}
              </div>

              <div
                style={{
                  color: '#6b7280',
                  fontSize: 12,
                }}
              >
                {resource.type} • Uploaded{' '}
                {new Date(
                  resource.uploadedAt
                ).toLocaleString()}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: 8,
              }}
            >
              <a
                href={resource.content}
                download={resource.filename}
                className="btn"
              >
                Download
              </a>

              {isAdmin && (
                <button
                  className="btn"
                  style={{
                    background: '#dc2626',
                  }}
                  onClick={() =>
                    handleDelete(resource.id)
                  }
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
