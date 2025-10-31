"use client"

import React from "react"

export async function sendNotification(payload: { to: string; type: string; message: string }) {
  try {
    const res = await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    return await res.json()
  } catch (e) {
    console.warn("Failed to send notification", e)
    return { success: false }
  }
}

export default function Notifications() {
  return <div />
}
