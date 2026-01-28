# Implementation Plan - Advanced Flowchart & Cloud Support

## 1. Cloud & Infrastructure Expansion
**Goal:** Add support for AWS, Azure, Docker, VPS, and other infrastructure components.

-   **Library Update (`componentLibrary.ts`)**:
    -   Add new categories: `cloud-aws`, `cloud-azure`, `devops`.
    -   Add components:
        -   **AWS**: Lambda, EC2, S3, RDS, DynamoDB, API Gateway.
        -   **Azure**: Functions, VM, Blob Storage, CosmosDB.
        -   **DevOps**: Docker Container, Kubernetes Pod, Jenkins/CI, VPS (Generic Linux).
    -   **Icon Strategy**: Map to semantically relevant `lucide-react` icons (e.g., `Container` -> `Box`, `Lambda` -> `Zap`, `S3` -> `HardDrive`) to maintain style consistency while using Label names for differentiation.

## 2. Advanced Flowchart Features
**Goal:** Support essential flowcharting elements like shapes, text, and code.

-   **Node Shapes Support**:
    -   Update `ArchNode` to support specific shapes based on type:
        -   **Diamond** (`<>`) for Conditional/Decision nodes.
        -   **Circle** (`()`) for Start/End events.
        -   **Rectangle** (`[]`) for standard processing (current default).
    -   Implement CSS/SVG clip-paths or structural changes in `ArchNode`.

-   **New Node Types**:
    -   **Text Block / Label**: A simple node with no background/border, just resizeable text.
    -   **Code Snippet**: A node containing a code block (monospaced font, gray background).
    -   **Empty/Spacer Node**: Transparent node for layout adjustments.

## 3. Grouping & Layout
**Goal:** Allow visual grouping of nodes (e.g., "VPC", "Subnet", "Region").

-   **Group Node Implementation**:
    -   Create a new node type `GroupNode` in React Flow.
    -   **Features**:
        -   Resizeable (using `<NodeResizer />`).
        -   Z-index handling (rendered behind other nodes).
        -   Visual style: Dashed border, translucent background, label in top-left.
    -   **Interaction**: Dragging a group should (ideally) drag child nodes, or visually contain them. (React Flow `parentId` support might be complex to retrofit, so we will start with *Visual Grouping* (a box behind nodes)).

## 4. UI/UX Refinements
-   **Sidebar Update**: Update `ComponentToolbar` to accommodate the huge influx of new components (potentially hierarchical or search-optimized).
-   **Properties Panel (Future)**: Support changing colors/shapes of existing nodes.

## Execution Steps
1.  **Refactor Node Types**: Register `group`, `text`, `code` in `MainCanvas`.
2.  **Update Component Library**: Bulk add the requested Cloud/DevOps items.
3.  **Enhance `ArchNode`**: Add visual variants for Shapes (Decision Diamond).
4.  **Create Custom Nodes**:
    -   `TextNode.tsx`
    -   `CodeNode.tsx`
    -   `GroupNode.tsx`
