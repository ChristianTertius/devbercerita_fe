"use client"

import { useRouter } from "next/navigation"

export function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="self-start text-sm text-ink/50 transition  hover:text-ink"
    >← Kembali</button>
  )
}
