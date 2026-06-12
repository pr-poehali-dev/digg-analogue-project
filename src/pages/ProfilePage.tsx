import { useState } from "react";
import Icon from "@/components/ui/icon";

interface ProfilePageProps {
  savedIds: Set<number>;
}

export default function ProfilePage({ savedIds }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<"activity" | "settings">("activity");

  const recentActivity = [
    { icon: "Heart", text: "Проголосовали за «OpenAI представила GPT-5»", time: "2 ч. назад", color: "#c44" },
    { icon: "MessageSquare", text: "Прокомментировали «SpaceX запустила Starship»", time: "5 ч. назад", color: "#448" },
    { icon: "Bookmark", text: "Сохранено: «Apple анонсировала M4 Ultra»", time: "6 ч. назад", color: "#484" },
    { icon: "Heart", text: "Проголосовали за «Meta открыла Llama 4»", time: "1 д. назад", color: "#c44" },
    { icon: "MessageSquare", text: "Прокомментировали «Tesla представила Optimus 3»", time: "1 д. назад", color: "#448" },
  ];

  const settings = [
    { label: "Email-уведомления", desc: "Получать дайджест раз в день", icon: "Mail" },
    { label: "Push-уведомления", desc: "О трендах и новых комментариях", icon: "Bell" },
    { label: "Компактный вид", desc: "Показывать больше материалов", icon: "AlignJustify" },
    { label: "Тёмная тема", desc: "Переключить на тёмный интерфейс", icon: "Moon" },
  ];

  return (
    <div className="animate-fade-in max-w-xl">
      {/* Profile header */}
      <div className="mb-6 pb-6" style={{ borderBottom: "1px solid #d4cfc4" }}>
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 flex items-center justify-center flex-shrink-0 font-serif-custom text-xl font-bold"
            style={{ backgroundColor: "#141414", color: "#ece8df" }}
          >
            Y
          </div>
          <div className="flex-1">
            <h2 className="font-serif-custom text-[1.2rem] font-semibold" style={{ color: "#141414" }}>
              @you
            </h2>
            <p className="text-[12px] mt-0.5" style={{ color: "#999" }}>
              Читатель технологических новостей
            </p>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-4 pt-4" style={{ borderTop: "1px solid #d4cfc4" }}>
              {[
                { label: "Сохранено", value: savedIds.size },
                { label: "Комментариев", value: 12 },
                { label: "Голосов", value: 47 },
              ].map(s => (
                <div key={s.label}>
                  <p className="font-serif-custom text-xl font-bold" style={{ color: "#141414" }}>{s.value}</p>
                  <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: "#999" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 mb-5" style={{ borderBottom: "1px solid #d4cfc4" }}>
        {[
          { id: "activity", label: "Активность" },
          { id: "settings", label: "Настройки" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "activity" | "settings")}
            className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider transition-colors"
            style={{
              color: activeTab === tab.id ? "#141414" : "#999",
              borderBottom: activeTab === tab.id ? "2px solid #141414" : "2px solid transparent",
              marginBottom: "-1px",
              letterSpacing: "0.08em",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "activity" && (
        <div>
          {recentActivity.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 py-3.5"
              style={{ borderBottom: "1px solid #e4dfd4" }}
            >
              <Icon name={item.icon} size={13} style={{ color: item.color, marginTop: "2px", flexShrink: 0 }} />
              <div className="flex-1">
                <p className="text-[13px]" style={{ color: "#333" }}>{item.text}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "#bbb" }}>{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "settings" && (
        <div>
          {settings.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-4"
              style={{ borderBottom: "1px solid #e4dfd4" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 flex items-center justify-center"
                  style={{ backgroundColor: "#e0dace" }}
                >
                  <Icon name={s.icon} size={13} style={{ color: "#777" }} />
                </div>
                <div>
                  <p className="text-[13px] font-medium" style={{ color: "#141414" }}>{s.label}</p>
                  <p className="text-[11px]" style={{ color: "#999" }}>{s.desc}</p>
                </div>
              </div>
              {/* Toggle */}
              <div
                className="w-9 h-5 relative cursor-pointer"
                style={{ backgroundColor: "#d4cfc4", borderRadius: "999px" }}
              >
                <div
                  className="absolute left-0.5 top-0.5 w-4 h-4"
                  style={{ backgroundColor: "#ece8df", borderRadius: "50%", boxShadow: "0 1px 2px rgba(0,0,0,0.15)" }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
