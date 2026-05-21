# 🖥️ Xcode Remote Studio

> **Build and control iOS/macOS apps remotely via a browser** — Powered by GitHub Actions, noVNC, and Cloudflare Tunnel.

![macOS](https://img.shields.io/badge/macOS-14+-000?style=flat-square&logo=apple)
![Xcode](https://img.shields.io/badge/Xcode-16+-147EFB?style=flat-square&logo=xcode&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-Powered-2088FF?style=flat-square&logo=github-actions&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare_Tunnel-Enabled-F38020?style=flat-square&logo=cloudflare&logoColor=white)

---

## 🎯 What is this?

Xcode Remote Studio gives you a **full macOS desktop with Xcode** running in the cloud, accessible from any browser — no Mac needed! It uses:

- **GitHub Actions macOS runners** — Real macOS with Xcode pre-installed
- **noVNC** — Web-based VNC client for browser access
- **Cloudflare Tunnel** — Secure public URL (no port forwarding needed)
- **Custom Dashboard** — Beautiful web UI to manage your session

## ⚡ Quick Start

### 1. Fork / Clone this Repository

```bash
git clone https://github.com/YOUR_USERNAME/xcode-remote-studio.git
cd xcode-remote-studio
git push origin main
```

### 2. Run the Workflow

1. Go to your repository on GitHub
2. Navigate to **Actions** → **🖥️ Xcode Remote Studio**
3. Click **"Run workflow"**
4. Configure your session:
   - **Session Duration**: 1-6 hours
   - **Xcode Version**: latest, 16.2, 16.1, etc.
   - **Screen Resolution**: 1920x1080 (recommended)
   - **VNC Password**: Your chosen password
   - **Tunnel Token**: (Optional) Cloudflare tunnel token
5. Click **"Run workflow"**

### 3. Connect

1. Wait for the workflow to start (~2-3 minutes)
2. Check the **workflow logs** for the **Tunnel URL**
3. Open the URL in your browser
4. Enter your VNC password
5. 🎉 You now have a macOS desktop with Xcode!

## 📁 Project Structure

```
xcode-remote-studio/
├── .github/
│   └── workflows/
│       ├── macos-xcode-remote.yml    # Main remote session workflow
│       └── build-ios-app.yml          # iOS build workflow
├── scripts/
│   ├── setup-vnc.sh                   # VNC server setup
│   └── setup-tunnel.sh               # Cloudflare tunnel setup
├── web/
│   ├── index.html                     # Dashboard HTML
│   ├── dashboard.css                  # Dashboard styles
│   └── dashboard.js                   # Dashboard logic
└── README.md
```

## 🔧 Workflows

### 🖥️ Xcode Remote Studio (Main)

Full remote macOS desktop session with:
- VNC server (Screen Sharing)
- noVNC web interface on port 800
- Cloudflare Tunnel for public access
- Xcode, Terminal, and Finder auto-launched
- Auto-healing (restarts crashed services)
- Configurable duration (1-6 hours)

### 📱 Build iOS App

Dedicated build workflow for:
- Building `.xcodeproj` or `.xcworkspace` files
- Running on iOS Simulator (iPhone 16 Pro, iPad Pro, etc.)
- Running unit tests
- Uploading build artifacts

## 🌐 Cloudflare Tunnel Setup

### Option A: Quick Tunnel (Free, No Setup)

Leave the **Tunnel Token** empty when running the workflow. A temporary `*.trycloudflare.com` URL will be generated automatically.

> ⚠️ Quick tunnel URLs are temporary and change each session.

### Option B: Named Tunnel (Persistent URL)

1. Create a [Cloudflare account](https://dash.cloudflare.com)
2. Go to **Zero Trust** → **Networks** → **Tunnels**
3. Create a new tunnel
4. Copy the tunnel token
5. Configure the tunnel to route traffic to `http://localhost:800`
6. Paste the token when running the workflow

## 💡 Tips & Tricks

### Creating a New Xcode Project

Once connected to the desktop:
1. Open **Xcode** (should be auto-launched)
2. **File** → **New** → **Project**
3. Select **iOS** → **App**
4. Configure and create!

Or use the quick-create script in Terminal:
```bash
~/Desktop/create_ios_project.sh MyAwesomeApp
```

### Building from Terminal

```bash
xcodebuild -project MyApp.xcodeproj \
  -scheme MyApp \
  -destination 'platform=iOS Simulator,name=iPhone 16 Pro' \
  build
```

### Running iOS Simulator

```bash
# List available simulators
xcrun simctl list devices

# Boot a simulator
xcrun simctl boot "iPhone 16 Pro"

# Open Simulator app
open -a Simulator
```

## ⚠️ Important Notes

1. **GitHub Actions Limits**: Free tier gets 2,000 minutes/month for macOS runners. macOS minutes are billed at **10x** the standard rate.
2. **Session Duration**: Maximum 6 hours per session (GitHub Actions limit).
3. **Data Persistence**: All data is lost when the session ends. Save your work to the repository or download it.
4. **Security**: Change the default VNC password! Quick tunnel URLs are public.
5. **Performance**: GitHub-hosted runners have limited specs. Complex builds may be slower than local machines.

## 🛡️ Security

- Always use a **strong VNC password**
- Use **named Cloudflare tunnels** with access policies for production use
- Never commit secrets to the repository
- The session is isolated and destroyed after the workflow ends

## 📜 License

MIT License — Use freely, build amazing things! 🚀
