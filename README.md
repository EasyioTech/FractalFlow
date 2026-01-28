# Zoomable Software Architecture Canvas

A powerful single-page application for creating nested software architecture diagrams with infinite zoom capabilities.

## Features

🎯 **Deep Zoom Navigation** - Double-click any component to dive into its detailed architecture
📊 **Infinite Canvas** - Pan and zoom freely to explore your system design
🎨 **Beautiful Dark UI** - Modern Linear-like aesthetic with smooth animations
💾 **Auto-Save** - All changes automatically persist to browser storage
🔄 **Hierarchical Design** - Nest LLDs inside HLD components seamlessly

## Architecture Components

- **API Gateway** - Entry points for API requests
- **Server** - Application server instances
- **Database** - Data storage systems
- **Edge Device** - Client or IoT devices
- **Load Balancer** - Traffic distribution nodes

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## How to Use

### Adding Components

1. Click any component in the left sidebar
2. The component will be added to your canvas
3. Drag nodes to reposition them

### Creating Connections

1. Click and drag from any connection handle (blue dots)
2. Drop on another node's handle to create a connection
3. Connections are animated and auto-routed

### Deep Zoom (The Magic! ✨)

1. **Double-click any node** to enter its nested view
2. Design the internal architecture (LLD) of that component
3. Nodes with nested graphs show a blue ring indicator
4. Use the breadcrumb navigation at the top to go back
5. Click the "← Back" button to return to parent view

### Navigation

- **Breadcrumb Trail** - Shows your current depth (e.g., System Overview > Database > Tables)
- **Back Button** - Quick return to parent level
- **Home Icon** - Jump back to root/main canvas

## Technical Stack

- **React 18** + **TypeScript**
- **Vite** - Lightning-fast dev server
- **React Flow** - Canvas rendering engine
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Lucide React** - Icon library
- **IndexedDB** - Client-side persistence

## Data Architecture

The application uses a **graph-based data model** where each node can contain a child graph:

```typescript
{
  graphs: {
    main: { nodes: [...], edges: [...] },
    "graph-abc": { nodes: [...], edges: [...] },
    "graph-xyz": { nodes: [...], edges: [...] }
  },
  navigationStack: ["main", "graph-abc"],
  currentGraphId: "graph-abc"
}
```

## Performance

- **60fps transitions** between nested levels
- **Lazy loading** - Only current graph is rendered
- **Viewport persistence** - Return to exact zoom/pan position
- **Optimized re-renders** - Memoized components and selectors

## Browser Storage

**Fresh Start on Every Session:**
- 🔄 Data clears automatically when page is refreshed
- 💾 Auto-saves during the current session (prevents accidental data loss)
- 🚀 Always start with a clean canvas
- 🌐 No server required - works completely offline
- 📦 Can handle large architecture diagrams (>5MB) during session

**Note:** If you need persistent storage across sessions, see `SESSION_DATA_MANAGEMENT.md` for configuration options.

## Keyboard Shortcuts

- **Delete/Backspace** - Delete selected node or edge
- **Ctrl/Cmd + Scroll** - Zoom in/out
- **Space + Drag** - Pan the canvas
- **Escape** - Deselect all

## Tips

💡 **Start Broad** - Create your HLD first, then zoom into each component
💡 **Use Layers** - You can nest infinitely deep (HLD → LLD → Schema → Field Details)
💡 **Consistent Naming** - Name nodes clearly before diving in
💡 **Visual Indicators** - The blue ring shows which nodes contain nested diagrams

## License

MIT

## Contributing

This is a demonstration/prototype project. Feel free to fork and extend!

---

Built with ❤️ for software architects who think visually
