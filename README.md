# FractalFlow

**A modern, hierarchical system architecture design tool for building and visualizing complex software systems.**

## Overview

FractalFlow is an interactive visual design tool that helps software architects and developers create, organize, and navigate multi-layered system architectures. Built with a "fractal" approach, it allows you to zoom into any component to reveal its internal architecture, creating infinitely deep hierarchical designs.

## Key Features

### 🎨 Visual Design
- **Rich Node Library**: Service nodes, databases, cloud resources, flowchart shapes, and more
- **Flexible Connections**: Multiple connection styles (smooth, bezier, straight) with custom labels
- **Smart Grouping**: Organize related components into visual groups
- **Conditional Flows**: Diamond-shaped decision nodes with Yes/No branching

### 🔄 Hierarchical Navigation
- **Drill-Down Architecture**: Double-click any node to design its internal architecture
- **Breadcrumb Navigation**: Easily navigate back through architecture levels
- **Graph Overview**: Jump between different architectural views

### ⚡ Powerful Interactions
- **Drag & Drop**: Add components from the sidebar to your canvas
- **Live Editing**: Double-click nodes and edges to rename them inline
- **Smart Connections**: Create connections with labeled edges and waypoints
- **Context Menus**: Right-click for quick actions and property editing

### 🎯 Command Palette
Press `Cmd/Ctrl+K` to access quick commands:
- Node operations (add, duplicate, delete, group)
- Navigation (back, jump to graph, clear canvas)
- View controls (zoom, fit view, lock, theme toggle)
- File operations (save, export JSON/PNG, import)
- Edit actions (undo, redo, select all)

### 🎨 Modern UI
- **Dark Mode**: Beautiful dark theme optimized for long design sessions
- **Gradient Accents**: Eye-catching blue-cyan gradients throughout
- **Smooth Animations**: Polished transitions and hover effects
- **Responsive Design**: Works seamlessly on different screen sizes

### 💾 Data Management
- **Auto-Save**: Your work is automatically saved to browser storage
- **Export/Import**: Save your architectures as JSON files
- **Session Persistence**: Your work is preserved across browser sessions

## Quick Start

### Adding Components
1. **From Sidebar**: Drag components from the left panel onto the canvas
2. **Command Palette**: Press `Cmd/Ctrl+K` → "Add Node"
3. **Quick Add**: Click the "+" icon in the navigation dock

### Creating Connections
1. Hover over a node to reveal connection handles
2. Drag from any handle to another node's handle
3. Double-click the edge to add a label
4. Right-click for connection styling options

### Building Hierarchies
1. Double-click any node to navigate into it
2. Design the internal architecture of that component
3. Use the breadcrumb trail at the top to navigate back
4. Create as many levels as needed - there's no limit!

### Organizing with Groups
1. Add a "Group" component from the Layout category
2. Drag and drop nodes onto the group container
3. Resize the group as needed
4. Move the group to reposition all contained nodes together

### Decision Flows
1. Add a "Condition" node from the Flowchart category
2. Connect from the green "YES" handle for true paths
3. Connect from the red "NO" handle for false paths
4. Connections are automatically labeled

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl+K` | Open command palette |
| `Cmd/Ctrl+S` | Save project |
| `Cmd/Ctrl+Z` | Undo |
| `Cmd/Ctrl+Shift+Z` | Redo |
| `Cmd/Ctrl+D` | Duplicate selected |
| `Delete/Backspace` | Delete selected |
| `Cmd/Ctrl+0` | Fit view |
| `Cmd/Ctrl++` | Zoom in |
| `Cmd/Ctrl+-` | Zoom out |
| `Cmd/Ctrl+L` | Toggle view lock |
| `Cmd/Ctrl+T` | Toggle theme |

## Component Categories

### Cloud & Infrastructure
- Microservice, API Gateway, Load Balancer
- CDN, Queue, Cache
- Cloud Service (AWS/Azure/GCP)

### Data & Storage
- Database, NoSQL, Data Lake
- Message Queue, Event Stream

### Network & Security
- Firewall, VPN, DNS
- Auth Service, SSL/TLS

### Flowchart
- Process, Decision (Condition)
- Start/End, Circle

### Layout
- Group, Text Block, Code Block

## Use Cases

- **System Architecture Design**: Plan microservices architectures
- **Cloud Infrastructure**: Design AWS, Azure, or GCP deployments  
- **Data Flow Diagrams**: Visualize data movement through systems
- **Process Flows**: Document business processes and workflows
- **API Design**: Map out API structures and integrations
- **Documentation**: Create visual documentation for existing systems

## Tips & Best Practices

1. **Start High-Level**: Begin with major system components, then drill down
2. **Use Groups**: Organize related components visually
3. **Label Everything**: Clear labels make diagrams self-documenting
4. **Consistent Styling**: Use edge styles consistently (solid for sync, dashed for async)
5. **Regular Saves**: Use `Cmd/Ctrl+S` to save important work
6. **Export Backups**: Periodically export your architectures as JSON

## About

FractalFlow enables architects and developers to think fractally about system design - creating architectures where each component can contain its own internal architecture, infinitely deep. This mirrors how real software systems are built: from high-level service interactions down to internal component details.

---

**Built with React, TypeScript, and ReactFlow**
