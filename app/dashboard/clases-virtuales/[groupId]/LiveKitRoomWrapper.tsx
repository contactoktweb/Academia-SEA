'use client'

import { useEffect, useState } from 'react'
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from '@livekit/components-react'
import '@livekit/components-styles'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { TeacherControls } from './TeacherControls'

export function LiveKitRoomWrapper({ 
  roomName, 
  isTeacher,
  courseAssignmentId
}: { 
  roomName: string,
  isTeacher?: boolean,
  courseAssignmentId?: string
}) {
  const [token, setToken] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(`/api/livekit/token?room=${roomName}`)
        const data = await resp.json()
        
        if (data.error) {
          setError(data.error)
          return
        }
        setToken(data.token)
      } catch (e) {
        setError("Error de conexión al obtener el token de LiveKit")
        console.error(e)
      }
    })()
  }, [roomName])

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600 dark:bg-red-900/30">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="mb-2 text-xl font-bold">Error de Acceso</h2>
        <p className="text-slate-500">{error}</p>
        <button 
          onClick={() => router.push('/dashboard/clases-virtuales')}
          className="mt-6 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Volver a Mis Clases
        </button>
      </div>
    )
  }

  if (token === "") {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="mt-4 text-sm font-medium text-slate-500">Conectando a la clase virtual...</p>
      </div>
    )
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}
      onDisconnected={() => {
        router.push('/dashboard/clases-virtuales')
      }}
    >
      {isTeacher && (
        <TeacherControls 
          groupId={roomName} 
          courseAssignmentId={courseAssignmentId} 
        />
      )}
      <VideoConference />
      <RoomAudioRenderer />
    </LiveKitRoom>
  )
}
