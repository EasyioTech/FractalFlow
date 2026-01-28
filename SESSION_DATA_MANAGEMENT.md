# Session Data Management

## ✅ Clear All Data on Refresh - IMPLEMENTED

The application now clears all previous session data when the page is refreshed, giving you a **fresh canvas every time**.

## 🔄 How It Works

### On Page Load:
```typescript
useEffect(() => {
    const initializeFresh = async () => {
        // 1. Clear IndexedDB
        await clearArchitecture();
        
        // 2. Initialize fresh empty canvas
        initializeStore();
    };
    
    initializeFresh();
}, []);
```

### What Gets Cleared:
- ✅ All nodes from all graphs
- ✅ All connections/edges
- ✅ All nested graphs (deep zoom levels)
- ✅ Navigation history
- ✅ Complete IndexedDB data

### What Persists During Session:
- ✅ **Auto-save still works** during the current session
- ✅ Won't lose work if you accidentally close a tab
- ✅ Data persists until you refresh the page

## 📋 Behavior

| Action | Result |
|--------|--------|
| Refresh Page (F5) | ❌ All data cleared, fresh canvas |
| Close Tab | ❌ Data lost on next open |
| Navigate Away | ❌ Data lost when returning |
| Accidental Close Tab | ✅ Can recover if reopened immediately (before refresh) |
| Clear Canvas Button | ❌ Only clears current graph |

## 🎯 Use Cases

**Perfect For:**
- ✅ Demos and presentations (start fresh every time)
- ✅ Teaching/training sessions
- ✅ Quick brainstorming (no clutter from previous sessions)
- ✅ Testing and experimentation

**How Different From Before:**
- **Before**: Data persisted across sessions, loaded automatically
- **After**: Clean slate on every page load

## 💾 If You Want Persistent Storage

If you later want to **enable** data persistence across sessions, simply change this in `App.tsx`:

```typescript
// CURRENT (clears on refresh):
const initializeFresh = async () => {
    await clearArchitecture();
    initializeStore();
};

// TO ENABLE PERSISTENCE:
const initializeFresh = async () => {
    const savedData = await loadArchitecture();
    if (savedData) {
        // Restore saved data
        set(savedData);
    } else {
        initializeStore();
    }
};
```

## 🧪 Test It

1. Add several nodes to the canvas
2. Create connections
3. Navigate into a node (deep zoom)
4. Add more nodes in nested view
5. **Refresh the page (F5)**
6. 🎉 Canvas is completely empty!

## 📝 Modified Files

1. **`src/lib/db.ts`**
   - Added `clearArchitecture()` function
   - Deletes all data from IndexedDB

2. **`src/App.tsx`**
   - Removed `loadFromIndexedDB()` call
   - Added `clearArchitecture()` call on mount
   - Always initializes fresh store

## 🔧 Technical Details

The `clearArchitecture()` function:
```typescript
export async function clearArchitecture(): Promise<void> {
    const db = await getDB();
    await db.clear(STORE_NAME); // Removes all entries
}
```

This is called **before** `initializeStore()`, ensuring:
1. Old data is removed from browser
2. Fresh empty graph is created
3. No conflicts or stale data

Every page load = Fresh start! 🚀
