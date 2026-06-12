import { useState } from "react";
import { NEWS } from "@/data/news";
import Icon from "@/components/ui/icon";

interface ProfilePageProps {
  savedIds: Set<number>;
}

export default function ProfilePage({ savedIds }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<"activity" | "settings">("activity");

  const totalComments = NEWS.reduce((a, n) => a + n.comments.length, 0);
  const totalVotes = NEWS.reduce((a, n) => a + n.upvotes, 0);

  const recentActivity = [
    { icon: "ArrowUp", text: "Вы проголосовали за «OpenAI представила GPT-5»", time: "2 ч. назад", color: "text-orange-500" },
    { icon: "MessageSquare", text: "Вы прокомментировали «SpaceX запустила Starship»", time: "5 ч. назад", color: "text-blue-500" },
    { icon: "Bookmark", text: "Сохранено: «Apple анонсировала M4 Ultra»", time: "6 ч. назад", color: "text-green-500" },
    { icon: "ArrowUp", text: "Вы проголосовали за «Meta открыла Llama 4»", time: "1 д. назад", color: "text-orange-500" },
    { icon: "MessageSquare", text: "Вы прокомментировали «Tesla представила Optimus 3»", time: "1 д. назад", color: "text-blue-500" },
  ];

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      {/* Profile header */}
      <div className="bg-white border border-[hsl(var(--border))] rounded-lg p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-[hsl(var(--foreground))] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            Y
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif-custom text-xl font-semibold text-[hsl(var(--foreground))]">
                  @you
                </h2>
                <p className="text-[13px] text-[hsl(var(--muted-foreground))] mt-0.5">
                  Читатель технологических новостей
                </p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[hsl(var(--border))] rounded text-[12px] font-medium text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                <Icon name="Edit3" size={12} />
                Изменить
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-[hsl(var(--border))]">
              {[
                { label: "Сохранено", value: savedIds.size, icon: "Bookmark" },
                { label: "Комментарии", value: 12, icon: "MessageSquare" },
                { label: "Голосов", value: 47, icon: "ArrowUp" },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <p className="text-xl font-bold text-[hsl(var(--foreground))]">{stat.value}</p>
                  <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-white border border-[hsl(var(--border))] rounded-lg p-1 w-fit">
        {[
          { id: "activity", label: "Активность" },
          { id: "settings", label: "Настройки" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "activity" | "settings")}
            className={`px-4 py-2 rounded text-[13px] font-medium transition-all ${
              activeTab === tab.id
                ? "bg-[hsl(var(--foreground))] text-white"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "activity" && (
        <div className="bg-white border border-[hsl(var(--border))] rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-[hsl(var(--border))]">
            <h3 className="text-[12px] font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
              Последняя активность
            </h3>
          </div>
          <div className="divide-y divide-[hsl(var(--border))]">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3.5 hover:bg-[hsl(var(--muted))] transition-colors">
                <div className={`mt-0.5 ${item.color}`}>
                  <Icon name={item.icon} size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] text-[hsl(var(--foreground))]">{item.text}</p>
                  <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="bg-white border border-[hsl(var(--border))] rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-[hsl(var(--border))]">
            <h3 className="text-[12px] font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
              Настройки
            </h3>
          </div>
          <div className="divide-y divide-[hsl(var(--border))]">
            {[
              { label: "Email-уведомления", desc: "Получать дайджест раз в день", icon: "Mail" },
              { label: "Уведомления в браузере", desc: "Push-уведомления о трендах", icon: "Bell" },
              { label: "Компактный вид", desc: "Показывать больше новостей", icon: "AlignJustify" },
              { label: "Тёмная тема", desc: "Переключить на тёмный интерфейс", icon: "Moon" },
            ].map((setting, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[hsl(var(--muted))] flex items-center justify-center">
                    <Icon name={setting.icon} size={14} className="text-[hsl(var(--muted-foreground))]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-[hsl(var(--foreground))]">{setting.label}</p>
                    <p className="text-[11px] text-[hsl(var(--muted-foreground))]">{setting.desc}</p>
                  </div>
                </div>
                <div className="w-10 h-5 rounded-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] relative cursor-pointer hover:bg-[hsl(var(--border))] transition-colors">
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
