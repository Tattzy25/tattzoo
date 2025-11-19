type ProgressHandler = (params: { message: string; progress: number }) => void

export class McpHttpClient {
  private endpoint: string
  private sessionId: string | null = null
  private sse: EventSource | null = null
  private nextId = 1
  private messageHandlers = new Map<number, (result: any) => void>()
  private progressHandlers = new Map<number, ProgressHandler>()

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  async initialize(): Promise<void> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: this.nextId++,
        method: 'initialize',
        params: {
          protocolVersion: '2025-03-26',
          capabilities: {},
          clientInfo: { name: 'tattzoo-web', version: '1.0.0' },
        },
      }),
    })

    const data = await response.json().catch(() => ({}))
    this.sessionId = response.headers.get('Mcp-Session-Id') || data?.result?.sessionId || null
    this.openSSE()
  }

  private openSSE(): void {
    if (this.sse) return
    const url = new URL(this.endpoint)
    const streamUrl = this.sessionId ? `${url.href}?sessionId=${encodeURIComponent(this.sessionId)}` : url.href
    this.sse = new EventSource(streamUrl)
    this.sse.addEventListener('message', (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data)
        if (message.method === 'notifications/progress') {
          const reqId = Number(message.params.requestId)
          const handler = this.progressHandlers.get(reqId)
          if (handler) handler({ message: message.params.message, progress: Number(message.params.progress) })
          return
        }
        if (typeof message.id === 'number' && message.result) {
          const handler = this.messageHandlers.get(Number(message.id))
          if (handler) {
            handler(message.result)
            this.messageHandlers.delete(Number(message.id))
          }
        }
      } catch {}
    })
  }

  async callTool(name: string, args: Record<string, any>, onProgress?: (message: string, progress: number) => void): Promise<any> {
    const id = this.nextId++
    if (onProgress) {
      this.progressHandlers.set(id, ({ message, progress }) => onProgress(message, progress))
    }

    await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
        ...(this.sessionId ? { 'Mcp-Session-Id': this.sessionId } : {}),
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id,
        method: 'tools/call',
        params: { name, arguments: args },
      }),
    })

    return new Promise((resolve, reject) => {
      this.messageHandlers.set(id, (result: any) => {
        this.progressHandlers.delete(id)
        const textPart = Array.isArray(result?.content) ? result.content.find((c: any) => c?.type === 'text') : null
        if (textPart && typeof textPart.text === 'string') {
          try {
            resolve(JSON.parse(textPart.text))
          } catch {
            resolve(textPart.text)
          }
        } else {
          reject(new Error('Invalid MCP result'))
        }
      })
      setTimeout(() => {
        if (this.messageHandlers.has(id)) {
          this.messageHandlers.delete(id)
          this.progressHandlers.delete(id)
          reject(new Error('Tool call timeout'))
        }
      }, 60000)
    })
  }
}