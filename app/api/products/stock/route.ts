import { NextResponse } from "next/server"

// This route provides a simple in-memory stock update wrapper around products mock.
// Note: Because the main products mock is a const in another module, this route will not
// actually mutate that module's exported array. For demo purposes we simply echo back the requested change.

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { productId, stock } = body
    if (!productId) return NextResponse.json({ success: false, error: "productId required" }, { status: 400 })

    // In a real app update DB. Here just return success
    return NextResponse.json({ success: true, data: { productId, stock } })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update stock" }, { status: 500 })
  }
}
