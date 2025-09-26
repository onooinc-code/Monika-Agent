'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '@/contexts/StateProvider';
import { CloseIcon, SearchIcon, FilterIcon, FolderIcon, ChevronDownIcon, CopyIcon, CheckIcon } from '@/components/Icons';
import { safeRender } from '@/services/utils/safeRender';

const elementData = [
  {
    group: 'Branding',
    elements: [
      { name: 'Monica Button', description: 'The main branding button with star and glow animations, used in the Title Bar.', descriptionAr: 'زر العلامة التجارية الرئيسي مع رسوم متحركة للنجوم والتوهج، يستخدم في شريط العنوان.', classNames: 'btn, container-stars, glow' }
    ]
  },
  {
    group: 'Header',
    elements: [
      { name: 'Header Container', description: 'The main container for the entire header.', descriptionAr: 'الحاوية الرئيسية للهيدر بأكمله.', classNames: 'AppHeader' },
      { name: 'Left Section', description: 'Container for the sidebar toggle button.', descriptionAr: 'حاوية زر تبديل الشريط الجانبي.', classNames: 'HeaderLeftSection' },
      { name: 'Left Actions', description: 'Container for left-side action buttons like the sidebar toggle.', descriptionAr: 'حاوية أزرار الإجراءات اليسرى مثل زر الشريط الجانبي.', classNames: 'HeaderLeftActions' },
      { name: 'Menu Button', description: 'Button to toggle the conversation list sidebar.', descriptionAr: 'زر لتبديل الشريط الجانبي لقائمة المحادثات.', classNames: 'MenuButton' },
      { name: 'Center Section', description: 'Container for the title and agent/manager cards.', descriptionAr: 'حاوية العنوان وكروت الوكلاء والمدير.', classNames: 'HeaderCenterSection' },
      { name: 'Title Bar Container', description: 'The main container for the application title bar, featuring an animated background.', descriptionAr: 'الحاوية الرئيسية لشريط عنوان التطبيق، تتميز بخلفية متحركة.', classNames: 'TitleBarContainer' },
      { name: 'Header Title', description: 'The main title of the application.', descriptionAr: 'العنوان الرئيسي للتطبيق.', classNames: 'HeaderTitle' },
      { name: 'Cards Container', description: 'Container for all agent and manager cards.', descriptionAr: 'حاوية لجميع كروت الوكلاء والمدير.', classNames: 'HeaderCardsContainer' },
      { name: 'Agent Card', description: 'Individual card for an agent.', descriptionAr: 'الكارت الفردي للوكيل.', classNames: 'AgentCard, HeaderCards' },
      { name: 'Manager Card', description: 'Card for the Agent Manager.', descriptionAr: 'كارت مدير الوكلاء.', classNames: 'ManagerCard, HeaderCards' },
      { name: 'Right Section', description: 'Container for the header action buttons.', descriptionAr: 'حاوية أزرار الإجراءات في الهيدر.', classNames: 'HeaderRightSection' },
      { name: 'Actions Container', description: 'The animated card holding the action buttons.', descriptionAr: 'الكارت المتحرك الذي يحمل أزرار الإجراءات.', classNames: 'HeaderActions' },
    ]
  },
  {
    group: 'Header Actions',
    elements: [
      { name: 'Header Actions Container', description: 'The animated card holding the new radio button actions.', descriptionAr: 'البطاقة المتحركة التي تحتوي على أزرار الإجراءات الراديوية الجديدة.', classNames: 'header-action-card' },
      { name: 'Radio Input Container', description: 'The main grid container for the four action buttons.', descriptionAr: 'حاوية الشبكة الرئيسية لأزرار الإجراءات الأربعة.', classNames: 'radio-input' },
      { name: 'Radio Label', description: 'The clickable label for an individual action.', descriptionAr: 'التسمية القابلة للنقر للإجراء الفردي.', classNames: 'label' },
      { name: 'Settings Button (Spring)', description: 'The button for opening settings, styled as "Spring".', descriptionAr: 'زر فتح الإعدادات، المصمم بنمط "الربيع".', classNames: 'spring' },
      { name: 'Menu Button (Summer)', description: 'The button for toggling the sidebar, styled as "Summer".', descriptionAr: 'زر تبديل الشريط الجانبي، المصمم بنمط "الصيف".', classNames: 'summer' },
      { name: 'Gallery Button (Autumn)', description: 'The button for opening the components gallery, styled as "Autumn".', descriptionAr: 'زر فتح معرض المكونات، المصمم بنمط "الخريف".', classNames: 'autumn' },
      { name: 'Mode Button (Winter)', description: 'The button for changing conversation mode, styled as "Winter".', descriptionAr: 'زر تغيير وضع المحادثة، المصمم بنمط "الشتاء".', classNames: 'winter' },
      { name: 'Center Diamond', description: 'The central decorative diamond element.', descriptionAr: 'العنصر الزخرفي المركزي على شكل معين.', classNames: 'center' },
    ]
  },
   {
    group: 'Flip Switch',
    elements: [
      { name: 'Flip Switch Container', description: 'The main container for the animated flip switch.', descriptionAr: 'الحاوية الرئيسية لمفتاح التبديل المتحرك.', classNames: 'flip-switch-container' },
      { name: 'Flip Switch', description: 'The inner container that holds the options and the flipping card.', descriptionAr: 'الحاوية الداخلية التي تحتوي على الخيارات والبطاقة المتحركة.', classNames: 'flip-switch' },
      { name: 'Switch Button', description: 'The clickable label for each option in the switch.', descriptionAr: 'التسمية القابلة للنقر لكل خيار في المفتاح.', classNames: 'switch-button' },
      { name: 'Switch Card', description: 'The animated card that flips between options.', descriptionAr: 'البطاقة المتحركة التي تتقلب بين الخيارات.', classNames: 'switch-card' }
    ]
  },
  {
    group: 'Conversation Sub-Header',
    elements: [
      { name: 'Sub-Header Container', description: 'The main flex container for the sub-header.', descriptionAr: 'حاوية فلكس الرئيسية للهيدر الفرعي.', classNames: 'ConversationSubHeader' },
      { name: 'Conversation Title', description: 'The cyberpunk-style card component that displays the conversation title on the left.', descriptionAr: 'مكون بطاقة السايبربانك الذي يعرض عنوان المحادثة على اليسار.', classNames: 'ConversationTitle' },
      { name: 'Navigation Tabs', description: 'The central component for switching conversation modes (Dynamic, Continuous, Manual).', descriptionAr: 'المكون المركزي لتبديل أوضاع المحادثة.', classNames: 'nav-tabs-container' },
      { name: 'Conversation Actions', description: 'The pill-style container on the right with all the action icon-buttons.', descriptionAr: 'حاوية الأزرار الأيقونية للإجراءات على اليمين.', classNames: 'ConversationActions' },
    ]
  },
  {
    group: 'Message Area',
    elements: [
      { name: 'Message List', description: 'The main scrollable container for all messages.', descriptionAr: 'الحاوية الرئيسية القابلة للتمرير لجميع الرسائل.', classNames: 'MessageList' },
      { name: 'Message List Inner Container', description: 'A centered container within the message list.', descriptionAr: 'حاوية مركزية داخل قائمة الرسائل.', classNames: 'MessageListContainer' },
      { name: 'Topic Divider', description: 'The divider for new topics.', descriptionAr: 'الفاصل للمواضيع الجديدة.', classNames: 'TopicDivider' },
      { name: 'Topic Text', description: 'The text of the topic divider.', descriptionAr: 'نص فاصل الموضوع.', classNames: 'TopicDividerText' },
      { name: 'Topic Timestamp', description: 'The timestamp on the topic divider.', descriptionAr: 'الختم الزمني على فاصل الموضوع.', classNames: 'TopicDividerTimestamp' },
    ]
  },
  {
    group: 'Message Bubble',
    elements: [
      { name: 'Bubble Container', description: 'The main wrapper for a single message bubble.', descriptionAr: 'الغلاف الرئيسي لفقاعة رسالة واحدة.', classNames: 'MessageBubble' },
      { name: 'Avatar', description: 'The avatar for the message sender.', descriptionAr: 'الصورة الرمزية لمرسل الرسالة.', classNames: 'MessageAvatar' },
      { name: 'Content Container', description: 'The container for the header, body, and footer of the bubble.', descriptionAr: 'حاوية رأس وتذييل ومحتوى الفقاعة.', classNames: 'MessageContentContainer' },
      { name: 'Bubble Header', description: 'The header part of the bubble with sender info and timestamp.', descriptionAr: 'الجزء العلوي من الفقاعة مع معلومات المرسل والوقت.', classNames: 'MessageBubbleHeader' },
      { name: 'Sender Name', description: 'The name of the message sender.', descriptionAr: 'اسم مرسل الرسالة.', classNames: 'SenderName' },
      { name: 'Sender Job', description: 'The job/role of the message sender.', descriptionAr: 'وظيفة/دور مرسل الرسالة.', classNames: 'SenderJob' },
      { name: 'Alternative Response Navigator', description: 'Controls to switch between alternative AI responses.', descriptionAr: 'عناصر التحكم للتبديل بين ردود الذكاء الاصطناعي البديلة.', classNames: 'AlternativeResponseNavigator' },
      { name: 'Timestamp', description: 'The time the message was sent.', descriptionAr: 'وقت إرسال الرسالة.', classNames: 'MessageTimestamp' },
      { name: 'Bubble Body', description: 'The main content area of the message.', descriptionAr: 'منطقة المحتوى الرئيسية للرسالة.', classNames: 'MessageBubbleBody' },
      { name: 'Plan Display Container', description: 'Container for the Plan Display component.', descriptionAr: 'حاوية مكون عرض الخطة.', classNames: 'prose-agent' }
    ]
  }
];

export const DeveloperInfoModal: React.FC = () => {
    const { isDeveloperInfoOpen, setIsDeveloperInfoOpen } = useAppContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
    const [copiedClass, setCopiedClass] = useState<string | null>(null);

    const categories = useMemo(() => ['All', ...elementData.map(d => d.group)], []);

    const filteredData = useMemo(() => {
        return elementData
            .map(group => ({
                ...group,
                elements: group.elements.filter(el =>
                    el.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    el.classNames.toLowerCase().includes(searchQuery.toLowerCase())
                ),
            }))
            .filter(group => 
                (activeFilter === 'All' || group.group === activeFilter) && group.elements.length > 0
            );
    }, [searchQuery, activeFilter]);

    useEffect(() => {
        if (isDeveloperInfoOpen) {
            // Expand all groups by default when modal opens or filter changes
            const allGroups = filteredData.reduce((acc, group) => {
                acc[group.group] = true;
                return acc;
            }, {} as Record<string, boolean>);
            setExpandedGroups(allGroups);
        }
    }, [isDeveloperInfoOpen, filteredData]);
    
    const toggleGroup = (groupName: string) => {
        setExpandedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
    };

    const handleCopy = (className: string) => {
        navigator.clipboard.writeText(className);
        setCopiedClass(className);
        setTimeout(() => setCopiedClass(null), 1500);
    };

    if (!isDeveloperInfoOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 p-4 modal-overlay open" onClick={() => setIsDeveloperInfoOpen(false)}>
            <div className="glass-pane rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col modal-content shadow-cyan-500/20" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-6 border-b border-white/10 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-white">Developer Info & UI Kit</h2>
                    <button onClick={() => setIsDeveloperInfoOpen(false)} className="p-1 rounded-full hover:bg-white/10"><CloseIcon /></button>
                </header>
                <div className="flex-1 flex min-h-0">
                    {/* Sidebar */}
                    <aside className="w-64 p-4 border-r border-white/10 flex-shrink-0 flex flex-col">
                        <div className="relative mb-4">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon className="w-5 h-5 text-gray-400" /></span>
                            <input type="search" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                            <FilterIcon className="w-5 h-5"/>
                            <span>Categories</span>
                        </div>
                        <nav className="flex-1 space-y-1 overflow-y-auto -mr-2 pr-2">
                            {categories.map(cat => (
                                <button key={cat} onClick={() => setActiveFilter(cat)} className={`w-full text-left p-2 rounded-md font-semibold text-sm transition-colors ${activeFilter === cat ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-white/10'}`}>
                                    {safeRender(cat)}
                                </button>
                            ))}
                        </nav>
                    </aside>
                    {/* Main Content */}
                    <main className="flex-1 overflow-y-auto p-6 space-y-6">
                        {filteredData.map(group => (
                            <div key={group.group}>
                                <div onClick={() => toggleGroup(group.group)} className="flex items-center gap-3 cursor-pointer mb-2">
                                    <FolderIcon className="w-6 h-6 text-indigo-400"/>
                                    <h3 className="text-xl font-semibold text-white">{safeRender(group.group)}</h3>
                                    <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${expandedGroups[group.group] ? 'rotate-180' : ''}`} />
                                </div>
                                {expandedGroups[group.group] && (
                                    <div className="space-y-4 pl-9 animate-fade-in-up">
                                        {group.elements.map(el => (
                                            <div key={el.name} className="glass-pane p-4 rounded-lg">
                                                <h4 className="font-semibold text-lg text-cyan-300">{safeRender(el.name)}</h4>
                                                <p className="text-gray-300 mt-1">{safeRender(el.description)}</p>
                                                <p className="text-gray-400 mt-1 text-right" dir="rtl">{safeRender(el.descriptionAr)}</p>
                                                <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
                                                    {el.classNames.split(',').map(c => c.trim()).map(cls => (
                                                        <div key={cls} className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-md font-mono text-xs text-green-400">
                                                            <span>.{safeRender(cls)}</span>
                                                            <button onClick={() => handleCopy(cls)} className="text-white hover:text-cyan-300">
                                                                {copiedClass === cls ? <CheckIcon className="w-3 h-3 text-green-400" /> : <CopyIcon className="w-3 h-3" />}
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </main>
                </div>
            </div>
        </div>
    );
};