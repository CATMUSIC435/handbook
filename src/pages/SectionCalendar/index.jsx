import { useState, useMemo } from "react";
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
import mockCustomers from "../../data/customers.json";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import CustomSelect from "../../components/ui/CustomSelect";
import MapboxLocationPicker from "./components/MapboxLocationPicker";
import MapboxOverview from "./components/MapboxOverview";

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
    [],
  );

  const [customers] = useLocalStorage(
    "fenica_customers",
    mockCustomers,
  );

  // Custom Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newCustomerId, setNewCustomerId] = useState("");
  const [newDateTime, setNewDateTime] = useState(new Date());
  const [newEndDateTime, setNewEndDateTime] = useState(
    new Date(new Date().getTime() + 60 * 60 * 1000),
  );
  const [newLocation, setNewLocation] = useState("");
  const [newCoordinates, setNewCoordinates] = useState(null);
  const [newType, setNewType] = useState("meeting");

  // Selected date for Agenda view
  const [selectedDateStr, setSelectedDateStr] = useState(format(new Date(), "yyyy-MM-dd"));

  // Calendar controlled state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");
  const [isCalendarCollapsed, setIsCalendarCollapsed] = useState(false);

  const events = useMemo(() => {
    return appointments.map((apt) => {
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
  }, [appointments]);

  const selectedDayAppointments = useMemo(() => {
    return [...appointments]
      .filter((a) => a.date === selectedDateStr)
      .sort((a, b) => {
        const timeA = (a.time || "00:00").split(':').map(Number);
        const timeB = (b.time || "00:00").split(':').map(Number);
        return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
      });
  }, [appointments, selectedDateStr]);

  const handleSelectSlot = (slotInfo) => {
    setSelectedDateStr(format(slotInfo.start, "yyyy-MM-dd"));
    setEditingEventId(null);
    setNewTitle("");
    setNewCustomerId("");
    setNewLocation("");
    setNewCoordinates(null);
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
    setNewCustomerId(event.customerId || event.customer); // Support old data fallback
    setNewLocation(event.location);
    setNewCoordinates(event.coordinates || null);
    setNewType(event.type);
    setNewDateTime(event.start);
    setNewEndDateTime(event.end);
    setShowAddModal(true);
  };

  const handleAddAppointment = (e) => {
    e.preventDefault();
    if (!newTitle || !newCustomerId || !newDateTime) return;

    if (editingEventId) {
      const updated = appointments.map((apt) => {
        if (apt.id === editingEventId) {
          return {
            ...apt,
            title: newTitle,
            customerId: newCustomerId,
            date: format(newDateTime, "yyyy-MM-dd"),
            time: format(newDateTime, "HH:mm"),
            endDate: format(newEndDateTime, "yyyy-MM-dd"),
            endTime: format(newEndDateTime, "HH:mm"),
            location: newLocation,
            coordinates: newCoordinates,
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
        customerId: newCustomerId,
        date: format(newDateTime, "yyyy-MM-dd"),
        time: format(newDateTime, "HH:mm"),
        endDate: format(newEndDateTime, "yyyy-MM-dd"),
        endTime: format(newEndDateTime, "HH:mm"),
        location: newLocation,
        coordinates: newCoordinates,
        type: newType,
        status: "upcoming",
      };
      setAppointments([...appointments, newApt]);
    }

    setShowAddModal(false);
    setEditingEventId(null);
    setNewTitle("");
    setNewCustomerId("");
    setNewLocation("");
    setNewCoordinates(null);
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

  const getCustomerName = (customerId) => {
    const cust = customers.find((c) => c.id === customerId);
    return cust ? cust.name : customerId; // Fallback to raw ID if not found (legacy data)
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-y-auto relative flex flex-col">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto w-full mb-8 mt-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-6 lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-bold text-sm mb-4 w-fit">
            <CalendarIcon size={16} /> Quản Lý Lịch Hẹn
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsCalendarCollapsed(!isCalendarCollapsed)}
            className={`flex items-center gap-2 px-4 py-3 font-bold border transition-colors ${
              isCalendarCollapsed 
                ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <MapPin size={20} />
            <span className="hidden sm:inline">{isCalendarCollapsed ? "Mở Bảng Lịch" : "Bản Đồ Lộ Trình"}</span>
          </button>

          <button
            onClick={() => {
              setEditingEventId(null);
              setNewTitle("");
              setNewCustomerId("");
              setNewLocation("");
              setNewCoordinates(null);
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
      <div className="mx-auto w-full pb-20 flex flex-col lg:flex-row gap-8 flex-1">
        {/* LEFT: React Big Calendar */}
        {!isCalendarCollapsed && (
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
        )}

        {/* RIGHT: Notifications & Upcoming */}
        <div className={`${isCalendarCollapsed ? 'flex-1' : 'lg:w-[400px] shrink-0'} flex flex-col gap-6`}>
          {/* Selected Day's Agenda */}
          <div className={`bg-white shadow-xl shadow-slate-200/50 border border-slate-100 flex overflow-hidden ${isCalendarCollapsed ? 'flex-col lg:flex-row min-h-[80vh] lg:min-h-[600px] flex-1' : 'flex-col p-6 flex-1'}`}>
            
            {/* AGENDA LIST */}
            <div className={`${isCalendarCollapsed ? 'w-full lg:w-[350px] shrink-0 p-6 border-r border-slate-100 overflow-y-auto h-[40vh] lg:h-auto lg:max-h-[800px] bg-white z-10 order-2 lg:order-1' : ''}`}>
              <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="text-indigo-500" /> Lịch Trình{" "}
                {selectedDateStr === format(new Date(), "yyyy-MM-dd") ? "Hôm Nay" : selectedDateStr}
              </h3>

              {!isCalendarCollapsed && (
                <div className="mb-6  overflow-hidden shadow-sm">
                  <MapboxOverview appointments={selectedDayAppointments} />
                </div>
              )}

              <div className="flex flex-col gap-4 relative">
                <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-200 z-0"></div>

                {selectedDayAppointments
                  .map((apt, index) => {
                    let markerBg = "bg-indigo-500";
                    if (apt.type === "meeting") markerBg = "bg-blue-500";
                    if (apt.type === "contract") markerBg = "bg-emerald-500";
                    if (apt.type === "call") markerBg = "bg-purple-500";
                    if (apt.type === "reminder") markerBg = "bg-amber-500";

                    return (
                      <div key={apt.id} className="relative z-10 flex gap-4">
                        <div className={`mt-2 w-8 h-8 rounded-full shrink-0 flex items-center justify-center shadow-sm text-sm font-bold text-white border-2 border-white ${markerBg}`}>
                          {index + 1}
                        </div>

                        <div
                          className={`flex-1 p-4 border  ${apt.status === "completed" ? "bg-slate-50 border-slate-100 opacity-60" : "bg-white border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"}`}
                          onClick={() => handleSelectEvent(apt)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-black text-slate-800">
                              {apt.time}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wider  border ${getTypeColor(apt.type)}`}
                            >
                              {apt.type}
                            </span>
                          </div>
                          <h4
                            className={`font-bold text-slate-900 mb-3 ${apt.status === "completed" && "line-through"}`}
                          >
                            {apt.title}
                          </h4>

                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                              <User size={14} className="text-slate-400" /> {getCustomerName(apt.customerId || apt.customer)}
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                              <MapPin size={14} className="text-slate-400" /> {apt.location || "Chưa có địa điểm"}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {selectedDayAppointments.length === 0 && (
                  <div className="text-center text-slate-400 py-8 relative z-10 bg-white">
                    Không có lịch trình nào.
                  </div>
                )}
              </div>
            </div>

            {/* FULL MAP VIEW */}
            {isCalendarCollapsed && (
              <div className="flex-1 bg-slate-100 relative min-h-[50vh] lg:min-h-0 flex flex-col w-full h-full order-1 lg:order-2">
                <MapboxOverview appointments={selectedDayAppointments} isFullScreen />
              </div>
            )}
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
                  <CustomSelect
                    value={newCustomerId}
                    onChange={setNewCustomerId}
                    options={[
                      { value: "", label: "Chọn khách hàng..." },
                      ...customers.map(c => ({ value: c.id, label: `${c.name} - ${c.phone}` }))
                    ]}
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
                <div className="z-10">
                  <MapboxLocationPicker 
                    locationName={newLocation}
                    coordinates={newCoordinates}
                    onChange={({ location, coordinates }) => {
                      setNewLocation(location);
                      setNewCoordinates(coordinates);
                    }}
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
