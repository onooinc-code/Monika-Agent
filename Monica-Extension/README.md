p# 🤖 AI Studio Auto Chat Chrome Extension

A Chrome extension that automatically creates new chats in Google AI Studio and syncs them with your AI Studio database.

## 🔧 Recent Fixes Applied

✅ **Fixed message passing issues** - Content script now properly responds to popup messages
✅ **Updated permissions** - Added 'tabs' permission for chrome.tabs.create and chrome.tabs.sendMessage
✅ **Improved element detection** - Updated selectors to work with current Google AI Studio interface
✅ **Enhanced error handling** - Added comprehensive error handling and debugging
✅ **Removed conflicts** - Removed manual content script injection since it's already declared in manifest

## ✨ Features

- 🚀 **One-Click Chat Creation**: Automatically opens Google AI Studio and creates a new chat
- 📝 **Smart Automation**: Types "hi" and clicks run to generate conversation titles
- 💾 **Database Sync**: Automatically saves conversations to your AI Studio database
- 🎨 **Beautiful UI**: Clean, modern interface with real-time status updates
- 🔄 **Real-time Updates**: Live status tracking during automation

## 📋 Requirements

1. **Google AI Studio Account**: You need access to [Google AI Studio](https://aistudio.google.com)
2. **AI Studio Database**: Your Supabase tables must be created (run the migration first)
3. **API Server**: The included API server must be running

## 🛠️ Installation

### Step 1: Load the Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `Monica-Extension` folder
5. The extension should now appear in your extensions list

### Step 2: Start the API Server

```bash
# Navigate to the extension directory
cd Monica-Extension

# Install dependencies (if needed)
npm install express cors

# Start the API server
node api-server.js
```

You should see:
```
🚀 AI Studio API Server running on http://localhost:3000
📋 Available endpoints:
   GET  /health
   POST /api/ai-studio/conversations
   GET  /api/ai-studio/conversations
   POST /api/ai-studio/prompts
   GET  /api/ai-studio/prompts/unresponded
```

### Step 3: Verify Database Connection

Make sure your `.env` file has the correct Supabase credentials:

```env
VITE_SUPABASE_URL="https://zipzmduyygozncmvkzru.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 🚀 Usage

1. **Click the Extension Icon**: Click the AI Studio Auto Chat icon in your Chrome toolbar
2. **Click "Create New Chat"**: The automation will start
3. **Watch the Magic**: The extension will:
   - Open Google AI Studio in a new tab
   - Navigate to the new chat page
   - Type "hi" in the input field
   - Click the "Run" button
   - Wait for the conversation title to be generated
   - Extract the title and URL
   - Save to your AI Studio database
4. **Check Results**: The conversation will appear in your AI Studio database

## 📁 Project Structure

```
Monica-Extension/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── content.js            # Google AI Studio automation
├── background.js         # Background tasks
├── api-server.js         # REST API server
└── README.md            # This file
```

## 🔧 API Endpoints

The extension includes a REST API server that bridges the Chrome extension with your AI Studio services:

### Conversations
- `POST /api/ai-studio/conversations` - Create new conversation
- `GET /api/ai-studio/conversations` - Get conversations

### Prompts
- `POST /api/ai-studio/prompts` - Create new prompt
- `GET /api/ai-studio/prompts/unresponded` - Get unresponded prompts

## 🐛 Troubleshooting

### Extension Not Loading
- Make sure Developer mode is enabled in Chrome extensions
- Check that all files are in the correct directory
- Verify manifest.json syntax

### API Server Not Starting
- Check if port 3000 is available
- Install dependencies: `npm install express cors`
- Verify your .env file has correct Supabase credentials

### Automation Not Working
- Make sure you're logged into Google AI Studio
- Check the browser console for error messages
- Verify the page structure hasn't changed

### Debugging Console Output
When the extension is working correctly, you should see these logs in the browser console:

```
🔄 Page already loaded, AI Studio automation ready
📋 Available elements: [counts of text areas and buttons]
📨 Received message: {action: "createNewChat", data: {...}}
🤖 Starting AI Studio automation...
⏳ Waiting for page to load...
📝 Found textarea, entering text...
▶️ Found run button, clicking...
✅ Automation completed successfully
📤 Sending response: {success: true, data: {...}}
```

If you see "Could not establish connection":
- Make sure the content script is loaded (check manifest.json)
- Verify the page URL matches the content script pattern
- Check that the 'tabs' permission is granted

If automation doesn't execute:
- Check that elements are found (see console logs)
- Verify selectors match the current page structure
- Look for JavaScript errors in the console

### Database Connection Issues
- Verify your Supabase credentials in .env
- Check that the AI Studio tables exist in Supabase
- Test the API server endpoints directly

## 🔒 Security Notes

- The extension only accesses Google AI Studio pages
- Database credentials are stored locally in .env
- No data is sent to external servers except your Supabase instance
- Row Level Security (RLS) is enabled on database tables

## 📝 Development

### Adding New Features
1. Edit the appropriate JavaScript file
2. Reload the extension in Chrome (`chrome://extensions/`)
3. Test the changes

### Debugging
- Open Chrome DevTools in the extension popup
- Check the background script console
- Monitor network requests in the API server

## 🎯 Next Steps

After getting the basic functionality working, you can extend the extension with:

- **Multiple Prompt Types**: Support for different initial prompts
- **Conversation Templates**: Pre-defined conversation starters
- **Batch Operations**: Create multiple chats at once
- **Custom Instructions**: Allow custom system instructions
- **Export Features**: Export conversations to different formats

## 📄 License

This project is part of the Monica AI Assistant system.

---

**Happy automating!** 🚀🤖