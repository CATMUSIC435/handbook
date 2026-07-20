import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Ruler,
  Compass,
  Eye,
  Sofa,
  CheckCircle,
  Tag,
  LayoutDashboard,
  Image as ImageIcon,
  Home,
} from "lucide-react";
import { mockFloors, translateDirection, translateView } from "../../pages/SectionLocation/components/Tower3D/data";

export default function UnitDetail({ unitId, onBack, isUpdating }) {
  const [activeImageTab, setActiveImageTab] = useState("3d");
  
  // Find unit details from data
  const realUnitData = mockFloors[0].units.find(u => u.code === unitId) || {};
  const is2PN = realUnitData.type?.includes("2 PN");

  const unitDetails = {
    id: unitId,
    area: `${realUnitData.builtUpArea || 72} m²`,
    type: realUnitData.type || "2 Phòng ngủ, 2 WC",
    price: isUpdating ? "Đang cập nhật" : (realUnitData.price || "Từ 3.5 Tỷ"),
    direction: isUpdating ? "Đang cập nhật" : translateDirection(realUnitData.direction || "Đông Nam"),
    view: isUpdating ? "Đang cập nhật" : translateView(realUnitData.view || "Hồ bơi nội khu"),
    balcony: isUpdating ? "Đang cập nhật" : `Có (${translateDirection(realUnitData.direction || "Đông Nam")})`,
    furniture: isUpdating ? "Đang cập nhật" : "Hoàn thiện cơ bản",
    status: isUpdating ? "Đang cập nhật" : (realUnitData.status === 'available' ? 'Đang mở bán' : (realUnitData.status === 'sold' ? 'Đã bán' : 'Booking')),
  };

  const images = {
    layout: realUnitData.room3dImage || "/assets/images/room3d/2pn.png",
    "3d": realUnitData.room3dImage || "/assets/images/room3d/2pn.png",
    furniture: is2PN 
      ? "/assets/images/2pn/nha-mau-can-ho-fenica-2pn-dsc01973-hdr.jpg"
      : "/assets/images/1pn/nha-mau-can-ho-fenica-1pn-plus-dsc01755-hdr.jpg",
  };
  return (
    <div className="absolute inset-0 bg-slate-50 p-4 lg:p-8 flex flex-col z-50 overflow-y-auto cursor-auto">
      <div className="flex items-center gap-4 mb-6 sticky top-0 bg-slate-50 z-30 py-4 border-b border-slate-200">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white bg-slate-100 transition-colors shadow-sm"
        >
          <ArrowLeft size={24} />
        </button>
        <h3 className="text-lg lg:text-xl font-bold text-slate-900">
          Chi tiết căn hộ: <span className="text-primary">{unitId}</span>
        </h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 flex-1">
        {" "}
        {/* Left: Info */}{" "}
        <div className="bg-white shadow-xl p-4 lg:p-8 border border-slate-100 h-fit">
          <h4 className="text-lg lg:text-xl font-bold text-slate-900 mb-6 border-b pb-4">
            Thông tin căn hộ
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 text-primary">
                <Ruler size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Diện tích</p>
                <p className="font-semibold text-slate-900">
                  {unitDetails.area}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 text-primary">
                <Home size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Loại</p>
                <p className="font-semibold text-slate-900">
                  {unitDetails.type}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 text-primary">
                <Tag size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Giá</p>
                <p className="font-semibold text-accent">{unitDetails.price}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 text-primary">
                <Compass size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Hướng</p>
                <p className="font-semibold text-slate-900">
                  {unitDetails.direction}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 text-primary">
                <Eye size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">View</p>
                <p className="font-semibold text-slate-900">
                  {unitDetails.view}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 text-primary">
                <LayoutDashboard size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Ban công</p>
                <p className="font-semibold text-slate-900">
                  {unitDetails.balcony}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 text-primary">
                <Sofa size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Nội thất</p>
                <p className="font-semibold text-slate-900">
                  {unitDetails.furniture}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 text-green-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Trạng thái</p>
                <p className="font-semibold text-green-600">
                  {unitDetails.status}
                </p>
              </div>
            </div>
          </div>
          <button className="mt-8 w-full py-4 bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">
            {" "}
            Nhận Báo Giá Chi Tiết{" "}
          </button>
        </div>{" "}
        {/* Right: Images */}{" "}
        <div className="bg-white shadow-xl p-4 lg:p-8 border border-slate-100 flex flex-col">
          <h4 className="text-lg lg:text-xl font-bold text-slate-900 mb-6 border-b pb-4">
            Hình ảnh
          </h4>
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveImageTab("layout")}
              className={`flex-1 py-3 px-4 font-semibold flex items-center justify-center gap-2 transition-colors ${activeImageTab === "layout" ? "bg-primary text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              <LayoutDashboard size={18} /> Layout{" "}
            </button>
            <button
              onClick={() => setActiveImageTab("3d")}
              className={`flex-1 py-3 px-4 font-semibold flex items-center justify-center gap-2 transition-colors ${activeImageTab === "3d" ? "bg-primary text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              <ImageIcon size={18} /> 3D{" "}
            </button>
            <button
              onClick={() => setActiveImageTab("furniture")}
              className={`flex-1 py-3 px-4 font-semibold flex items-center justify-center gap-2 transition-colors ${activeImageTab === "furniture" ? "bg-primary text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              <Sofa size={18} /> Nội thất{" "}
            </button>
          </div>
          <div className="flex-1 bg-slate-100 overflow-hidden relative min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImageTab}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                src={images[activeImageTab]}
                alt={`Chi tiết ${activeImageTab}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
