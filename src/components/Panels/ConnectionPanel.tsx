import React, { useState } from 'react';
import { X, Activity, Minus, Settings2 } from 'lucide-react';

interface ConnectionPanelProps {
    edgeId: string;
    edgeData: any;
    position: { x: number; y: number };
    onClose: () => void;
    onUpdate: (updates: any) => void;
}

export const ConnectionPanel: React.FC<ConnectionPanelProps> = ({
    edgeId: _edgeId,
    edgeData,
    position,
    onClose,
    onUpdate,
}) => {
    const [label, setLabel] = useState(edgeData?.label || '');
    const [protocol, setProtocol] = useState(edgeData?.metadata?.protocol || '');
    const [dataType, setDataType] = useState(edgeData?.metadata?.dataType || '');
    const [relationship, setRelationship] = useState(edgeData?.metadata?.relationship || '');
    const [variant, setVariant] = useState(edgeData?.variant || 'default');

    const handleApply = () => {
        onUpdate({
            data: {
                ...edgeData,
                label,
                variant,
                metadata: {
                    ...edgeData?.metadata,
                    protocol,
                    dataType,
                    relationship,
                },
            },
        });
        onClose();
    };

    return (
        <div
            className="fixed z-50 bg-dark-surface/95 backdrop-blur-xl border border-dark-border rounded-xl shadow-2xl p-4 min-w-[320px]"
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-accent-blue" />
                    <h3 className="text-sm font-semibold text-white">Connection Settings</h3>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                    <X className="w-4 h-4 text-gray-400" />
                </button>
            </div>

            {/* Label Input */}
            <div className="mb-3">
                <label className="block text-xs font-medium text-gray-400 mb-1">Label</label>
                <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="e.g., API Call, Data Flow"
                    className="w-full px-3 py-2 bg-black/20 border border-dark-border rounded-lg text-sm text-white
                             focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue"
                />
            </div>

            {/* Style Variant */}
            <div className="mb-3">
                <label className="block text-xs font-medium text-gray-400 mb-2">Style</label>
                <div className="flex gap-2">
                    <button
                        onClick={() => setVariant('default')}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2
                                  ${variant === 'default' ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue' : 'bg-white/5 text-gray-400 border border-dark-border hover:bg-white/10'}`}
                    >
                        <Minus className="w-3 h-3" /> Solid
                    </button>
                    <button
                        onClick={() => setVariant('dashed')}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2
                                  ${variant === 'dashed' ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue' : 'bg-white/5 text-gray-400 border border-dark-border hover:bg-white/10'}`}
                    >
                        <Activity className="w-3 h-3" /> Dashed
                    </button>
                </div>
            </div>

            {/* Protocol */}
            <div className="mb-3">
                <label className="block text-xs font-medium text-gray-400 mb-1">Protocol</label>
                <select
                    value={protocol}
                    onChange={(e) => setProtocol(e.target.value)}
                    className="w-full px-3 py-2 bg-black/20 border border-dark-border rounded-lg text-sm text-white
                             focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue"
                >
                    <option value="">Select protocol...</option>
                    <option value="HTTP">HTTP</option>
                    <option value="HTTPS">HTTPS</option>
                    <option value="gRPC">gRPC</option>
                    <option value="WebSocket">WebSocket</option>
                    <option value="TCP">TCP</option>
                    <option value="UDP">UDP</option>
                    <option value="MQTT">MQTT</option>
                </select>
            </div>

            {/* Data Type */}
            <div className="mb-3">
                <label className="block text-xs font-medium text-gray-400 mb-1">Data Type</label>
                <select
                    value={dataType}
                    onChange={(e) => setDataType(e.target.value)}
                    className="w-full px-3 py-2 bg-black/20 border border-dark-border rounded-lg text-sm text-white
                             focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue"
                >
                    <option value="">Select data type...</option>
                    <option value="JSON">JSON</option>
                    <option value="XML">XML</option>
                    <option value="Binary">Binary</option>
                    <option value="Text">Text</option>
                    <option value="Protobuf">Protobuf</option>
                </select>
            </div>

            {/* Relationship */}
            <div className="mb-4">
                <label className="block text-xs font-medium text-gray-400 mb-1">Relationship</label>
                <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full px-3 py-2 bg-black/20 border border-dark-border rounded-lg text-sm text-white
                             focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue"
                >
                    <option value="">Select relationship...</option>
                    <option value="Uses">Uses</option>
                    <option value="Depends on">Depends on</option>
                    <option value="Triggers">Triggers</option>
                    <option value="Calls">Calls</option>
                    <option value="Subscribes to">Subscribes to</option>
                    <option value="Publishes to">Publishes to</option>
                </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-sm font-medium transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleApply}
                    className="flex-1 px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg text-sm font-medium transition-colors"
                >
                    Apply
                </button>
            </div>
        </div>
    );
};
