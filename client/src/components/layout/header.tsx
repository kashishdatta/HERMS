import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  description: string;
  showSearch?: boolean;
  showQuickAction?: boolean;
  onQuickAction?: () => void;
  quickActionLabel?: string;
  quickActionIcon?: string;
}

export default function Header({
  title,
  description,
  showSearch = true,
  showQuickAction = false,
  onQuickAction,
  quickActionLabel = "Quick Action",
  quickActionIcon = "fas fa-plus",
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>
        <div className="flex items-center space-x-4">
          {showSearch && (
            <div className="relative">
              <Input
                type="text"
                placeholder="Search equipment..."
                className="pl-10 pr-4 py-2 w-80 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          )}
          {showQuickAction && onQuickAction && (
            <Button
              onClick={onQuickAction}
              className="bg-primary hover:bg-blue-700 text-white"
            >
              <i className={`${quickActionIcon} mr-2`}></i>
              {quickActionLabel}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
