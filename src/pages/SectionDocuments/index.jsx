import { useState } from "react";
import { motion } from "motion/react";
import {
  FileText,
  FileSpreadsheet,
  Download,
  Eye,
  FileBox,
  FileArchive,
  Search,
} from "lucide-react";
import documentsData from "../../data/documents.json";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

const IconMap = {
  FileText,
  FileSpreadsheet,
  FileBox,
  FileArchive,
};

export default function SectionDocuments() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDocs = documentsData.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 overflow-y-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-start gap-6">
        <div className="max-w-sm w-full">
          <Input
            icon={Search}
            placeholder="Tìm kiếm tài liệu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-6 border-b border-slate-100 bg-slate-50/50 text-sm font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-6 md:col-span-5">Tên Tài Liệu</div>
          <div className="hidden md:block col-span-2">Phiên bản</div>
          <div className="hidden lg:block col-span-2">Kích thước</div>
          <div className="col-span-6 md:col-span-3 lg:col-span-3 text-right">
            Thao tác
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-100">
          {filteredDocs.map((doc, index) => {
            const Icon = IconMap[doc.icon];
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                key={doc.id}
                className="grid grid-cols-12 gap-4 p-6 items-center hover:bg-slate-50 transition-colors group"
              >
                {/* Title & Icon */}
                <div className="col-span-6 md:col-span-5 flex items-center gap-4">
                  <div
                    className={`w-12 h-12 ${doc.bg} flex flex-shrink-0 items-center justify-center`}
                  >
                    <Icon className={doc.color} size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                      {doc.title}
                    </h4>
                    <span className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                      {doc.type} • {doc.date}
                    </span>
                  </div>
                </div>

                {/* Version */}
                <div className="hidden md:flex col-span-2 items-center">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-semibold">
                    {doc.version}
                  </span>
                </div>

                {/* Size */}
                <div className="hidden lg:flex col-span-2 items-center">
                  <span className="text-slate-500 font-medium">{doc.size}</span>
                </div>

                {/* Actions */}
                <div className="col-span-6 md:col-span-3 lg:col-span-3 flex items-center justify-end gap-3">
                  <Button
                    variant="ghost"
                    icon={Eye}
                    className="hidden sm:flex"
                    size="sm"
                    onClick={() => {
                      if (
                        doc.id === 1 ||
                        doc.title.toLowerCase().includes("brochure")
                      ) {
                        window.open(
                          "https://fenica.vn/vr-360-virtual.html#/brochure",
                          "_blank",
                        );
                      } else {
                        alert("Tính năng đang được cập nhật!");
                      }
                    }}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="primary"
                    icon={Download}
                    size="sm"
                    onClick={() => {
                      if (
                        doc.id === 1 ||
                        doc.title.toLowerCase().includes("brochure")
                      ) {
                        window.open(
                          "https://fenica.vn/vr-360-virtual.html#/brochure",
                          "_blank",
                        );
                      } else {
                        alert("Tính năng đang được cập nhật!");
                      }
                    }}
                  >
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                </div>
              </motion.div>
            );
          })}

          {filteredDocs.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <FileBox size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">
                Không tìm thấy tài liệu phù hợp.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
