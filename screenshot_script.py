#!/usr/bin/env python3
"""
Script de capture d'écran simple pour QuantumShield Web App
Génère des captures d'écran de toutes les interfaces principales

Usage: python screenshot_script.py
"""

import asyncio
import os
from datetime import datetime
from playwright.async_api import async_playwright

class QuantumShieldScreenshots:
    def __init__(self):
        self.base_url = "http://localhost:3000"
        self.screenshots_dir = f"screenshots_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        self.page = None
        
    async def setup(self):
        """Initialize browser"""
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(headless=True)
        self.page = await self.browser.new_page(viewport={"width": 1920, "height": 1080})
        
        os.makedirs(self.screenshots_dir, exist_ok=True)
        print(f"📁 Screenshots directory: {self.screenshots_dir}")

    async def cleanup(self):
        """Close browser"""
        await self.browser.close()
        await self.playwright.stop()

    async def screenshot(self, name: str, description: str = ""):
        """Take a screenshot"""
        filepath = os.path.join(self.screenshots_dir, f"{name}.png")
        await self.page.screenshot(path=filepath, full_page=True)
        print(f"📸 {name}.png - {description}")
        await asyncio.sleep(1)

    async def quick_login(self):
        """Quick login for authenticated pages"""
        await self.page.goto(f"{self.base_url}/register")
        await asyncio.sleep(2)
        
        # Register test user
        await self.page.fill('input[name="email"]', 'screenshot@test.com')
        await self.page.fill('input[name="username"]', 'screenshot_user')
        await self.page.fill('input[name="password"]', 'testpass123')
        await self.page.fill('input[name="confirmPassword"]', 'testpass123')
        await self.page.click('button[type="submit"]')
        await asyncio.sleep(3)
        
        # Login
        if 'login' in self.page.url:
            await self.page.fill('input[name="username"]', 'screenshot_user')
            await self.page.fill('input[name="password"]', 'testpass123')
            await self.page.click('button[type="submit"]')
            await asyncio.sleep(3)

    async def capture_all_interfaces(self):
        """Capture all main interfaces"""
        print("🚀 Capturing all QuantumShield interfaces...")
        
        try:
            await self.setup()
            
            # 1. Homepage
            await self.page.goto(self.base_url)
            await asyncio.sleep(3)
            await self.screenshot("01_homepage", "Page d'accueil")
            
            # 2. Register page
            await self.page.goto(f"{self.base_url}/register")
            await asyncio.sleep(2)
            await self.screenshot("02_register", "Page d'inscription")
            
            # 3. Login page
            await self.page.goto(f"{self.base_url}/login")
            await asyncio.sleep(2)
            await self.screenshot("03_login", "Page de connexion")
            
            # Quick login for authenticated pages
            await self.quick_login()
            
            # 4. Dashboard
            await self.page.goto(f"{self.base_url}/dashboard")
            await asyncio.sleep(3)
            await self.screenshot("04_dashboard", "Dashboard principal")
            
            # 5. Devices page (empty)
            await self.page.goto(f"{self.base_url}/devices")
            await asyncio.sleep(3)
            await self.screenshot("05_devices_empty", "Page dispositifs (vide)")
            
            # Add a device and capture
            try:
                await self.page.click('button:has-text("Ajouter un dispositif")')
                await asyncio.sleep(1)
                await self.screenshot("05_devices_modal", "Modal ajout dispositif")
                
                await self.page.fill('input[placeholder*="SENSOR"]', 'DEMO_001')
                await self.page.fill('input[placeholder*="Capteur"]', 'Capteur Demo')
                await self.page.select_option('select', 'Smart Sensor')
                await self.page.click('button[type="submit"]:has-text("Ajouter")')
                await asyncio.sleep(4)
                await self.screenshot("05_devices_with_device", "Page dispositifs avec dispositif")
            except:
                print("⚠️  Could not add device, continuing...")
            
            # 6. Crypto page
            await self.page.goto(f"{self.base_url}/crypto")
            await asyncio.sleep(3)
            await self.screenshot("06_crypto_main", "Page cryptographie")
            
            # Generate keys for crypto demo
            try:
                await self.page.click('button:has-text("Générer")')
                await asyncio.sleep(4)
                await self.screenshot("06_crypto_with_keys", "Cryptographie avec clés générées")
                
                # Encryption tab
                await self.page.click('[role="tab"]:has-text("Chiffrement")')
                await asyncio.sleep(1)
                await self.screenshot("06_crypto_encryption", "Onglet chiffrement")
                
                # Signature tab
                await self.page.click('[role="tab"]:has-text("Signature")')
                await asyncio.sleep(1)
                await self.screenshot("06_crypto_signature", "Onglet signature")
            except:
                print("⚠️  Could not test crypto features, continuing...")
            
            # 7. Tokens page
            await self.page.goto(f"{self.base_url}/tokens")
            await asyncio.sleep(3)
            await self.screenshot("07_tokens_main", "Page tokens QS")
            
            try:
                # Transactions tab
                await self.page.click('[role="tab"]:has-text("Transactions")')
                await asyncio.sleep(1)
                await self.screenshot("07_tokens_transactions", "Onglet transactions")
                
                # Rewards tab
                await self.page.click('[role="tab"]:has-text("Récompenses")')
                await asyncio.sleep(1)
                await self.screenshot("07_tokens_rewards", "Onglet récompenses")
                
                # Market tab
                await self.page.click('[role="tab"]:has-text("Marché")')
                await asyncio.sleep(1)
                await self.screenshot("07_tokens_market", "Onglet marché")
            except:
                print("⚠️  Could not test token features, continuing...")
            
            # 8. Mobile responsive views
            await self.page.set_viewport_size({"width": 375, "height": 667})
            
            await self.page.goto(self.base_url)
            await asyncio.sleep(2)
            await self.screenshot("08_mobile_homepage", "Homepage mobile")
            
            await self.page.goto(f"{self.base_url}/dashboard")
            await asyncio.sleep(2)
            await self.screenshot("08_mobile_dashboard", "Dashboard mobile")
            
            print("\n✅ All screenshots captured successfully!")
            print(f"📁 Location: {self.screenshots_dir}")
            
        except Exception as e:
            print(f"❌ Error: {e}")
        finally:
            await self.cleanup()

async def main():
    """Main execution"""
    screenshotter = QuantumShieldScreenshots()
    await screenshotter.capture_all_interfaces()

if __name__ == "__main__":
    asyncio.run(main())