import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const FILE_PATH = path.join(DATA_DIR, 'workflows.json')

async function readStore() {
  try {
    const raw = await fs.readFile(FILE_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    return { workflows: [] }
  }
}

async function writeStore(store: any) {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.writeFile(FILE_PATH, JSON.stringify(store, null, 2), 'utf-8')
  } catch (err) {
    // ignore
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')
  const store = await readStore()
  if (id) {
    const wf = store.workflows.find((w: any) => w.id === id)
    if (!wf) return NextResponse.json({ error: 'not found' }, { status: 404 })
    return NextResponse.json(wf)
  }
  return NextResponse.json({ workflows: store.workflows })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, name, nodes, edges } = body
    if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 })

    const store = await readStore()
    let wf
    if (id) {
      wf = store.workflows.find((w: any) => w.id === id)
      if (wf) {
        wf.name = name
        wf.nodes = nodes
        wf.edges = edges
        wf.updatedAt = new Date().toISOString()
      }
    }
    if (!wf) {
      const newWf = {
        id: String(Date.now()),
        name,
        nodes: nodes || [],
        edges: edges || [],
        createdAt: new Date().toISOString(),
      }
      store.workflows.push(newWf)
      wf = newWf
    }

    await writeStore(store)
    return NextResponse.json({ workflow: wf })
  } catch (err) {
    return NextResponse.json({ error: 'failed to save' }, { status: 500 })
  }
}
