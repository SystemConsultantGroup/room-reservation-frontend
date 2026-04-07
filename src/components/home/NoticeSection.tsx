import { Card } from '@/components/ui/Card';
import { ManagementUnitDetail } from '@/types/managementUnit';
import ReactMarkdown from 'react-markdown';

interface NoticeSectionProps {
  managementUnit?: ManagementUnitDetail;
}

export function NoticeSection({ managementUnit }: NoticeSectionProps) {
  if (!managementUnit) return null;

  const hasNotice = !!(managementUnit.noticeTitle?.trim() || managementUnit.noticeContent?.trim());
  if (!hasNotice) return null;

  return (
    <div className="flex flex-col gap-4">
      <Card className="!p-8 border border-ui-border">
        <h3 className="text-lg font-extrabold text-gray-800 mb-6 tracking-tight leading-snug">
          {managementUnit.noticeTitle}
        </h3>

        <div className="text-xs text-gray-600 leading-relaxed break-keep font-medium prose-custom">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="text-lg font-bold text-gray-900 mb-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-base font-bold text-gray-900 mb-3">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-bold text-gray-800 mb-2">{children}</h3>,
              p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="space-y-3 mb-4 list-none">{children}</ul>,
              li: ({ children }) => (
                <li className="flex items-start">
                  <span className="mr-3 text-brand-primary font-extrabold">·</span>
                  <div className="flex-1">{children}</div>
                </li>
              ),
              strong: ({ children }) => <strong className="text-gray-900 font-bold">{children}</strong>,
              em: ({ children }) => <em className="text-gray-400 italic not-italic text-micro font-bold block mt-6 pt-6 border-t border-ui-border">{children}</em>,
            }}
          >
            {managementUnit.noticeContent}
          </ReactMarkdown>
        </div>
      </Card>
    </div>
  );
}
