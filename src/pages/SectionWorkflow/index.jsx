import { useState, useCallback, useMemo, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  MarkerType,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Coffee,
  Percent,
  ShieldAlert,
  PenTool,
  HeartHandshake,
  X,
  ChevronRight,
  FileText,
  CheckCircle2,
  Plus,
  Settings,
  Save,
  Bell,
} from "lucide-react";
import initialWorkflows from "../../data/workflow.json";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import CustomSelect from "../../components/ui/CustomSelect";
const iconMap = {
  Search,
  Coffee,
  Percent,
  ShieldAlert,
  PenTool,
  HeartHandshake,
  Bell,
};
/* --- Custom Node --- */ function WorkflowNode({ data, selected }) {
  const Icon = iconMap[data.icon] || Search;
  return (
    <div
      className={`px-4 py-3 shadow-md bg-white border-2 transition-all min-w-[200px] ${selected ? "border-primary shadow-primary/20 scale-105" : "border-slate-200 hover:border-primary/50"}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-slate-300 border-none"
      />
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 flex items-center justify-center ${selected ? "bg-primary text-white" : "bg-slate-100 text-slate-500"}`}
        >
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-sm text-slate-900 leading-tight">
            {data.label}
          </h4>
          <p className="text-[10px] text-slate-500 font-medium mt-0.5">
            {data.tasks?.length || 0} công việc
          </p>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-slate-300 border-none"
      />
    </div>
  );
}
/* --- Main Component --- */ export default function SectionWorkflow() {
  const [workflows, setWorkflows] = useLocalStorage(
    "fenica_workflows",
    initialWorkflows,
  );
  const [activeWfId, setActiveWfId] = useState(workflows[0]?.id || "");
  const activeWorkflow = useMemo(
    () => workflows.find((w) => w.id === activeWfId) || workflows[0],
    [workflows, activeWfId],
  );
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  /* Update state when active workflow changes */ useEffect(() => {
    if (activeWorkflow) {
      setNodes(activeWorkflow.nodes || []);
      setEdges(
        (activeWorkflow.edges || []).map((e) => ({
          ...e,
          markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
          style: { strokeWidth: 2, stroke: "#94a3b8" },
          labelStyle: { fill: "#64748b", fontWeight: "bold", fontSize: 12 },
          labelBgStyle: { fill: "rgba(255, 255, 255, 0.9)", color: "#fff" },
        })),
      );
      setSelectedNode(null);
    }
  }, [activeWfId, activeWorkflow]);
  const saveToStorage = useCallback(
    (newNodes, newEdges) => {
      setWorkflows((prev) =>
        prev.map((wf) => {
          if (wf.id === activeWfId) {
            return {
              ...wf,
              nodes: newNodes || wf.nodes,
              edges: newEdges || wf.edges,
            };
          }
          return wf;
        }),
      );
    },
    [activeWfId, setWorkflows],
  );
  const [selectedNode, setSelectedNode] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWfModal, setShowWfModal] = useState(false);
  /* Edit Mode state */ const [isEditMode, setIsEditMode] = useState(false);
  const nodeTypes = useMemo(() => ({ custom: WorkflowNode }), []);
  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => {
        const nextNodes = applyNodeChanges(changes, nds); // Automatically save position changes to local storage
        const hasPosChange = changes.some(
          (c) => c.type === "position" && !c.dragging,
        );
        if (hasPosChange) {
          saveToStorage(nextNodes, null);
        }
        return nextNodes;
      });
    },
    [activeWfId, saveToStorage],
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((eds) => {
        const nextEdges = applyEdgeChanges(changes, eds);
        saveToStorage(null, nextEdges);
        return nextEdges;
      }),
    [activeWfId, saveToStorage],
  );
  const onConnect = useCallback(
    (params) =>
      setEdges((eds) => {
        const nextEdges = addEdge(
          {
            ...params,
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
          },
          eds,
        );
        saveToStorage(null, nextEdges);
        return nextEdges;
      }),
    [activeWfId, saveToStorage],
  );
  const onNodeClick = (event, node) => {
    setSelectedNode(node);
  };
  /* --- Add Node Form State --- */ const [newNodeTitle, setNewNodeTitle] =
    useState("");
  const [newNodeDesc, setNewNodeDesc] = useState("");
  const [newNodeIcon, setNewNodeIcon] = useState("Search");
  const [newNodeTasks, setNewNodeTasks] = useState("");
  const handleAddNode = (e) => {
    e.preventDefault();
    const newNode = {
      id: Date.now().toString(),
      type: "custom",
      position: { x: 250, y: nodes.length * 150 + 50 },
      // Add below others roughly
      data: {
        label: newNodeTitle,
        icon: newNodeIcon,
        description: newNodeDesc,
        tasks: newNodeTasks.split("\n").filter((t) => t.trim() !== ""),
        documents: [],
      },
    };
    // Auto edge from last node if it exists
    let newEdge = null;
    if (nodes.length > 0) {
      const lastNode = nodes[nodes.length - 1];
      newEdge = {
        id: `e${lastNode.id}-${newNode.id}`,
        source: lastNode.id,
        target: newNode.id,
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
      };
    }
    const updatedNodes = [...nodes, newNode];
    const updatedEdges = newEdge ? [...edges, newEdge] : edges;
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    saveToStorage(updatedNodes, updatedEdges);
    setShowAddModal(false);
    setNewNodeTitle("");
    setNewNodeDesc("");
    setNewNodeTasks("");
  };
  /* --- Add Workflow Form State --- */ const [newWfName, setNewWfName] =
    useState("");
  const handleAddWf = (e) => {
    e.preventDefault();
    if (!newWfName) return;
    const newWf = {
      id: `wf-${Date.now()}`,
      name: newWfName,
      nodes: [
        {
          id: "1",
          type: "custom",
          position: { x: 250, y: 50 },
          data: {
            label: "Bước 1",
            icon: "Search",
            description: "Mô tả bước 1",
            tasks: [],
            documents: [],
          },
        },
      ],
      edges: [],
    };
    setWorkflows([...workflows, newWf]);
    setActiveWfId(newWf.id);
    setShowWfModal(false);
    setNewWfName("");
  };
  const workflowOptions = workflows.map((w) => ({
    value: w.id,
    label: w.name,
  }));
  return (
    <div className="h-screen w-full bg-slate-50 relative flex flex-col overflow-hidden">
      {""}
      {/* Top Header Bar */}
      {""}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 shadow-sm shrink-0">
        <div className="flex items-center gap-4 w-full max-w-md">
          <div className="w-64">
            <CustomSelect
              value={activeWfId}
              onChange={setActiveWfId}
              options={workflowOptions}
            />
          </div>
          <button
            onClick={() => setShowWfModal(true)}
            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
            title="Tạo quy trình mới"
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-2 px-4 py-2.5 font-bold transition-all ${isEditMode ? "bg-amber-100 text-amber-700 border border-amber-200 shadow-sm" : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"}`}
          >
            {""}
            {isEditMode ? (
              <>
                <Save size={18} /> Đang sửa
              </>
            ) : (
              <>
                <Settings size={18} /> Chỉnh sửa
              </>
            )}
            {""}
          </button>
          {""}
          {isEditMode && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all"
            >
              <Plus size={18} /> Thêm Bước{""}
            </button>
          )}
          {""}
        </div>
      </div>
      {""}
      {/* React Flow Canvas */}
      {""}
      <div className="flex-1 w-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={isEditMode ? onEdgesChange : undefined}
          onConnect={isEditMode ? onConnect : undefined}
          onNodeClick={onNodeClick}
          onPaneClick={() => setSelectedNode(null)}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.5}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 1.2 }}
          className="bg-slate-50"
          nodesDraggable={isEditMode}
          nodesConnectable={isEditMode}
          elementsSelectable={true}
        >
          <Background color="#cbd5e1" gap={24} size={2} />
          <Controls
            className="bg-white border-slate-200 shadow-lg overflow-hidden"
            showInteractive={false}
          />
        </ReactFlow>
        {""}
        {isEditMode && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/80 text-white px-4 py-2 text-sm font-medium backdrop-blur-sm">
            {""}
            Kéo thả để di chuyển các bước. Nối điểm để tạo mũi tên.{""}
          </div>
        )}
        {""}
      </div>
      {""}
      {/* Detail Panel */}
      {""}
      <AnimatePresence>
        {""}
        {selectedNode && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-[400px] h-[calc(100%-80px)] mt-[73px] bg-white shadow-2xl border-l border-slate-200 absolute right-0 top-0 z-20 flex flex-col"
          >
            <div className="p-4 lg:p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary mb-1 block">
                  Chi tiết bước
                </span>
                <h3 className="text-lg lg:text-xl font-black text-slate-900">
                  {selectedNode.data.label}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-2 bg-white text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors shadow-sm border border-slate-200"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 lg:p-6 overflow-y-auto flex-1 hide-scrollbar">
              <p className="text-slate-600 leading-relaxed mb-8 font-medium">
                {""}
                {selectedNode.data.description}
                {""}
              </p>
              {""}
              {selectedNode.data.tasks &&
                selectedNode.data.tasks.length > 0 && (
                  <div className="mb-8">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-emerald-500" />
                      {""}
                      Nhiệm vụ trọng tâm{""}
                    </h4>
                    <ul className="flex flex-col gap-3">
                      {""}
                      {selectedNode.data.tasks.map((task, idx) => (
                        <li
                          key={idx}
                          className="flex gap-3 text-slate-600 bg-slate-50 p-3 border border-slate-100"
                        >
                          <ChevronRight
                            size={16}
                            className="text-slate-400 shrink-0 mt-0.5"
                          />
                          <span className="text-sm font-medium">{task}</span>
                        </li>
                      ))}
                      {""}
                    </ul>
                  </div>
                )}
              {""}
              {selectedNode.data.documents &&
                selectedNode.data.documents.length > 0 && (
                  <div>
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <FileText size={18} className="text-amber-500" /> Tài liệu
                      cần dùng{""}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {""}
                      {selectedNode.data.documents.map((doc, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100 flex items-center gap-1.5"
                        >
                          <FileText size={12} /> {doc}
                          {""}
                        </span>
                      ))}
                      {""}
                    </div>
                  </div>
                )}
              {""}
            </div>
            <div className="p-4 lg:p-6 border-t border-slate-100 bg-slate-50/50">
              {""}
              {isEditMode ? (
                <button
                  onClick={() => {
                    setNodes(nodes.filter((n) => n.id !== selectedNode.id));
                    setEdges(
                      edges.filter(
                        (e) =>
                          e.source !== selectedNode.id &&
                          e.target !== selectedNode.id,
                      ),
                    );
                    saveToStorage(
                      nodes.filter((n) => n.id !== selectedNode.id),
                      edges.filter(
                        (e) =>
                          e.source !== selectedNode.id &&
                          e.target !== selectedNode.id,
                      ),
                    );
                    setSelectedNode(null);
                  }}
                  className="w-full py-3 bg-rose-50 text-rose-600 font-bold border border-rose-200 hover:bg-rose-100 transition-all"
                >
                  {""}
                  Xóa Bước Này{""}
                </button>
              ) : (
                <button className="w-full py-3 bg-slate-900 text-white font-bold shadow-lg shadow-slate-900/20 hover:bg-primary hover:shadow-primary/30 transition-all">
                  {""}
                  Đánh dấu hoàn thành{""}
                </button>
              )}
              {""}
            </div>
          </motion.div>
        )}
        {""}
      </AnimatePresence>
      {""}
      {/* Add Node Modal */}
      {""}
      <AnimatePresence>
        {""}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-white p-4 lg:p-6 shadow-2xl relative"
            >
              <h2 className="text-lg lg:text-xl font-black text-slate-900 mb-6">
                Thêm Bước Mới
              </h2>
              <form onSubmit={handleAddNode} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">
                    Tên bước
                  </label>
                  <input
                    required
                    value={newNodeTitle}
                    onChange={(e) => setNewNodeTitle(e.target.value)}
                    className="w-full p-3 border border-slate-200 bg-slate-50"
                    placeholder="VD: Báo giá"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">
                    Mô tả ngắn
                  </label>
                  <textarea
                    value={newNodeDesc}
                    onChange={(e) => setNewNodeDesc(e.target.value)}
                    className="w-full p-3 border border-slate-200 bg-slate-50 resize-none h-20"
                    placeholder="Mô tả công việc..."
                  ></textarea>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">
                    Nhiệm vụ (mỗi dòng 1 nhiệm vụ)
                  </label>
                  <textarea
                    value={newNodeTasks}
                    onChange={(e) => setNewNodeTasks(e.target.value)}
                    className="w-full p-3 border border-slate-200 bg-slate-50 resize-none h-24"
                    placeholder="Nhiệm vụ 1&#10;Nhiệm vụ 2"
                  ></textarea>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">
                    Icon
                  </label>
                  <CustomSelect
                    value={newNodeIcon}
                    onChange={(val) => setNewNodeIcon(val)}
                    options={[
                      { value: "Search", label: "Tìm kiếm (Search)" },
                      { value: "Coffee", label: "Tư vấn (Coffee)" },
                      { value: "Percent", label: "Báo giá (Percent)" },
                      { value: "PenTool", label: "Ký kết (PenTool)" },
                      {
                        value: "HeartHandshake",
                        label: "Chăm sóc (HeartHandshake)",
                      },
                      { value: "Bell", label: "Thông báo (Bell)" },
                    ]}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary text-white font-bold hover:bg-primary/90 shadow-lg shadow-primary/30"
                  >
                    Thêm Mới
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
        {""}
      </AnimatePresence>
      {""}
      {/* Add Workflow Modal */}
      {""}
      <AnimatePresence>
        {""}
        {showWfModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-white p-4 lg:p-6 shadow-2xl relative"
            >
              <h2 className="text-lg lg:text-xl font-black text-slate-900 mb-6">
                Tạo Quy Trình Mới
              </h2>
              <form onSubmit={handleAddWf} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">
                    Tên quy trình
                  </label>
                  <input
                    required
                    value={newWfName}
                    onChange={(e) => setNewWfName(e.target.value)}
                    className="w-full p-3 border border-slate-200 bg-slate-50"
                    placeholder="VD: Quy trình Xử lý Sự cố"
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowWfModal(false)}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary text-white font-bold hover:bg-primary/90 shadow-lg shadow-primary/30"
                  >
                    Tạo Mới
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
        {""}
      </AnimatePresence>
    </div>
  );
}
