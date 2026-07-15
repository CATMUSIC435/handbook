import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Plus,
  X,
} from "lucide-react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { vi } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import mockAppointments from "../../data/appointments.json";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import CustomSelect from "../../components/ui/CustomSelect";

const locales = {
  vi: vi,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

import withDragAndDropModule from "react-big-calendar/lib/addons/dragAndDrop";
const withDragAndDrop = withDragAndDropModule.default || withDragAndDropModule;

const DnDCalendar = withDragAndDrop(Calendar);

export default function SectionCalendar() {
  const [appointments, setAppointments] = useLocalStorage(
    "fenica_appointments",
    mockAppointments,
  );

  // Custom Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newCustomer, setNewCustomer] = useState("");
  const [newDateTime, setNewDateTime] = useState(new Date());
  const [newEndDateTime, setNewEndDateTime] = useState(
    new Date(new Date().getTime() + 60 * 60 * 1000),
  );
  const [newLocation, setNewLocation] = useState("");
  const [newType, setNewType] = useState("meeting");

  // Selected date for Agenda view
  const [selectedDateStr, setSelectedDateStr] = useState("2026-07-14");

  // Calendar controlled state
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 14));
  const [currentView, setCurrentView] = useState("month");

  const events = appointments.map((apt) => {
    const [year, month, day] = (
      apt.date || format(new Date(), "yyyy-MM-dd")
    ).split("-");
    const [hour, minute] = (apt.time || "00:00").split(":");
    const start = new Date(year, month - 1, day, hour, minute);

    let end;
    if (apt.endDate && apt.endTime) {
      const [eYear, eMonth, eDay] = apt.endDate.split("-");
      const [eHour, eMinute] = apt.endTime.split(":");
      end = new Date(eYear, eMonth - 1, eDay, eHour, eMinute);
    } else {
      end = new Date(year, month - 1, day, parseInt(hour) + 1, minute);
    }

    return {
      ...apt,
      start,
      end,
    };
  });

  const handleSelectSlot = (slotInfo) => {
    setEditingEventId(null);
    setNewTitle("");
    setNewCustomer("");
    setNewLocation("");
    setNewDateTime(slotInfo.start);
    setNewEndDateTime(
      slotInfo.end || new Date(slotInfo.start.getTime() + 60 * 60 * 1000),
    );
    setShowAddModal(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedDateStr(event.date);
    setEditingEventId(event.id);
    setNewTitle(event.title);
    setNewCustomer(event.customer);
    setNewLocation(event.location);
    setNewType(event.type);
    setNewDateTime(event.start);
    setNewEndDateTime(event.end);
    setShowAddModal(true);
  };

  const handleAddAppointment = (e) => {
    e.preventDefault();
    if (!newTitle || !newCustomer || !newDateTime) return;

    if (editingEventId) {
      const updated = appointments.map((apt) => {
        if (apt.id === editingEventId) {
          return {
            ...apt,
            title: newTitle,
            customer: newCustomer,
            date: format(newDateTime, "yyyy-MM-dd"),
            time: format(newDateTime, "HH:mm"),
            endDate: format(newEndDateTime, "yyyy-MM-dd"),
            endTime: format(newEndDateTime, "HH:mm"),
            location: newLocation,
            type: newType,
          };
        }
        return apt;
      });
      setAppointments(updated);
    } else {
      const newApt = {
        id: Date.now(),
        title: newTitle,
        customer: newCustomer,
        date: format(newDateTime, "yyyy-MM-dd"),
        time: format(newDateTime, "HH:mm"),
        endDate: format(newEndDateTime, "yyyy-MM-dd"),
        endTime: format(newEndDateTime, "HH:mm"),
        location: newLocation,
        type: newType,
        status: "upcoming",
      };
      setAppointments([...appointments, newApt]);
    }

    setShowAddModal(false);
    setEditingEventId(null);
    setNewTitle("");
    setNewCustomer("");
    setNewLocation("");
  };

  const handleDeleteAppointment = () => {
    if (editingEventId) {
      setAppointments(appointments.filter((a) => a.id !== editingEventId));
      setShowAddModal(false);
      setEditingEventId(null);
    }
  };

  // Drag and drop handlers
  const handleEventDrop = ({ event, start, end }) => {
    const updated = appointments.map((apt) => {
      if (apt.id === event.id) {
        return {
          ...apt,
          date: format(start, "yyyy-MM-dd"),
          time: format(start, "HH:mm"),
          endDate: format(end, "yyyy-MM-dd"),
          endTime: format(end, "HH:mm"),
        };
      }
      return apt;
    });
    setAppointments(updated);
  };

  const handleEventResize = ({ event, start, end }) => {
    const updated = appointments.map((apt) => {
      if (apt.id === event.id) {
        return {
          ...apt,
          date: format(start, "yyyy-MM-dd"),
          time: format(start, "HH:mm"),
          endDate: format(end, "yyyy-MM-dd"),
          endTime: format(end, "HH:mm"),
        };
      }
      return apt;
    });
    setAppointments(updated);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "contract":
        return "bg-emerald-100 text-emerald-600 border-emerald-200";
      case "call":
        return "bg-purple-100 text-purple-600 border-purple-200";
      case "reminder":
        return "bg-amber-100 text-amber-600 border-amber-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = "#e2e8f0";
    if (event.type === "meeting") backgroundColor = "#3b82f6"; // blue
    if (event.type === "contract") backgroundColor = "#10b981"; // emerald
    if (event.type === "call") backgroundColor = "#a855f7"; // purple
    if (event.type === "reminder") backgroundColor = "#f59e0b"; // amber
    return {
      style: {
        backgroundColor,
        borderRadius: "6px",
        border: "none",
        color: "#fff",
        fontSize: "12px",
        fontWeight: "bold",
        padding: "2px 6px",
      },
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-y-auto relative">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto w-full mb-8 mt-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-6 lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-bold text-sm mb-4 w-fit">
            <CalendarIcon size={16} /> Quản Lý Lịch Hẹn
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setEditingEventId(null);
              setNewTitle("");
              setNewCustomer("");
              setNewLocation("");
              setNewDateTime(new Date());
              setNewEndDateTime(
                new Date(new Date().getTime() + 60 * 60 * 1000),
              );
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} /> Thêm Lịch Hẹn
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="mx-auto w-full pb-20 flex flex-col lg:flex-row gap-8">
        {/* LEFT: React Big Calendar */}
        <div className="flex-1 bg-white p-6 shadow-xl shadow-slate-200/50 border border-slate-100 min-h-[600px] overflow-hidden calendar-container">
          <DnDCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            culture="vi"
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            selectable
            resizable
            onEventDrop={handleEventDrop}
            onEventResize={handleEventResize}
            messages={{
              next: "Tiếp",
              previous: "Trước",
              today: "Hôm nay",
              month: "Tháng",
              week: "Tuần",
              day: "Ngày",
              agenda: "Lịch trình",
              date: "Ngày",
              time: "Thời gian",
              event: "Sự kiện",
            }}
            date={currentDate}
            onNavigate={(newDate) => setCurrentDate(newDate)}
            view={currentView}
            onView={(newView) => setCurrentView(newView)}
            eventPropGetter={eventStyleGetter}
            className="font-sans"
            style={{ height: "600px" }}
          />
        </div>

        {/* RIGHT: Notifications & Upcoming */}
        <div className="lg:w-[400px] shrink-0 flex flex-col gap-6">
          {/* Selected Day's Agenda */}
          <div className="bg-white p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex-1">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <Clock className="text-indigo-500" /> Lịch Trình{" "}
              {selectedDateStr === "2026-07-14" ? "Hôm Nay" : selectedDateStr}
            </h3>

            <div className="flex flex-col gap-4 relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100 z-0"></div>

              {appointments
                .filter((a) => a.date === selectedDateStr)
                .map((apt) => (
                  <div key={apt.id} className="relative z-10 flex gap-4">
                    <div className="mt-1.5 w-6 h-6 bg-white border-4 border-indigo-500 shrink-0 flex items-center justify-center shadow-sm"></div>

                    <div
                      className={`flex-1 p-4 border ${apt.status === "completed" ? "bg-slate-50 border-slate-100 opacity-60" : "bg-white border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all"}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-black text-indigo-600">
                          {apt.time}
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-1 uppercase tracking-wider border ${getTypeColor(apt.type)}`}
                        >
                          {apt.type}
                        </span>
                      </div>
                      <h4
                        className={`font-bold text-slate-900 mb-3 ${apt.status === "completed" && "line-through"}`}
                      >
                        {apt.title}
                      </h4>

                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                          <User size={14} /> {apt.customer}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                          <MapPin size={14} /> {apt.location}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              {appointments.filter((a) => a.date === selectedDateStr).length ===
                0 && (
                <div className="text-center text-slate-400 py-8 relative z-10 bg-white">
                  Không có lịch trình nào.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Appointment Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-white p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-black text-slate-900 mb-6">
                {editingEventId ? "Sửa Lịch Hẹn" : "Thêm Lịch Hẹn"}
              </h2>

              <form
                onSubmit={handleAddAppointment}
                className="flex flex-col gap-4"
              >
                <div>
                  <label className="text-xs font-bold text-slate-400 mb-1 block">
                    Tiêu đề *
                  </label>
                  <input
                    required
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-3 border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 outline-none"
                    placeholder="VD: Gặp khách xem sa bàn"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 mb-1 block">
                    Khách hàng *
                  </label>
                  <input
                    required
                    type="text"
                    value={newCustomer}
                    onChange={(e) => setNewCustomer(e.target.value)}
                    className="w-full p-3 border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 outline-none"
                    placeholder="Tên khách hàng"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <label className="text-xs font-bold text-slate-400 mb-1 block">
                      Bắt đầu *
                    </label>
                    <DatePicker
                      selected={newDateTime}
                      onChange={(date) => setNewDateTime(date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      timeCaption="Giờ"
                      dateFormat="dd/MM/yyyy HH:mm"
                      className="w-full p-3 border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 outline-none font-medium text-slate-700"
                      wrapperClassName="w-full"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <label className="text-xs font-bold text-slate-400 mb-1 block">
                      Kết thúc *
                    </label>
                    <DatePicker
                      selected={newEndDateTime}
                      onChange={(date) => setNewEndDateTime(date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      timeCaption="Giờ"
                      dateFormat="dd/MM/yyyy HH:mm"
                      className="w-full p-3 border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 outline-none font-medium text-slate-700"
                      wrapperClassName="w-full"
                      minDate={newDateTime}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 mb-1 block">
                    Địa điểm
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full p-3 border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-500 outline-none"
                    placeholder="Nhà mẫu / Gọi thoại..."
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 mb-1 block">
                    Loại hình
                  </label>
                  <CustomSelect
                    value={newType}
                    onChange={setNewType}
                    options={[
                      { value: "meeting", label: "Gặp mặt (Meeting)" },
                      { value: "call", label: "Gọi điện (Call)" },
                      { value: "contract", label: "Ký Hợp Đồng (Contract)" },
                      { value: "reminder", label: "Nhắc nhở (Reminder)" },
                    ]}
                  />
                </div>

                 <div className="flex gap-4 mt-4">
                   {editingEventId && (
                     <button
                       type="button"
                       onClick={handleDeleteAppointment}
                       className="px-6 py-4 bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors"
                     >
                       Xóa
                     </button>
                   )}
                   <button
                     type="submit"
                     className="flex-1 py-4 bg-primary text-white font-bold shadow-lg hover:bg-primary/90 transition-colors"
                   >
                     {editingEventId ? "Cập Nhật Lịch Hẹn" : "Lưu Lịch Hẹn"}
                   </button>
                 </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
