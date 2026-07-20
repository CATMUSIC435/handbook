import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Edit2,
  MessageSquare,
  Tag,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronDown,
  Building2,
  Trash2,
  ArrowDownUp,
} from "lucide-react";
import mockCustomers from "../../data/customers.json";
import mockAppointments from "../../data/appointments.json";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import CustomSelect from "../../components/ui/CustomSelect";
import { useLocalStorage } from "../../hooks/useLocalStorage";
const ACTIVITY_TYPES = [
  { value: "CALL", label: "Cuộc gọi" },
  { value: "MEETING", label: "Gặp mặt" },
  { value: "NOTE", label: "Ghi chú" },
  { value: "EMAIL", label: "Email" },
];
export default function SectionCustomerProfile() {
  const [customers, setCustomers] = useLocalStorage(
    "fenica_customers_v2",
    [],
  );
  const [appointments] = useLocalStorage(
    "fenica_appointments_v2",
    [],
  );
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("history");
  /* history, info, notes */ const [showAddModal, setShowAddModal] =
    useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [isActivityTypeOpen, setIsActivityTypeOpen] = useState(false);
  const [newActivityType, setNewActivityType] = useState("CALL");
  const [newActivityContent, setNewActivityContent] = useState("");
  /* EDIT STATE */ const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState(null);
  /* NOTES STATE */ const [notesValue, setNotesValue] = useState("");
  /* ACTIVITY TIMELINE STATE */ const [sortOrder, setSortOrder] =
    useState("desc");
  /* desc = newest first */ const [editActivityId, setEditActivityId] =
    useState(null);
  const [editActivityContent, setEditActivityContent] = useState("");
  const selectedCustomer =
    customers.find((c) => c.id === selectedId) || customers[0];
  useEffect(() => {
    if (selectedCustomer) {
      setNotesValue(selectedCustomer.notes || "");
    }
  }, [selectedId, selectedCustomer?.notes]);
  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!newCustomerName || !newCustomerPhone) return;
    const newId = `KH${Date.now()}`;
    const newCustomer = {
      id: newId,
      name: newCustomerName,
      phone: newCustomerPhone,
      email: "",
      transactionStatus: "new",
      interestLevel: "cold",
      budget: "Chưa xác định",
      targetUnit: "Chưa xác định",
      history: [
        {
          id: `h1`,
          date: new Date().toISOString().split("T")[0],
          type: "NOTE",
          content: "Khách hàng mới được thêm vào hệ thống.",
        },
      ],
      notes: "",
    };
    setCustomers([newCustomer, ...customers]);
    setSelectedId(newId);
    setShowAddModal(false);
    setNewCustomerName("");
    setNewCustomerPhone("");
  };
  const handleEditCustomer = (e) => {
    e.preventDefault();
    if (!editForm.name || !editForm.phone) return;
    const updated = customers.map((c) =>
      c.id === editForm.id ? { ...c, ...editForm } : c,
    );
    setCustomers(updated);
    setShowEditModal(false);
  };
  const handleDeleteCustomer = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá khách hàng này?")) {
      const updated = customers.filter((c) => c.id !== id);
      setCustomers(updated);
      if (selectedId === id && updated.length > 0) {
        setSelectedId(updated[0].id);
      }
    }
  };
  const handleUpdateNotes = () => {
    if (!selectedCustomer) return;
    const updated = customers.map((c) =>
      c.id === selectedId ? { ...c, notes: notesValue } : c,
    );
    setCustomers(updated);
    alert("Đã lưu ghi chú thành công!");
  };
  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!newActivityContent) return;
    const updatedCustomers = customers.map((c) => {
      if (c.id === selectedId) {
        return {
          ...c,
          history: [
            {
              id: `h${Date.now()}`,
              date: new Date().toISOString().split("T")[0],
              type: newActivityType,
              content: newActivityContent,
            },
            ...c.history,
          ],
        };
      }
      return c;
    });
    setCustomers(updatedCustomers);
    setShowAddActivityModal(false);
    setIsActivityTypeOpen(false);
    setNewActivityContent("");
    setNewActivityType("CALL");
  };
  const handleDeleteActivity = (activityId) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá hoạt động này?")) {
      const updatedCustomers = customers.map((c) => {
        if (c.id === selectedId) {
          return {
            ...c,
            history: c.history.filter((h) => h.id !== activityId),
          };
        }
        return c;
      });
      setCustomers(updatedCustomers);
    }
  };
  const handleSaveEditActivity = (activityId) => {
    if (!editActivityContent.trim()) return;
    const updatedCustomers = customers.map((c) => {
      if (c.id === selectedId) {
        return {
          ...c,
          history: c.history.map((h) =>
            h.id === activityId ? { ...h, content: editActivityContent } : h,
          ),
        };
      }
      return c;
    });
    setCustomers(updatedCustomers);
    setEditActivityId(null);
  };
  const sortedHistory = selectedCustomer
    ? [...selectedCustomer.history].sort((a, b) => {
        return sortOrder === "desc"
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date);
      })
    : [];
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm),
  );
  const getInterestColor = (level) => {
    switch (level) {
      case "hot":
        return "bg-rose-100 text-rose-600 border-rose-200";
      case "warm":
        return "bg-amber-100 text-amber-600 border-amber-200";
      case "cold":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };
  const getInterestLabel = (level) => {
    switch (level) {
      case "hot":
        return "Rất quan tâm";
      case "warm":
        return "Đang cân nhắc";
      case "cold":
        return "Chưa rõ nhu cầu";
      default:
        return level;
    }
  };
  const getStatusInfo = (status) => {
    switch (status) {
      case "new":
        return {
          label: "Khách mới",
          color: "bg-blue-50 text-blue-600 border-blue-200",
          icon: AlertCircle,
        };
      case "consulting":
        return {
          label: "Đang tư vấn",
          color: "bg-indigo-50 text-indigo-600 border-indigo-200",
          icon: MessageSquare,
        };
      case "viewing":
        return {
          label: "Đã xem nhà",
          color: "bg-purple-50 text-purple-600 border-purple-200",
          icon: MapPin,
        };
      case "deposited":
        return {
          label: "Đã cọc",
          color: "bg-emerald-50 text-emerald-600 border-emerald-200",
          icon: CheckCircle2,
        };
      case "won":
        return {
          label: "Ký HĐMB",
          color: "bg-emerald-500 text-white border-emerald-600",
          icon: CheckCircle2,
        };
      case "lost":
        return {
          label: "Đóng/Thất bại",
          color: "bg-slate-100 text-slate-500 border-slate-300",
          icon: X,
        };
      default:
        return {
          label: status,
          color: "bg-slate-50 text-slate-600",
          icon: FileText,
        };
    }
  };
  const StatusIcon = selectedCustomer
    ? getStatusInfo(selectedCustomer.transactionStatus).icon
    : FileText;
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-hidden">
      {" "}
      {/* Header */}{" "}
      <div className="bg-white border-b border-slate-200 shrink-0">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Users size={20} />
            </div>
            <div>
              <h2 className="hidden text-lg lg:text-xl font-black text-slate-900 leading-tight">
                Hồ Sơ Khách Hàng
              </h2>
              <p className="hidden text-sm font-medium text-slate-500">
                Quản lý vòng đời (CRM Mini)
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-bold shadow-lg shadow-slate-900/20 hover:bg-amber-500 hover:shadow-amber-500/30 transition-all"
          >
            <Plus size={18} /> Thêm khách hàng{" "}
          </button>
        </div>
      </div>{" "}
      {/* Main Workspace */}{" "}
      <div className="flex-1 max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row overflow-hidden p-4 gap-4">
        {" "}
        {/* LEFT PANE: Customer List */}{" "}
        <div className="w-full lg:w-96 shrink-0 bg-white border border-slate-200 shadow-sm flex flex-col overflow-hidden max-h-[400px] lg:max-h-none">
          {" "}
          {/* Search Box */}{" "}
          <div className="p-4 border-b border-slate-100 shrink-0">
            <Input
              icon={Search}
              placeholder="Tìm tên, SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>{" "}
          {/* List */}{" "}
          <div
            className="flex-1 overflow-y-auto p-2"
            style={{ scrollbarWidth: "thin" }}
          >
            <div className="flex flex-col gap-1">
              {" "}
              {filteredCustomers.map((customer) => (
                <div key={customer.id} className="relative group">
                  <button
                    onClick={() => setSelectedId(customer.id)}
                    className={`w-full flex flex-col p-4 text-left transition-all ${selectedId === customer.id ? "bg-amber-50 border border-amber-200" : "hover:bg-slate-50 border border-transparent"}`}
                  >
                    <div className="flex justify-between items-start mb-2 pr-8">
                      <span className="font-bold text-slate-900 text-base">
                        {customer.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 uppercase border ${getInterestColor(customer.interestLevel)}`}
                      >
                        {" "}
                        {customer.interestLevel}{" "}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 mb-1">
                      <Phone size={12} /> {customer.phone}{" "}
                    </div>
                    <div className="text-xs font-bold text-slate-400 mt-1 truncate flex items-center gap-1">
                      <Tag size={10} />{" "}
                      {getStatusInfo(customer.transactionStatus).label}{" "}
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCustomer(customer.id);
                    }}
                    className="absolute top-4 right-4 w-6 h-6 bg-rose-100 text-rose-600 items-center justify-center hidden group-hover:flex hover:bg-rose-500 hover:text-white transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}{" "}
              {filteredCustomers.length === 0 && (
                <div className="text-center p-4 lg:p-8 text-slate-400">
                  <Users size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">
                    Không tìm thấy khách hàng.
                  </p>
                </div>
              )}{" "}
            </div>
          </div>
        </div>{" "}
        {/* RIGHT PANE: Customer Details */}{" "}
        <div className="flex-1 bg-white border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          {" "}
          {selectedCustomer ? (
            <>
              {" "}
              {/* Profile Header */}{" "}
              <div className="p-4 lg:p-8 border-b border-slate-100 bg-slate-50/50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg lg:text-xl font-black text-slate-900">
                        {selectedCustomer.name}
                      </h3>
                      <button
                        onClick={() => {
                          setEditForm(selectedCustomer);
                          setShowEditModal(true);
                        }}
                        className="text-xs font-bold px-2.5 py-1 bg-white border border-slate-200 text-slate-500 shadow-sm hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-colors flex items-center gap-1"
                      >
                        <Edit2 size={12} /> Sửa{" "}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-4 lg:gap-6 mt-4">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <div className="w-8 h-8 bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                          <Phone size={14} className="text-amber-500" />
                        </div>{" "}
                        {selectedCustomer.phone}{" "}
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <div className="w-8 h-8 bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                          <Mail size={14} className="text-amber-500" />
                        </div>{" "}
                        {selectedCustomer.email || "Chưa cập nhật"}{" "}
                      </div>
                    </div>
                  </div>{" "}
                  {/* Status Badges */}{" "}
                  <div className="flex flex-col items-end gap-3">
                    <div
                      className={`px-4 py-2 flex items-center gap-2 font-bold text-sm border ${getStatusInfo(selectedCustomer.transactionStatus).color}`}
                    >
                      <StatusIcon size={16} />{" "}
                      {
                        getStatusInfo(selectedCustomer.transactionStatus).label
                      }{" "}
                    </div>
                    <div
                      className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider border ${getInterestColor(selectedCustomer.interestLevel)}`}
                    >
                      {" "}
                      Nhu cầu:{" "}
                      {getInterestLabel(selectedCustomer.interestLevel)}{" "}
                    </div>
                  </div>
                </div>
              </div>{" "}
              {/* Details Workspace */}{" "}
              <div className="flex-1 flex flex-col overflow-hidden">
                {" "}
                {/* Tabs */}{" "}
                <div className="flex border-b border-slate-100 px-6 pt-4 gap-4 lg:gap-6 shrink-0">
                  <button
                    onClick={() => setActiveTab("history")}
                    className={`pb-4 font-bold text-sm border-b-2 transition-colors ${activeTab === "history" ? "border-amber-500 text-amber-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                  >
                    {" "}
                    Lịch sử trao đổi{" "}
                  </button>
                  <button
                    onClick={() => setActiveTab("info")}
                    className={`pb-4 font-bold text-sm border-b-2 transition-colors ${activeTab === "info" ? "border-amber-500 text-amber-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                  >
                    {" "}
                    Thông tin & Nhu cầu{" "}
                  </button>
                  <button
                    onClick={() => setActiveTab("notes")}
                    className={`pb-4 font-bold text-sm border-b-2 transition-colors ${activeTab === "notes" ? "border-amber-500 text-amber-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                  >
                    {" "}
                    Ghi chú nội bộ{" "}
                  </button>
                </div>{" "}
                {/* Tab Content */}{" "}
                <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-50/30">
                  <AnimatePresence mode="wait">
                    {" "}
                    {/* HISTORY TAB */}{" "}
                    {activeTab === "history" && (
                      <motion.div
                        key="history"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                          <div className="flex items-center gap-3">
                            <h4 className="font-bold text-slate-900">
                              Dòng thời gian tương tác
                            </h4>
                            <button
                              onClick={() =>
                                setSortOrder((prev) =>
                                  prev === "desc" ? "asc" : "desc",
                                )
                              }
                              className="text-[11px] text-slate-500 hover:text-amber-600 flex items-center gap-1 font-bold bg-white px-2 py-1 border border-slate-200 shadow-sm transition-colors"
                              title="Sắp xếp thời gian"
                            >
                              <ArrowDownUp size={12} />{" "}
                              {sortOrder === "desc"
                                ? "Mới nhất"
                                : "Cũ nhất"}{" "}
                            </button>
                          </div>
                          <button
                            onClick={() => setShowAddActivityModal(true)}
                            className="text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 transition-colors"
                          >
                            <Plus size={14} /> Thêm hoạt động{" "}
                          </button>
                        </div>
                        <div className="relative border-l-2 border-slate-200 ml-3 md:ml-4 flex flex-col gap-4 lg:gap-8 pb-4">
                          {" "}
                          {sortedHistory.map((item) => (
                            <div
                              key={item.id}
                              className="relative pl-6 md:pl-8 group"
                            >
                              {" "}
                              {/* Timeline dot */}{" "}
                              <div className="absolute -left-[11px] top-1 w-5 h-5 bg-white border-4 border-amber-500 shadow-sm"></div>
                              <div className="bg-white p-5 border border-slate-100 shadow-sm hover:border-amber-200 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1">
                                      {" "}
                                      {item.type}{" "}
                                    </span>
                                    <span className="text-sm font-medium text-slate-500 flex items-center gap-1">
                                      <Clock size={12} /> {item.date}{" "}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-50 p-1">
                                    <button
                                      onClick={() => {
                                        setEditActivityId(item.id);
                                        setEditActivityContent(item.content);
                                      }}
                                      className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-amber-500 transition-colors"
                                      title="Sửa"
                                    >
                                      <Edit2 size={12} />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteActivity(item.id)
                                      }
                                      className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
                                      title="Xóa"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>{" "}
                                {editActivityId === item.id ? (
                                  <div className="mt-3 flex flex-col gap-2">
                                    <textarea
                                      value={editActivityContent}
                                      onChange={(e) =>
                                        setEditActivityContent(e.target.value)
                                      }
                                      className="w-full bg-slate-50 border border-slate-200 p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                                      rows={3}
                                    />
                                    <div className="flex justify-end gap-2">
                                      <button
                                        onClick={() => setEditActivityId(null)}
                                        className="text-xs font-bold text-slate-600 px-4 py-2 hover:bg-slate-100 transition-colors"
                                      >
                                        Hủy bỏ
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleSaveEditActivity(item.id)
                                        }
                                        className="text-xs font-bold text-white bg-amber-500 px-4 py-2 hover:bg-amber-600 shadow-sm shadow-amber-500/20 transition-all"
                                      >
                                        Lưu thay đổi
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-slate-700 leading-relaxed font-medium mt-1">
                                    {item.content}
                                  </p>
                                )}{" "}
                              </div>
                            </div>
                          ))}{" "}
                          {sortedHistory.length === 0 && (
                            <div className="pl-8 text-slate-400 font-medium">
                              Chưa có lịch sử trao đổi nào.
                            </div>
                          )}{" "}
                        </div>
                      </motion.div>
                    )}{" "}
                    {/* INFO TAB */}{" "}
                    {activeTab === "info" && (
                      <motion.div
                        key="info"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                          <div className="bg-white p-4 lg:p-6 border border-slate-100 shadow-sm">
                            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                              <Tag size={16} className="text-amber-500" /> Ngân
                              sách dự kiến{" "}
                            </h4>
                            <p className="text-lg lg:text-xl font-black text-slate-700">
                              {selectedCustomer.budget}
                            </p>
                          </div>
                          <div className="bg-white p-4 lg:p-6 border border-slate-100 shadow-sm">
                            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                              <Building2 size={16} className="text-amber-500" />{" "}
                              Sản phẩm quan tâm{" "}
                            </h4>
                            <p className="text-lg lg:text-xl font-bold text-slate-700">
                              {selectedCustomer.targetUnit}
                            </p>
                          </div>
                          <div className="md:col-span-2 bg-white p-4 lg:p-6 border border-slate-100 shadow-sm">
                            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                              <AlertCircle
                                size={16}
                                className="text-amber-500"
                              />{" "}
                              Yêu cầu đặc biệt{" "}
                            </h4>
                            <p className="text-slate-600 leading-relaxed">
                              {" "}
                              {selectedCustomer.notes || "(Chưa có thông tin yêu cầu đặc biệt)"}{" "}
                            </p>
                          </div>
                          
                          <div className="md:col-span-2 bg-white p-4 lg:p-6 border border-slate-100 shadow-sm">
                            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                              <Calendar
                                size={16}
                                className="text-amber-500"
                              />{" "}
                              Lịch Hẹn Sắp Tới{" "}
                            </h4>
                            <div className="flex flex-col gap-3">
                              {appointments.filter(a => a.customerId === selectedCustomer.id).length > 0 ? (
                                appointments
                                  .filter(a => a.customerId === selectedCustomer.id)
                                  .map(apt => (
                                    <div key={apt.id} className="p-3 border border-slate-100 bg-slate-50 flex justify-between items-center">
                                      <div>
                                        <p className="font-bold text-slate-900">{apt.title}</p>
                                        <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                                          <Clock size={12} /> {apt.time} - {apt.date}
                                        </p>
                                      </div>
                                      <div className="text-xs font-bold px-2 py-1 uppercase border bg-white  text-slate-600 shadow-sm">
                                        {apt.type}
                                      </div>
                                    </div>
                                  ))
                              ) : (
                                <p className="text-slate-500 italic">Khách hàng chưa có lịch hẹn nào sắp tới.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}{" "}
                    {/* NOTES TAB */}{" "}
                    {activeTab === "notes" && (
                      <motion.div
                        key="notes"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex flex-col"
                      >
                        <div className="bg-[#fff9e6] p-4 lg:p-6 border border-amber-200/50 shadow-inner flex-1 min-h-[300px]">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-amber-800 flex items-center gap-2">
                              <Edit2 size={16} /> Sổ tay ghi chú{" "}
                            </h4>
                            <button
                              onClick={handleUpdateNotes}
                              className="text-xs font-bold bg-amber-500 text-white px-3 py-1.5 hover:bg-amber-600 transition-colors shadow-sm"
                            >
                              {" "}
                              Lưu cập nhật{" "}
                            </button>
                          </div>
                          <textarea
                            className="w-full h-[80%] bg-transparent border-none outline-none resize-none text-slate-700 font-medium leading-relaxed placeholder:text-amber-700/30"
                            value={notesValue}
                            onChange={(e) => setNotesValue(e.target.value)}
                            placeholder="Nhập ghi chú quan trọng về khách hàng..."
                          ></textarea>
                        </div>
                      </motion.div>
                    )}{" "}
                  </AnimatePresence>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-4 lg:p-8 text-center bg-slate-50/50">
              <Users size={48} className="mb-4 opacity-30" />
              <h3 className="text-lg font-bold text-slate-600 mb-2">
                Chưa chọn khách hàng
              </h3>
              <p className="text-sm font-medium">
                Vui lòng chọn khách hàng từ danh sách bên trái hoặc thêm mới để
                xem chi tiết.
              </p>
            </div>
          )}{" "}
        </div>
      </div>{" "}
      {/* Add Customer Modal */}{" "}
      <AnimatePresence>
        {" "}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 lg:p-6 border-b border-slate-100">
                <h3 className="text-lg lg:text-xl font-bold text-slate-900">
                  Thêm Khách Hàng Mới
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <form
                onSubmit={handleAddCustomer}
                className="p-4 lg:p-6 flex flex-col gap-4"
              >
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder="VD: Nguyễn Văn A"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 font-medium text-slate-900 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    placeholder="VD: 0909123456"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 font-medium text-slate-900 transition-all"
                  />
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                  >
                    {" "}
                    Hủy bỏ{" "}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-lg shadow-amber-500/30 transition-all"
                  >
                    {" "}
                    Lưu thông tin{" "}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}{" "}
      </AnimatePresence>{" "}
      {/* Add Activity Modal */}{" "}
      <AnimatePresence>
        {" "}
        {showAddActivityModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddActivityModal(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 lg:p-6 border-b border-slate-100">
                <h3 className="text-lg lg:text-xl font-bold text-slate-900">
                  Thêm Hoạt Động Mới
                </h3>
                <button
                  onClick={() => setShowAddActivityModal(false)}
                  className="w-8 h-8 bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <form
                onSubmit={handleAddActivity}
                className="p-4 lg:p-6 flex flex-col gap-4"
              >
                <div className="relative">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Loại hoạt động *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsActivityTypeOpen(!isActivityTypeOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 font-medium text-slate-900 transition-all"
                  >
                    <span>
                      {ACTIVITY_TYPES.find((t) => t.value === newActivityType)
                        ?.label || "Chọn loại hoạt động"}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-slate-400 transition-transform ${isActivityTypeOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {" "}
                    {isActivityTypeOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 w-full mt-2 bg-white border border-slate-200 shadow-xl overflow-hidden"
                      >
                        {" "}
                        {ACTIVITY_TYPES.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => {
                              setNewActivityType(type.value);
                              setIsActivityTypeOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${newActivityType === type.value ? "bg-amber-50 text-amber-700 font-bold" : "text-slate-700 hover:bg-slate-50"}`}
                          >
                            {" "}
                            {type.label}{" "}
                          </button>
                        ))}{" "}
                      </motion.div>
                    )}{" "}
                  </AnimatePresence>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Nội dung *
                  </label>
                  <textarea
                    required
                    value={newActivityContent}
                    onChange={(e) => setNewActivityContent(e.target.value)}
                    placeholder="Nhập nội dung hoạt động..."
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 font-medium text-slate-900 transition-all resize-none"
                  />
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddActivityModal(false)}
                    className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                  >
                    {" "}
                    Hủy bỏ{" "}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-lg shadow-amber-500/30 transition-all"
                  >
                    {" "}
                    Lưu hoạt động{" "}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}{" "}
      </AnimatePresence>{" "}
      {/* Edit Customer Modal */}{" "}
      <AnimatePresence>
        {" "}
        {showEditModal && editForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-4 lg:p-6 border-b border-slate-100 shrink-0">
                <h3 className="text-lg lg:text-xl font-bold text-slate-900">
                  Sửa Thông Tin Khách Hàng
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="w-8 h-8 bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div
                className="overflow-y-auto"
                style={{ scrollbarWidth: "thin" }}
              >
                <form
                  onSubmit={handleEditCustomer}
                  className="p-4 lg:p-6 flex flex-col gap-4"
                >
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 font-medium text-slate-900 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      required
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 font-medium text-slate-900 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editForm.email || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 font-medium text-slate-900 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Ngân sách dự kiến
                    </label>
                    <input
                      type="text"
                      value={editForm.budget || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, budget: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 font-medium text-slate-900 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Sản phẩm quan tâm
                    </label>
                    <input
                      type="text"
                      value={editForm.targetUnit || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, targetUnit: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 font-medium text-slate-900 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Trạng thái giao dịch
                    </label>
                    <CustomSelect
                      value={editForm.transactionStatus}
                      onChange={(val) =>
                        setEditForm({ ...editForm, transactionStatus: val })
                      }
                      options={[
                        { value: "new", label: "Khách mới" },
                        { value: "consulting", label: "Đang tư vấn" },
                        { value: "viewing", label: "Đã xem nhà" },
                        { value: "deposited", label: "Đã cọc" },
                        { value: "won", label: "Ký HĐMB (Thành công)" },
                        { value: "lost", label: "Đóng/Thất bại" },
                      ]}
                      className="w-full px-4 py-3"
                    />
                  </div>
                  <div className="mt-4 flex gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                    >
                      {" "}
                      Hủy bỏ{" "}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-lg shadow-amber-500/30 transition-all"
                    >
                      {" "}
                      Lưu thay đổi{" "}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}{" "}
      </AnimatePresence>
    </div>
  );
}
