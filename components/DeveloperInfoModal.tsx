import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/StateProvider.tsx';
import { CloseIcon, SearchIcon, FilterIcon, FolderIcon, ChevronDownIcon, CopyIcon, CheckIcon } from './Icons.tsx';

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
      { name: 'Plan Display Container', description: 'Container for the AI Manager\'s plan.', descriptionAr: 'حاوية خطة مدير الذكاء الاصطناعي.', classNames: 'PlanDisplayContainer' },
      { name: 'Message Text', description: 'The rendered markdown text of the message.', descriptionAr: 'نص الرسالة المعروض بصيغة ماركداون.', classNames: 'MessageText' },
      { name: 'Expand Message Button', description: 'Button to show/hide the full text of a long message.', descriptionAr: 'زر لإظهار/إخفاء النص الكامل لرسالة طويلة.', classNames: 'ExpandMessageButton' },
      { name: 'Attachment Image', description: 'The attached image in a message.', descriptionAr: 'الصورة المرفقة في رسالة.', classNames: 'MessageAttachment' },
    ]
  },
   {
    group: 'Message Bubble (Editing State)',
    elements: [
      { name: 'Editing Container', description: 'The main wrapper for a bubble in edit mode.', descriptionAr: 'الغلاف الرئيسي للفقاعة في وضع التعديل.', classNames: 'MessageBubbleEditing' },
      { name: 'Edit Input Textarea', description: 'The textarea for editing the message text.', descriptionAr: 'منطقة النص لتعديل الرسالة.', classNames: 'MessageEditInput' },
      { name: 'Edit Actions Container', description: 'Container for the save and cancel buttons.', descriptionAr: 'حاوية أزرار الحفظ والإلغاء.', classNames: 'MessageEditActions' },
      { name: 'Cancel Edit Button', description: 'Button to cancel editing.', descriptionAr: 'زر لإلغاء التعديل.', classNames: 'MessageEditCancelButton' },
      { name: 'Save Edit Button', description: 'Button to save the edited message.', descriptionAr: 'زر لحفظ الرسالة المعدلة.', classNames: 'MessageEditSaveButton' },
    ]
  },
  {
    group: 'Message Input',
    elements: [
        { name: 'Footer Container', description: 'The main footer element containing the input area.', descriptionAr: 'عنصر التذييل الرئيسي الذي يحتوي على منطقة الإدخال.', classNames: 'MessageInputFooter' },
        { name: 'Input Wrapper', description: 'The styled wrapper with the gradient border.', descriptionAr: 'الغلاف المصمم مع حدود متدرجة.', classNames: 'MessageInputWrapper' },
        { name: 'Input Inner', description: 'The inner container with the dark background.', descriptionAr: 'الحاوية الداخلية ذات الخلفية الداكنة.', classNames: 'MessageInputInner' },
        { name: 'Textarea', description: 'The main text input field.', descriptionAr: 'حقل إدخال النص الرئيسي.', classNames: 'MessageInputTextarea' },
        { name: 'Action Buttons Container', description: 'Container for the attachment, template, and web buttons.', descriptionAr: 'حاوية أزرار الإجراءات (مرفق، قالب، ويب).', classNames: 'MessageInputActionButtonsContainer' },
        { name: 'Attach File Button', description: 'Button to open the file attachment dialog.', descriptionAr: 'زر لفتح مربع حوار إرفاق الملفات.', classNames: 'AttachFileButton' },
        { name: 'Add Template Button', description: 'Button for adding a template.', descriptionAr: 'زر لإضافة قالب.', classNames: 'AddTemplateButton' },
        { name: 'Browse Web Button', description: 'Button for browsing the web.', descriptionAr: 'زر لتصفح الويب.', classNames: 'BrowseWebButton' },
        { name: 'Send Message Button', description: 'The main button to send the message.', descriptionAr: 'الزر الرئيسي لإرسال الرسالة.', classNames: 'SendMessageButton' },
        { name: 'Tags Container', description: 'Container for the suggested action tags.', descriptionAr: 'حاوية علامات الإجراءات المقترحة.', classNames: 'MessageInputTagsContainer' },
        { name: 'Tag', description: 'An individual suggested action tag.', descriptionAr: 'علامة إجراء مقترحة فردية.', classNames: 'MessageInputTag' },
    ]
  },
];

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };
    return (
        <button onClick={handleCopy} className="p-1 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors" title="Copy">
            {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
        </button>
    );
};

export const DeveloperInfoModal: React.FC = () => {
  const { isDeveloperInfoOpen, setIsDeveloperInfoOpen } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filteredData = useMemo(() => {
    let data = elementData;
    if (activeFilters.length > 0) {
      data = data.filter(group => activeFilters.includes(group.group));
    }
    if (searchQuery.trim()) {
      const lowercasedQuery = searchQuery.toLowerCase();
      return data.map(group => {
        const filteredElements = group.elements.filter(el => 
          el.name.toLowerCase().includes(lowercasedQuery) ||
          el.description.toLowerCase().includes(lowercasedQuery) ||
          el.descriptionAr.toLowerCase().includes(lowercasedQuery) ||
          el.classNames.toLowerCase().includes(lowercasedQuery)
        );
        return { ...group, elements: filteredElements };
      }).filter(group => group.elements.length > 0);
    }
    return data;
  }, [searchQuery, activeFilters]);
  
  const toggleFilter = (group: string) => {
    setActiveFilters(prev => 
      prev.includes(group) ? prev.filter(f => f !== group) : [...prev, group]
    );
  };

  if (!isDeveloperInfoOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 p-4 modal-overlay open" onClick={() => setIsDeveloperInfoOpen(false)}>
      <div className="glass-pane rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col modal-content shadow-cyan-500/20" onClick={e => e.stopPropagation()}>
        <header className="flex justify-between items-center p-6 border-b border-white/10 flex-shrink-0">
          <h2 className="text-2xl font-bold text-white">Developer Information Panel</h2>
          <button onClick={() => setIsDeveloperInfoOpen(false)} className="p-1 rounded-full hover:bg-white/10">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="p-4 border-b border-white/10 flex-shrink-0 space-y-4 sticky top-0 bg-[var(--color-pane)] z-10">
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon className="w-5 h-5 text-gray-400" /></span>
                <input
                    type="search"
                    placeholder="Search elements..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            <div className="flex flex-wrap gap-2 items-center">
                <FilterIcon className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-semibold text-gray-300">Filters:</span>
                {elementData.map(group => (
                    <button 
                        key={group.group}
                        onClick={() => toggleFilter(group.group)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${activeFilters.includes(group.group) ? 'bg-indigo-500 border-indigo-400 text-white' : 'bg-black/20 border-white/10 text-gray-300 hover:bg-white/10'}`}
                    >
                        {group.group}
                    </button>
                ))}
                {activeFilters.length > 0 && <button onClick={() => setActiveFilters([])} className="text-xs text-red-400 hover:underline">Clear Filters</button>}
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {filteredData.map(group => (
            <details key={group.group} open className="group/details">
                <summary className="flex justify-between items-center text-xl font-semibold text-indigo-300 list-none">
                    <div className="flex items-center gap-3">
                        <FolderIcon className="w-6 h-6" />
                        {group.group}
                        <span className="text-sm font-mono bg-indigo-500/20 text-indigo-200 px-2.5 py-1 rounded-full">{group.elements.length}</span>
                    </div>
                    <ChevronDownIcon className="w-6 h-6 transition-transform transform group-open/details:rotate-180" />
                </summary>
                <div className="overflow-x-auto pt-4">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-cyan-300 uppercase bg-black/30">
                            <tr>
                                <th scope="col" className="px-6 py-3 rounded-tl-lg w-1/4">Element Name</th>
                                <th scope="col" className="px-6 py-3 w-1/2">Description</th>
                                <th scope="col" className="px-6 py-3 rounded-tr-lg w-1/4">Class Names</th>
                            </tr>
                        </thead>
                        <tbody>
                        {group.elements.map((el, idx) => (
                            <tr key={el.name} className={`border-b border-gray-700/50 hover:bg-white/5 ${idx === group.elements.length - 1 ? 'border-b-0' : ''}`}>
                                <td className="px-6 py-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-white">{el.name}</span>
                                        <CopyButton text={el.name} />
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p>{el.description}</p>
                                            <p className="text-gray-400 mt-1" dir="rtl">{el.descriptionAr}</p>
                                        </div>
                                        <CopyButton text={`${el.description}\n${el.descriptionAr}`} />
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-mono text-yellow-300 whitespace-nowrap">{el.classNames}</span>
                                        <CopyButton text={el.classNames} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </details>
          ))}
           {filteredData.length === 0 && (
            <p className="text-center text-gray-500 py-10">
              No elements found matching your search criteria.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};