import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  StickyNote,
  Calendar,
  Plus,
  Building2,
  Phone,
  Search,
  Trash2,
  Edit2,
  X,
  LayoutGrid,
  KanbanSquare,
  GripVertical,
  Settings,
} from "lucide-react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import notesData from "../../data/notes.json";
import CustomSelect from "../../components/ui/CustomSelect";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useDraggable, useDroppable } from "@dnd-kit/core";

const initialNotes = [];

const defaultColumns = [
  {
    id: "new",
    title: "Khách mới",
    color: "bg-slate-100 text-slate-600 border-slate-200",
  },
  {
    id: "warm",
    title: "Đang chăm sóc",
    color: "bg-amber-100 text-amber-600 border-amber-200",
  },
  {
    id: "hot",
    title: "Tiềm năng cao",
    color: "bg-rose-100 text-rose-600 border-rose-200",
  },
];

const colorThemes = [
  {
    id: "slate",
    name: "Xám",
    class: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-500",
  },
  {
    id: "amber",
    name: "Vàng",
    class: "bg-amber-100 text-amber-600 border-amber-200",
    dot: "bg-amber-500",
  },
  {
    id: "rose",
    name: "Đỏ",
    class: "bg-rose-100 text-rose-600 border-rose-200",
    dot: "bg-rose-500",
  },
  {
    id: "emerald",
    name: "Xanh lá",
    class: "bg-emerald-100 text-emerald-600 border-emerald-200",
    dot: "bg-emerald-500",
  },
  {
    id: "blue",
    name: "Xanh dương",
    class: "bg-blue-100 text-blue-600 border-blue-200",
    dot: "bg-blue-500",
  },
  {
    id: "purple",
    name: "Tím",
    class: "bg-purple-100 text-purple-600 border-purple-200",
    dot: "bg-purple-500",
  },
];

function DroppableColumn({ id, title, color, children, onEditColumn }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[320px] flex flex-col gap-4 p-4 border-2 transition-colors duration-200 h-full ${
        isOver
          ? "border-amber-400 bg-amber-50/50 shadow-inner"
          : "border-slate-100 bg-slate-50/50"
      }`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`px-4 py-2 font-bold text-sm border shadow-sm ${color}`}
        >
          {title}{" "}
          <span className="ml-1 opacity-70">
            ({Array.isArray(children) ? children.length : 0})
          </span>
        </div>
        <button
          onClick={() => onEditColumn(id)}
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
          title="Tuỳ chỉnh bước"
        >
          <Settings size={16} />
        </button>
      </div>
      <div className="flex flex-col gap-4 flex-1 h-full min-h-[150px]">
        {children}
      </div>
    </div>
  );
}

function DraggableCard({ note, onEdit, onDelete, isOverlay, columns }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: note.id,
      data: note,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const col = columns.find((c) => c.id === note.status);
  const statusColor = col
    ? col.color
    : "bg-slate-100 text-slate-600 border-slate-200";
  const statusLabel = col ? col.title : "Không xác định";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white p-5 shadow-sm border border-slate-100 relative transition-shadow ${
        isDragging && !isOverlay ? "opacity-30" : "hover:shadow-md"
      } ${isOverlay ? "shadow-2xl scale-105 rotate-2 cursor-grabbing" : ""}`}
    >
      <div
        {...listeners}
        {...attributes}
        className={`absolute top-4 right-4 text-slate-300 hover:text-amber-500 transition-colors ${isOverlay ? "cursor-grabbing" : "cursor-grab active:cursor-grabbing"}`}
      >
        <GripVertical size={20} />
      </div>

      <h3 className="text-lg font-black text-slate-900 mb-3 pr-8 truncate">
        {note.customer}
      </h3>

      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
          <Phone size={14} className="text-amber-500" />{" "}
          {note.phone || "Chưa cập nhật"}
        </div>
        <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
          <Building2 size={14} className="text-amber-500" />{" "}
          {note.unit || "Chưa xác định"}
        </div>
        <div className="flex items-center gap-2 text-rose-600 font-medium text-sm bg-rose-50 px-2 py-1 w-fit">
          <Calendar size={14} /> Gọi lại: {note.callbackDate || "Không có lịch"}
        </div>
      </div>

      <p className="text-slate-500 text-sm leading-relaxed bg-amber-50/50 p-3 border border-amber-100/50 italic line-clamp-3">
        "{note.interest}"
      </p>

      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-50">
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onEdit(note)}
          className="w-8 h-8 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-amber-500 transition-colors"
        >
          <Edit2 size={14} />
        </button>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onDelete(note.id)}
          className="w-8 h-8 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

export default function SectionNotes() {
  const [columns, setColumns] = useLocalStorage(
    "fenica_kanban_columns",
    defaultColumns,
  );
  const [notes, setNotes] = useLocalStorage("fenica_notes_v2", initialNotes);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [activeDragNote, setActiveDragNote] = useState(null);

  const [newCustomer, setNewCustomer] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newUnit, setNewUnit] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [newDate, setNewDate] = useState("");

  // Column Management State
  const [editingColumn, setEditingColumn] = useState(null); // { id, title, color }
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [columnFormData, setColumnFormData] = useState({
    title: "",
    color: colorThemes[0].class,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const filteredNotes = useMemo(() => {
    return notes.filter(
      (n) =>
        n.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.unit.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [notes, searchTerm]);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newCustomer) return;

    const note = {
      id: Date.now(),
      customer: newCustomer,
      phone: newPhone,
      unit: newUnit,
      interest: newInterest,
      callbackDate: newDate,
      status: columns.length > 0 ? columns[0].id : "new",
    };

    setNotes([note, ...notes]);
    setNewCustomer("");
    setNewPhone("");
    setNewUnit("");
    setNewInterest("");
    setNewDate("");
    setIsAdding(false);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const handleEditClick = (note) => {
    setEditingNoteId(note.id);
    setEditFormData(note);
  };

  const handleSaveEdit = () => {
    setNotes(notes.map((n) => (n.id === editingNoteId ? editFormData : n)));
    setEditingNoteId(null);
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const note = notes.find((n) => n.id === active.id);
    setActiveDragNote(note);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDragNote(null);

    if (over && active.id !== over.id) {
      const activeId = active.id;
      const overStatus = over.id;

      setNotes(
        notes.map((note) => {
          if (note.id === activeId) {
            return { ...note, status: overStatus };
          }
          return note;
        }),
      );
    }
  };

  const getStatusColor = (statusId) => {
    const col = columns.find((c) => c.id === statusId);
    return col ? col.color : "bg-slate-100 text-slate-600 border-slate-200";
  };

  const getStatusLabel = (statusId) => {
    const col = columns.find((c) => c.id === statusId);
    return col ? col.title : "Không xác định";
  };

  // --- COLUMN MANAGEMENT ---
  const handleAddColumnSubmit = (e) => {
    e.preventDefault();
    if (!columnFormData.title.trim()) return;
    const newCol = {
      id: "col_" + Date.now(),
      title: columnFormData.title.trim(),
      color: columnFormData.color,
    };
    setColumns([...columns, newCol]);
    setIsAddingColumn(false);
    setColumnFormData({ title: "", color: colorThemes[0].class });
  };

  const handleEditColumnSubmit = (e) => {
    e.preventDefault();
    if (!editingColumn.title.trim()) return;
    setColumns(
      columns.map((c) => (c.id === editingColumn.id ? editingColumn : c)),
    );
    setEditingColumn(null);
  };

  const handleDeleteColumn = () => {
    if (!editingColumn) return;

    const notesInColumn = notes.filter((n) => n.status === editingColumn.id);

    if (notesInColumn.length > 0) {
      // Auto move notes to the first available column that is NOT the deleted one
      const fallbackColumn = columns.find((c) => c.id !== editingColumn.id);
      if (!fallbackColumn) {
        alert(
          "Bạn không thể xoá cột duy nhất khi vẫn còn khách hàng bên trong!",
        );
        return;
      }

      setNotes(
        notes.map((n) => {
          if (n.status === editingColumn.id)
            return { ...n, status: fallbackColumn.id };
          return n;
        }),
      );
      alert(
        `Đã di chuyển ${notesInColumn.length} khách hàng sang bước"${fallbackColumn.title}"để tránh mất dữ liệu.`,
      );
    }

    setColumns(columns.filter((c) => c.id !== editingColumn.id));
    setEditingColumn(null);
  };

  const columnOptions = columns.map((c) => ({ value: c.id, label: c.title }));

  return (
    <div className="min-h-screen bg-slate-50 overflow-y-auto relative">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-7xl mx-auto w-full mt-4 px-6 lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-600 font-bold text-sm mb-4 w-fit">
            <StickyNote size={16} /> CRM Cá Nhân
          </div>
        </div>

        <div className="flex gap-4 items-center flex-wrap sm:flex-nowrap">
          {/* View Toggle */}
          <div className="flex bg-slate-200/50 p-1 shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 flex items-center justify-center transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-amber-500" : "text-slate-400 hover:text-slate-600"}`}
              title="Chế độ Lưới"
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-2 flex items-center justify-center transition-colors ${viewMode === "kanban" ? "bg-white shadow-sm text-amber-500" : "text-slate-400 hover:text-slate-600"}`}
              title="Chế độ Kanban"
            >
              <KanbanSquare size={20} />
            </button>
          </div>

          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Tìm khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-56 pl-10 pr-4 py-3 border border-slate-200 focus:border-amber-500 outline-none shadow-sm transition-colors"
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold hover:bg-amber-500 transition-all shadow-lg hover:shadow-amber-500/30 whitespace-nowrap shrink-0"
          >
            {isAdding ? <X size={20} /> : <Plus size={20} />}
            <span className="hidden sm:inline">
              {isAdding ? "Đóng" : "Thêm mới"}
            </span>
          </button>
        </div>
      </div>

      <div className="mx-auto w-full pb-20">
        {/* ADD NOTE FORM (Collapsible) */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="mb-8 origin-top"
            >
              <div className="bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 max-w-3xl mx-auto">
                <h3 className="font-black text-2xl text-slate-900 mb-6">
                  Thêm Ghi Chú Khách Hàng
                </h3>
                <form
                  onSubmit={handleAddNote}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                      Tên khách hàng *
                    </label>
                    <input
                      required
                      type="text"
                      value={newCustomer}
                      onChange={(e) => setNewCustomer(e.target.value)}
                      className="w-full p-4 border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 outline-none transition-colors"
                      placeholder="VD: Khách A"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full p-4 border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 outline-none transition-colors"
                      placeholder="VD: 0909..."
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                      Căn quan tâm
                    </label>
                    <input
                      type="text"
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value)}
                      className="w-full p-4 border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 outline-none transition-colors"
                      placeholder="VD: A-1205"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                      Ngày gọi lại
                    </label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full p-4 border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 outline-none transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                      Nội dung quan tâm
                    </label>
                    <textarea
                      rows="3"
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      className="w-full p-4 border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 outline-none transition-colors resize-none"
                      placeholder="VD: Thích view hồ bơi..."
                    ></textarea>
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-4 mt-2">
                    <button
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="px-8 py-4 bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
                    >
                      Hủy Bỏ
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-4 bg-amber-500 text-white font-bold shadow-lg shadow-amber-500/30 hover:bg-amber-600 transition-colors"
                    >
                      Lưu Ghi Chú
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Editing Note Modal */}
        <AnimatePresence>
          {editingNoteId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex justify-center items-center p-4 bg-slate-900/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white p-6 sm:p-8 w-full max-w-2xl shadow-2xl relative"
              >
                <h3 className="font-black text-2xl text-slate-900 mb-6">
                  Chỉnh sửa Ghi chú
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                      Khách hàng
                    </label>
                    <input
                      type="text"
                      value={editFormData.customer}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          customer: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-slate-200 outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={editFormData.phone}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          phone: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-slate-200 outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                      Ngày gọi lại
                    </label>
                    <input
                      type="date"
                      value={editFormData.callbackDate}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          callbackDate: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-slate-200 outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                      Trạng thái
                    </label>
                    <CustomSelect
                      value={editFormData.status}
                      onChange={(val) =>
                        setEditFormData({ ...editFormData, status: val })
                      }
                      options={columnOptions}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                      Nội dung
                    </label>
                    <textarea
                      value={editFormData.interest}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          interest: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-slate-200 resize-none outline-none focus:border-amber-500"
                      rows="3"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                    <button
                      onClick={() => setEditingNoteId(null)}
                      className="px-6 py-3 bg-slate-100 font-bold text-slate-600 hover:bg-slate-200"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-6 py-3 bg-amber-500 font-bold text-white hover:bg-amber-600 shadow-lg shadow-amber-500/30"
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Editing Column Modal */}
        <AnimatePresence>
          {(editingColumn || isAddingColumn) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] flex justify-center items-center p-4 bg-slate-900/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white p-6 sm:p-8 w-full max-w-md shadow-2xl relative"
              >
                <h3 className="font-black text-2xl text-slate-900 mb-6">
                  {editingColumn ? "Tuỳ chỉnh Bước" : "Thêm Bước Mới"}
                </h3>
                <form
                  onSubmit={
                    editingColumn
                      ? handleEditColumnSubmit
                      : handleAddColumnSubmit
                  }
                  className="flex flex-col gap-6"
                >
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                      Tên bước (cột)
                    </label>
                    <input
                      required
                      type="text"
                      value={
                        editingColumn
                          ? editingColumn.title
                          : columnFormData.title
                      }
                      onChange={(e) =>
                        editingColumn
                          ? setEditingColumn({
                              ...editingColumn,
                              title: e.target.value,
                            })
                          : setColumnFormData({
                              ...columnFormData,
                              title: e.target.value,
                            })
                      }
                      className="w-full p-3 border border-slate-200 outline-none focus:border-amber-500"
                      placeholder="VD: Chốt cọc, Đã ký HĐMB..."
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                      Màu sắc
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {colorThemes.map((theme) => {
                        const isSelected = editingColumn
                          ? editingColumn.color === theme.class
                          : columnFormData.color === theme.class;
                        return (
                          <div
                            key={theme.id}
                            onClick={() =>
                              editingColumn
                                ? setEditingColumn({
                                    ...editingColumn,
                                    color: theme.class,
                                  })
                                : setColumnFormData({
                                    ...columnFormData,
                                    color: theme.class,
                                  })
                            }
                            className={`w-10 h-10 cursor-pointer flex items-center justify-center transition-transform ${theme.class} ${isSelected ? "ring-2 ring-offset-2 ring-slate-400 scale-110 shadow-md" : "opacity-70 hover:opacity-100"}`}
                            title={theme.name}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingColumn(null);
                        setIsAddingColumn(false);
                      }}
                      className="px-5 py-2.5 bg-slate-100 font-bold text-slate-600 hover:bg-slate-200"
                    >
                      Hủy
                    </button>
                    {editingColumn && (
                      <button
                        type="button"
                        onClick={handleDeleteColumn}
                        className="px-5 py-2.5 bg-rose-50 font-bold text-rose-500 hover:bg-rose-100 mr-auto"
                      >
                        Xoá cột
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-slate-900 font-bold text-white hover:bg-amber-500 shadow-md transition-colors"
                    >
                      Lưu
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        {filteredNotes.length === 0 && viewMode === "grid" ? (
          <div className="py-20 text-center text-slate-400 border-2 border-dashed border-slate-200">
            <StickyNote
              size={48}
              className="mx-auto mb-4 opacity-50 text-amber-500"
            />
            <p className="text-lg font-medium text-slate-500">
              Chưa có ghi chú nào phù hợp.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredNotes.map((note) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={note.id}
                  className="bg-white p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all group flex flex-col relative"
                >
                  <div
                    className={`absolute top-6 right-6 px-3 py-1 text-xs font-bold uppercase tracking-wider border ${getStatusColor(note.status)}`}
                  >
                    {getStatusLabel(note.status)}
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mb-4 pr-32 truncate">
                    {note.customer}
                  </h3>

                  <div className="flex flex-col gap-3 mb-6 flex-1">
                    <div className="flex items-center gap-3 text-slate-600 font-medium">
                      <div className="w-8 h-8 bg-slate-50 flex items-center justify-center shrink-0">
                        <Phone size={14} className="text-amber-500" />
                      </div>
                      {note.phone || "Chưa cập nhật"}
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 font-medium">
                      <div className="w-8 h-8 bg-slate-50 flex items-center justify-center shrink-0">
                        <Building2 size={14} className="text-amber-500" />
                      </div>
                      {note.unit || "Chưa xác định"}
                    </div>
                    <div className="flex items-center gap-3 text-rose-600 font-medium">
                      <div className="w-8 h-8 bg-rose-50 flex items-center justify-center shrink-0">
                        <Calendar size={14} className="text-rose-500" />
                      </div>
                      Gọi lại: {note.callbackDate || "Không có lịch"}
                    </div>
                  </div>

                  <p className="text-slate-600 leading-relaxed bg-amber-50/50 p-4 border border-amber-100/50 italic text-sm line-clamp-3 mb-6">
                    "{note.interest}"
                  </p>

                  <div className="flex gap-2 mt-auto pt-4 border-t border-slate-50">
                    <button
                      onClick={() => handleEditClick(note)}
                      className="flex-1 py-3 flex items-center justify-center gap-2 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-amber-500 transition-colors font-bold text-sm"
                    >
                      <Edit2 size={16} /> Sửa
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="w-12 h-12 shrink-0 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* KANBAN VIEW */
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div
              className="flex flex-col sm:flex-row gap-6 overflow-x-auto pb-8 items-start snap-x"
              style={{ scrollbarWidth: "thin" }}
            >
              {columns.map((col) => (
                <div
                  key={col.id}
                  className="snap-start min-w-[320px] w-full sm:w-[320px] h-full"
                >
                  <DroppableColumn
                    id={col.id}
                    title={col.title}
                    color={col.color}
                    onEditColumn={(id) =>
                      setEditingColumn(columns.find((c) => c.id === id))
                    }
                  >
                    {filteredNotes
                      .filter((note) => note.status === col.id)
                      .map((note) => (
                        <DraggableCard
                          key={note.id}
                          note={note}
                          onEdit={handleEditClick}
                          onDelete={deleteNote}
                          columns={columns}
                        />
                      ))}
                  </DroppableColumn>
                </div>
              ))}

              {/* ADD NEW COLUMN BUTTON */}
              <div className="snap-start min-w-[320px] w-full sm:w-[320px] pt-4">
                <button
                  onClick={() => setIsAddingColumn(true)}
                  className="w-full flex flex-col items-center justify-center gap-3 py-12 border-2 border-dashed border-slate-200 text-slate-400 hover:text-amber-500 hover:border-amber-300 hover:bg-amber-50/50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-slate-100 group-hover:bg-amber-100 flex items-center justify-center transition-colors">
                    <Plus size={24} />
                  </div>
                  <span className="font-bold">Thêm Bước Mới</span>
                </button>
              </div>
            </div>
            <DragOverlay>
              {activeDragNote ? (
                <DraggableCard
                  note={activeDragNote}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  isOverlay
                  columns={columns}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
}
